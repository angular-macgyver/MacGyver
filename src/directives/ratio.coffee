angular.module("Mac").directive "macGovernRatio", [ "$rootScope", ($rootScope) ->
  (scope, element, attrs) ->
    # Some GLOBALS
    children = {}
    total    = 0

    getSiblingScopes = (siblings) ->
      # We're querying elements vs using $$prevSibling $$nextSibling on the
      # scope since it seems like angular won't update those properties as we
      # reorder the elements
      li = []
      for el in siblings
        siblingScope = angular.element(el).scope()
        if children[siblingScope.$id]?
          li.push siblingScope
      li

    scope.$on "mac-ratio-#{scope.$id}-register", (event, childElement, childScope) ->
      total++
      children[childScope.$id] =
        element: childElement
        scope:   childScope
      console.log total

    scope.$on "mac-ratio-#{scope.$id}-changed", (event, id, newValue, oldValue) ->
      # We only work with numbers...
      return unless !isNaN(newValue) and !isNaN(oldValue)

      [cElement, cScope]   = [children[id].element, children[id].scope]
      nextSiblings         = getSiblingScopes cElement.nextAll()
      scale                = (oldValue - newValue)/nextSiblings.length
      nextSiblingsWidthMap = {}
      siblingsTotalWidth   = 0

      for siblingScope in nextSiblings
        width = +siblingScope.cell.column.width + scale
        if width < 5 then width = 5
        nextSiblingsWidthMap[siblingScope.$id] = width
        siblingsTotalWidth                    += width

      prevSiblings = getSiblingScopes cElement.prevAll()
      siblingsTotalWidth += _(prevSiblings).reduce (m, v) ->
        +v.cell.column.width + m
      , 0

      # Abort if we're gonna make the size bigger than the total width
      return unless (siblingsTotalWidth + newValue) < 100
      # These values are good, lets do it!
      children[id].scope.cell.column.width = newValue
      for siblingScope in nextSiblings
        siblingScope.cell.column.width =
          nextSiblingsWidthMap[siblingScope.$id]

]

angular.module("Mac").directive "macRatio", [ "$rootScope", ($rootScope) ->
  (scope, element, attrs) ->
    scope.$emit "mac-ratio-#{scope.$parent.$id}-register", element, scope

    # Set the initial percentage
    attrs.$observe "macRatio", (value) ->
      scope.cell.column.width = value

    scope.$watch "cell.column.ratio", (newValue, oldValue) ->
      return unless newValue isnt oldValue
      scope.$emit "mac-ratio-#{scope.$parent.$id}-changed", scope.$id, newValue, oldValue
]
