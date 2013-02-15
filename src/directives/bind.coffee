#
# @type directive
# @name macBind
# @description
# macBind recurive go up parent scope to find the correct variable
#
# @attributes
# - mac-bind:        expression to evaluate
# - mac-bind-depth: Max parent scope depth it should go (default 2)
#

angular.module("Mac").directive "macBind", ["$parse", ($parse) ->
  link: ($scope, element, attr) ->
    element.addClass('mac-binding').data('$binding', attr.ngBind)

    fn    = $parse attr.macBind
    depth = +(attr.macBindDepth or 2)

    checkScope = (scope, depth, $event) ->
      return false if depth is 0
      ret    = fn scope, {$scope}
      parent = scope.$parent
      if not ret and parent?
        return checkScope parent, depth - 1, $event
      else
        if ret
          scope.$watch attr.macBind, (value) ->
            element.text (value or "")
        return true

    checkScope $scope, depth
]
