# TODO: Clean up the formatting on these:
# - `controllers` instead of `ctrl`
# - add macTable as required

angular.module("Mac").directive "macColumns", [ ->
  require: "macColumns"
  controller: ->
    # Track our columns
    this.trackedColumns = {}

    # Some utility functions
    this.resizeIt = (scope, element, children, cElement, args) ->
      [event, ui] = args
      column      = cElement.scope().cell.column
      width       = ui.size.width
      percentage  = (width/element.width())*100
      # Reset the width that jQuery will assign
      cElement.css("width", "")
      scope.$apply =>
        this.recalculateWidths null, cElement.scope().$id, percentage, +column.width

    this.reorderIt = (scope, element, children, cElement, args) ->
      [matchedElements, event, ui] = args
      columnsOrder                 = []
      changedElement               = angular.element(ui.item)
      table                        = changedElement.scope().cell.row.section.table
      matchedElements.each ->
        columnsOrder.push angular.element(this).scope().cell.colName

      scope.$apply ->
        table.columnsOrder = columnsOrder
        table.columnsCtrl.syncOrder()

    this.getSiblingScopes = (siblings) ->
      # We're querying elements vs using $$prevSibling $$nextSibling on the
      # scope since it seems like angular won't update those properties as we
      # reorder the elements
      li = []
      for el in siblings
        siblingScope = angular.element(el).scope()
        if this.trackedColumns[siblingScope.$id]?
          li.push siblingScope
      li

    this.recalculateWidths = (event, id, newValue, oldValue) ->
      # We only work with numbers...
      return unless !isNaN(newValue) and !isNaN(oldValue)

      [cScope, cElement]   = this.trackedColumns[id]
      nextSiblings         = this.getSiblingScopes cElement.nextAll()
      scale                = (oldValue - newValue)/nextSiblings.length
      nextSiblingsWidthMap = {}
      siblingsTotalWidth   = 0

      for siblingScope in nextSiblings
        width = +siblingScope.cell.column.width + scale
        if width < 5 then width = 5
        nextSiblingsWidthMap[siblingScope.$id] = width
        siblingsTotalWidth                    += width

      prevSiblings = this.getSiblingScopes cElement.prevAll()
      siblingsTotalWidth += _(prevSiblings).reduce (m, v) ->
        +v.cell.column.width + m
      , 0

      # Abort if we're gonna make the size bigger than the total width
      return unless (siblingsTotalWidth + newValue) <= 100
      # Valid resize, lets do it!
      cScope.cell.column.width = newValue
      for siblingScope in nextSiblings
        siblingScope.cell.column.width =
          nextSiblingsWidthMap[siblingScope.$id]

    return

  link: (scope, element, attrs, ctrl) ->

    scope.$on "mac-ratio-#{scope.$id}-changed", ->
      # Call our controllers 'recalculateWidths' method
      ctrl.recalculateWidths.apply ctrl, arguments

    # This is our main hookable function
    # this will delegate events to either other MAC directives or callbacks
    # on properties on the governing directive
    scope.$on "mac-element-#{scope.$id}-changed", (event, type, cElement, args...) ->
      titlizedType  = _.string.titleize type
      attributeName = "mac#{titlizedType}Callback"
      if attrs[attributeName]?
        callback = scope.$eval attrs[attributeName]
        callback scope, element, ctrl.trackedColumns, cElement, args
      # MacGyver Builtins
      else if attributeName is "macResizedCallback"
        ctrl.resizeIt scope, element, ctrl.trackedColumns, cElement, args
      else if attributeName is "macReorderedCallback"
        ctrl.reorderIt scope, element, ctrl.trackedColumns, cElement, args

]

angular.module("Mac").directive "initialWidth", [ ->
  require:  ["^macTableV2", "^tableSection", "^macColumns"]
  priority: 500
  compile: (element, attr) ->
    ($scope, $element, $attrs, controllers) ->
      # Register our column
      controllers[2].trackedColumns[$scope.$id] = [$scope, $element]

      # Set the initial percentage
      $attrs.$observe "initialWidth", (value) ->
        $scope.cell.column.width = +value.replace "%", ""
]

