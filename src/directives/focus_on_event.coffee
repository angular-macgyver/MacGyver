###
@chalk overview
@name mac-focus-on-event

@description
Scroll window to the element and focus on the element

@param {String}  mac-focus-on-event Event to focus on element
@param {Boolean} mac-focus-on-event-scroll Scroll to element location or not
###
angular.module("Mac").directive "macFocusOnEvent", ["$timeout", ($timeout) ->
  (scope, element, attributes) ->
    scope.$on attributes.macFocusOnEvent, ->
      $timeout ->
        element.focus()
        if attributes.macFocusOnEventScroll
          x = window.scrollX
          y = window.scrollY
          window.scrollTo x, y
      , 0
]
