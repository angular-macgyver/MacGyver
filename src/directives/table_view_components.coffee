##
## macTableRow, and macCellTemplate
##

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
          templateName = if cell.column.colName of sectionController.cellTemplates then cell.column.colName else "?"
          return template[1] if template = sectionController.cellTemplates[templateName]

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

angular.module("Mac").directive "macCellTemplate", [ ->
  transclude: "element"
  priority:   1000
  require:    ["^macTable", "^macTableSection", "^macTableRow"]

  compile: (element, attr, linker) ->
    ($scope, $element, $attr, controllers) ->
      templateNames =
        if $attr.macCellTemplate then $attr.macCellTemplate.split " " else ["?"]
      for templateName in templateNames
        controllers[1].cellTemplates[templateName] = [$element, linker, $attr]
]
