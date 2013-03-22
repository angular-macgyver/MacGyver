##
## @name
## Events
##
## @description
## A directive for handling basic html events (e.g., blur, keyup, focus, etc.)
##
##
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

#
# @type directive
# @name macClick
# @description
# macClick recurive go up parent scope to call function
#
# @attributes
# - mac-click:       expression to evaluate upon click
# - mac-click-depth: Max parent scope depth it should go (default 2)
#
angular.module("Mac").directive "macClick", ["$parse", ($parse) ->
  link: ($scope, element, attr) ->
    fn    = $parse attr.macClick
    depth = +(attr.macClickDepth or 2)

    clickAction = (scope, depth, $event) ->
      return false if depth is 0
      ret    = fn scope, {$event, $scope}
      parent = scope.$parent
      if not ret and parent?
        return clickAction parent, depth - 1, $event
      else
        return true

    element.bind "click", (event) ->
      $scope.$apply -> clickAction $scope, depth, event
]

#
# @type directive
# @name macParentClick
# @description
# macParentClick allows you to specify custom behavior on parent scope
# when element is clicked
#
# @attributes
# - mac-parent-click: function called on user click
#                       @param {Object} $event Click event
#
angular.module("Mac").directive "macParentClick", ["$parse", ($parse) ->
  link: ($scope, element, attr) ->
    fn = $parse attr.macParentClick
    return unless $scope.$parent?
    element.bind "click", (event) ->
      $scope.$apply ->
        fn $scope.$parent, {$event: event}
]

for key in ["Enter", "Escape", "Space", "Left", "Up", "Right", "Down"]
  do (key) ->
    angular.module("Mac").directive "macKeydown#{key}", ["$parse", "keys", ($parse, keys) ->
      restrict: "A"
      link: (scope, element, attributes) ->
        expression = $parse attributes["macKeydown#{key}"]
        element.on "keydown", (event) ->
          if event.which is keys["#{key.toUpperCase()}"]
            event.preventDefault()
            scope.$apply -> expression scope, $event: event
    ]

angular.module("Mac").directive "macModelBlur", ["$parse", ($parse) ->
  restrict: "A"
  link: (scope, element, attributes, controller) ->
    element.on "blur", (event) ->
      scope.$apply $parse(attributes.macModelBlur)(scope, $event: event)
]

angular.module("Mac").directive "macPauseTyping", ["$parse", ($parse) ->
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
]
