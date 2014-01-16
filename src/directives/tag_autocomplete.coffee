###
@chalk overview
@name Tag Autocomplete

@description
A directive for generating tag input with autocomplete support on text input

@dependencies
- mac-autocomplete
- mac-menu

@param {String}  mac-tag-autocomplete-url         Url to fetch autocomplete dropdown list data.
mac-tag-autocomplete-url and mac-tag-autocomplete-source cannot be used together. Url
will always take priority over mac-tag-autocomplete-source.
@param {String}  mac-tag-autocomplete-source      Data to use.
Source support multiple types:
- Array: An array can be used for local data and there are two supported formats:
  - An array of strings: ["Item1", "Item2"]
  - An array of objects with mac-autocomplete-label key: [{name:"Item1"}, {name:"Item2"}]
- String: Using a string as the source is the same as passing the variable into mac-autocomplete-url
- Function: A callback when querying for data. The callback receive two arguments:
  - {String} Value currently in the text input
  - {Function} A response callback which expects a single argument, data to user. The data will be
  populated on the menu and the menu will adjust accordingly
@param {String}  mac-tag-autocomplete-value       The value to be sent back upon selection (default "id")
@param {String}  mac-tag-autocomplete-label       The label to display to the users (default "name")
@param {Expr}    mac-tag-autocomplete-model       Model for autocomplete
@param {Array}   mac-tag-autocomplete-selected    The list of elements selected by the user (required)
@param {String}  mac-tag-autocomplete-query       The query parameter on GET command (defualt "q")
@param {Integer} mac-tag-autocomplete-delay       Time delayed on fetching autocomplete data after keyup  (default 800)
@param {String}  mac-tag-autocomplete-placeholder Placeholder text of the text input (default "")
@param {Boolean} mac-tag-autocomplete-disabled    If autocomplete is enabled or disabled (default false)
@param {Expr}    mac-tag-autocomplete-on-enter    When autocomplete is disabled, this function is called on enter, Should return either string, object or boolean. If false, item is not added
- `item` - {String} User input
@param {String}  mac-tag-autocomplete-events      A CSV list of events to attach functions to
@param {Expr}    mac-tag-autocomplete-on-         Function to be called when specified event is fired
- `event` - {Object} jQuery event
- `value` - {String} Value in the input text

@param {Event} mac-tag-autocomplete-clear-input $broadcast message; clears text input when received
###

angular.module("Mac").directive "macTagAutocomplete", [
  "$parse"
  "$timeout"
  "keys"
  "util"
  ($parse, $timeout, keys, util) ->
    restrict:    "E"
    templateUrl: "template/tag_autocomplete.html"
    replace:     true
    scope:
      url:         "=macTagAutocompleteUrl"
      placeholder: "=macTagAutocompletePlaceholder"
      selected:    "=macTagAutocompleteSelected"
      source:      "=macTagAutocompleteSource"
      disabled:    "=macTagAutocompleteDisabled"
      model:       "=macTagAutocompleteModel"
      onEnter:     "&macTagAutocompleteOnEnter"
      onKeydown:   "&macTagAutocompleteOnKeydown"

    compile: (element, attrs) ->
      valueKey   = attrs.macTagAutocompleteValue
      valueKey  ?= "id"
      labelKey   = attrs.macTagAutocompleteLabel
      labelKey  ?= "name"
      queryKey   = attrs.macTagAutocompleteQuery  or "q"
      delay      = +attrs.macTagAutocompleteDelay or 800
      useSource  = false

      textInput =
        angular.element(element[0].getElementsByClassName "mac-autocomplete")
      attrsObject =
        "mac-autocomplete-value": valueKey
        "mac-autocomplete-label": labelKey
        "mac-autocomplete-query": queryKey
        "mac-autocomplete-delay": delay

      if attrs.macTagAutocompleteUrl?
        attrsObject["mac-autocomplete-url"] = "url"
      else if useSource = attrs.macTagAutocompleteSource?
        attrsObject["mac-autocomplete-source"] = "autocompleteSource"

      textInput.attr attrsObject

      ($scope, element, attrs) ->
        # Variable for input element
        $scope.textInput = ""
        if useSource
          $scope.autocompleteSource =
            if angular.isArray($scope.source) then [] else $scope.source

        # NOTE: Proxy is created to prevent tag autocomplete from breaking
        # when user did not specify model
        if attrs.macTagAutocompleteModel?
          $scope.$watch "textInput", (value) -> $scope.model     = value
          $scope.$watch "model",     (value) -> $scope.textInput = value

        # Clicking on the element will focus on input
        $scope.focusTextInput = ->
          textInputDOM = element[0].getElementsByClassName "mac-autocomplete"
          textInputDOM[0].focus()

        $scope.getTagLabel = (tag) -> if labelKey then tag[labelKey] else tag

        # Loop through the list of events user specified
        # NOTE: Timeout is added to make sure the autocomplete directive
        # has been run and converted the custom tag to input tag
        $timeout ->
          if (events = attrs.macTagAutocompleteEvents)
            textInput =
              angular.element(element[0].getElementsByClassName "text-input")

            for name in events.split(",")
              name        = util.trim name
              capitalized = util.capitalize name
              eventFn     = attrs["macTagAutocompleteOn#{capitalized}"]

              continue unless eventFn and name isnt "keydown"

              do (name, eventFn) ->
                textInput.bind name, ($event) ->
                  expression = $parse eventFn
                  $scope.$apply ->
                    expression $scope.$parent, {$event, item: $scope.textInput}
        , 0, false

        updateAutocompleteSource = ->
          $scope.autocompletePlaceholder =
            if $scope.selected?.length then "" else $scope.placeholder

          return unless useSource and angular.isArray($scope.source)
          sourceValues   = (item[valueKey] for item in ($scope.source or []))
          selectedValues = (item[valueKey] for item in ($scope.selected or []))
          difference     = (item for item in sourceValues when item not in selectedValues)

          $scope.autocompleteSource =
            (item for item in ($scope.source or []) when item[valueKey] in difference)

        if useSource and angular.isArray($scope.source)
          $scope.$watchCollection "source", updateAutocompleteSource

        $scope.$watchCollection "selected", updateAutocompleteSource

        $scope.onKeyDown = ($event) ->
          stroke = $event.which or $event.keyCode
          switch stroke
            when keys.BACKSPACE
              $scope.selected.pop?() unless $scope.textInput
            when keys.ENTER
              # Used when autocomplete is not needed
              if $scope.textInput.length > 0 and $scope.disabled
                $scope.onSelect $scope.textInput

          if attrs.macTagAutocompleteOnKeydown?
            $scope.onKeydown? {$event, value: $scope.textInput}

          return true

        $scope.onSuccess = (data) ->
          # get all selected values
          existingValues = (item[valueKey] for item in ($scope.selected or []))
          # remove selected tags on autocomplete dropdown
          return (item for item in data.data when (item[valueKey] or item) not in existingValues)

        $scope.onSelect = (item) ->
          if attrs.macTagAutocompleteOnEnter?
            item = $scope.onEnter {item}

          $scope.selected.push item if item
          # NOTE: $timeout is added to allow user to access the model before
          # clearing value in autocomplete
          $timeout ->
            $scope.textInput = ""
          , 0

        $scope.$on "mac-tag-autocomplete-clear-input", ->
          $scope.textInput = ""
]
