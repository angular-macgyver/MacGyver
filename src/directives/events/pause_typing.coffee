angular.module("Mac").
  directive("macPauseTyping", ["$parse", "$timeout", ($parse, $timeout) ->
    # Fires when the user stops typing for more than (delay) milliseconds
    # To change the delay, add a mac-pause-typing-delay="500" attribute to the element
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
