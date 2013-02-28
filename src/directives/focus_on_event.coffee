module = angular.module "Mac"

module.directive "macFocusOnEvent", ->
  (scope, element, attributes) ->
    scope.$on attributes.geFocusOnEvent, ->
      setTimeout (->
        x = window.scrollX
        y = window.scrollY

        element.focus()

        window.scrollTo x, y
      ), 0
