###
@chalk overview
@name Popover
###

###
@chalk provider
@name Popover Provider

@description
Configurate popover options in config block.

@param {Object} defaults Popover defaults
```js
{
  fixed: false,
  childPopover: false,
  offsetY: 0,
  offsetX: 0,
  trigger: "click"
}
```

@param {Object} popoverDefaults Popover trigger defaults
```js
{
  footer: false,
  header: false,
  title: "",
  direction: "above left"
}
```

@param {String} template Popover template
```js
"<div class=\"mac-popover\" ng-class=\"macPopoverClasses\">
  <div class=\"tip\"></div>
    <div class=\"popover-header\">
      <div class=\"title\">{{macPopoverTitle}}</div>
    </div>
  <div mac-popover-fill-content></div>
</div>";
```

###

###
@chalk service
@name Popover Service

@description
Popover service to keep state of opened popover. Allowing user to hide certain
or all popovers

@param {Array} popoverList The popover that's currently being shown

@param {Array} registered Object storing all the registered popover DOM elements

@param {Function} last Get data of the last popover
- Returns {Object} The last opened popover

@param {Function} register Register a popover with an id and an element
- {String} id Popover id
- {DOM Element} element Popover element
- Returns {Bool} If the id already existed

@param {Function} unregister Remove id and element from registered list of popover
- {String} id Popover id
- Returns {Bool} If the id exist

@param {Function} add Add a new popover to opened list
- {String} id Popover id
- {DOM Element} popover Popover DOM element
- {DOM Element} element Trigger DOM element
- {Object} options Additional options
- Returns {Object} The new popover object

@param {Function} pop Get and remove the last popover from list
- Returns {Object} Last element from popoverList

@param {Function} show Show and position a registered popover
- {String} id Popover id
- {DOM Element} element Element that trigger the popover
- {Object} options Additional options for popover

@param {Function} getById Get opened popover object by id
- {String} id Popover id
- Returns {Object} Opened popover object

@param {Function} resize Update size and position of an opened popover
- {Object|String} popoverObj Support multiple type input:
  - Object: One of the popover objects in popoverList
  - String: Popover ID

@param {Function} hide Hide a certain popover. If no selector is provided, the
last opened popover is hidden
- {DOM Element|String} selector Support multiple type input:
  - DOM Element: Popover trigger element
  - String: Popover ID
- {Function} callback Callback after popover is hidden

@param {Function} hideAll Hide all popovers

###

