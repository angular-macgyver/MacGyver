###
@chalk overview
@name Columns
@description
Directive that keeps track of the widths of the columns in the table.
This directive is automatically added to any row whose cells use `mac-columns-width`.

@dependencies
macTable, macTableSection, macTableRow
###

angular.module("Mac").factory "macColumnsController", ->
  class MacColumnsController
    constructor: (@scope, @element, @attrs) ->
      @trackedColumns = {}

    getSiblingScopes: (siblings) ->
      # We're querying elements vs using $$prevSibling $$nextSibling on the
      # scope since it seems like angular won't update those properties as we
      # reorder the elements
      li = []
      for el in siblings
        siblingScope = angular.element(el).scope()
        if this.trackedColumns[siblingScope.$id]?
          li.push siblingScope
      li

    recalculateWidths: (event, id, newValue, oldValue) ->
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
      siblingsTotalWidth += prevSiblings.reduce (m, v) ->
        +v.cell.column.width + m
      , 0

      # Abort if we're gonna make the size bigger than the total width
      return unless (siblingsTotalWidth + newValue) <= 100
      # Valid resize, lets do it!
      cScope.cell.column.width = newValue
      for siblingScope in nextSiblings
        siblingScope.cell.column.width =
          nextSiblingsWidthMap[siblingScope.$id]


angular.module("Mac").directive "macColumns", [ "macColumnsController", (macColumnsController) ->
  require:    ["^macTable", "^macTableSection", "macTableRow", "macColumns"]
  controller: ["$scope", "$element", "$attrs", macColumnsController]

  link: ($scope, $element, $attrs, controllers) ->
    $scope.$on "mac-columns-#{$scope.$id}-changed", (event, id, newValue, oldValue) ->
      controllers[3].recalculateWidths.apply controllers[3], arguments
]

angular.module("Mac").directive "macColumnWidth", [ ->
  require:  ["^macTable", "^macTableSection", "^macTableRow", "^macColumns"]
  priority: 500

  compile: (element, attr) ->
    ($scope, $element, $attrs, controllers) ->
      # Register our column
      controllers[3].trackedColumns[$scope.$id] = [$scope, $element]

      # Set the initial percentage
      $attrs.$observe "macColumnWidth", (value) ->
        # Only set this if we don't have a width
        return if $scope.cell.column.width
        $scope.cell.column.width = +value.replace "%", ""
]

