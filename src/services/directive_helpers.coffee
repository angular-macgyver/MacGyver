# Reusable methods we use in our directives

angular.module("Mac").factory "directiveHelpers", [ ->
  # ngRepeat-esque cloning
  # TODO: Optimize this similar to ngRepeat
  repeater: (iterator, keyName, $scope, $element, linkerFactory, postClone) ->
    return unless $element.length

    for item in iterator
      nScope          = $scope.$new()
      nScope[keyName] = item

      if linkerFn = linkerFactory item
        clonedElement = linkerFn nScope, (clone) ->
          $element[0].appendChild clone[0]
        postClone and postClone item, clonedElement
]
