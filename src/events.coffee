##
## scripts/directives/events.coffee
##
## A directive for handling basic html events (e.g., blur, keyup, focus, etc.)
##

for event in ["Blur", "Focus", "Keydown", "Keyup", "Mouseenter", "Mouseleave"]
  do (event) ->
    angular.module("Util").directive "util#{event}", ["$parse", ($parse) ->
      restrict: "A"
      link: (scope, element, attributes) ->
        expression = $parse attributes["util#{event}"]
        element.on event.toLowerCase(), (event) ->
          scope.$apply -> expression scope, $event: event
          true
    ]

for key in ["Enter", "Escape", "Space", "Left", "Up", "Right", "Down"]
  do (key) ->
    angular.module("Util").directive "utilKeydown#{key}", ["$parse", "Util.keys", ($parse, keys) ->
      restrict: "A"
      link: (scope, element, attributes) ->
        expression = $parse attributes["utilKeydown#{key}"]
        element.on "keydown", (event) ->
          if event.which is keys["#{key.toUpperCase()}"]
            event.preventDefault()
            scope.$apply -> expression scope, $event: event
    ]

angular.module("Util").directive "utilModelBlur", ["$parse", ($parse) ->
  restrict: "A"
  link: (scope, element, attributes, controller) ->
    element.on "blur", (event) ->
      scope.$apply $parse(attributes.utilModelBlur)(scope, $event: event)
]

angular.module("Util").directive "utilPauseTyping", ["$parse", ($parse) ->
  # Fires when the user stops typing for more than (delay) milliseconds
  # To change the delay, add a util-pause-typing-delay="500" attribute to the element
  restrict: "A"
  link: (scope, element, attributes) ->
    expression = $parse attributes["utilPauseTyping"]
    delay      = scope.$eval(attributes["utilPauseTypingDelay"]) or 800
    keyupTimer = ""
    element.on "keyup", (event) ->
      clearTimeout keyupTimer
      keyupTimer = setTimeout( (->
        scope.$apply ->
          expression(scope, {$event: event})
      ), delay)
]
