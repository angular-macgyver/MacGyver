angular.module("Mac").directive "macFocusOnEvent", ->
  (scope, element, attributes) ->
    scope.$on attributes.macFocusOnEvent, ->
      setTimeout (->
        x = window.scrollX
        y = window.scrollY

        element.focus()

        window.scrollTo x, y
      ), 0