angular.module("Mac").
  provider("popover", ->
    this.registered = registered = {}
    this.defaults   = defaults   =
      fixed:        false
      childPopover: false
      offsetY:      0
      offsetX:      0
      trigger:      "click"

    this.popoverDefaults = popoverDefaults =
      footer:    false
      header:    false
      title:     ""
      direction: "above left"

    ###
    @name template
    @description
    Popover template
    ###
    this.template = popoverTemplate = """
      <div class="mac-popover" ng-class="macPopoverClasses">
        <div class="tip"></div>
        <div class="popover-header">
          <div class="title">{{macPopoverTitle}}</div>
        </div>
        <div mac-popover-fill-content></div>
      </div>
    """

    @$get = [
      "$animate"
      "$compile"
      "$controller"
      "$http"
      "$rootScope"
      "$templateCache"
      "$timeout"
    (
      $animate
      $compile
      $controller
      $http
      $rootScope
      $templateCache
      $timeout
    ) ->
      service =
        popoverList: []

        registered: registered

        defaults: defaults

        popoverDefaults: popoverDefaults

        template: popoverTemplate

        last: -> @popoverList[@popoverList.length - 1]

        register: (id, options) ->
          unless exist = @registered[id]?
            @registered[id] = options
          return not exist

        unregister: (id) ->
          if exist = @registered[id]?
            delete @registered[id]
          return exist

        add: (id, popover, element, options) ->
          newObject = {id, popover, element, options}
          @popoverList.push newObject
          return newObject

        pop: -> @popoverList.pop()

        show: (id, element, options = {}) ->
          popoverOptions = @registered[id]
          return false unless popoverOptions

          addPopover = ->
            showPopover = (template) ->
              # Scope allows either a scope or an object:
              # - Scope - Use the scope to compile modal
              # - Object - Creates a new "isolate" scope and extend the isolate
              # scope with data being passed in
              #
              # Use the scope passed in
              if isScope(options.scope)
                viewScope = options.scope.$new()

              # Create an isolated scope and extend scope with value pass in
              else
                viewScope = $rootScope.$new true
                if angular.isObject options.scope
                  angular.extend viewScope, options.scope

              # Bind refresh on listener to popover
              if popoverOptions.refreshOn
                viewScope.$on popoverOptions.refreshOn, ->
                  service.resize id

              # Bind controller to popover scope
              if popoverOptions.controller
                $controller popoverOptions.controller,
                  $scope: viewScope

              angular.extend viewScope,
                macPopoverClasses:
                  footer: popoverOptions.footer or false
                  header: popoverOptions.header or !!popoverOptions.title or false
                  fixed:  popoverOptions.fixed  or false
                macPopoverTitle:    popoverOptions.title or ""
                macPopoverTemplate: template

              popover = $compile(popoverTemplate)(viewScope)
              popover.attr
                id:        id
                direction: popoverOptions.direction or "below left"

              popoverObj = service.add id, popover, element, options
              $animate.addClass element, "active"

              $rootScope.$broadcast "popoverWasShown", id

              $animate.enter(popover, angular.element(document.body)).then ->
                service.resize popoverObj

            if (template = popoverOptions.template)
              showPopover template

            else if (path = popoverOptions.templateUrl)
              template = $templateCache.get path
              if template
                showPopover template
              else
                $http.get(path).then (resp) ->
                  $templateCache.put path, resp.data
                  showPopover resp.data
                , ->
                  throw new Error('Failed to load template: #{path}')

          if service.popoverList.length and not !!options.childPopover
            service.hide addPopover
          else
            addPopover()

          return true

        getById: (id, element) ->
          for item in @popoverList
            sameTrigger = not element? or item.element is element
            return item if item.id is id and sameTrigger

        resize: (popoverObj) ->
          if angular.isString popoverObj
            popoverObj = service.getById popoverObj
          return unless popoverObj?

          currentPopover  = popoverObj.popover
          relativeElement = popoverObj.element
          options         = popoverObj.options
          $window         = angular.element(window)

          offset     = relativeElement.offset()
          offset.top = relativeElement.position().top if options.fixed
          relative   =
            height: relativeElement.outerHeight()
            width:  relativeElement.outerWidth()

          current =
            height: currentPopover.outerHeight()
            width:  currentPopover.outerWidth()

          top  = 0
          left = 0

          position = (currentPopover.attr("direction") or "top left").trim()

          setOverflowPosition = (offset = 0) ->
            tip       = angular.element currentPopover[0].getElementsByClassName("tip")
            top      -= offset
            tipOffset = +tip.css("margin-top").replace "px", ""
            tip.css "margin-top", tipOffset + offset

          updateOffset = ->
            switch position
              when "above left"
                top  = -(current.height + 10)
                left = -25 + relative.width / 2
              when "above right"
                top  = -(current.height + 10)
                left = 25 + relative.width / 2 - current.width
              when "below left"
                top  = relative.height + 10
                left = -25 + relative.width / 2
              when "below right"
                top  = relative.height + 10
                left = 25 + relative.width / 2 - current.width
              when "middle right"
                top  = relative.height / 2 - current.height / 2
                left = relative.width + 10
              when "middle left"
                top  = relative.height / 2 - current.height / 2
                left = -(current.width + 10)
          updateOffset()

          #Calculate if popover is clipped by window, swap direction otherwise
          topScroll  = if options.fixed then 0 else $window.scrollTop()
          leftScroll = if options.fixed then 0 else $window.scrollLeft()
          action     = {}

          # if position is either above or below
          if position.indexOf("middle") is -1
            if offset.top + top - topScroll < 0 # above
              action = {remove: "above", add: "below"}

            else if offset.top + top + current.height - topScroll > $window.height()
              action = {remove: "below", add: "above"}

          # if position is middle
          else
            if (diff = offset.top + top - topScroll) < 0
              setOverflowPosition diff

            else if (diff = offset.top + top + currentPopover.outerHeight() - topScroll - $window.height()) > 0
              setOverflowPosition diff

          # Update offset for above or below
          if action.remove and action.add
            position = position.replace action.remove, action.add

          # Clear action for left and right
          action = {}

          # Right align originally, switching to left
          if offset.left + left - leftScroll < 0
            action = {remove: "right", add: "left"}

          # Left align originally, switching to right
          else if offset.left + left + currentPopover.outerWidth() - leftScroll > $window.width()
            action = {remove: "left", add: "right"}

          if action.remove and action.add
            position = position.replace action.remove, action.add

          updateOffset()

          offset.top  += top
          offset.left += left

          # Add any configured offset on the popover trigger
          offset.left += options.offsetX if options.offsetX?
          offset.top  += options.offsetY if options.offsetY?

          angular.forEach offset, (value, key) ->
            unless isNaN(+value)
              value = "#{value}px"
            currentPopover.css key, value

          currentPopover.addClass "visible #{position}"

        # Hides the currently-shown popover.
        hide: (selector, callback) ->
          # Don't need to hide when no popover is open
          return callback?() unless @popoverList.length

          if angular.isFunction(selector)
            callback = selector
            selector = null

          if selector?
            comparator =
              if angular.isString selector
                (item) -> item.id is selector
              else if angular.isElement selector
                (item) -> item.element is selector
            index = -1

            for i in [@popoverList.length-1..0] by -1 when comparator @popoverList[i]
              popoverObj = @popoverList[i]
              index      = i
              break

            @popoverList.splice index, 1 if index > -1

          else
            # Get the last popover element
            popoverObj = @pop()

          return unless popoverObj?

          $rootScope.$broadcast "popoverBeforeHide", popoverObj.id

          # Remove active class on popover trigger
          $animate.removeClass popoverObj.element, "active"

          removeScope = popoverObj.popover.scope()
          $animate.leave(popoverObj.popover).then ->
            $rootScope.$broadcast "popoverWasHidden", popoverObj.id

            removeScope.$destroy()

            callback?()

        # Hides all the currently-shown popover
        hideAll: ->
          @hide() while @popoverList.length
          return

      return service
    ]

    return
  ).

  config ["popoverProvider", (popoverProvider) ->
    angular.module("Mac").popover = (name, options) ->
      unless popoverProvider.registered[name]?
        opts = {}
        angular.extend opts, popoverProvider.popoverDefaults, options, {id: name}
        popoverProvider.registered[name] = opts
  ]
