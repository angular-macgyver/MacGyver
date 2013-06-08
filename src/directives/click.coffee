#
# @chalk overview
# @type directive
# @name macClick
# @description
# macClick recurive go up parent scope to call function. This is more of a hack and
# should only be used when absolutely needed.
# This directive will be depcreated in the very near future.
#
# @param {Expression} mac-click       To evaluate upon click
# @param {Integer}    mac-click-depth Max parent scope depth it should go (default 2)
#
angular.module("Mac").directive "macClick", ["$parse", ($parse) ->
  link: ($scope, element, attr) ->
    fn    = $parse attr.macClick
    depth = +(attr.macClickDepth or 2)

    clickAction = (scope, depth, $event) ->
      return false if depth is 0
      ret    = fn scope, {$event, $scope}
      parent = scope.$parent
      if not ret and parent?
        return clickAction parent, depth - 1, $event
      else
        return true

    element.bind "click", (event) ->
      $scope.$apply -> clickAction $scope, depth, event
]
