#
# macCells and macCellTemplate
# Basically a simplified version of ngSwitch that loops over table cells
#

angular.module("Mac").directive "macRows", [ ->
  require:    ["^macTable", "macRows"]
  priority:   500
  transclude: true
  controller: ($scope, $compile, $attrs, $element) ->
    this.templates = {}
    # We can't recompile with
    this.unsafeDirectives = [
      "mac-rows"
      "mac-cell-template"
      "mac-cell-template-default"
    ]

    this.drawRows = (rows, transcludeFn) ->
      for row in rows
        nScope     = $scope.$new()
        nScope.row = row
        transcludeFn nScope, (clone) =>
          for name, ctrl of $element.data()
            clone.data name, ctrl

          console.log this.templates
          $compile(clone)(nScope)
          console.log clone
          console.log this.tableCtrl.$element
          this.tableCtrl.$element.append clone
          this.drawCells(clone, row.cells)

    this.drawCells = ($element, cells) ->
      return unless cells
      # We're gonna redraw all the cells, so first remove them..
      $element.children().remove()
      # Loop over our cells
      for cell in cells
        # FIX: This check for whether we have a default is pretty ugly...
        columnName = cell.colName
        if not this.templates[columnName]? and this.templates["?"]?
          columnName = "?"
        else if not this.templates[columnName]?
          continue

        [transcludeFn, cScope] = this.templates[columnName]
        nScope                 = $scope.$new()
        nScope.cell            = cell
        transcludeFn nScope, (clone) =>
          # Copy all controllers to the new element
          for name, ctrl of $element.data()
            clone.data name, ctrl

          this.addDefaultAttributes clone

          # Remove directives we cannot safely re-compile with
          for attributeName in this.unsafeDirectives
            clone[0].removeAttribute attributeName

          # Recompile with our new attribute and other safely removed
          $compile(clone)(nScope)

          # Append it to the parent element
          $element.append clone

    this.addDefaultAttributes = (clone) ->
      # Add a default `width` if macColumns
      # directive exists on this directive
      if not clone.attr("mac-column-width") and $attrs.macColumns?
        clone.attr "mac-column-width", "{{100/cell.row.cells.length}}"

      # Bind a width attribute to these automatically
      clone.attr "width", "{{cell.width}}%"

      # Do we want these to be resizable?
      if $attrs.macCellsResizable?
        clone.attr "mac-resizable", true

    return

  compile: (element, attr, transclude) ->
    ($scope, $element, $attrs, controllers) ->
      [macTableController, macRowsController] = controllers
      macRowsController.tableCtrl             = macTableController
      $scope.table                            = macTableController.table
      sectionName                             = $attrs.macRows
      rowsExpression                          = "table.sections.#{sectionName}.rows"
      console.log rowsExpression

      $scope.$watch rowsExpression, (rows) ->
        return unless rows
        console.log rows
        macRowsController.drawRows rows, transclude
        # ctrl.drawCells cells

]

angular.module("Mac").directive "macCellTemplate", [ ->
  require: "^macRows"
  transclude: "element"
  priority: 1000
  compile: (element, attrs, transclude) ->
    ($scope, $element, $attrs, macCellsController) ->
      macCellsController.templates[$attrs.macCellTemplate] = [transclude, $scope]
]

angular.module("Mac").directive "macCellTemplateDefault", [ ->
  require: "^macRows"
  transclude: "element"
  priority: 1000
  compile: (element, attrs, transclude) ->
    console.log "Fired"
    ($scope, $element, $attrs, macCellsController) ->
      macCellsController.templates["?"] = [transclude, $scope]
]
