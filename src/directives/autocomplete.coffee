###
@chalk overview
@name Autocomplete

@description
A directive for providing suggestions while typing into the field

Autocomplete allows for custom html templating in the dropdown and some properties are exposed on the local scope on each template instance, including:

| Variable  | Type    | Details                                                                     |
|-----------|---------|-----------------------------------------------------------------------------|
| `$index`  | Number  | iterator offset of the repeated element (0..length-1)                       |
| `$first`  | Boolean | true if the repeated element is first in the iterator.                      |
| `$middle` | Boolean | true if the repeated element is between the first and last in the iterator. |
| `$last`   | Boolean | true if the repeated element is last in the iterator.                       |
| `$even`   | Boolean | true if the iterator position `$index` is even (otherwise false).           |
| `$odd`    | Boolean | true if the iterator position `$index` is odd (otherwise false).            |
| `item`    | Object  | item object with `value` and `label` if label-key is set                    |

To use custom templating

```
<mac-autocomplete mac-autocomplete-url="someUrl" ng-model="model">
  <span> {{item.label}} </span>
</mac-autocomplete>
```

Template default to `{{item.label}}` if not defined

@dependencies
- mac-menu

@param {String} ng-model Assignable angular expression to data-bind to (required)
@param {String} mac-placeholder Placeholder text
@param {String} mac-autocomplete-url Url to fetch autocomplete dropdown list data. URL may include GET params e.g. "/users?nocache=1"
@param {Expression} mac-autocomplete-source Data to use.
Source support multiple types:
- Array: An array can be used for local data and there are two supported formats:
  - An array of strings: ["Item1", "Item2"]
  - An array of objects with mac-autocomplete-label key: [{name:"Item1"}, {name:"Item2"}]
- String: Using a string as the source is the same as passing the variable into mac-autocomplete-url
- Function: A callback when querying for data. The callback receive two arguments:
  - {String} Value currently in the text input
  - {Function} A response callback which expects a single argument, data to user. The data will be
  populated on the menu and the menu will adjust accordingly
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
@param {String}  mac-autocomplete-label The label to display to the users (default "name")
@param {String}  mac-autocomplete-query The query parameter on GET command (default "q")
@param {Integer} mac-autocomplete-delay Delay on fetching autocomplete data after keyup (default 800)

