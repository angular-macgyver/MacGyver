###
@chalk overview
@name mac-affix

@description
Fix the component at a certain position

@param {Expr}  mac-affix-disabled To unpin element (default false)
@param {Expr}  mac-affix-top      Top offset (default 0)
@param {Expr}  mac-affix-bottom   Bottom offset (default 0)
@param {Event} refresh-mac-affix  To update the position of affixed element
###

angular.module("Mac").directive "macAffix", [
  "$document"
  "$window"
  ($document, $window)->
    link: ($scope, element, attrs) ->
      defaults =
        top:      0
        bottom:   0
        disabled: false
        classes:  "affix affix-top affix-bottom"

      offset       = top: defaults.top, bottom: defaults.bottom
      disabled     = defaults.disabled
      lastAffix    = null
      unpin        = null
      pinnedOffset = null
      windowEl     = angular.element($window)

      ###
      @name setOffset
      @description
      Update top or bottom offset. This function will make sure the value is
      an integer and use default value
      @param {String} key Offset key
      @param {String|Integer} value Update value
      @param {Bool} useDefault
      ###
      setOffset = (key, value, useDefault = false) ->
        value       = defaults[key] if useDefault and not value?
        offset[key] = +value if value? and not isNaN(+value)

      if attrs.macAffixTop?
        setOffset "top", $scope.$eval(attrs.macAffixTop), true
        $scope.$watch attrs.macAffixTop, (value) -> setOffset "top", value

      if attrs.macAffixBottom?
        setOffset "bottom", $scope.$eval(attrs.macAffixBottom), true
        $scope.$watch attrs.macAffixBottom, (value) -> setOffset "bottom", value

      getPinnedOffset = ->
        return pinnedOffset if pinnedOffset?

        element.removeClass(defaults.classes).addClass "affix"
        scrollHeight = $document.height()
        pinnedOffset = scrollHeight - element.outerHeight() - offset.bottom
        return pinnedOffset

      scrollEvent = ->
        # Check if element is visible
        return if element[0].offsetHeight <= 0 and element[0].offsetWidth <= 0

        position      = element.offset()
        scrollTop     = windowEl.scrollTop()
        scrollHeight  = $document.height()
        elementHeight = element.outerHeight()

        affix =
          # Disable pinning to the bottom
          if unpin? and scrollTop <= unpin
            false

          # If user scroll pass element and should fix to the bottom
          else if offset.bottom? and scrollTop > scrollHeight - elementHeight - offset.bottom
            "bottom"

          # Before top offset and affixing element
          else if offset.top? and scrollTop <= offset.top
            "top"

          # Affix element to certain position
          else
            false

        return if affix is lastAffix
        element.css "top", "" if unpin

        lastAffix = affix
        unpin     = if affix is "bottom" then getPinnedOffset() else null

        element
          .removeClass(defaults.classes)
          .addClass "affix" + (if affix then "-#{affix}" else "")

        if affix is "bottom"
          curOffset = element.offset()
          element.css "top", unpin - curOffset.top

        return true

      if attrs.macAffixDisabled?
        disabled = $scope.$eval(attrs.macAffixDisabled) or defaults.disabled
        $scope.$watch attrs.macAffixDisabled, (value) ->
          return if not value? or value is disabled

          disabled = value
          action   = if value then "unbind" else "bind"
          windowEl[action] "scroll", scrollEvent

          if disabled
            # clear all styles and reset affix element
            lastAffix = null
            unpin     = null

            element
              .css("top", "")
              .removeClass defaults.classes
          else
            scrollEvent()

      unless disabled
        windowEl.bind "scroll", scrollEvent

      $scope.$on "refresh-mac-affix", -> position = element.offset()
      $scope.$on "$destroy",          -> windowEl.unbind "scroll", scrollEvent
]
