###
@chalk overview
@name Windows Resize

@description
Binding custom behavior on window resize event

@param {Expression} mac-window-resize Expression to evaluate on window resize
###

angular.module("Mac").
  directive("macWindowResize", ["$parse", "$window", ($parse, $window) ->
    restrict: "A"
    link: ($scope, element, attrs) ->
      handler = ($event) ->
        callbackFn = $parse attrs.macWindowResize
        $scope.$apply -> callbackFn $scope, {$event}
        return true

      angular.element($window).bind "resize", handler

      $scope.$on "destroy", ->
        angular.element($window).unbind "resize", handler

  ])
