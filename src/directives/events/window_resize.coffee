angular.module("Mac").
  directive("macWindowResize", ["$parse", "$window", ($parse, $window) ->
    restrict: "A"
    link: ($scope, element, attrs) ->
      callbackFn = $parse attrs.macWindowResize
      $($window).bind "resize", ($event) ->
        $scope.$apply -> callbackFn $scope, {$event}
        return true
  ])
