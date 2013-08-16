###
@chalk overview
@name Pause Typing

@description
macPauseTyping directive allow user to specify custom behavior after user stops typing for more than (delay) milliseconds

@param {Expression} mac-pause-typing       Expression to evaluate after delay
@param {Expression} mac-pause-typing-delay Delay value to evaluate expression (default 800)
###

angular.module("Mac").
  directive("macPauseTyping", ["$parse", "$timeout", ($parse, $timeout) ->
    restrict: "A"
    link:     (scope, element, attributes) ->
      expression = $parse attributes["macPauseTyping"]
      delay      = scope.$eval(attributes["macPauseTypingDelay"]) or 800
      keyupTimer = null
      element.on "keyup", ($event) ->
        $timeout.cancel keyupTimer if keyupTimer?
        keyupTimer = $timeout ->
          expression scope, {$event}
        , delay
  ])
