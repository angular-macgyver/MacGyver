angular.module("Mac").
  directive("macPauseTyping", ["$parse", ($parse) ->
    # Fires when the user stops typing for more than (delay) milliseconds
    # To change the delay, add a mac-pause-typing-delay="500" attribute to the element
    restrict: "A"
    link: (scope, element, attributes) ->
      expression = $parse attributes["macPauseTyping"]
      delay      = scope.$eval(attributes["macPauseTypingDelay"]) or 800
      keyupTimer = ""
      element.on "keyup", (event) ->
        clearTimeout keyupTimer
        keyupTimer = setTimeout( (->
          scope.$apply ->
            expression(scope, {$event: event})
        ), delay)
  ])
