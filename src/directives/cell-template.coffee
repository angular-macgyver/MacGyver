#
# macRow and macCellTemplate
# A combo of ngRepeat and ngSwitch that specifically works on table data
#
angular.module("Mac").directive "macRow", [ "$compile", ($compile) ->
  require: ["^macTable", "macRow", "?macColumns"]
  transclude: "element"
  terminal: true
  controller: ->
    @templates = {}
    @getTemplate = (columnName) ->
      if not @templates[columnName]? and @templates["?"]?
        columnName = "?"
      @templates[columnName]

    return # implicit return for controller constructor
  compile: (element, attr, linker) ->

    ($scope, $element, $attr, controllers) ->
      [tableCtrl, rowCtrl] = controllers
      sectionName          = $attr.macRow
      trackExpression      = "table.sections.#{sectionName}.rows"
      rowCtrl.section      = sectionName

      # TODO: Possibly make it a requirement that there is a unique field
      # to keep track of these with...
      # Danger now is that this is polluting the models
      uid = 0
      hashKey = (row) ->
        if not key = row.model.$$hashKey
          key                 = "M#{++uid}"
          row.model.$$hashKey = key
        key

      $scope.$watch trackExpression, (rows) ->
        $scope.lastRowMap = {} unless $scope.lastRowMap?

        return unless rows
        cursor = $element

        for row in rows
          nextRowMap = {}
          key        = hashKey row
          if $scope.lastRowMap[key]?
            # Existing Row
            block = nextRowMap[key] = $scope.lastRowMap[key]
          else
            # New Row
            block           = {}
            block.scope     = $scope.$new()
            nextRowMap[key] = block

          if not block.element?
            block.element = linker block.scope, (clone) ->
              # We add our data here so it will be availble when our
              # child directives linking functions fire
              # TODO: figure out why it has to happen HERE
              # https://groups.google.com/forum/?fromgroups=#!topic/angular/_TEvNgws4T0
              clone.data "$macTableController", tableCtrl
              clone.data "$macRowController", rowCtrl
              if controllers[2]
                clone.data "$macColumnsController", controllers[2]
              clone

          # Insert our element into the DOM
          cursor.after block.element

          # Ad a container for our cells if we don't have one
          block.cells = {} unless block.cells?

          # Clear the element for our cells to be added
          block.element.children().remove()

          # Iterate over our cells
          for cell in row.cells
            columnName = cell.colName

            # If we do not have a stored version, make one
            if not block.cells[columnName]?
              block.cells[columnName] = cellBlock = {}
              template                = rowCtrl.getTemplate cell.colName

              # Pass if no template is found
              continue unless template

              [$element, transclude, $attrs]  = template
              cellScope                       = $scope.$new()
              cellScope.cell                  = cell
              console.log "<---About to clone"
              block.cells[columnName].element = transclude cellScope, (clone) -> clone
              console.log "Did clone"

            # Append our clone element
            console.log "About to append"
            block.element.append block.cells[columnName].element
            console.log "Did append--->"

          cursor = block.element

        $scope.lastRowMap = nextRowMap

      return
]

angular.module("Mac").directive "macCellTemplate", [ ->
  require: ["^macTable", "^macRow", "^?macColumns"]
  transclude: "element"
  priority: 1000
  compile: (element, attrs, transclude) ->
    ($scope, $element, $attrs, controllers) ->
      [tableCtrl, rowCtrl]                      = controllers
      rowCtrl.templates[$attrs.macCellTemplate] = [$element, transclude, $attrs]
]

angular.module("Mac").directive "macCellTemplateDefault", [ "$timeout", ($timeout) ->
  require: ["^macTable", "^macRow", "^?macColumns"]
  transclude: "element"
  priority: 1000
  compile: (element, attrs, transclude) ->
    ($scope, $element, $attrs, controllers) ->
      if controllers[2]
        controllers[2].trackedColumns[$scope.$id] = [$scope, $element]

      [tableCtrl, rowCtrl]   = controllers
      rowCtrl.templates["?"] = [$element, transclude, $attrs]
]
