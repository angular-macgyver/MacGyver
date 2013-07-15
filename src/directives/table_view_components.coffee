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
        rowElement.find("[mac-cell-template]").remove()

        # Figure out where to add in our cell templates
        # we search for the markers "before-templates" && "after-templates"
        # or else default to appending it first into the row
        beforeElement = rowElement.find("[before-templates]:last")
        afterElement  = rowElement.find("[after-templates]:first")

        if beforeElement.length
          cellMarker = beforeElement
        else if afterElement.length
          cellMarker = angular.element "<!-- cells: #{sectionController.section.name} -->"
          afterElement.before cellMarker
        else
          cellMarker = angular.element "<!-- cells: #{sectionController.section.name} -->"
          rowElement.append cellMarker

        linkerFactory = (cell) =>
          templateName = cell.colName of sectionController.cellTemplates and cell.colName or "?"
          return template[1] if template = sectionController.cellTemplates[templateName]

        directiveHelpers.repeater cells, "cell", rowElement.scope(), cellMarker, linkerFactory
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
