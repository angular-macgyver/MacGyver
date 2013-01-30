##
## Autocomplete
##
## A directive for providing suggestions while typing into the field
##
## Dpendencies
## - jQuery UI autocomplete
##
## Attributes
## - mac-autocomplete-url:         url to fetch autocomplete dropdown list data
## - mac-autocomplete-on-select:   function called when user select on an item
##                                 params:
##                                    selected - the item selected
## - mac-autocomplete-on-success:  function called on success ajax request
##                                 params:
##                                    data   - data returned from the request
##                                    others - status, headers
## - mac-autocomplete-on-error:    function called on ajax request error
##                                 params:
##                                    data   - data returned from the request
##                                    others - status, headers
## - mac-autocomplete-on-key-down: function called on key down
##                                 params:
##                                    event - jQuery event
##                                    value - the value in the input text
## - mac-autocomplete-value:       the value to be sent back upon selection
## - mac-autocomplete-label:       the label to display to the users
## - mac-autocomplete-query:       the query parameter on GET command
## - mac-autocomplete-delay:       time delayed on fetching autocomplete data after keyup
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
      valueKey      = attrs.macAutocompleteValue  or "id"
      labelKey      = attrs.macAutocompleteLabel  or "name"
      queryKey      = attrs.macAutocompleteQuery  or "q"
      delay         = +attrs.macAutocompleteDelay or 800
      clearOnSelect = attrs.macAutocompleteClearOnSelect is "true"

      textInput = $("input", element)

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
