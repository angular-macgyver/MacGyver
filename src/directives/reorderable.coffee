angular.module("Mac").directive "macReorderable", [
  "hookableDirectiveController"
  (hookableDirectiveController) ->
    require: ["macReorderable"]

    controller: ["$scope", "$element", "$attrs", hookableDirectiveController]
    link: ($scope, $element, $attrs, controllers) ->
      selector = $attrs.macReorderable
      $element.sortable
        items:     selector
        cursor:    "move"
        opacity:   0.8
        tolerance: "pointer"
        update:    (event, ui) ->
          controllers[0].fireCallbacks event, ui, $element.find selector
]


angular.module("Mac").directive "macReorderableColumns", [ ->
  require: ["^macTable", "macReorderable"]

  link: ($scope, $element, $attr, controllers) ->
    controllers[1].registerCallback (event, ui, columnElements) ->
      columnsOrder   = []
      changedElement = $(ui.item)

      columnElements.each ->
        columnsOrder.push $(this).scope().cell.column.colName

      $scope.$apply ->
        controllers[0].table.columnsOrder = columnsOrder
        controllers[0].table.columnsCtrl.syncOrder()
]
