angular.module("Mac").directive "macTable", [ "Table", (Table) ->
  # templateUrl: "template/table_view.html"
  require: "macTable"
  priority: 2000
  scope:
    models:  "=models"
    columns: "=columns"
    header:  "=header"
  controller: ->
    @directive = "mac-table"
    return

  compile: (element, attr) ->
    # Compile-o-rama! Add all our extra directives and interpolated values here

    # Since initial-width depends on mac-columns,
    # add that to the parent of any we find
    element.find("[initial-width]").parent().attr("mac-columns", "")

    # Resizable? F@@@ YEAH!
    if attr.resizableColumns?
      element.find("[section-row=header],[section=header],[for=header]")
        .find("[cell-template]").attr("mac-resizable", "")

    if attr.reorderableColumns?
      element.find("[section-row=header],[section=header],[for=header]")
        .attr("mac-reorderable", "[cell-template]")

    # All cells should have widths, don't you agree?
    element.find("[cell-template]").attr("width", "{{cell.width}}%")

    ($scope, $element, $attr, ctrl) ->
      ctrl.$element = $element

      $scope.$watch "columns", (value) ->
        ctrl.table = $scope.table = new Table $scope.columns
      , true

      $scope.$watch "models", (value) ->
        $scope.table.load "body", $scope.models
        # As a convenience, if there is no header, add one
        if not $scope.table.sections.header?
          blankRow = $scope.table.blankRow()
          $scope.table.load "header", [blankRow]
      , true

      $scope.$watch "header", (value) ->
        return unless value
        $scope.table.load "header", [$scope.header]
      , true
]
