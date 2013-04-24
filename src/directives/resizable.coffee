# http://bugs.jqueryui.com/ticket/2421
#
# Example:
# mac-resizable
# mac-resizable-callback="resizeIt"
#
angular.module("Mac").directive "macResizable", [ ->
  (scope, element, attrs) ->
    axis = attrs.macResizable or "x"
    # TODO: do a check here
    callback = scope.$eval attrs.macResizableCallback
    element.resizable
      axis:        axis
      containment: "parent"
      handles:     "e"
      resize:      (event, ui) ->
        callback element, event, ui, scope
]
