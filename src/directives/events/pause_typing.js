/**
 * @ngdoc directive
 * @name macPauseTyping
 *
 * @description
 * macPauseTyping directive allow user to specify custom behavior after user stops typing for more than (delay) milliseconds
 *
 * @param {expression} mac-pause-typing       Expression to evaluate after delay
 * @param {expression} mac-pause-typing-delay Delay value to evaluate expression (default 800)
 *
 * @example
<example>
  <input type="text" mac-pause-typing="afterPausing($event)" />
  <div>value: {{pauseTypingModel}}</div>
</example>
<input type="text" mac-pause-typing="afterPausing($event)" />
 */

angular.module('Mac').directive('macPauseTyping', ['$parse', '$timeout', function($parse, $timeout) {
  return {
    restrict: 'A',
    link: function($scope, element, attrs) {
      var expr = $parse(attrs.macPauseTyping),
         delay = $scope.$eval(attrs.macPauseTypingDelay) || 800,
         keyupTimer;

      element.bind('keyup', function($event) {
        if(keyupTimer) {
          $timeout.cancel(keyupTimer);
        }

        keyupTimer = $timeout(function() {
          expr($scope, {$event: $event});
        }, delay);
      });
    }
  };
}]);
