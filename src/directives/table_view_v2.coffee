angular.module("Mac").directive "macTableV2", [ "Table", (Table) ->
  require:    "macTableV2"
  priority:   2000
  scope:      true
  controller: ["$scope", ($scope) ->
    @directive = "mac-table"
    @makeTable = (columns) -> @table = $scope.table = new Table columns
    return
  ]
  compile: (element, attr) ->
    # Bootstrap our template
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

    # Generating the boilerplate initial-width calculations is a drag,
    # lets do that automatically using the "auto" value in initialWidth directive
    autoWidthTemplates = element.find("[initial-width=auto]")
    if autoWidthTemplates.length
      autoWidthTemplates.each ->
        siblings       = $(this).siblings("[initial-width]")
        hardsetPercent = 0
        siblings.each ->
          hardsetPercent += +$(this).attr('initial-width').replace "%", ""
        initialWidthExp =
          "{{(100/(table.columns.length - #{siblings.length})) - (#{hardsetPercent}/(table.columns.length - #{siblings.length}))}}%"
        $(this).attr "initial-width",  initialWidthExp

    ($scope, $element, $attr, controller) ->
      controller.$element = $element

      # A note about how we're $observing and then $watching
      # this is done to avoid using an isolate scope

      $attr.$observe "columns", (columnsExp) ->
        # As a convenience, we'll take the word "dynamic" unevaluated
        # and make a dynamic table
        if columnsExp is "dynamic"
          controller.makeTable "dynamic"
        # Otherwise we'll watch on our expression
        else
          $scope.$watch columnsExp, (columns) ->
            controller.makeTable columns
          , true
]
