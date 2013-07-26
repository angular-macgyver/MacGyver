##
## @name
## Events
##
## @description
## A directive for handling basic html events (e.g., blur, keyup, focus, etc.)
##

for event in ["Blur", "Focus", "Keydown", "Keyup", "Mouseenter", "Mouseleave"]
  do (event) ->
    angular.module("Mac").directive "mac#{event}", ["$parse", ($parse) ->
      restrict: "A"
      link: (scope, element, attributes) ->
        expression = $parse attributes["mac#{event}"]
        element.on event.toLowerCase(), (event) ->
          scope.$apply -> expression scope, $event: event
          true
    ]
