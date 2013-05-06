###
@chalk overview
@name Autocomplete

@description
A directive for providing suggestions while typing into the field

@dependencies
- jQuery UI autocomplete

@param {String} mac-autocomplete-url Url to fetch autocomplete dropdown list data
@param {Function} mac-autocomplete-on-select Function called when user select on an item
       - `selected` - {Object} The item selected
@param {Function} mac-autocomplete-on-success function called on success ajax request
        - `data` - {Object} Data returned from the request
        - `status` - {Number} The status code of the response
        - `header` - {Object} Header of the response
@param {Function} mac-autocomplete-on-error Function called on ajax request error
        - `data` - {Object} Data returned from the request
        - `status` - {Number} The status code of the response
        - `header` - {Object} Header of the response
@param {Function} mac-autocomplete-on-key-down function called on key down
        - `event` - {Object} jQuery event
        - `value` - {String} Value in the input text
@param {String}  mac-autocomplete-value           The value to be sent back upon selection        (default "id")
@param {String}  mac-autocomplete-label           The label to display to the users               (default "name")
@param {String}  mac-autocomplete-query           The query parameter on GET command              (default "q")
@param {Integer} mac-autocomplete-delay           Delay on fetching autocomplete data after keyup (default 800)
@param {Boolean} mac-autocomplete-clear-on-select Clear text input on select                      (default false)
@param {String}  mac-autocomplete-placeholder     Placeholder text of the text input              (default "")
###

angular.module("Mac").directive "macAutocomplete", [
  "$http"
  "$parse"
  "$filter"
  ($http, $parse, $filter) ->
    restrict:    "E"
    templateUrl: "template/autocomplete.html"
    replace:     true
    scope:
      autocompleteUrl: "=macAutocompleteUrl"
      onSelect:        "&macAutocompleteOnSelect"
      onSuccess:       "&macAutocompleteOnSuccess"
      onError:         "&macAutocompleteOnError"
      onKeyDown:       "&macAutocompleteOnKeyDown"
      placeholder:     "=macAutocompletePlaceholder"
      source:          "=macAutocompleteSource"

    compile: (element, attrs) ->
      valueKey      = attrs.macAutocompleteValue       or "id"
      labelKey      = attrs.macAutocompleteLabel       or "name"
      queryKey      = attrs.macAutocompleteQuery       or "q"
      delay         = +attrs.macAutocompleteDelay      or 800
      events        = attrs.macAutocompleteEvents      or ""
      clearOnSelect = attrs.macAutocompleteClearOnSelect?

      ($scope, element, attrs) ->
        if attrs.macAutocompleteOnKeyDown
          element.bind "keydown", (event) ->
            $scope.onKeyDown {event, value: $(this).val()}

        #
        # @function
        # @name sourceFn
        # @description
        # Used by jQuery UI autocomplete to populate options
        # The list of objects will be populated through the response function
        # @param {Request Object} req Request object from jQuery UI
        # @param {Response function} resp Response callback function for jQuery UI
        #
        sourceFn = (req, resp) ->
          if attrs.macAutocompleteUrl?
            options =
              method: "GET"
              url:    $scope.autocompleteUrl
              params: {}
            options.params[queryKey] = req.term

            $http(options)
              .success (data, status, headers, config) ->
                  if attrs.macAutocompleteOnSuccess?
                    fetchedList = $scope.onSuccess {data, status, headers}

                  fetchedList ?= data.data

                  resp $scope.updateList fetchedList
              .error (data, status, headers, config) ->
                if attrs.macAutocompleteOnError?
                  $scope.onError {data, status, headers}
          else
            list = $scope.updateList($scope.source or [])
            resp $filter("filter") list, req.term

        element.autocomplete
          delay:     delay
          autoFocus: true
          source:    sourceFn

          select: (event, ui) ->
            $scope.$apply ->
              selected = _($scope.currentAutocomplete).find (item) -> item[labelKey] is ui.item.label
              $scope.onSelect {selected} if attrs.macAutocompleteOnSelect?

            if clearOnSelect
              setTimeout (->
                element.val ""
              ), 0

        #
        # @event
        # @name resetAutocomplete
        # @description
        # Event to reset autocomplete
        #
        $scope.$on "resetAutocomplete", -> $scope.reset()

        #
        # @function
        # @name $scope.updateList
        # @description
        # Convert given data to the format used by autocomplete
        # @param {Array} data Raw data
        #
        $scope.updateList = (data = []) ->
          # store the current data for revert lookup
          $scope.currentAutocomplete = data

          # convert tags to jquery ui autocomplete format
          _(data).map (item) ->
            label = value = if labelKey? then item[labelKey] else item
            return {label, value}

        #
        # @function
        # @name $scope.reset
        # @description
        # Resetting autocomplete
        #
        $scope.reset = ->
          $scope.currentAutocomplete = []

        $scope.reset()
]
