/**
 * @chalk overview
 * @name Time
 * @description
 * A directive for creating a time input field. Time input can use any `ng-` attributes support by text input type.
 *
 * @param {String} ng-model         Assignable angular expression to data-bind to
 * Clearing model by setting it to null or '' will set model back to default value
 * @param {String} name             Property name of the form under which the control is published
 * @param {String} required         Adds `required` validation error key if the value is not entered.
 * @param {String} ng-required      Adds `required` attribute and `required` validation constraint to
 *  the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
 *  `required` when you want to data-bind to the `required` attribute.
 * @param {String} ng-pattern      Sets `pattern` validation error key if the value does not match the
 *  RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
 *    patterns defined as scope expressions.
 * @param {String} ng-change       Angular expression to be executed when input changes due to user interaction with the input element.
 * @param {String} ng-disabled     Enable or disable time input
 *
 * @param {String} mac-time-default If model is undefined, use this as the starting value (default 12:00 PM)
 */

angular.module('Mac').directive('macTime', [
  'keys',
  'util',
  'macTimeDefaults',
  'macTimeUtil',
  function (keys, util, defaults, timeUtil) {
    return {
      restrict: 'E',
      require: 'ngModel',
      replace: true,
      templateUrl: 'template/time.html',
      link: function ($scope, element, attrs, ngModelCtrl) {
        var opts, time, timeValidator, whitelistKeys;

        opts = util.extendAttributes('macTime', defaults, attrs);

        whitelistKeys = [keys.UP,
          keys.DOWN,
          keys.LEFT,
          keys.RIGHT,
          keys.A,
          keys.P
        ];

        // Set default placeholder
        if (!attrs.placeholder) {
          attrs.$set('placeholder', opts.placeholder);
        }

        // Validation
        timeValidator = function (value) {
          if (!value || util.validateTime(value)) {
            ngModelCtrl.$setValidity('time', true);
            return value;
          } else {
            ngModelCtrl.$setValidity('time', false);
            return undefined;
          }
        };

        ngModelCtrl.$formatters.push(timeValidator);
        ngModelCtrl.$parsers.push(timeValidator);

        time = timeUtil.initializeTime(opts);

        element.on('blur', function () {
          $scope.$apply(function () {
            timeUtil.updateInput(time, ngModelCtrl);
          });
        });

        /**
         * @name Click event
         * @description
         * Note: The initial click into the input will not update the time because the
         * model is empty. The selection by default should be hour
         */
        element.on('click', function () {
          $scope.$apply(function() {
            var isModelSet = !!ngModelCtrl.$modelValue;

            timeUtil.updateTime(time, ngModelCtrl);
            timeUtil.updateInput(time, ngModelCtrl);

            // After the initial view update, selectionStart is set to the end.
            // This is not the desired behavior as it should select hour by default
            if (!isModelSet) {
              timeUtil.selectHours(element);
              return;
            }

            switch (timeUtil.getSelection(element)) {
              case 'hour':
                timeUtil.selectHours(element);
                break;
              case 'minute':
                timeUtil.selectMinutes(element);
                break;
              case 'meridian':
                timeUtil.selectMeridian(element);
                break;
            }
          });

          return true;
        });

        element.on('keydown', function (event) {
          var key = event.which;

          if (whitelistKeys.indexOf(key) === -1) {
            return true;
          }

          event.preventDefault();

          $scope.$apply(function () {
            var change, selection = timeUtil.getSelection(element), meridian;

            if (key === keys.UP || key === keys.DOWN) {
              change = key === keys.UP ? 1 : -1;

              switch (selection) {
                case 'hour':
                  timeUtil.incrementHour(time, change);
                  timeUtil.selectHours(element);
                  break;
                case 'minute':
                  timeUtil.incrementMinute(time, change);
                  timeUtil.selectMinutes(element);
                  break;
                case 'meridian':
                  timeUtil.toggleMeridian(time);
                  timeUtil.selectMeridian(element);
                  break;
              }

              timeUtil.updateInput(time, ngModelCtrl);

            } else if (key === keys.LEFT) {
              timeUtil.selectPreviousSection(element);
              timeUtil.updateInput(time, ngModelCtrl);

            } else if (key === keys.RIGHT) {
              timeUtil.selectNextSection(element);
              timeUtil.updateInput(time, ngModelCtrl);

            } else if ((key === keys.A || key === keys.P) && selection === 'meridian') {
              meridian = key === keys.A ? 'AM' : 'PM';
              timeUtil.setMeridian(time, meridian);

              timeUtil.updateInput(time, ngModelCtrl);
              timeUtil.selectMeridian(element);
            }
          });
        });

        element.on('keyup', function (event) {
          var key = event.which;

          if (!((keys.NUMPAD0 <= key && key <= keys.NUMPAD9) || (keys.ZERO <= key && key <= keys.NINE))) {
            event.preventDefault();
          }

          $scope.$apply(function () {
            timeUtil.updateTime(time, ngModelCtrl);
          });
        });
      }
    };
  }
]);
