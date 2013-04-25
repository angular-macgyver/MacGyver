#
# macCells and macCellTemplate
# Basically a simplified version of ngSwitch that loops over table cells
#

angular.module("Mac").directive "macCells", [ ->
  require: "macCells"
  priority: 500
  controller: ($scope, $compile, $attrs, $element) ->
    this.templates = {}
    # We can't recompile with
    this.unsafeDirectives = [
      "mac-cell-template"
      "mac-cell-template-default"
    ]

    this.drawCells = (cells) ->
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

  link: ($scope, $element, $attrs, ctrl) ->
    $scope.$watch $attrs.macCells, (cells) ->
      ctrl.drawCells cells, $element, $attrs

]

angular.module("Mac").directive "macCellTemplate", [ ->
  require: "^macCells"
  transclude: "element"
  priority: 1000
  compile: (element, attrs, transclude) ->
    ($scope, $element, $attrs, macCellsController) ->
      macCellsController.templates[$attrs.macCellTemplate] = [transclude, $scope]
]

angular.module("Mac").directive "macCellTemplateDefault", [ ->
  require: "^macCells"
  transclude: "element"
  priority: 1000
  compile: (element, attrs, transclude) ->
    ($scope, $element, $attrs, macCellsController) ->
      macCellsController.templates["?"] = [transclude, $scope]
]
