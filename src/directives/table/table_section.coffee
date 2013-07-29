###
@chalk overview
@name Table Section 
@description
Main directive for registering table sections. Can optionally have 
macTableSectionModels, macTableSectionController, or macTableSectionBlankRow.

@dependencies
macTable
###

angular.module("Mac").directive "macTableSection", ->
  class MacTableSectionController
    constructor: (@scope, @attrs) ->
      @name          = null
      @section       = null
      @cellTemplates = {}
      @watchers      = {}

    registerWatcher: (directiveName, controller) ->
      @watchers[directiveName] = controller

    applyWatchers: ->
      for directiveName, controller of @watchers
        do (directiveName, controller) =>
          @attrs.$observe directiveName, (expression) =>
            controller.watch expression, @name

  # Config our directive object
  require:    ["^macTable", "macTableSection"]
  scope:      true
  controller: ["$scope", "$attrs", MacTableSectionController]

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

          # Call the watch method on any directives that have registered
          controllers[1].applyWatchers()

###
@chalk overview
@name Table Section Blank Row
@description
Inserts a blank row with keys matching those of the tables columns.

@dependencies
macTable, macTableSection
###

angular.module("Mac").directive "macTableSectionBlankRow", ->
  class MacTableSectionBlankRowCtrl
    constructor: (@scope) ->

    watch: (expression, sectionName) ->
      # We want to wait for another section to be loaded before we create our
      # blank row, this ensures we actually have column names to work with
      sectionToWaitOn = expression or "body"
      
      killWatcher = @scope.$watch "table.sections.#{sectionToWaitOn}.rows", (rows) =>
        return unless rows
        killWatcher()

        @scope.$watch "table.columnsOrder", =>
          # If this section has already been created, clear it so multiple rows
          # aren't inserted
          if sectionName of @scope.table.sections
            @scope.table.clear  sectionName

          # We do this in two steps to avoid clobbering our columns when
          # the table has dynamic columns
          @scope.table.load   sectionName
          @scope.table.insert sectionName, @scope.table.blankRow()

  require:    ["^macTable", "macTableSection", "macTableSectionBlankRow"]
  controller: ["$scope", MacTableSectionBlankRowCtrl]

  link: ($scope, $element, $attrs, controllers) ->
    controllers[1].registerWatcher "macTableSectionBlankRow", controllers[2]

###
@chalk overview
@name Table Section Models
@description
Watches a models expression and loads them into the section

@dependencies
macTable, macTableSection
###

angular.module("Mac").directive "macTableSectionModels", ["$parse", ($parse) ->
  class MacTableSectionModelsCtrl
    constructor: (@scope) ->

    watch: (expression, sectionName) ->
      lastStringified = ""

      @scope.$watch =>
        models = $parse(expression)(@scope)
        return unless angular.isArray models

        # We compare these using JSON.stringify, which guards against circular
        # structure better than the angular `copy` method
        currStringified = JSON.stringify models

        if currStringified isnt lastStringified
          lastStringified = currStringified

          @models = models
          @scope.table.load sectionName, models

          # This will cause our watcher to be fired again if something has changed
          return currStringified

  require:    ["^macTable", "macTableSection", "macTableSectionModels"]
  controller: ["$scope", MacTableSectionModelsCtrl]

  link: ($scope, $element, $attrs, controllers) ->
    controllers[1].registerWatcher "macTableSectionModels", controllers[2]
]

###
@chalk overview
@name Table Section Controller
@description
Watches a controller expression and loads the controller into the section

@dependencies
macTable, macTableSection
###

angular.module("Mac").directive "macTableSectionController", ->
  class MacTableSectionControllerCtrl
    constructor: (@scope) ->

    watch: (expression, sectionName) ->
      @scope.$watch expression, (controller) =>
        return unless controller

        @controller = controller
        @scope.table.load sectionName, null, controller

  require:    ["^macTable", "macTableSection", "macTableSectionController"]
  controller: ["$scope", MacTableSectionControllerCtrl]

  link: ($scope, $element, $attrs, controllers) ->
    controllers[1].registerWatcher "macTableSectionController", controllers[2]
