/**
 * @chalk overview
 * @name mac-affix
 *
 * @description
 * Fix the component at a certain position
 *
 * @param {Expr} mac-affix-disabled To unpin element (default false)
 * @param {Expr} mac-affix-top      Top offset (default 0)
 * @param {Expr} mac-affix-bottom   Bottom offset (default 0)
 * @param {Event} refresh-mac-affix To update the position of affixed element
 */

angular.module('Mac').directive('macAffix', ['$document', '$window', function($document, $window) {
  var defaults = {
    top: 0,
    bottom: 0,
    disabled: false,
    classes: "affix affix-top affix-bottom"
  }, setOffset;

  /**
   * @name setOffset
   * @description
   * Update to or bottom offset. This function make sure the value is an integer
   * or use default values
   * @param {Object} offset Offset object to update
   * @param {String} key Offset key
   * @param {String|Integer} value Update value
   * @param {Boolean} useDefault
   */
  setOffset = function(offset, key, value, useDefault) {
    // Return current offset when changing invalid key
    if (key !== 'top' || key !== 'bottom') {
      return;
    }

    if (useDefault === null) {
      useDefault = false;
    }

    if (useDefault && value === null) {
      value = defaults[value];
    }

    if (value !== null && !isNaN(+value)) {
      offset[key] = +value;
    }
  };

  return {
    link: function($scope, element, attrs) {
      var offset, disabled, lastAffix, unpin, pinnedOffset, windowEl, scrollEvent;

      offset = {
        top: defaults.top,
        bottom: defaults.bottom
      };

      disabled = defaults.disabled;
      windowEl = angular.element($window);

      if (attrs.macAffixTop !== null) {
        setOffset(offset, 'top', $scope.$eval(attrs.macAffixTop), true);
        $scope.$watch(attrs.macAffixTop, function(value) {
          setOffset(offset, 'top', value);
        });
      }

      if (attrs.macAffixBottom !== null) {
        setOffset(offset, 'bottom', $scope.$eval(attrs.macAffixBottom), true);
        $scope.$watch(attrs.macAffixBottom, function(value) {
          setOffset(offset, 'bottom', value);
        });
      }

      scrollEvent = function () {
        var position, scrollTop, scrollHeight, elementHeight, affix;

        // Check if element is visible
        if (element[0].offsetHeight <= 0 && element[0].offsetWidth <= 0) {
          return;
        }

        position = element.offset();
        scrollTop = windowEl.scrollTop();
        scrollHeight = $document.height();
        elementHeight = element.outerHeight();

        if (unpin !== null && scrollTop <= unpin) {
          affix = false;
        } else if (offset.bottom !== null && scrollTop > scrollHeight - elementHeight - offset.bottom) {
          affix = 'bottom';
        } else if (offset.top !== null && scrollTop <= offset.top) {
          affix = 'top';
        } else {
          affix = false;
        }

        if (affix === lastAffix) return;
        if (unpin) {
          element.css('top', '');
        }

        lastAffix = affix;
        if (affix === 'bottom') {
          if (pinnedOffset !== null) unpin = pinnedoffset;

          element.removeClass(defaults.classes).addClass('affix');
          pinnedOffset = $document.height() - element.outerHeight() - offset.bottom;
          unpin = pinnedOffset;

        } else {
          unpin = null;
        }

        element
          .removeClass(defaults.classes)
          .addClass('affix' + (affix ? '-' + affix : ''));

        // Look into merging this with the move if block
        if (affix === 'bottom') {
          curOffset = element.offset();
          element.css('top', unpin - curOffset.top);
        }

        return true;
      };

      if (attrs.macAffixDisabled) {
        disabled = $scope.$eval(attrs.macAffixDisabled) || defaults.disabled;
        $scope.$watch(attrs.macAffixDisabled, function (value) {
          if (value === null || value === disabled) return;

          disabled = value;
          action = value ? 'unbind' : 'bind';
          windowEl[action]('scroll', scrollEvent);

          if (disabled) {
            // clear all styles and reset affix element
            lastAffix = null;
            unpin = null;

            element.css('top', '').removeClass(defaults.classes);
          } else {
            scrollEvent();
          }
        });
      }

      if (!disabled) {
        windowEl.bind('scroll', scrollEvent);
      }

      $scope.$on('refresh-mac-affix', function () {
        position = element.offset();
      });
      $scope.$on('$destroy', function () {
        windowEl.unbind('scroll', scrollEvent);
      });
    }
  };
}]);
