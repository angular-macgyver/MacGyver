angular.module("Mac").directive "macTable", [ "Table", "$parse", (Table, $parse) ->
  require: "macTable"
  priority: 2000
  scope: true

  controller: ["$scope", ($scope) ->
    @directive      = "mac-table"
    @setBodyContent = (models) ->

      $scope.table.load "body", models
      # As a convenience, if there is no header, add one
      if not $scope.table.sections.header?
        blankRow = $scope.table.blankRow()
        $scope.table.load "header", [blankRow]

    return
  ]

  compile: (element, attr) ->
    # Compile-o-rama! Add all our extra directives and interpolated values here

    # TODO: Make these queries guard against applying to nested tables

    # Since initial-width depends on mac-columns,
    # add that to the parent of any we find
    element.find("[initial-width]").parents("[table-row]").attr("mac-columns", "")

    # Resizable? F@@@ YEAH!
    if attr.resizableColumns?
      element.find("[table-section=header]")
        .find("[cell-template]").attr("mac-resizable", "")

    if attr.reorderableColumns?
      element.find("[table-section=header] [table-row]")
        .attr("mac-reorderable", "[cell-template]")

    # All cells should have widths, don't you agree?
    element.find("[cell-template]").attr("width", "{{cell.width}}%")

    ($scope, $element, $attr, ctrl) ->
      ctrl.$element = $element

      $scope.$watch "columns", (columns) ->
        ctrl.table = $scope.table = new Table columns

        $attr.$observe "models", (modelsExp) ->
          $scope.$watch modelsExp, (models) ->
            ctrl.setBodyContent models
          , true

      , true

      $scope.$watch "header", (header) ->
        $scope.table.load "header", [header]
      , true
]
