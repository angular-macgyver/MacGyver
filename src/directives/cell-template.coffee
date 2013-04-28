#
# sectionRow and cellTemplate
# A combo of ngRepeat and ngSwitch that specifically works on table data
#

angular.module("Mac").factory "directiveHelpers", [ ->

  # Ensures that controllers are propigated to stamped clones
  # Issue: https://github.com/angular/angular.js/issues/2533
  copyData: (el1, el2) ->
    for name, value of el1.data()
      el2.data name, value unless name is "$scope" # don't overwrite our $scope

  # ngRepeat-esque cloning
  # TODO: Optimize this similar to ngRepeat
  repeater: (iterator, keyName, $scope, $element, linkerFactory, postClone) ->
    cursor = $element
    for item in iterator
      nScope          = $scope.$new()
      nScope[keyName] = item

      if linkerFn = linkerFactory item
        clonedElement = linkerFn nScope, (clone) =>
          @copyData $element, clone
          cursor.after clone
          cursor = clone
        postClone and postClone item, clonedElement

]

angular.module("Mac").directive "sectionRow", [ "directiveHelpers", (directiveHelpers) ->
  transclude: "element"
  priority: 500
  terminal: true
  require: ["^?macTable", "^?sectionRow"]
  controller: ->
    @name = "repeat-row"
    @cellTemplates = {}
    @repeatCells = (row, rowElement) ->
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
        cellMarker = angular.element "<!-- cells: #{row.section.name} -->"
        afterElement.before cellMarker
      else
        cellMarker = angular.element "<!-- cells: #{row.section.name} -->"
        rowElement.append cellMarker

      linkerFactory = (cell) =>
        templateName = _(@cellTemplates).has(cell.colName) and cell.colName or "?"
        return template[1] if template = @cellTemplates[templateName]
      directiveHelpers.repeater row.cells, "cell", rowElement.scope(), cellMarker, linkerFactory
    return
  compile: (element, attr, linker) ->
    ($scope, $element, $attr, controllers) ->
      section = $attr.section or $attr.sectionRow or "body"
      $scope.$watch "table.sections.#{section}.rows", (rows) ->
        if rows
          # Remove the old rows
          $element.parent()
            .find("[section-row=#{section}],[section=#{section}]").remove()

          # Iterate over the new ones
          directiveHelpers.repeater(
            rows
            "row"
            $scope
            $element
            -> linker
            (row, rowElement) ->
              # Watch our rows cells for changes...
              rowElement.scope().$watch "row.cells", (cells) ->
                controllers[1].repeatCells row, rowElement
          )
]


angular.module("Mac").directive "cellTemplate", [ ->
  transclude: "element"
  priority: 1000
  require: ["^?macTable", "^?sectionRow"]
  compile: (element, attr, linker) ->
    ($scope, $element, $attr, controllers) ->
      templateName = $attr.for or $attr.cellTemplate or "?" # == default
      controllers[1].cellTemplates[templateName] = [$element, linker, $attr]
]
