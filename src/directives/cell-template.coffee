#
# macCells and macCellTemplate
# Basically a simplified version of ngSwitch that loops over table cells
#

angular.module("Mac").directive "macCells", [ ->
  require: "macCells"
  controller: ->
    this.templates = {}
    return
  link: ($scope, $element, $attrs, ctrl) ->
    $scope.$watch $attrs.macCells, (cells) ->
      # We're gonna redraw all the cells, so first remove them..
      $element.children().remove()
      # Loop over our cells
      for cell in cells
        # FIX: This check for whether we have a default is pretty ugly...
        columnName = cell.colName
        if not ctrl.templates[columnName]? and ctrl.templates["?"]?
          columnName = "?"
        else if not ctrl.templates[columnName]?
          continue
        [transcludeFn, cScope] = ctrl.templates[columnName]
        nScope                 = cScope.$new()
        nScope.cell            = cell
        transcludeFn nScope, (clone) -> $element.append clone
]


angular.module("Mac").directive "macCellTemplate", [ ->
  require: "^macCells"
  transclude: "element"
  priority: 500
  compile: (element, attrs, transclude) ->
    ($scope, $element, $attrs, macCellsController) ->
      macCellsController.templates[$attrs.macCellTemplate] = [transclude, $scope]
]

angular.module("Mac").directive "macCellTemplateDefault", [ ->
  require: "^macCells"
  transclude: "element"
  priority: 500
  compile: (element, attrs, transclude) ->
    ($scope, $element, $attrs, macCellsController) ->
      macCellsController.templates["?"] = [transclude, $scope]
]
