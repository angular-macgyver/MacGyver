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

      showTip = (event) ->
        return if disabled

        tip       = if opts.inside then element else $(document.body)
        tooltip   = $("""<div class="tooltip #{opts.direction}"><div class="tooltip-message">#{text}</div></div>""")
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
          when "bottom", "top" then offset.left += elementSize.width / 2.0 - tooltipSize.width / 2.0
          when "left", "right" then offset.top  += elementSize.height / 2.0 - tooltipSize.height / 2.0

        switch opts.direction
          when "bottom" then offset.top  += elementSize.height
          when "top"    then offset.top  -= tooltipSize.height
          when "left"   then offset.left -= tooltipSize.width
          when "right"  then offset.left += elementSize.width

        # Constrain the position.
        offset.top  = Math.max 0, offset.top
        offset.left = Math.max 0, offset.left

        # Set the offset.
        tooltip.css(offset).addClass "visible"

      removeTip = (event) ->
        tooltip.removeClass "visible"
        $timeout ->
          tooltip.remove()
        , 100

      toggle = (event) ->
        if tooltip? then removeTip(event) else showTip(event)

      attrs.$observe "macTooltip", (value) ->
        if value? and value
          text = value

          unless enabled
            unless opts.trigger in ["hover", "click"]
              throw "Invalid trigger"

            switch opts.trigger
              when "click"
                element.on "click", toggle
              when "hover"
                element.on "mouseenter", showTip
                element.on "mouseleave click", removeTip

            enabled = true

      scope.$watch attrs.macTooltipDisabled, (value) ->
        disabled = value

      scope.$on "$destroy", ->
        removeTip() if tooltip?
]
