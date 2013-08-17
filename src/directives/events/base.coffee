###
@chalk overview
@name Events

@description
A directive for handling basic html events (e.g., blur, keyup, focus, etc.)
Currently MacGyver has blur, focus, keydown, keyup, mouseenter and mouseleave

@param {Expression} mac-blur       Expression to evaluate on blur
@param {Expression} mac-focus      Expression to evaluate on focus
@param {Expression} mac-keydown    Expression to evaluate on keydown
@param {Expression} mac-keyup      Expression to evaluate on keyup
@param {Expression} mac-mouseenter Expression to evaluate on mouseenter
@param {Expression} mac-mouseleave Expression to evaluate on mouseleave
###

for event in ["Blur", "Focus", "Keydown", "Keyup", "Mouseenter", "Mouseleave"]
  do (event) ->
    angular.module("Mac").directive "mac#{event}", ["$parse", ($parse) ->
      restrict: "A"
      link: (scope, element, attributes) ->
        expression = $parse attributes["mac#{event}"]
        element.on event.toLowerCase(), ($event) ->
          scope.$apply -> expression scope, {$event}
          true
    ]
