###
@chalk overview
@name Tooltip

@description
Tooltip directive

@param {String}  mac-tooltip           Text to show in tooltip
@param {String}  mac-tooltip-direction Direction of tooltip (default 'top')
@param {String}  mac-tooltip-trigger   How tooltip is triggered (default 'hover')
@param {Boolean} mac-tooltip-inside    Should the tooltip be appended inside element (default false)
@param {Expr}    mac-tooltip-disabled  Disable and enable tooltip
###

###
NOTE: This directive does not use $animate to append and remove DOM element or
  add and remove classes in order to optimize showing tooltips by eliminating
  the need for firing a $digest cycle.
###

angular.module("Mac").directive "macTooltip", [
  "$timeout"
  "util"
  ($timeout, util) ->
    restrict: "A"

    link: (scope, element, attrs) ->
      tooltip  = null
      text     = ""
      enabled  = false
      disabled = false

      defaults =
        direction: "top"
        trigger:   "hover"
        inside:    false

      opts = util.extendAttributes "macTooltip", defaults, attrs

      showTip = ->
        return true if disabled or not text

        tip =
          if opts.inside then element else angular.element(document.body)

        ## Check if the tooltip still exist, remove if it does
        removeTip(0)

        tooltip = angular.element """<div class="mac-tooltip #{opts.direction}"><div class="tooltip-message">#{text}</div></div>"""
        tip.append tooltip

        # Only get element offset when not adding tooltip within the element.
        offset = if opts.inside then { top: 0, left: 0 } else element.offset()

        # Get element height and width.
        elementSize =
          width:  element.outerWidth()
          height: element.outerHeight()

        # Get tooltip width and height.
        tooltipSize =
          width:  tooltip.outerWidth()
          height: tooltip.outerHeight()

        # Adjust offset based on direction.
        switch opts.direction
          when "bottom", "top"
            offset.left += elementSize.width / 2.0 - tooltipSize.width / 2.0
          when "left", "right"
            offset.top  += elementSize.height / 2.0 - tooltipSize.height / 2.0

        switch opts.direction
          when "bottom" then offset.top  += elementSize.height
          when "top"    then offset.top  -= tooltipSize.height
          when "left"   then offset.left -= tooltipSize.width
          when "right"  then offset.left += elementSize.width

        # Constrain the position.
        offset.top  = Math.max 0, offset.top
        offset.left = Math.max 0, offset.left

        # Set the offset.
        angular.forEach offset, (value, key) ->
          if not isNaN(+value) and angular.isNumber +value
            value = "#{value}px"
          tooltip.css key, value

        tooltip.addClass "visible"
        return true

      removeTip = (delay = 100) ->
        if tooltip?
          tooltip.removeClass "visible"
          $timeout ->
            tooltip?.remove()
            tooltip = null
          , delay, false
        return true

      toggle = ->
        if tooltip? then removeTip() else showTip()

      attrs.$observe "macTooltip", (value) ->
        if value?
          text = value

          unless enabled
            unless opts.trigger in ["hover", "click"]
              throw "Invalid trigger"

            switch opts.trigger
              when "click"
                element.bind "click", toggle
              when "hover"
                element.bind "mouseenter", showTip
                element.bind "mouseleave click", -> removeTip()

            enabled = true

      if attrs.macTooltipDisabled?
        scope.$watch attrs.macTooltipDisabled, (value) ->
          disabled = value

      scope.$on "$destroy", ->
        removeTip(0) if tooltip?
]
