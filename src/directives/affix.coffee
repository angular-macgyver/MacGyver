###
@chalk overview
@name mac-affix

@description
Fix the component at a certain position

@param {Expr} mac-affix-disabled To unpin element
@param {Expr} mac-affix-top      Top offset (default 0)
@param {Expr} mac-affix-bottom   Bottom offset (default 0)
###

angular.module("Mac").directive "macAffix", ->
  link: ($scope, element, attrs) ->
    defaults =
      top:      0
      bottom:   0
      disabled: false
      classes:  "affix affix-top affix-bottom"

    offset    = top: defaults.top, bottom: defaults.bottom
    position  = top: 0, left: 0
    disabled  = defaults.disabled
    lastAffix = null
    unpin     = null
    windowEl  = angular.element(window)

    if attrs.macAffixTop?
      offset.top = $scope.$eval(attrs.macAffixTop) or defaults.top
      $scope.$watch attrs.macAffixTop, (value) ->
        offset.top = value if value?

    if attrs.macAffixBottom?
      offset.bottom = $scope.$eval(attrs.macAffixBottom) or defaults.bottom
      $scope.$watch attrs.macAffixBottom, (value) ->
        offset.bottom = value if value?

    (getPosition = ->
      position = element.offset()
    )()

    scrollEvent = ->
      # Check if element is visible
      return if element[0].offsetHeight <= 0 and element[0].offsetWidth <= 0

      scrollTop    = windowEl.scrollTop()
      scrollHeight = angular.element(document).height()

      affix =
        if unpin? and scrollTop + unpin <= position.top
          false
        else if position.top + element.height() >= scrollHeight - offset.bottom
          "bottom"
        else if scrollTop <= offset.top
          "top"
        else
          false

      return if affix is lastAffix
      lastAffix = affix

      element.css "top", "" if unpin

      element
        .removeClass(defaults.classes)
        .addClass "affix" + (if affix then "-#{affix}" else "")

      if affix is "bottom"
        unpin = position.top - scrollTop
        element.css(
          "top",
          document.body.offsetHeight - offset.bottom - element.height()
        )
      else
        unpin = null

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

    $scope.$on "refresh-mac-affix", getPosition
    $scope.$on "$destroy", ->
      windowEl.unbind "scroll", scrollEvent
