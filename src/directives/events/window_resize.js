/**
 * @ngdoc directive
 * @name macWindowResize
 *
 * @description
 * Binding custom behavior on window resize event
 *
 * @param {expression} mac-window-resize Expression to evaluate on window resize
 *
 * @example`
<example>
  <div mac-window-resize="windowResizing($event)">
    Current width: {{windowWidth}}
  </div>
</example>
<div mac-window-resize="windowResizing($event)">
  Current width: {{windowWidth}}
</div>
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
