/**
 * @chalk overview
 * @name Pause Typing
 * 
 * @description
 * macPauseTyping directive allow user to specify custom behavior after user stops typing for more than (delay) milliseconds
 * 
 * @param {Expression} mac-pause-typing       Expression to evaluate after delay
 * @param {Expression} mac-pause-typing-delay Delay value to evaluate expression (default 800)
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