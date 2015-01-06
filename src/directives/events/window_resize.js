/**
 * @chalk overview
 * @name Windows Resize
 *
 * @description
 * Binding custom behavior on window resize event
 *
 * @param {Expression} mac-window-resize Expression to evaluate on window resize
 */

angular.module('Mac').directive('macWindowResize', ['$parse', '$window', function($parse, $window) {
  return {
    restrict: 'A',
    link: function ($scope, element, attrs) {
      var callbackFn = $parse(attrs.macWindowResize),
          windowEl = angular.element($window);

      var handler = function($event) {
        $scope.$apply(function() {
          callbackFn($scope, {$event: $event});
        });
        return true;
      };

      windowEl.bind('resize', handler);

      $scope.$on('$destroy', function() {
        windowEl.unbind('resize', handler);
      });
    }
  };
}]);
