##
## @name
## Autocomplete
##
## @description
## A directive for providing suggestions while typing into the field
##
## @dependencies
## - jQuery UI autocomplete
##
## @attributes
## - mac-autocomplete-url:             url to fetch autocomplete dropdown list data
## - mac-autocomplete-on-select:       function called when user select on an item
##                                       @params {Object} selected The item selected
## - mac-autocomplete-on-success:      function called on success ajax request
##                                       @params {Object} data Data returned from the request
##                                       @params {Number} status The status code of the response
##                                       @params {Object} headeres Header of the response
## - mac-autocomplete-on-error:        function called on ajax request error
##                                       @params {Object} data Data returned from the request
##                                       @params {Number} status The status code of the response
##                                       @params {Object} headeres Header of the response
## - mac-autocomplete-on-key-down:     function called on key down
##                                       @params {Object} event jQuery event
##                                       @params {String} value Value in the input text
## - mac-autocomplete-value:           the value to be sent back upon selection               (default "id")
## - mac-autocomplete-label:           the label to display to the users                      (default "name")
## - mac-autocomplete-query:           the query parameter on GET command                     (default "q")
## - mac-autocomplete-delay:           time delayed on fetching autocomplete data after keyup (default 800)
## - mac-autocomplete-clear-on-select: Clear text input on select                             (default false)
## - mac-autocomplete-placeholder:     Placeholder text of the text input                     (default "")
##

angular.module("Mac").directive "macAutocomplete", [
  "$http",
  "$parse",
  ($http, $parse) ->
    restrict:    "E"
    templateUrl: "template/autocomplete.html"
    replace:     true
    scope:
      autocompleteUrl: "=macAutocompleteUrl"
      onSelect:        "&macAutocompleteOnSelect"
      onSuccess:       "&macAutocompleteOnSuccess"
      onError:         "&macAutocompleteOnError"
      onKeyDown:       "&macAutocompleteOnKeyDown"

    compile: (element, attrs) ->
      valueKey      = attrs.macAutocompleteValue       or "id"
      labelKey      = attrs.macAutocompleteLabel       or "name"
      queryKey      = attrs.macAutocompleteQuery       or "q"
      delay         = +attrs.macAutocompleteDelay      or 800
      clearOnSelect = attrs.macAutocompleteClearOnSelect is "true"
      placeholder   = attrs.macAutocompletePlaceholder or ""

      # Set the placeholder
      element.attr "placeholder", placeholder

      ($scope, element, attrs) ->
        if attrs.macAutocompleteOnKeyDown
          element.bind "keydown", (event) ->
            $scope.onKeyDown {event, value: $(this).val()}

        element.autocomplete
          delay:     delay
          autoFocus: true
          source: (req, resp) ->
            options =
              method: "GET"
              url:    $scope.autocompleteUrl
              params: {}
            options.params[queryKey] = req.term

            $http(options)
              .success (data, status, headers, config) ->
                  if attrs.macAutocompleteOnSuccess?
                    list = $scope.onSuccess {data, status, headers}

                  list ?= data.data

                  # convert tags to jquery ui autocomplete format
                  resp _(list).map (item) ->
                    label = value = if labelKey? then item[labelKey] else item
                    return {label, value}
                  # store the current data for revert lookup
                  $scope.currentAutocomplete = data.data
              .error (data, status, headers, config) ->
                if attrs.macAutocompleteOnError?
                  $scope.onError {data, status, headers}

          select: (event, ui) ->
            $scope.$apply ->
              selected = _($scope.currentAutocomplete).find (item) -> item[labelKey] is ui.item.label
              $scope.onSelect {selected} if attrs.macAutocompleteOnSelect?

            if clearOnSelect
              setTimeout (->
                element.val ""
              ), 0

        $scope.$on "resetAutocomplete", -> $scope.reset()

        $scope.reset = ->
          $scope.currentAutocomplete = []

        $scope.reset()
]
