# Reusable methods we use in our directives

angular.module("Mac").factory "directiveHelpers", [ ->
  # ngRepeat-esque cloning
  # TODO: Optimize this similar to ngRepeat
  repeater: (iterator, keyName, $scope, $element, linkerFactory, postClone) ->
    cursor = $element
    for item in iterator
      nScope          = $scope.$new()
      nScope[keyName] = item

      if linkerFn = linkerFactory item
        clonedElement = linkerFn nScope, (clone) =>
          cursor.after clone
          cursor = clone
        postClone and postClone item, clonedElement
]
