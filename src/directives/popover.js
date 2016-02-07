/**
 * @ngdoc directive
 * @name macPopover Trigger
 * @description
 * Mac popover trigger directive
 *
 * @param {String}  mac-popover            ID of the popover to show
 * @param {Integer} mac-popover-offset-x   Extra x offset (default 0)
 * @param {Integer} mac-popover-offset-y   Extra y offset (default 0)
 * @param {String}  mac-popover-container  Container for popover
 * - Attribute does not exist: document body
 * - Attribute without value: Parent element of the popover
 * - Attribute with scope variable: Use as container if it is an DOM element
 * @param {String}  mac-popover-trigger    Trigger option, click | hover | focus (default click)
 * - click: Popover only opens when user click on trigger
 * - hover: Popover shows when user hover on trigger
 * - focus: Popover shows when focus on input element
 *
 * @example
<example>
  <ul class="nav nav-pills">
    <li><a mac-popover="testPopover">Above left</a></li>
    <li><a mac-popover="testPopover2">Above right</a></li>
    <li><a mac-popover="testPopover3">Below left</a></li>
    <li><a mac-popover="testPopover4">Below right</a></li>
    <li><a mac-popover="testPopover5">Middle left</a></li>
    <li><a mac-popover="testPopover6">Middle right</a></li>
  </ul>
  <mac-popover id="testPopover" mac-popover-title="Test Popover Title" mac-popover-header ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover2" mac-popover-direction="above right" ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover3" mac-popover-direction="below left" ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover4" mac-popover-direction="below right" ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover5" mac-popover-direction="middle left" ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover6" mac-popover-direction="middle right" ng-cloak>Open a popover</mac-popover>
</example>
<a mac-popover="testPopover">Above left</a>
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

        options = util.extendAttributes('macPopover', defaults.trigger, attrs);

        /**
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
 * @ngdoc directive
 * @name macPopover Element
 * @description
 * Element directive to define popover
 *
 * @param {String} id Modal id
 * @param {Bool}   mac-popover-footer     Show footer or not
 * @param {Bool}   mac-popover-header     Show header or not
 * @param {String} mac-popover-title      Popover title
 * @param {String} mac-popover-direction  Popover direction (default "above left")
 * @param {String} mac-popover-refresh-on Event to update popover size and position
 * - above, below or middle - Place the popover above, below or center align the trigger element
 * - left or right  - Place tip on the left or right of the popover
 *
 * @example
<example>
  <ul class="nav nav-pills">
    <li><a mac-popover="testPopover">Above left</a></li>
    <li><a mac-popover="testPopover2">Above right</a></li>
    <li><a mac-popover="testPopover3">Below left</a></li>
    <li><a mac-popover="testPopover4">Below right</a></li>
    <li><a mac-popover="testPopover5">Middle left</a></li>
    <li><a mac-popover="testPopover6">Middle right</a></li>
  </ul>
  <mac-popover id="testPopover" mac-popover-title="Test Popover Title" mac-popover-header ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover2" mac-popover-direction="above right" ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover3" mac-popover-direction="below left" ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover4" mac-popover-direction="below right" ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover5" mac-popover-direction="middle left" ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover6" mac-popover-direction="middle right" ng-cloak>Open a popover</mac-popover>
</example>
<mac-popover id="testPopover">Open a popover</mac-popover>
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
 * An internal directive to compile popover template
 * @private
 */
directive('macPopoverFillContent', ['$compile', function ($compile) {
  return {
    restrict: 'A',
    link: function ($scope, element) {
      element.html($scope.macPopoverTemplate);
      $compile(element.contents())($scope);
    }
  };
}]);
