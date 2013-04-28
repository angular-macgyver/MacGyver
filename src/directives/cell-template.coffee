#
# macRow and macCellTemplate
# A combo of ngRepeat and ngSwitch that specifically works on table data
#


angular.module("Mac").factory "directiveHelpers", [ ->

  # Ensures that controllers are propigated to stamped clones
  # Issue: https://github.com/angular/angular.js/issues/2533
  copyData: (el1, el2) ->
    for name, value of el1.data()
      el2.data name, value unless name is "$scope"

  # ngRepeat-style cloning
  # TODO: Optimize this similar to ngRepeat
  repeater: (iterator, keyName, $scope, $element, linkerFactory, postClone) ->
    #$element.children().remove()
    cursor = $element
    for item in iterator
      nScope          = $scope.$new()
      nScope[keyName] = item

      if linkerFn = linkerFactory item
        console.log "PRE-CLONE FOR:", keyName
        clonedElement = linkerFn nScope, (clone) =>
          @copyData $element, clone
          console.log "CLONE", clone, clone.data()
          cursor.after clone
          cursor = clone
        console.log "POST-CLONE FOR:", keyName
        postClone and postClone item, clonedElement

]

angular.module("Mac").directive "repeatRow", [ "directiveHelpers", (directiveHelpers) ->
  transclude: "element"
  priority: 500
  terminal: true
  require: ["^?macTable", "^?repeatRow"]
  controller: ->
    @name = "repeat-row"
    @cellTemplates = {}
    @repeatCells = (row, rowElement) ->
      console.log "CELL TEMPLATES", @cellTemplates
      # Make a marker for where to insert our cells after
      cellMarker = angular.element "<!-- cells: #{row.section.name} -->"
      rowElement.children().remove()
      rowElement.append cellMarker
      linkerFactory = (cell) =>
        templateName = _(@cellTemplates).has(cell.colName) and cell.colName or "?"
        console.log "CELL TEMPLATE", templateName, @cellTemplates[templateName]
        return template[1] if template = @cellTemplates[templateName]
      directiveHelpers.repeater row.cells, "cell", rowElement.scope(), cellMarker, linkerFactory
    return
  compile: (element, attr, linker) ->
    console.log "repeat-row: compile", attr
    ($scope, $element, $attr, controllers) ->
      console.log "repeat-row: link #{$scope.$id}", controllers, !!$scope.table
      section = $attr.repeatRow
      $scope.$watch "table.sections.#{section}.rows", (rows) ->
        if rows
          directiveHelpers.repeater(
            rows
            "row"
            $scope
            $element
            -> linker
            (row, rowElement) -> controllers[1].repeatCells row, rowElement
          )
]


angular.module("Mac").directive "cell", [ ->
  transclude: "element"
  priority: 1000
  require: ["?^macTable", "?^repeatRow"]
  compile: (element, attr, linker) ->
    console.log "cell: compile", attr
    ($scope, $element, $attr, controllers) ->
      console.log "cell: linker #{$scope.$id}", controllers, !!$scope.table, !!$scope.row
      controllers[1].cellTemplates[$attr.cell] = [$element, linker, $attr]
]

angular.module("Mac").directive "defaultCell", [ ->
  transclude: "element"
  priority: 1000
  transclude: "element"
  require: ["?^macTable", "?^repeatRow"]
  compile: (element, attr, linker) ->
    console.log "default-cell: compile", attr
    ($scope, $element, $attr, controllers) ->
      console.log "default-cell: linker #{$scope.$id}", controllers, !!$scope.table, !!$scope.row
      controllers[1].cellTemplates["?"] = [$element, linker, $attr]
]

angular.module("Mac").directive "macTest1", [ ->
  priority: 2000
  require: ["^?macTable", "^?repeatRow"]
  compile: (element, attr) ->
    console.log "test-1: compile", attr
    ($scope, $element, $attr, controllers) ->
      console.log "test-1: link #{$scope.$id}", controllers, $attr
]

angular.module("Mac").directive "macRowTest", [ ->
  priority: 1000
  compile: (element, attr) ->
    console.log "mac-row-test: compile", attr
    ($scope, $element, $attrs) ->
      console.log "mac-row-test: linking #{$scope.$id}"
]

angular.module("Mac").directive "macRow", [ "$compile", ($compile) ->
  require: ["^macTable", "macRow", "?macColumns"]
  transclude: "element"
  #terminal: true
  priority: 1
  controller: ->
    console.log "mac-row: controller"
    @templates = {}
    @getTemplate = (columnName) ->
      if not @templates[columnName]? and @templates["?"]?
        columnName = "?"
      @templates[columnName]

    return # implicit return for controller constructor
  compile: (element, attr, linker) ->
    console.log "mac-row: compile", attr
    ($scope, $element, $attr, controllers) ->
      console.log "mac-row: linking #{$scope.$id}"
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
  priority: 0
  compile: (element, attrs, transclude) ->
    ($scope, $element, $attrs, controllers) ->
      [tableCtrl, rowCtrl]                      = controllers
      rowCtrl.templates[$attrs.macCellTemplate] = [$element, transclude, $attrs]
]

angular.module("Mac").directive "macCellTemplateDefault", [ "$timeout", ($timeout) ->
  require: ["^macTable", "^macRow", "^?macColumns"]
  transclude: "element"
  priority: 2000
  compile: (element, attrs, transclude) ->
    console.log "cell-template-default: compile", attrs
    ($scope, $element, $attrs, controllers) ->
      console.log "cell-template-default: linking #{$scope.$id}"
      if controllers[2]
        controllers[2].trackedColumns[$scope.$id] = [$scope, $element]

      [tableCtrl, rowCtrl]   = controllers
      rowCtrl.templates["?"] = [$element, transclude, $attrs]
]
