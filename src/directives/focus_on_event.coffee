###
@chalk overview
@name mac-focus-on-event

@description
Scroll window to the element and focus on the element

@param {String} mac-focus-on-event Event to focus on element
###
angular.module("Mac").directive "macFocusOnEvent", ->
  (scope, element, attributes) ->
    scope.$on attributes.macFocusOnEvent, ->
      setTimeout (->
        x = window.scrollX
        y = window.scrollY

        element.focus()

        window.scrollTo x, y
      ), 0
