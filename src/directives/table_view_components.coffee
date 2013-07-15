##
## macTableSection, macTableRow, and macCellTemplate
##

angular.module("Mac").factory "MacTableSectionController", [
  "$parse"
  (
    $parse
  ) ->
    class MacTableSectionController
      constructor: (@scope) ->
        @cellTemplates = {}

      watchModels: (modelsExp, controller) ->
        @scope.$watch "#{modelsExp}.length", (modelsLength) =>
          models = $parse(modelsExp)(@scope)
          return unless models
          @models = models

          if controller?
            @scope.table.load @name, models, controller
          else
            @scope.table.load @name, models
]

angular.module("Mac").directive "macTableSection", [
  "directiveHelpers"
  "MacTableSectionController"
  (
    directiveHelpers
    MacTableSectionController
  ) ->
    require:    ["^macTable", "macTableSection", "?macTableSectionModels", "?macTableSectionController"]
    scope:      true
    controller: ["$scope", MacTableSectionController]

    compile: (element, attr, linker) ->
      ($scope, $element, $attr, controllers) ->
        # TODO: Clean this up... it's pretty confusing

        # Track our section name / section data
        $attr.$observe "macTableSection", (sectionName) ->
          return unless sectionName
          controllers[1].name = sectionName

          # Watch our table, then watch our section
          $scope.$watch "table", (table) ->
            return unless table

            # Autogenerate if the section has no models (most likely a header or
            # footer)
            if not $attr.macTableSectionModels?
              # We want to wait for another section to be populated before we
              # continue so we have rows to work from, we'll assume there's going
              # to be a body...
              # TODO: make this less specific
              $scope.$watch "table.section.body.rows.length", (rows) ->
                # We do this in two steps to avoid clobbering our columns when
                # the table has dynamic columns
                table.load sectionName
                table.insert sectionName, table.blankRow()
              , true

            # Watch for our section to be created (see below)
            $scope.$watch "table.sections.#{sectionName}", (section) ->
              $scope.section = controllers[1].section = $scope.table.sections[sectionName]

          if controllers[2]
            # Watch and evaluate for our models
            $attr.$observe "macTableSectionModels", (modelsExp) ->
              $scope.$watch "table", (table) ->
                return unless table
                controllers[2].watchModels sectionName, modelsExp

          if controllers[3]
            # Watch and evalute for our controller
            $attr.$observe "macTableSectionController", (controllerExp) ->
              $scope.$watch "table", (table) ->
                return unless table
                controllers[3].watchController sectionName, controllerExp
]

angular.module("Mac").factory "MacTableSectionModelsCtrl", [
  "$parse"
  (
    $parse
  ) ->
    class MacTableSectionModelsCtrl
      constructor: (@scope) ->

      watchModels: (sectionName, modelsExp) ->
        @scope.$watch "#{modelsExp}.length", (modelsLength) =>
          models = $parse(modelsExp)(@scope)
          return unless models

          @models = models
          @scope.table.load sectionName, models
]

angular.module("Mac").directive "macTableSectionModels", [
  "MacTableSectionModelsCtrl"
  (
    MacTableSectionModelsCtrl
  ) ->
    controller: ["$scope", MacTableSectionModelsCtrl]
    compile: (element, attr) ->
]

angular.module("Mac").factory "MacTableSectionControllerCtrl", [
  "$parse"
  (
    $parse
  ) ->
    class MacTableSectionControllerCtrl
      constructor: (@scope) ->

      watchController: (sectionName, controllerExp) ->
        @scope.$watch controllerExp, (controller) =>
          return unless controller

          @controller = controller
          @scope.table.load sectionName, null, controller
]

angular.module("Mac").directive "macTableSectionController", [
  "MacTableSectionControllerCtrl"
  (
    MacTableSectionControllerCtrl
  ) ->
    controller: ["$scope", MacTableSectionControllerCtrl]
    compile: (element, attr) ->
]

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
