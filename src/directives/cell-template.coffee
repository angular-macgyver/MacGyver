angular.module("Mac").directive "macCells", [ ->
  require: "macCells"
  controller: ->
    this.templates = {}
    return
  link: ($scope, $element, $attrs, macCellsController) ->
    $scope.$watch $attrs.macCells, (cells) ->
      for cell in cells
        continue unless macCellsController.templates[cell.colName]?
        [transcludeFn, cScope] = macCellsController.templates[cell.colName]
        nScope                 = cScope.$new()
        nScope.cell            = cell
        transcludeFn nScope, (clone) ->
          $element.append clone
]


angular.module("Mac").directive "macCellTemplate", [ ->
  require: "^macCells"
  transclude: "element"
  priority: 500
  compile: (element, attrs, transclude) ->
    ($scope, $element, $attrs, macCellsController) ->
      macCellsController.templates[$attrs.macCellTemplate] = [transclude, $scope]
]
