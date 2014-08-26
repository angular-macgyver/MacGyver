###
@chalk
@name mac-popover (attribute)
@description
Mac popover trigger directive. Without using mac-popover-child-popover, the last
popover will be closed automatically

@param {String}  mac-popover               ID of the popover to show
@param {Boolean} mac-popover-fixed         Determine if the popover is fixed
@param {Boolean} mac-popover-child-popover If the popover is child of another popover (default false)
@param {Integer} mac-popover-offset-x      Extra x offset (default 0)
@param {Integer} mac-popover-offset-y      Extra y offset (default 0)
@param {String}  mac-popover-trigger       Trigger option, click | hover | focus (default click)
- click: Popover only opens when user click on trigger
- hover: Popover shows when user hover on trigger
- focus: Popover shows when focus on input element
@param {String}  mac-popover-exclude       CSV of popover id that can't be shown at the same time
###

angular.module("Mac").
  directive("macPopover", [
    "$timeout"
    "popover"
    "util"
    "popoverViews"
    (
      $timeout
      popover
      util
      popoverViews
    ) ->
      restrict: "A"
      link: (scope, element, attrs) ->
        options = util.extendAttributes "macPopover", popoverViews.defaults, attrs

        exclude     = attrs.macPopoverExclude or ""
        excludeList = if exclude then exclude.split "," else []

        delayId      = null
        closeDelayId = null

        clearDelays = ->
          $timeout.cancel delayId      if delayId?
          $timeout.cancel closeDelayId if closeDelayId?

        show = (id, delay = 0) ->
          clearDelays()

          delayId = $timeout ->
            last = popover.last()

            # Close the last popover
            # If the trigger is the same, `show` acts as a toggle
            if last? and (not excludeList.length or last.id in excludeList or last.id is id)
              popover.hide()
              return true if element[0] is last.element[0]

            options.scope = scope
            popover.show id, element, options
          , delay

          return true

        hide = (element, delay = 0) ->
          clearDelays()
          closeDelayId = $timeout ->
            popover.hide element
          , delay

        attrs.$observe "macPopover", (id) ->
          return unless id

          if options.trigger is "click"
            element.bind "click", -> show id, 0
          else
            showEvent = if "focus" then "focusin" else "mouseenter"
            hideEvent = if "focus" then "focusout" else "mouseleave"

            element.bind showEvent, -> show id, 400
            element.bind hideEvent, -> hide element, 500
  ]).

  #
  # @chalk
  # @name mac-popover(element)
  # @description
  # Element directive to define popover
  #
  # @param {String} id Modal id
  # @param {String} mac-popover-refresh-on Event to update popover size and position
  # @param {Bool}   mac-popover-footer     Show footer or not
  # @param {Bool}   mac-popover-header     Show header or not
  # @param {String} mac-popover-title      Popover title
  # @param {String} mac-popover-direction  Popover direction (default "above left")
  # - above, below or middle - Place the popover above, below or center align the trigger element
  # - left or right  - Place tip on the left or right of the popover
  #
  directive("macPopover", [
    "popover"
    "popoverViews"
    "util"
    (
      popover
      popoverViews
      util
    ) ->
      restrict: "E"
      compile:  (element, attrs) ->
        unless attrs.id
          throw Error "macPopover: Missing id"

        opts = util.extendAttributes "macPopover", popoverViews.popoverDefaults, attrs

        angular.extend opts, {template: element.html()}

        element.replaceWith document.createComment "macPopover: #{attrs.id}"

        ($scope, element, attrs) ->
          attrs.$observe "id", (value) -> popover.register value, opts
  ]).

  #
  # @name mac-popover-fill-content
  # @description
  # An internal directive to compile popover template
  #
  directive("macPopoverFillContent", [
    "$compile", ($compile) ->
      restrict: "A"
      link: ($scope, element, attrs) ->
        element.html $scope.macPopoverTemplate
        $compile(element.contents()) $scope
  ])
