angular.module("Mac").directive "macTableV2", [ "Table", (Table) ->
  require:    "macTableV2"
  priority:   2000
  scope:      true
  controller: ->
    @directive = "mac-table"
    return
  compile: (element, attr) ->
    # Apply boilerplate template directives
    # Reduces the amount of setup on the users end when creating a new table

    # If we find the initial-width directive we can assume that the parent
    # should have the mac-columns directive
    element.find("[initial-width]").parents("[table-row]").attr("mac-columns", "")

    # Resizable?
    if attr.resizableColumns?
      element.find("[table-section=header]")
        .find("[cell-template]").attr("mac-resizable", "")

    # Reorderable?
    if attr.reorderableColumns?
      element.find("[table-section=header] [table-row]")
        .attr("mac-reorderable", "[cell-template]")

    # Give our cells widths
    element.find("[cell-template]").attr("width", "{{cell.width}}%")

    ($scope, $element, $attr, controller) ->
      controller.$element = $element

      # A note about how we're $observing and then $watching
      # this is done to avoid using an isolate scope

      $attr.$observe "columns", (columnsExp) ->
        $scope.$watch columnsExp, (columns) ->
          controller.table = $scope.table = new Table columns
        , true
]
