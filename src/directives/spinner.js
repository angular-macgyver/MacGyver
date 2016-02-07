/**
 * @ngdoc directive
 * @name macSpinner
 * @description
 * A directive for generating spinner
 *
 * @param {Integer} mac-spinner-size The size of the spinner (default 16)
 * @param {Integer} mac-spinner-z-index The z-index (default inherit)
 * @param {String}  mac-spinner-color Color of all the bars (default #2f3035)
 *
 * @example
<caption>Basic setup</caption>
<example>
   <mac-spinner />
 </example>
 <mac-spinner />
 */

angular.module('Mac').directive('macSpinner', ['util', function (util) {
  var updateBars = function (bars, propertyName, value) {
    var i, property;
    if (angular.isObject(propertyName)) {
      for (property in propertyName) {
        updateBars(bars, property, propertyName[property]);
      }
      return;
    }

    for (i = 0; i < bars.length; i++) {
      bars[i].style[propertyName] = value;
    }
  },
  setSpinnerSize = function (element, bars, size) {
    if (!size) {
      return;
    }

    updateBars(bars, {
      height: size * 0.32 + 'px',
      left: size * 0.445 + 'px',
      top: size * 0.37 + 'px',
      width: size * 0.13 + 'px',
      borderRadius: size * 0.32 * 2 + 'px',
      position: 'absolute'
    });

    if (!isNaN(+size) && angular.isNumber(+size)) {
      size = size + 'px';
    }

    element.css({
      height: size,
      width: size
    });
  },
  defaults = {
    size: 16,
    zIndex: 'inherit',
    color: '#2f3035'
  };

  return {
    restrict: 'E',
    replace: true,
    template: '<div class="mac-spinner"></div>',

    compile: function (element) {
      var i, bars = [],
          animateCss = util.getCssVendorName(element[0], 'animation'),
          transformCss = util.getCssVendorName(element[0], 'transform'),
          delay, degree, styl, bar;

      for (i = 0; i < 10; i++) {
        delay = i * 0.1 - 1 + !i;
        degree = i * 36;
        styl = {};
        bar = angular.element('<div class="bar"></div>');
        // Cache each bar for css updates
        bars.push(bar[0]);

        styl[animateCss] = 'fade 1s linear infinite ' + delay + 's';
        styl[transformCss] = 'rotate(' + degree + 'deg) translate(0, 130%)';
        bar.css(styl);

        element.append(bar);
      }

      return function ($scope, element, attrs) {
        if (attrs.macSpinnerSize) {
          attrs.$observe('macSpinnerSize', function (value) {
            setSpinnerSize(element, bars, value);
          });
        } else {
          setSpinnerSize(element, bars, defaults.size);
        }

        attrs.$observe('macSpinnerZIndex', function (value) {
          if (value) {
            element.css('z-index', value);
          }
        });

        if (attrs.macSpinnerColor) {
          attrs.$observe('macSpinnerColor', function (value) {
            if (value) {
              updateBars(bars, 'background', value);
            }
          });
        } else {
          updateBars(bars, 'background', defaults.color)
        }
      };
    }
  };
}]);
