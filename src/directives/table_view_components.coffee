#
# tableSection, tableRow, and cellTemplate
#

angular.module("Mac").directive "tableSection", [ "directiveHelpers", (directiveHelpers) ->
  require:    ["^macTableV2", "tableSection"]
  scope:      true
  controller: ["$scope", "$parse", ($scope, $parse) ->
    @directive = "table-section"

    @cellTemplates = {}

    @watchModels = (modelsExp, controller) ->

      $scope.$watch "#{modelsExp}.length", (modelsLength) =>
        models = $parse(modelsExp)($scope)
        return unless models
        @models = models

        if controller?
          $scope.table.load @name, models, controller
        else
          $scope.table.load @name, models

    @watchTable = (callback) ->
      $scope.$watch "table", callback

    return
  ]
  compile: (element, attr, linker) ->
    ($scope, $element, $attr, controllers) ->
      # TODO: Clean this up... it's pretty confusing

      # Track our section name / section data
      $attr.$observe "tableSection", (sectionName) ->
        return unless sectionName
        controllers[1].name = sectionName

        # Watch our table, then watch our section
        $scope.$watch "table", (table) ->
          return unless table

          # Autogenerate if the section has no models (most likely a header or
          # footer)
          if not $attr.models?
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

        # Watch and evaluate for our models
        $attr.$observe "models", (modelsExp) ->
          $scope.$watch "table", (table) ->
            return unless table

            # If we've got a controller attribute, we need to grab that first
            if $attr.controller?
              $attr.$observe "controller", (controllerExp) ->
                $scope.$watch controllerExp, (controller) ->
                  controllers[1].watchModels modelsExp, controller
            # Otherwise just make the section
            else
                controllers[1].watchModels modelsExp
]

angular.module("Mac").directive "tableRow", [ "directiveHelpers", (directiveHelpers) ->
  require: ["^macTableV2", "^tableSection", "tableRow"]

  controller: ->
    @directive   = "table-row"
    @repeatCells = (cells, rowElement, sectionController) ->
      # Clear out our existing cell-templates
      rowElement.html ""

      cellMarker = angular.element "<!-- cells: #{sectionController.section.name} -->"
      rowElement.append cellMarker

      linkerFactory = (cell) =>
        templateName = cell.column.colName of sectionController.cellTemplates and cell.column.colName or "?"
        return template[1] if template = sectionController.cellTemplates[templateName]

      # Store current display and then set it to display none
      currentDisplay = rowElement.css "display"
      rowElement.css "display", "none"

      # Repeat our cells
      directiveHelpers.repeater cells, "cell", rowElement.scope(), cellMarker, linkerFactory

      # Reset our display
      rowElement.css "display", currentDisplay

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

angular.module("Mac").directive "macCellTemplate", [ ->
  transclude: "element"
  priority:   1000
  require:    ["^macTableV2", "^tableSection", "^tableRow"]

  compile: (element, attr, linker) ->
    ($scope, $element, $attr, controllers) ->
      templateNames =
        if $attr.macCellTemplate then $attr.macCellTemplate.split " " else ["?"]
      for templateName in templateNames
        controllers[1].cellTemplates[templateName] = [$element, linker, $attr]
]
