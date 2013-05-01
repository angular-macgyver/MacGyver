#
# sectionRow and cellTemplate
# A combo of ngRepeat and ngSwitch that specifically works on table data
#

angular.module("Mac").factory "directiveHelpers", [ ->

  # ngRepeat-esque cloning
  # TODO: Optimize this similar to ngRepeat
  repeater: (iterator, keyName, $scope, $element, linkerFactory, postClone) ->
    cursor = $element
    for item in iterator
      nScope          = $scope.$new()
      nScope[keyName] = item

      if linkerFn = linkerFactory item
        clonedElement = linkerFn nScope, (clone) =>
          cursor.after clone
          cursor = clone
        postClone and postClone item, clonedElement

]

angular.module("Mac").directive "tableSection", [ "directiveHelpers", (directiveHelpers) ->
  require: ["^macTable", "tableSection"]
  scope: true
  controller: ->
    @name = "table-section"
    @cellTemplates = {}
    return
  compile: (element, attr, linker) ->
    ($scope, $element, $attr, controllers) ->

      $attr.$observe "tableSection", (sectionName) ->
        return unless sectionName
        $scope.$watch "table.sections.#{sectionName}", (section) ->
          $scope.section = controllers[1].section = $scope.table.sections[sectionName]

]

angular.module("Mac").directive "tableRow", [ "directiveHelpers", (directiveHelpers) ->
  require: ["^macTable", "^tableSection", "tableRow"]
  controller: ->
    @name = "table-row"
    @repeatCells = (cells, rowElement, sectionController) ->
      # Clear out our existing cell-templates
      rowElement.find("[cell-template]").remove()

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
        templateName = _(sectionController.cellTemplates).has(cell.colName) and cell.colName or "?"
        return template[1] if template = sectionController.cellTemplates[templateName]

      directiveHelpers.repeater cells, "cell", rowElement.scope(), cellMarker, linkerFactory

    return
  compile: (element, attr) ->
    ($scope, $element, $attr, controllers) ->
      # Watch our rows cells for changes...
      $scope.$watch "row.cells", (cells) ->
        # We might end up with a case were our section hasn't been added yet
        # if so return without anymore processing
        return unless controllers[1].section?.name?
        controllers[2].repeatCells cells, $element, controllers[1]

]


angular.module("Mac").directive "cellTemplate", [ ->
  transclude: "element"
  priority: 1000
  require: ["^macTable", "^tableSection", "^tableRow"]
  compile: (element, attr, linker) ->
    ($scope, $element, $attr, controllers) ->
      templateName = $attr.for or $attr.cellTemplate or "?" # == default
      controllers[1].cellTemplates[templateName] = [$element, linker, $attr]
]
