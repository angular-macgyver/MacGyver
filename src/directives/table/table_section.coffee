###
@chalk overview
@name macTableSection 
@description
Main directive for registering table sections
###

angular.module("Mac").directive "macTableSection", ->
  class MacTableSectionController
    constructor: (@scope) ->
      @cellTemplates = {}

  # Config our directive object
  require: [
    "^macTable",
    "macTableSection",
    "?macTableSectionModels",
    "?macTableSectionController",
    "?macTableSectionBlankRow"
  ]
  scope:      true
  controller: ["$scope", MacTableSectionController]

  compile: (element, attr, linker) ->
    ($scope, $element, $attr, controllers) ->
      # Track our section name / section data
      $attr.$observe "macTableSection", (sectionName) ->
        return unless sectionName
        controllers[1].name = sectionName

        # Watch our table
        $scope.$watch "table", (table) ->
          return unless table

          # Watch for our section to be created
          $scope.$watch "table.sections.#{sectionName}", (section) ->
            $scope.section = controllers[1].section = $scope.table.sections[sectionName]

          # Watch and evaluate for our models
          if controllers[2]
            $attr.$observe "macTableSectionModels", (modelsExp) ->
              controllers[2].watch sectionName, modelsExp

          # Watch and evalute for our controller
          if controllers[3]
            $attr.$observe "macTableSectionController", (controllerExp) ->
              controllers[3].watch sectionName, controllerExp

          # Watch and evaluate any blank rows
          if controllers[4]
            $attr.$observe "macTableSectionBlankRow", ->
              controllers[4].watch sectionName

angular.module("Mac").directive "macTableSectionBlankRow", ->
  class MacTableSectionBlankRowCtrl
    constructor: (@scope) ->

    watch: (sectionName) ->
      # We want to wait for another section to be loaded before we create out
      # blank row, this ensures we actually have column names to work with
      # TODO: make this less specific (using "body" right now)
      @scope.$watch "table.section.body.rows.length", (rows) =>
        # We do this in two steps to avoid clobbering our columns when
        # the table has dynamic columns
        @scope.table.load   sectionName
        @scope.table.insert sectionName, @scope.table.blankRow()
      , true

  controller: ["$scope", MacTableSectionBlankRowCtrl]
  compile:    ->

angular.module("Mac").directive "macTableSectionModels", ["$parse", ($parse) ->
  class MacTableSectionModelsCtrl
    constructor: (@scope) ->

    watch: (sectionName, modelsExp) ->
      @scope.$watch "#{modelsExp}.length", (modelsLength) =>
        models = $parse(modelsExp)(@scope)
        return unless models

        @models = models
        @scope.table.load sectionName, models

  controller: ["$scope", MacTableSectionModelsCtrl]
  compile:    ->
]

angular.module("Mac").directive "macTableSectionController", ->
  class MacTableSectionControllerCtrl
    constructor: (@scope) ->

    watch: (sectionName, controllerExp) ->
      @scope.$watch controllerExp, (controller) =>
        return unless controller

        @controller = controller
        @scope.table.load sectionName, null, controller

  controller: ["$scope", MacTableSectionControllerCtrl]
  compile:    ->
