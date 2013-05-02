angular.module("Mac").directive "macTable", [ "Table", "$parse", (Table, $parse) ->
  require:  "macTable"
  priority: 2000
  scope:    true

  controller: ["$scope", ($scope) ->
    @directive      = "mac-table"
    return
  ]

  compile: (element, attr) ->
    # Add all our extra directives and interpolated values here

    # TODO: Make these queries guard against applying to nested tables
    # seems ok right now, but more testing has to be done...

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

      # A note about how we're $observing and then $watching
      # this is done to avoid using an isolate scope

      # TODO: The way we *have* to have columns when we load the tbale
      # for the sections rows to be populated correctly is an issue
      $attr.$observe "columns", (columnsExp) ->
        $scope.$watch columnsExp, (columns) ->
          ctrl.table = $scope.table = new Table columns
        , true
]
