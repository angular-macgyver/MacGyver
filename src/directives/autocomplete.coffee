###
@chalk overview
@name Autocomplete

@description
A directive for providing suggestions while typing into the field

@dependencies
- jQuery UI autocomplete

@param {String} ng-model Assignable angular expression to data-bind to
@param {String} mac-placeholder Placeholder text
@param {String} mac-autocomplete-url Url to fetch autocomplete dropdown list data
@param {Expression} mac-autocomplete-source Local data source
@param {Boolean} mac-autocomplete-disabled Boolean value if autocomplete should be disabled
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
@param {String}  mac-autocomplete-label The label to display to the users               (default "name")
@param {String}  mac-autocomplete-query The query parameter on GET command              (default "q")
@param {Integer} mac-autocomplete-delay Delay on fetching autocomplete data after keyup (default 800)
###

angular.module("Mac").directive "macAutocomplete", [
  "$http"
  "$parse"
  "$filter"
  ($http, $parse, $filter) ->
    restrict:    "E"
    templateUrl: "template/autocomplete.html"
    replace:     true
    require:     "?ngModel"

    link: ($scope, element, attrs, ctrl) ->
      labelKey = attrs.macAutocompleteLabel  or "name"
      queryKey = attrs.macAutocompleteQuery  or "q"
      delay    = +attrs.macAutocompleteDelay or 800

      autocompleteUrl     = $parse attrs.macAutocompleteUrl
      onSelect            = $parse attrs.macAutocompleteOnSelect
      onSuccess           = $parse attrs.macAutocompleteOnSuccess
      onError             = $parse attrs.macAutocompleteOnError
      source              = $parse attrs.macAutocompleteSource
      currentAutocomplete = []

      # HACK: setTimeout is added to make sure value wont' change afterwards
      if ctrl?
        $scope.$watch attrs.ngModel, (value) ->
          setTimeout ->
            ctrl.$setViewValue value
            ctrl.$render()
          , 0

      #
      # @function
      # @name reset
      # @description
      # Resetting autocomplete
      #
      reset = -> currentAutocomplete = []

      #
      # @function
      # @name updateList
      # @description
      # Convert given data to the format used by autocomplete
      # @param {Array} data Raw data
      #
      updateList = (data = []) ->
        # store the current data for revert lookup
        currentAutocomplete = data

        # convert tags to jquery ui autocomplete format
        _(data).map (item) ->
          label = value = if item[labelKey]? then item[labelKey] else item
          return {label, value}

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
        url = autocompleteUrl $scope

        if url
          options =
            method: "GET"
            url:    url
            params: {}
          options.params[queryKey] = req.term

          $http(options)
            .success (data, status, headers, config) ->
              fetchedList  = onSuccess? $scope, {data, status, headers}
              fetchedList ?= data.data

              resp updateList fetchedList
            .error (data, status, headers, config) ->
              onError? $scope, {data, status, headers}
        else
          list = updateList(source($scope) or [])
          resp $filter("filter") list, req.term

      element.autocomplete
        delay:     delay
        autoFocus: true
        source:    sourceFn

        select: (event, ui) ->
          $scope.$apply ->
            selected = _(currentAutocomplete).find (item) ->
              (item[labelKey] or item) is ui.item.label
            onSelect $scope, {selected} if onSelect?

      if attrs.macAutocompleteDisabled?
        $scope.$watch attrs.macAutocompleteDisabled, (value) ->
          action = if value then "disable" else "enable"
          element.autocomplete action

      #
      # @event
      # @name resetAutocomplete
      # @description
      # Event to reset autocomplete
      #
      $scope.$on "resetAutocomplete", -> reset()
]
