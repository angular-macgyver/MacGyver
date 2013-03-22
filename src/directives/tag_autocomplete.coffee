##
## @name
## Tag Autocomplete
##
## @description
## A directive for generating tag input with autocomplete support on text input
##
## @dependencies
## - jQuery UI autocomplete
##
## @attributes
## - mac-tag-autocomplete-url:         url to fetch autocomplete dropdown list data
## - mac-tag-autocomplete-value:       the value to be sent back upon selection                (default "id")
## - mac-tag-autocomplete-label:       the label to display to the users                       (default "name")
## - mac-tag-autocomplete-full-object: Push the full object into the selected array            (default false)
## - mac-tag-autocomplete-selected:    the list of elements selected by the user
## - mac-tag-autocomplete-query:       the query parameter on GET command                      (defualt "q")
## - mac-tag-autocomplete-delay:       time delayed on fetching autocomplete data after keyup  (default 800)
## - mac-tag-autocomplete-placeholder: Placeholder text of the text input                      (default "")
## - mac-tag-autocomplete-disabled:    If autocomplete is enabled or disabled                  (default false)
## - mac-tag-autocomplete-on-enter:    When autocomplete is disabled, this function is called on enter
##                                     Should return either string, object or boolean. If false, item is not added
##                                       @param {String} item User input
## - mac-tag-autocomplete-events:      a CSV list of events to attach functions to
## - mac-tag-autocomplete-on-[event]:  the function to be called when specified event is fired
##                                       @param {Object} event jQuery event
##                                       @param {String} value Value in the input text
##
## @events
## - mac-tag-autocomplete-clear-input: $broadcast message; clears text input when received
##

angular.module("Mac").directive "macTagAutocomplete", [
  "$parse",
  "$http",
  "keys",
  ($parse, $http, keys) ->
    restrict:    "E"
    templateUrl: "template/tag_autocomplete.html"
    replace:     true
    scope:
      autocompleteUrl:      "=macTagAutocompleteUrl"
      autocompleteValue:    "=macTagAutocompleteValue"
      autocompleteLabel:    "=macTagAutocompleteLabel"
      autocompleteQuery:    "=macTagAutocompleteQuery"
      autocompleteDelay:    "=macTagAutocompleteDelay"
      placeholder:          "=macTagAutocompletePlaceholder"
      autocompleteOnEnter:  "&macTagAutocompleteOnEnter"
      events:               "@macTagAutocompleteEvents"
      selected:             "=macTagAutocompleteSelected"
      source:               "=macTagAutocompleteSource"
      fullObject:           "&macTagAutocompleteFullObject"

    compile: (element, attrs) ->
      valueKey    = attrs.macTagAutocompleteValue
      valueKey   ?= "id"
      labelKey    = attrs.macTagAutocompleteLabel
      labelKey   ?= "name"
      queryKey    = attrs.macTagAutocompleteQuery    or "q"
      delay       = +attrs.macTagAutocompleteDelay   or 800
      selectedExp = attrs.macTagAutocompleteSelected
      events      = attrs.macTagAutocompleteEvents   or ""
      disabled    = attrs.macTagAutocompleteDisabled?
      eventsList  = _(events.split ",").map (item) ->
        attrEvent = _.string.capitalize item
        name:        item
        capitalized: attrEvent
        eventFn:     attrs["macTagAutocompleteOn#{attrEvent}"]

      # Update template on label variable name
      tagLabelKey = if labelKey is "" then labelKey else ".#{labelKey}"
      $(".tag-label", element).text "{{tag#{tagLabelKey}}}"

      textInput   = $(".mac-autocomplete", element)
      attrsObject =
        "mac-autocomplete-value":  valueKey
        "mac-autocomplete-label":  labelKey
        "mac-autocomplete-query":  queryKey
        "mac-autocomplete-delay":  delay
        "mac-autocomplete-events": events

      if attrs.macTagAutocompleteUrl?
        attrsObject["mac-autocomplete-url"] = "autocompleteUrl"
      else
        attrsObject["mac-autocomplete-source"] = "autocompleteSource"

      textInput.attr attrsObject

      ($scope, element, attrs) ->
        # Put disabled inside template scope:
        $scope.disabled = disabled

        # Clicking on the element will focus on input
        element.click ->
          $(".text-input", element).focus()

        #
        # @watcher
        # @name disabled
        # @description
        # Rebind events after ng-switch
        #
        $scope.$watch "disabled", (value) ->
          if value
            # Enable keydown event on disabled
            $(".no-complete", element)
              .on "keydown", (event) ->
                $scope.onKeyDown event, $(this).val()

          # Loop through the list of events user specified
          for event in eventsList
            continue unless event.eventFn and event.name isnt "keydown"

            do (event) ->
              $(".text-input", element).on event.name, ($event) ->
                expression = $parse event.eventFn
                $scope.$apply ->
                  expression $scope.$parent, {$event, item: $(".text-input", element).val() }

        $scope.$watch "selected.length", (length) ->
          $scope.updateSource()

        $scope.$watch "textInput", (value) ->
          $(".no-complete", element).val value

        #
        # @function
        # @name $scope.pushToSelected
        # @description
        # Convert item to the correct format before adding to the selected array
        # @param {Any} item Item to be pushed to selected array
        #
        $scope.pushToSelected = (item) ->
          output           = {}
          output[labelKey] = item[labelKey] if labelKey
          output[valueKey] = item[valueKey] if valueKey

          if $scope.fullObject or (not labelKey and not valueKey)
            output = item

          $scope.selected.push output

        $scope.updateSource = ->
          sourceValues   = _($scope.source or []).pluck valueKey
          selectedValues = _($scope.selected or []).pluck valueKey
          difference     = _(sourceValues).difference selectedValues

          $scope.autocompleteSource = _($scope.source).filter (item) ->
            item[valueKey] in difference

        $scope.onKeyDown = ($event, value = "") ->
          stroke = $event.which or $event.keyCode
          switch stroke
            when keys.BACKSPACE
              if value.length is 0
                $scope.$apply -> $scope.selected.pop()
            when keys.ENTER
              # Used when autocomplete is not needed
              if value.length > 0 and $scope.disabled
                $scope.$apply ->
                  $scope.textInput = ""
                  $scope.onSelect value

          if attrs.macTagAutocompleteOnKeydown?
            $scope.$apply ->
              expression = $parse attrs.macTagAutocompleteOnKeydown
              expression $scope.$parent, {$event, item: value}

          return true

        $scope.onSuccess = (data) ->
          # get all selected values
          existingValues = _($scope.selected).pluck valueKey
          # remove selected tags on autocomplete dropdown
          return _(data.data).reject (item) -> (item[valueKey] or item) in existingValues

        $scope.onSelect = (item) ->
          item = $scope.autocompleteOnEnter {item} if attrs.macTagAutocompleteOnEnter?
          $scope.pushToSelected item if item

        $scope.reset = ->
          $scope.textInput = ""
          $scope.updateSource()

        $scope.$on "mac-tag-autocomplete-clear-input", ->
          $(".text-input", element).val ""
]
