###
@chalk overview
@name Autocomplete

@description
A directive for providing suggestions while typing into the field

@dependencies
- mac-menu

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
  "$filter"
  "$compile"
  "$timeout"
  "$parse"
  "$rootScope"
  "keys"
  ($http, $filter, $compile, $timeout, $parse, $rootScope, keys) ->
    restrict:    "E"
    templateUrl: "template/autocomplete.html"
    replace:     true
    require:     "ngModel"

    link: ($scope, element, attrs, ctrl) ->
      labelKey = attrs.macAutocompleteLabel  or "name"
      queryKey = attrs.macAutocompleteQuery  or "q"
      delay    = +(attrs.macAutocompleteDelay or 800)
      inside   = attrs.macAutocompleteInside?

      autocompleteUrl = $parse attrs.macAutocompleteUrl
      onSelect        = $parse attrs.macAutocompleteOnSelect
      onSuccess       = $parse attrs.macAutocompleteOnSuccess
      onError         = $parse attrs.macAutocompleteOnError
      source          = $parse attrs.macAutocompleteSource
      disabled        = $parse attrs.macAutocompleteDisabled

      currentAutocomplete = []
      timeoutId           = null

      $menuScope       = $rootScope.$new()
      $menuScope.items = []
      $menuScope.index = 0

      $scope.$watch attrs.ngModel, (value) ->
        ctrl.$setViewValue value
        ctrl.$render()

      ctrl.$parsers.push (value) ->
        if value and not disabled($scope)
          if delay > 0
            $timeout.cancel timeoutId if timeoutId?
            timeoutId = $timeout ->
              queryData value
            , delay
          else
            queryData value

        return value

      #
      # @function
      # @name reset
      # @description
      # Resetting autocomplete
      #
      reset = ->
        $menuScope.items = []
        $menuScope.index = 0

      #
      # @function
      # @name positionMenu
      # @description
      # Calculate the style include position and width for menu
      #
      positionMenu = ->
        $menuScope.style       = element.offset()
        $menuScope.style.top  += element.outerHeight()
        $menuScope.style.width = element.outerWidth()

      #
      # @function
      # @name updateItem
      # @description
      # Update list of items getting passed to menu
      # @param {Array} data Array of data
      #
      updateItem = (data = []) ->
        currentAutocomplete = data
        $menuScope.items    = []
        for item in data
          label = value = item[labelKey] or item
          $menuScope.items.push {label, value}

      #
      # @function
      # @name queryData
      # @description
      # Used for querying data
      # @param {String} query Search query
      #
      queryData = (query) ->
        url = autocompleteUrl $scope

        if url
          options =
            method: "GET"
            url:    url
            params: {}
          options.params[queryKey] = query

          $http(options)
            .success (data, status, headers, config) ->
              dataList  = onSuccess $scope, {data, status, headers}
              dataList ?= data.data

              updateItem dataList
              positionMenu()
            .error (data, status, headers, config) ->
              onError $scope, {data, status, headers}
        else
          updateItem $filter("filter")(source($scope), query)
          positionMenu()

      $menuScope.select = (index) ->
        selected = currentAutocomplete[index]
        onSelect $scope, {selected}

        label = $menuScope.items[index].label or ""
        if attrs.ngModel?
          ctrl.$setViewValue label
          ctrl.$render()

        reset()

      element.on "keydown", (event) ->
        switch event.which
          when keys.DOWN
            $scope.$apply ->
              $menuScope.index = ($menuScope.index + 1) % $menuScope.items.length
          when keys.UP
            $scope.$apply ->
              $menuScope.index = (if $menuScope.index then $menuScope.index else $menuScope.items.length) - 1
          when keys.ENTER
            $scope.$apply ->
              if $menuScope.items.length > 0
                $menuScope.select $menuScope.index
          when keys.ESCAPE
            $scope.$apply -> reset()

        return true

      $(document).on "click", (event) ->
        if $menuScope.items.length > 0
          $scope.$apply -> reset()

      menuEl = angular.element("<mac-menu></mac-menu>")
      menuEl.attr
        "mac-menu-items":  "items"
        "mac-menu-style":  "style"
        "mac-menu-select": "select(index)"
        "mac-menu-index":  "index"
      if inside
        element.after $compile(menuEl) $menuScope
      else
        $(document.body).append $compile(menuEl) $menuScope

      #
      # @event
      # @name resetAutocomplete
      # @description
      # Event to reset autocomplete
      #
      $scope.$on "resetAutocomplete", -> reset()
]
