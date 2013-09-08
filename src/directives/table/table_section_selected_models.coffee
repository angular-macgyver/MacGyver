###
@chalk overview
@name Table Section Selected Models
@description
Creates two way binding between a selected models array

@param {array}       mac-table-section-selected-models    A two-way bound array to see selected models and to select them 

@dependencies
macTable, macTableSection
###
angular.module("Mac").directive "macTableSectionSelectedModels", [
  "$parse"
  (
    $parse
  ) ->
    class SelectedModelsController
      constructor: (@scope, @element, @attrs) ->
        @rangeModel = $parse @attrs.macTableSectionSelectedModels

      # This method is called from the macTableSection controller after the table 
      # has been instantiated
      watch: (expression, sectionName) ->
        @sectionName = sectionName

        @scope.$watch expression, (range) =>
          return unless @scope.table.sections[@sectionName]?

          range ?= []

          @unselectAll()
          for model in range
            if row = @findRowForModel model
              row.selected = true

          # Clean up our incoming models to match only models currently found in
          # the table
          range = @removeModelsNotInTable range
          @setModel range

        @scope.$watch "table.sections.#{sectionName}.rows.length", =>
          range = @removeModelsNotInTable @getModel()
          @setModel range

      removeModelsNotInTable: (range) ->
        removeIndexes = []

        for model, index in range
          unless @findRowForModel model
            removeIndexes.push index

        # Remove from the end of the array to avoid changing the index positions
        removeIndexes.reverse()

        for index in removeIndexes
          range.splice index, 1

        return range

      findRowForModel: (model) ->
        for row in @getSectionRows()
          return row if row.model is model

      setModel: (range) ->
        @rangeModel.assign @scope, range

      getModel: ->
        @rangeModel(@scope).slice 0

      getSectionRows: ->
        @scope.table.sections[@sectionName].rows

      unselectAll: ->
        for row, index in @getSectionRows()
          row.selected = false

    # Directive configuration
    controller: ["$scope", "$element", "$attrs", SelectedModelsController]
    require:    ["^macTable", "macTableSection", "macTableSectionSelectedModels"]
    compile: (element, attrs) ->
      ($scope, $element, $attrs, controllers) ->
        controllers[1].registerWatcher "macTableSectionSelectedModels", controllers[2]
]

###
@chalk overview
@name Table Selectable
@description
Gives element it is on a click event that selects the row it shares a scope with

@param {bool}       mac-table-selectable    whether the current element is selectable

@dependencies
macTable, macTableSection, macTableSectionSelectedModels
###
angular.module("Mac").directive "macTableSelectable", [
  "$document",
  "keys"
  (
    $document
    keys
  ) ->
    # Share the multiselect variable among all instances, toggled on shift up
    # and down
    shiftselect   = false
    commandselect = false

    $document.bind "keydown", (event) =>
      if event.which is keys.SHIFT
        shiftselect = true
      if event.which is keys.COMMAND
        commandselect = true

    $document.bind "keyup", (event) =>
      if event.which is keys.SHIFT
        shiftselect = false
      if event.which is keys.COMMAND
        commandselect = false

    class SelectHandleController
      constructor: (@scope, @element, @attrs) ->

      getIndexOfFirstSelected: ->
        for row, index in @parentController.getSectionRows()
          return index if row.selected

      selectAllBetween: (start, end) ->
        rowsSlice = @parentController.getSectionRows().slice start, end + 1
        @parentController.setModel (row.model for row in rowsSlice)

      selectRow: (row) ->
        # Clear the visual selection
        $document[0].getSelection().removeAllRanges()

        @scope.$apply =>
          if commandselect
            range = @parentController.getModel()
            if row.model in range
              @parentController.setModel range.filter (model) -> model isnt row.model
            else
              @parentController.setModel range.concat [row.model]

          else if shiftselect
            startIndex  = @getIndexOfFirstSelected()
            targetIndex = @parentController.getSectionRows().indexOf row

            if startIndex is targetIndex
              return
            else if startIndex < targetIndex
              @selectAllBetween startIndex, targetIndex
            else if startIndex > targetIndex
              @selectAllBetween targetIndex, startIndex

          else
            range = @parentController.getModel()
            if range.length > 1
              @parentController.setModel [row.model]
            else if row.model in range
              @parentController.setModel []
            else
              @parentController.setModel [row.model]

    require:    ["^macTable", "^macTableSectionSelectedModels", "macTableSelectable"]
    controller: ["$scope", "$element", "$attrs", SelectHandleController]
    link: ($scope, $element, $attrs, controllers) ->
      controllers[2].parentController = controllers[1]

      $element.on "click", (event) ->
        return unless $scope.$eval $attrs.macTableSelectable
        controllers[2].selectRow($scope.row)
]
