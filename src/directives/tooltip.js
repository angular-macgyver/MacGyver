/**
 * @ngdoc directive
 * @name macTooltip
 * @description
 * Tooltip directive
 *
 * @param {String}  mac-tooltip           Text to show in tooltip
 * @param {String}  mac-tooltip-direction Direction of tooltip (default 'top')
 * @param {String}  mac-tooltip-trigger   How tooltip is triggered (default 'hover')
 * @param {Boolean} mac-tooltip-inside    Should the tooltip be appended inside element (default false)
 * @param {Expr}    mac-tooltip-disabled  Disable and enable tooltip
 *
 * @example
<example>
  <ul class="nav nav-pills">
    <li><a mac-tooltip="Tooltip on top">Tooltip on top</a></li>
    <li><a mac-tooltip="Tooltip on bottom" mac-tooltip-direction="bottom">Tooltip on bottom</a></li>
    <li><a mac-tooltip="Tooltip on left" mac-tooltip-direction="left">Tooltip on left</a></li>
    <li><a mac-tooltip="Tooltip on right" mac-tooltip-direction="right">Tooltip on right</a></li>
  </ul>
</example>
<a href="#" mac-tooltip="Tooltip on bottom" mac-tooltip-direction="bottom">Tooltip on bottom</a>
 */

/**
 * NOTE: This directive does not use $animate to append and remove DOM element or
 * add and remove classes in order to optimize showing tooltips by eliminating
 * the need for firing a $digest cycle.
 */

angular.module('Mac').directive('macTooltip', [
  '$timeout',
  'macTooltipDefaults',
  'util',
  function ($timeout, defaults, util) {
    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {
        var tooltip, text, disabled, unobserve, closeDelay, opts;

        opts = util.extendAttributes('macTooltip', defaults, attrs);

        function showTip () {
          var container, offset, elementSize, tooltipSize, messageEl;

          if (disabled || !text || tooltip) {
            return true;
          }

          container = opts.inside ? element : angular.element(document.body);

          // Check if the tooltip still exists, remove if it does
          removeTip(0);

          messageEl = angular.element('<div class="tooltip-message"></div>');
          messageEl.text(text);

          tooltip = angular.element('<div />').addClass('mac-tooltip ' + opts.direction);
          tooltip.append(messageEl);

          container.append(tooltip);

          // Only get element offset when not adding tooltip within the element
          offset = opts.inside ? {top: 0, left: 0} : element.offset();

          // Get element height and width
          elementSize = {
            width: element.outerWidth(),
            height: element.outerHeight()
          };

          // Get tooltip width and height
          tooltipSize = {
            width: tooltip.outerWidth(),
            height: tooltip.outerHeight()
          };

          // Adjust offset based on direction
          switch (opts.direction) {
            case 'bottom':
            case 'top':
              offset.left += elementSize.width / 2 - tooltipSize.width / 2;
              break;
            case 'left':
            case 'right':
              offset.top += elementSize.height / 2 - tooltipSize.height / 2;
              break;
          }

          if (opts.direction == 'bottom') {
            offset.top += elementSize.height;
          } else if (opts.direction == 'top') {
            offset.top -= tooltipSize.height;
          } else if (opts.direction == 'left') {
            offset.left -= tooltipSize.width;
          } else if (opts.direction == 'right') {
            offset.left += elementSize.width;
          }

          // Set the offset
          angular.forEach(offset, function (value, key) {
            if (!isNaN(+value) && angular.isNumber(+value)) {
              value = value + "px";
            }

            tooltip.css(key, value);
          });

          tooltip.addClass(opts.class);
          return true;
        }

        function removeTip (delay) {
          delay = delay === undefined ? 100 : delay;

          if (tooltip && !closeDelay) {
            tooltip.removeClass(opts.class);

            closeDelay = $timeout(function () {
              if (tooltip) {
                tooltip.remove();
              }
              tooltip = null;
              closeDelay = null;
            }, delay, false);
          }

          return true;
        }

        function toggle () { return tooltip ? removeTip() : showTip(); }

        // Calling unobserve in the callback to simulate observeOnce
        unobserve = attrs.$observe('macTooltip', function (value) {
          if (value === undefined) {
            return;
          }

          text = value;

          if (opts.trigger !== 'hover' && opts.trigger !== 'click') {
            throw new Error('macTooltip: Invalid trigger');
          }

          if (opts.trigger === 'click') {
            element.bind('click', toggle);
          } else if (opts.trigger === 'hover') {
            element.bind('mouseenter', showTip);
            element.bind('mouseleave click', function () {
              removeTip();
            });
          }

          unobserve();
        });

        if (attrs.macTooltipDisabled) {
          $scope.$watch(attrs.macTooltipDisabled, function (value) {
            disabled = !!value;
          });
        }

        $scope.$on('$destroy', function () {
          removeTip(0);
        });
      }
    };
  }
]);
