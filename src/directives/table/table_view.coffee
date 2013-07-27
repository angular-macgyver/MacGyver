###
@chalk overview
@name Table 
@description
Directive for displaying tabluar data

@param {None}       mac-table-resizable-columns     Convenience param to add macResizableColumn and dependent directives to template elements
@param {None}       mac-table-reorderable-columns   Convenience param to add macReorderableColumn and dependent directives to template elements

###

angular.module("Mac").factory "MacTableController", ["Table", (Table) ->
  class MacTableController
    constructor: (@scope) ->

    hasResizableColumns:   false
    hasReorderableColumns: false

    makeTable: (columns) ->
      @table = @scope.table = new Table columns
]

angular.module("Mac").directive "macTable", [ "MacTableController", (MacTableController) ->
  require:    "macTable"
  scope:      true
  controller: ["$scope", MacTableController]

  compile: (element, attr) ->
    # Bootstrap our template
    # Reduces the amount of setup on the users end when creating a new table

    # Cache our selectors
    headerSectionElement = element.find("[mac-table-section=header]")

    # If we find the width directive we can assume that the parent
    # should have the mac-columns directive
    element.find("[mac-column-width]")
      .attr("width", "{{cell.column.width}}%")
      .parents("[mac-table-row]")
      .attr("mac-columns", "")

    # Format our mac-cell-templates
    element.find("[mac-cell-template]")
      # Add a wrapper to the inside of our cells
      .wrapInner("<div class='cell-wrapper' />")
      .attr("data-column-name", "{{cell.column.colName}}")

    # Resizable?
    if attr.macTableResizableColumns?
      headerSectionElement
        .find("[mac-cell-template]").find(".cell-wrapper")
        .attr("mac-resizable-column", "")
        .attr("mac-resizable", "")
        .attr("mac-resizable-containment", "document")

    # Reorderable?
    if attr.macTableReorderableColumns?
      headerSectionElement
        .find("[mac-table-row]")
        .attr("mac-reorderable", "[mac-cell-template]")
        .attr("mac-reorderable-columns", "")

    # Generate our boilerplate ng-repeat on rows if there isn't on set already
    element.find("[mac-table-row]")
      .not("[mac-table-row][ng-repeat]")
      .attr("ng-repeat", "row in section.rows")

    # Generating the boilerplate mac-column-width calculations is a drag,
    # lets do that automatically looking for "auto" in mac-column-width
    autoWidthTemplates = headerSectionElement.find("[mac-column-width=auto]")
    if autoWidthTemplates.length
      siblingTemplates = headerSectionElement.find("[mac-column-width]").not("[mac-column-width=auto]")
      remainingPercent = 100
      siblingTemplates.each ->
        remainingPercent -= +$(this).attr('mac-column-width').replace "%", ""
      initialWidthExp =
        "{{#{remainingPercent} / (table.columns.length - #{siblingTemplates.length})}}%"
      # Set each auto width template with our expression
      autoWidthTemplates.attr "mac-column-width",  initialWidthExp

    ($scope, $element, $attr, controller) ->
      controller.$element = $element

      # A note about how we're $observing and then $watching
      # this is done to avoid using an isolate scope

      $attr.$observe "macTableColumns", (columnsExp) ->
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
