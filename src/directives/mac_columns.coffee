
angular.module("Mac").directive "macColumns", [ ->
  require: ["^macTableV2", "^tableSection", "tableRow", "macColumns"]
  controller: ->
    # Track our columns
    this.trackedColumns = {}

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

    return

  link: ($scope, $element, $attrs, controllers) ->
    controllers[3].$element = $element

    $scope.$on "mac-columns-#{$scope.$id}-changed", (event, id, newValue, oldValue) ->
      controllers[3].recalculateWidths.apply controllers[3], arguments

]

angular.module("Mac").directive "initialWidth", [ ->
  require:  ["^macTableV2", "^tableSection", "^tableRow", "^macColumns"]
  priority: 500
  compile: (element, attr) ->
    ($scope, $element, $attrs, controllers) ->
      # Register our column
      controllers[3].trackedColumns[$scope.$id] = [$scope, $element]

      # Set the initial percentage
      $attrs.$observe "initialWidth", (value) ->
        # Only set this if we don't have a width
        return if $scope.cell.column.width
        $scope.cell.column.width = +value.replace "%", ""
]

