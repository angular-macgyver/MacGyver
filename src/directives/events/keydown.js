/**
 * @chalk overview
 * @name Keydown events
 * 
 * @description
 * A directive for handling certain keys on keydown event
 * Currently MacGyver supports enter, escape, space, left, up, right and down
 * 
 * @param {Expression} mac-keydown-enter  Expression to evaluate on hitting enter
 * @param {Expression} mac-keydown-escape Expression to evaluate on hitting escape
 * @param {Expression} mac-keydown-space  Expression to evaluate on hitting space
 * @param {Expression} mac-keydown-left   Expression to evaluate on hitting left
 * @param {Expression} mac-keydown-up     Expression to evaluate on hitting up
 * @param {Expression} mac-keydown-right  Expression to evaluate on hitting right
 * @param {Expression} mac-keydown-down   Expression to evaluate on hitting down
 */
 
function keydownFactory (key) {
  var name = 'macKeydown' + key;
  angular.module('Mac').directive(name, ['$parse', 'keys', function($parse, keys) {
    return {
      restrict: 'A',
      link: function($scope, element, attributes) {
        var expr = $parse(attributes[name]);
        element.bind('keydown', function($event) {
          if ($event.which === keys[key.toUpperCase()]) {
            $event.preventDefault();
            $scope.$apply(function() {
              expr($scope, {$event: $event});
            });
          }
        });
      }
    }
  }]);
}

var keydownKeys = ['Enter', 'Escape', 'Space', 'Left', 'Up', 'Right', 'Down'];
keydownKeys.forEach(keydownFactory);