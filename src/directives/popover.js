/**
 * @chalk
 * @name mac-popover (attribute)
 * @description
 * Mac popover trigger directive
 *
 * @param {String}  mac-popover               ID of the popover to show
 * @param {Boolean} mac-popover-fixed         Determine if the popover is fixed
 * @param {Integer} mac-popover-offset-x      Extra x offset (default 0)
 * @param {Integer} mac-popover-offset-y      Extra y offset (default 0)
 * @param {String}  mac-popover-trigger       Trigger option, click | hover | focus (default click)
 * - click: Popover only opens when user click on trigger
 * - hover: Popover shows when user hover on trigger
 * - focus: Popover shows when focus on input element
 */

angular.module('Mac').directive('macPopover', [
  '$timeout',
  'macPopoverDefaults',
  'popover',
  'util',
  function ($timeout, defaults, popover, util) {
    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {
        var options, delayId, closeDelayId, unobserve;

        options = util.extendAttributes('macPopover', defaults.element, attrs);

        /**
         * @description
         * Clearing show and/or hide delays
         */
        function clearDelays () {
          if (delayId) {
            $timeout.cancel(delayId);
            delayId = null;
          }
          if (closeDelayId) {
            $timeout.cancel(closeDelayId);
            closeDelayId = null;
          }
        }

        /**
         * @description
         * Check if popover should be shown, and show popover with service
         * @param {string} id
         * @param {Number} delay (default 0)
         */
        function show (id, delay) {
          delay = delay || 0;

          clearDelays();
          delayId = $timeout(function () {
            var last = popover.last();

            // Close the last popover
            // If the trigger is the same, `show` acts as a toggle
            if (last) {
              popover.hide();
              if (element[0] === last.element[0]) {
                return true;
              }
            }

            // Add current scope to option for compiling popover later
            options.scope = $scope;
            popover.show(id, element, options);
          }, delay);
        }

        /**
         * @description
         * Hide popover
         * @param {Element} element
         * @param {Number} delay (default 0)
         */
        function hide (element, delay) {
          delay = delay || 0;

          clearDelays();
          closeDelayId = $timeout(function () {
            popover.hide(element);
          }, delay);
        }

        // NOTE: Only bind once
        unobserve = attrs.$observe('macPopover', function (id) {
          var showEvent, hideEvent;

          if (!id) return;

          if (options.trigger === 'click') {
            element.bind('click', function () {
              show(id, 0);
            });
          } else {
            showEvent = options.trigger === 'focus' ? 'focusin' : 'mouseenter';
            hideEvent = options.trigger === 'focus' ? 'focusout' : 'mouseleave';

            element.bind(showEvent, function () {
              show(id, 400);
            });
            element.bind(hideEvent, function () {
              hide(element, 500);
            });

            unobserve();
          }
        });

        // Hide popover before trigger gets destroyed
        $scope.$on('$destroy', function () {
          hide(element, 0);
        });
      }
    };
  }
]).

/**
 * @chalk
 * @name mac-popover(element)
 * @description
 * Element directive to define popover
 *
 * @param {String} id Modal id
 * @param {String} mac-popover-refresh-on Event to update popover size and position
 * @param {Bool}   mac-popover-footer     Show footer or not
 * @param {Bool}   mac-popover-header     Show header or not
 * @param {String} mac-popover-title      Popover title
 * @param {String} mac-popover-direction  Popover direction (default "above left")
 * - above, below or middle - Place the popover above, below or center align the trigger element
 * - left or right  - Place tip on the left or right of the popover
 */
directive('macPopover', [
  'macPopoverDefaults',
  'popover',
  'util',
  function (defaults, popover, util) {
    return {
      restrict: 'E',
      compile: function (element, attrs) {
        var opts;
        if (!attrs.id) {
          throw Error('macPopover: Missing id');
        }

        opts = util.extendAttributes('macPopover', defaults.element, attrs);
        angular.extend(opts, {template: element.html()});

        // link function
        return function ($scope, element, attrs) {
          var unobserve = attrs.$observe('id', function (value) {
            var commentEl;

            // Register the popover with popover service
            popover.register(value, opts);

            // Replace original element with comment once element is cached
            commentEl = document.createComment('macPopover: ' + value);
            element.replaceWith(commentEl);

            unobserve();
          });
        };
      }
    };
  }
]).

/**
 * @name mac-popover-fill-content
 * @description
 * An internal directive to compile popover template
 * @private
 */
directive('macPopoverFillContent', ['$compile', function ($compile) {
  return {
    restrict: 'A',
    link: function ($scope, element, attrs) {
      element.html($scope.macPopoverTemplate);
      $compile(element.contents())($scope);
    }
  };
}]);
