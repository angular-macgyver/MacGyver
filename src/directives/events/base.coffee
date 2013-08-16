###
@chalk overview
@name Events

@description
A directive for handling basic html events (e.g., blur, keyup, focus, etc.)
Currently MacGyver has blur, focus, keydown, keyup, mouseenter and mouseleave

@param {Expression} mac-blur       Expression to evaulate on blur
@param {Expression} mac-focus      Expression to evulate on focus
@param {Expression} mac-keydown    Expression to evulate on keydown
@param {Expression} mac-keyup      Expression to evulate on keyup
@param {Expression} mac-mouseenter Expression to evulate on mouseenter
@param {Expression} mac-mouseleave Expression to evulate on mouseleave
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
