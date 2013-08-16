###
@chalk overview
@name Tag Autocomplete

@description
A directive for generating tag input with autocomplete support on text input

@dependencies
- mac-autocomplete
- mac-menu

@param {String} mac-tag-autocomplete-url          Url to fetch autocomplete dropdown list data
@param {String} mac-tag-autocomplete-value        The value to be sent back upon selection (default "id")
@param {String} mac-tag-autocomplete-label        The label to display to the users (default "name")
@param {Expression} mac-tag-autocomplete-model    Model for autocomplete
@param {Array} mac-tag-autocomplete-selected      The list of elements selected by the user
@param {String} mac-tag-autocomplete-query        The query parameter on GET command (defualt "q")
@param {Integer} mac-tag-autocomplete-delay       Time delayed on fetching autocomplete data after keyup  (default 800)
@param {String} mac-tag-autocomplete-placeholder  Placeholder text of the text input (default "")
@param {Boolean} mac-tag-autocomplete-disabled    If autocomplete is enabled or disabled (default false)
@param {Expression} mac-tag-autocomplete-on-enter When autocomplete is disabled, this function is called on enter, Should return either string, object or boolean. If false, item is not added
        - `item` - {String} User input
@param {String} mac-tag-autocomplete-events a CSV list of events to attach functions to
@param {Expression} mac-tag-autocomplete-on- The function to be called when specified event is fired
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
      valueKey    = attrs.macTagAutocompleteValue
      valueKey   ?= "id"
      labelKey    = attrs.macTagAutocompleteLabel
      labelKey   ?= "name"
      queryKey    = attrs.macTagAutocompleteQuery  or "q"
      delay       = +attrs.macTagAutocompleteDelay or 800
      events      = attrs.macTagAutocompleteEvents or ""
      eventsList  = []
      if events
        for item in events.split(",")
          attrEvent = util.capitalize item
          eventsList.push
            name:        item
            capitalized: attrEvent
            eventFn:     attrs["macTagAutocompleteOn#{attrEvent}"]

      # Update template on label variable name
      tagLabelKey = if labelKey then ".#{labelKey}" else labelKey
      $(".tag-label", element).text "{{tag#{tagLabelKey}}}"

      textInput   = $(".mac-autocomplete", element)
      attrsObject =
        "mac-autocomplete-value": valueKey
        "mac-autocomplete-label": labelKey
        "mac-autocomplete-query": queryKey
        "mac-autocomplete-delay": delay

      if attrs.macTagAutocompleteUrl?
        attrsObject["mac-autocomplete-url"] = "url"
      else if attrs.macTagAutocompleteSource?
        attrsObject["mac-autocomplete-source"] = "autocompleteSource"

      textInput.attr attrsObject

      ($scope, element, attrs) ->
        # Variable for input element
        $scope.textInput = ""

        if attrs.macTagAutocompleteModel?
          $scope.$watch "textInput", (value) -> $scope.model = value
          $scope.$watch "model",     (value) -> $scope.textInput = value

        # Clicking on the element will focus on input
        element.click -> $(".text-input", element).focus()

        # HACK - To make sure autocomplete html has been replaced
        $scope.eventsList = eventsList
        $scope.$watch "eventsList", (value) ->
          # Loop through the list of events user specified
          for event in eventsList
            continue unless event.eventFn and event.name isnt "keydown"

            do (event) ->
              $(".text-input", element).on event.name, ($event) ->
                expression = $parse event.eventFn
                $scope.$apply ->
                  expression $scope.$parent, {$event, item: $scope.textInput }

        $scope.$watch "selected.length", (length) ->
          # TODO Better way to find the difference between selected and source
          sourceValues   = (item[valueKey] for item in ($scope.source or []))
          selectedValues = (item[valueKey] for item in ($scope.selected or []))
          difference     = (item for item in sourceValues when item not in selectedValues)

          $scope.autocompleteSource  = (item for item in ($scope.source or []) when item[valueKey] in difference)

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

          $scope.selected.push item if item?
          $timeout ->
            $scope.$apply -> $scope.textInput = ""
          , 0

        $scope.$on "mac-tag-autocomplete-clear-input", ->
          $scope.textInput = ""
]