@param {Expr} mac-menu-class Classes for mac-menu used by mac-autocomplete. For more info, check [ngClass](http://docs.angularjs.org/api/ng/directive/ngClass)
###

angular.module("Mac").directive "macAutocomplete", [
  "$animate"
  "$compile"
  "$filter"
  "$http"
  "$parse"
  "$rootScope"
  "$timeout"
  "keys"
  (
    $animate
    $compile
    $filter
    $http
    $parse
    $rootScope
    $timeout
    keys
  ) ->
    restrict:    "EA"
    templateUrl: "template/autocomplete.html"
    transclude:  true
    replace:     true
    require:     "ngModel"

    link: ($scope, element, attrs, ctrl, transclude) ->
      labelKey    = attrs.macAutocompleteLabel or "name"
      labelGetter = $parse labelKey

      queryKey = attrs.macAutocompleteQuery or "q"
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

      isMenuAppended = false

      # NOTE: preventParser is used to prevent parser from firing when an item
      # is selected in the menu
      preventParser = false

      # NOTE: preventBlur is used to prevent blur even from firing when user click
      # on the menu
      preventBlur = false

      $menuScope       = $scope.$new()
      $menuScope.items = []
      $menuScope.index = 0

      $menuScope.select = (index) ->
        selected = currentAutocomplete[index]
        onSelect $scope, {selected}

        label         = $menuScope.items[index].label or ""
        preventParser = true

        if attrs.ngModel?
          ctrl.$setViewValue label
          ctrl.$render()

        reset()

      $menuScope.onMousedown = ($event) ->
        # prevent moving focus out of text field
        $event.preventDefault()

        preventBlur = true
        $timeout ->
          preventBlur = false
        , 0, false


      menuEl = angular.element(document.createElement("mac-menu"))
      menuEl.attr
        "ng-class":        attrs.macMenuClass or null
        "ng-mousedown":    "onMousedown($event)"
        "mac-menu-items":  "items"
        "mac-menu-select": "select(index)"
        "mac-menu-index":  "index"

      transclude $menuScope, (clone) -> menuEl.append(clone)

      # Precompile menu element
      $compile(menuEl) $menuScope

      ctrl.$parsers.push (value) ->
        # NOTE: If value is more than an empty string,
        # autocomplete is enabled and not 'onSelect' cycle
        if value and not disabled($scope) and not preventParser
          $timeout.cancel timeoutId if timeoutId?
          if delay > 0
            timeoutId = $timeout ->
              queryData value
            , delay

          else if isMenuAppended
            queryData value

        else
          reset()

        preventParser = false

        return value

      ###
      @name blurHandler
      @description
      Create a blur handler function to make sure directive is unbinding
      the correct handler
      ###
      blurHandler = ->
        if preventBlur
          preventBlur = false
          return

        $scope.$apply ->
          reset()

      ###
      @function
      @name appendMenu
      @description
      Adding menu to DOM
      @param {Function} callback Callback after enter animation completes
      ###
      appendMenu = (callback) ->
        unless isMenuAppended
          element.bind "blur", blurHandler

        isMenuAppended = true

        if inside
          $animate.enter menuEl, undefined, element, callback
        else
          $animate.enter menuEl, angular.element(document.body), undefined, callback

      ###
      @function
      @name reset
      @description
      Resetting autocomplete
      ###
      reset = ->
        $animate.leave menuEl, ->
          $menuScope.index        = 0
          $menuScope.items.length = 0

          # Clear menu element inline style
          menuEl[0].style.top  = ""
          menuEl[0].style.left = ""

          isMenuAppended = false

          element.unbind "blur", blurHandler

        return

      ###
      @function
      @name positionMenu
      @description
      Calculate the style include position and width for menu
      ###
      positionMenu = ->
        parentElement = if inside then element[0] else document.body
        parentStyles  = window.getComputedStyle parentElement

        offset          = element.offset()
        offset.left    -= parseInt parentStyles.marginLeft
        offset.top     += element.outerHeight() - parseInt parentStyles.marginTop
        offset.minWidth = element.outerWidth()

        # Add 'px' to left and top
        angular.forEach offset, (value, key) ->
          if not isNaN(+value) and angular.isNumber +value
            value = "#{value}px"

          menuEl[0].style[key] = value

      ###
      @function
      @name updateItem
      @description
      Update list of items getting passed to menu
      @param {Array} data Array of data
      ###
      updateItem = (data = []) ->
        if data.length > 0
          currentAutocomplete = data

          $menuScope.items = data.map (item) ->
            if angular.isObject item
              item.value ?= labelGetter(item) or ""
              item.label ?= labelGetter(item) or ""
              item

            else
              {label: item, value: item}

          appendMenu positionMenu

      ###
      @function
      @name getData
      @description
      GET request to fetch data from server, update menu items and position
      menu
      @param {String} url URL to fetch data from
      ###
      getData = (url, query) ->
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

          .error (data, status, headers, config) ->
            onError $scope, {data, status, headers}

      ###
      @function
      @name queryData
      @description
      Used for querying data
      @param {String} query Search query
      ###
      queryData = (query) ->
        url = autocompleteUrl $scope

        if url
          getData url, query

        else
          sourceData = source $scope

          if angular.isArray(sourceData)
            updateItem $filter("filter")(sourceData, query)

          else if angular.isString(sourceData)
            getData sourceData, query

          else if angular.isFunction(sourceData)
            sourceData query, updateItem

      element.bind "keydown", (event) ->
        # No action when menu is not showing
        return true if $menuScope.items.length is 0

        switch event.which
          when keys.DOWN
            $scope.$apply ->
              $menuScope.index = ($menuScope.index + 1) % $menuScope.items.length

              event.preventDefault()

          when keys.UP
            $scope.$apply ->
              $menuScope.index = (if $menuScope.index then $menuScope.index else $menuScope.items.length) - 1

              event.preventDefault()

          when keys.ENTER
            $scope.$apply ->
              $menuScope.select $menuScope.index

              # Prevent event from propagating up and possibly causing a form
              # submission.
              event.preventDefault()

          when keys.ESCAPE
            $scope.$apply ->
              reset()

              event.preventDefault()

        return true

      $scope.$on "$destroy", ->
        # Remove and destroy $menuScope
        $menuScope.$destroy()

        reset()

      ###
      @event
      @name reset-mac-autocomplete
      @description
      Event to reset autocomplete
      ###
      $scope.$on "reset-mac-autocomplete", -> reset()
]
