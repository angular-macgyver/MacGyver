/**
 * @ngdoc directive
 * @name macKeydownEnter
 *
 * @description
 * macKeydownEnter allows you to specify custom behavior when pressing
 * enter in an input
 *
 * @param {expression} macKeydownEnter To evaluate on hitting enter
 *
 * @example
<example>
  <input type="text" mac-keydown-enter = "eventKeydown = 'enter'" />
  <div>Key pressed: {{eventKeydown}}</div>
</example>
<input type="text" mac-keydown-enter = "eventKeydown = 'enter'" />
 */

/**
 * @ngdoc directive
 * @name macKeydownEscape
 *
 * @description
 * macKeydownEscape allows you to specify custom behavior when pressing
 * escape in an input
 *
 * @param {expression} macKeydownEscape To evaluate on hitting escape
 *
 * @example
<example>
  <input type="text" mac-keydown-escape = "eventKeydown = 'escape'" />
  <div>Key pressed: {{eventKeydown}}</div>
</example>
<input type="text" mac-keydown-escape = "eventKeydown = 'escape'" />
 */

/**
 * @ngdoc directive
 * @name macKeydownSpace
 *
 * @description
 * macKeydownSpace allows you to specify custom behavior when pressing
 * space in an input
 *
 * @param {expression} macKeydownSpace To evaluate on hitting space
 *
 * @example
<example>
  <input type="text" mac-keydown-space = "eventKeydown = 'space'" />
  <div>Key pressed: {{eventKeydown}}</div>
</example>
<input type="text" mac-keydown-space = "eventKeydown = 'space'" />
 */

/**
 * @ngdoc directive
 * @name macKeydownLeft
 *
 * @description
 * macKeydownLeft allows you to specify custom behavior when pressing
 * left in an input
 *
 * @param {expression} macKeydownLeft To evaluate on hitting left
 *
 * @example
<example>
  <input type="text" mac-keydown-left = "eventKeydown = 'left'" />
  <div>Key pressed: {{eventKeydown}}</div>
</example>
<input type="text" mac-keydown-left = "eventKeydown = 'left'" />
 */

/**
 * @ngdoc directive
 * @name macKeydownUp
 *
 * @description
 * macKeydownUp allows you to specify custom behavior when pressing
 * up in an input
 *
 * @param {expression} macKeydownUp To evaluate on hitting up
 *
 * @example
<example>
  <input type="text" mac-keydown-up = "eventKeydown = 'up'" />
  <div>Key pressed: {{eventKeydown}}</div>
</example>
<input type="text" mac-keydown-up = "eventKeydown = 'up'" />
 */

/**
 * @ngdoc directive
 * @name macKeydownRight
 *
 * @description
 * macKeydownRight allows you to specify custom behavior when pressing
 * right in an input
 *
 * @param {expression} macKeydownRight To evaluate on hitting right
 *
 * @example
<example>
  <input type="text" mac-keydown-right = "eventKeydown = 'right'" />
  <div>Key pressed: {{eventKeydown}}</div>
</example>
<input type="text" mac-keydown-right = "eventKeydown = 'right'" />
 */

/**
 * @ngdoc directive
 * @name macKeydownDown
 *
 * @description
 * macKeydownDown allows you to specify custom behavior when pressing
 * down in an input
 *
 * @param {expression} macKeydownDown To evaluate on hitting down
 *
 * @example
<example>
  <input type="text" mac-keydown-down = "eventKeydown = 'down'" />
  <div>Key pressed: {{eventKeydown}}</div>
</example>
<input type="text" mac-keydown-down = "eventKeydown = 'down'" />
 */

/**
 *
 * A directive for handling certain keys on keydown event
 * Currently MacGyver supports enter, escape, space, left, up, right and down
 *
 * @param {Expression} mac-keydown-enter  Expression
 * @param {Expression} mac-keydown-escape Expression to evaluate on hitting escape
 * @param {Expression} mac-keydown-space  Expression to evaluate on hitting space
 * @param {Expression} mac-keydown-left   Expression to evaluate on hitting left
 * @param {Expression} mac-keydown-up     Expression to evaluate on hitting up
 * @param {Expression} mac-keydown-right  Expression to evaluate on hitting right
 * @param {Expression} mac-keydown-down   Expression to evaluate on hitting down
 * @private
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
