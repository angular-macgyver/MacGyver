# http://bugs.jqueryui.com/ticket/2421
#
# Example:
# mac-resizable
#
angular.module("Mac").directive "macResizable", [ ->
  (scope, element, attrs) ->
    axis = attrs.macResizable or "x"
    element.resizable
      axis:        axis
      containment: "parent"
      handles:     "e"
      resize:      (event, ui) ->
        scope.$emit "mac-element-#{scope.$id}-changed", "resized", element, event, ui,
        scope.$emit "mac-element-#{scope.$parent.$id}-changed", "resized", element, event, ui,
]
