angular.module("Mac").directive "macResizable", [
  "hookableDirectiveController"
  (hookableDirectiveController) ->
    require:    ["macResizable"]
    controller: ["$scope", "$element", "$attrs", hookableDirectiveController]

    link: ($scope, $element, $attrs, controllers) ->
      axis        = $attrs.macResizable or "x"
      containment = $attrs.macResizableContainment or "parent"
      $element.resizable
        axis:        axis
        containment: containment
        handles:     "e"
        resize:      (event, ui) -> controllers[0].fireCallbacks event, ui
]

angular.module("Mac").directive "macResizableColumn", [ ->
  require: ["^macColumns", "macResizable"]

  link: ($scope, $element, $attrs, controllers) ->
    controllers[1].registerCallback (event, ui) ->
      column      = $scope.cell.column
      width       = ui.size.width
      percentage  = (width/controllers[0].element.width())*100

      $element.css("width", "") # Reset the width that jQuery will assign

      $scope.$apply ->
        controllers[0].recalculateWidths null, $scope.$id, percentage, +column.width
]
