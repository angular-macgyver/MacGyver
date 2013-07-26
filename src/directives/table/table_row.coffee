###
@chalk overview
@name Table Row
@description
Directive initializing a table row for cell templates to be registered under

@dependencies
macTable, macTableSection
###

angular.module("Mac").factory "MacTableRowController", [
  "directiveHelpers"
  (
    directiveHelpers
  ) ->
    class MacTableRowController

      repeatCells: (cells, rowElement, sectionController) ->
        # Clear out our existing cell-templates
        rowElement.children().remove()

        linkerFactory = (cell) ->
          templateName =
            if cell.column.colName of sectionController.cellTemplates
              cell.column.colName
            else
              "?"

          if template = sectionController.cellTemplates[templateName]
            return template[1]

        # Repeat our cells
        directiveHelpers.repeater cells, "cell", rowElement.scope(), rowElement, linkerFactory
]

angular.module("Mac").directive "macTableRow", [
  "MacTableRowController"
  (
    MacTableRowController
  ) ->
    require:    ["^macTable", "^macTableSection", "macTableRow"]
    controller: MacTableRowController

    compile: (element, attr) ->
      ($scope, $element, $attr, controllers) ->
        # Watch our rows cells for changes...
        $scope.$watch "row.cells", (cells) ->
          # We might end up with a case were our section hasn't been added yet
          # if so return without anymore processing
          return unless controllers[1].section?.name?
          controllers[2].repeatCells cells, $element, controllers[1]
]
