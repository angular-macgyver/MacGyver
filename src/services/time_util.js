/**
 * @name MacTime Util
 * @description
 * All utility functions for MacTime
 */

angular.module('Mac').factory('macTimeUtil', [
  '$filter',
  '$timeout',
  'macTimeDefaults',
  'util',
  function($filter, $timeout, defaults, util) {
    /**
     * @description
     * Generate Date object based on options
     * @param {Object} options
     * @returns {Date}
     */
    function initializeTime (options) {
      var currentDate = new Date().toDateString(), time;

      time = new Date(currentDate + ' ' + options.default);

      if (isNaN(time.getTime())) {
        time = new Date(currentDate + ' ' + defaults.default);
      }

      return time;
    }

    /**
     * @description
     * Get element cursor section
     * @param {Element} element
     * @returns {String}
     */
    function getSelection (element) {
      var start = element[0].selectionStart;

      if (0 <= start && start < 3){
        return 'hour';
      } else if (3 <= start && start < 6) {
        return 'minute';
      } else if (6 <= start  && start < 9) {
        return 'meridian';
      }
    }

    /**
     * @description
     * A wrapper for setSelectionRange with a timeout 0
     * @param {Element} element
     * @param {Number} start
     * @param {Number} end
     */
    function selectRange (element, start, end) {
      $timeout(function () {
        element[0].setSelectionRange(start, end);
      }, 0, false);
    }

    /**
     * @description
     * Select hour block
     * @param {Element} element
     */
    function selectHours (element) {
      selectRange(element, 0, 2);
    }

    /**
     * @description
     * Select minute block
     * @param {Element} element
     */
    function selectMinutes (element) {
      selectRange(element, 3, 5);
    }

    /**
     * @description
     * Select meridian block (AM/PM)
     * @param {Element} element
     */
    function selectMeridian (element) {
      selectRange(element, 6, 8);
    }

    /**
     * @description
     * Select/highlight next block
     * hour -> minute
     * minute -> meridian
     * meridian -> meridian (no next block)
     * @param {Element} element
     */
    function selectNextSection (element) {
      switch (getSelection(element)) {
        case 'hour':
          selectMinutes(element);
          break;
        case 'minute':
        case 'meridian':
          selectMeridian(element);
          break;
      }
    }

    /**
     * @description
     * Select/highlight previous block
     * hour -> hour (no previous block)
     * minute -> hour
     * meridian -> minute
     * @param {Element} element
     */
    function selectPreviousSection (element) {
      switch (getSelection(element)) {
        case 'hour':
        case 'minute':
          selectHours(element);
          break;
        case 'meridian':
          selectMinutes(element);
          break;
      }
    }

    /**
     * @description
     * Toggle time hour based on meridian value
     * @param {Date} time
     * @param {String} meridian
     */
    function setMeridian (time, meridian) {
      var hours = time.getHours();

      if (hours >= 12 && meridian === 'AM') {
        hours -= 12;
      } else if (hours < 12 && meridian === 'PM') {
        hours += 12;
      }

      time.setHours(hours);
    }

    /**
     * @description
     * Toggle time hour
     * @param {Date} time
     */
    function toggleMeridian (time) {
      var hours = time.getHours();
      time.setHours((hours + 12) % 24);
    }

    /**
     * @description
     * Change hour, wrapper for setHours
     * @param {Date} time
     * @param {Number} change
     */
    function incrementHour (time, change) {
      time.setHours(time.getHours() + change);
    }

    /**
     * @description
     * Change minute, wrapper for setMinutes
     * @param {Date} time
     * @param {Number} change
     */
    function incrementMinute (time, change) {
      time.setMinutes(time.getMinutes() + change);
    }

    /**
     * @description
     * Update input view value with ngModelController
     * @param {Date} time
     * @param {ngController} controller
     */
    function updateInput (time, controller) {
      var displayTime = $filter('date')(time.getTime(), 'hh:mm a');

      if (displayTime !== controller.$viewValue) {
        controller.$setViewValue(displayTime);
        controller.$render();
      }
    }

    /**
     * @description
     * Update time with ngModelController model value
     * @param {Date} time
     * @param {ngController} controller
     */
    function updateTime (time, controller) {
      var timeMatch = util.validateTime(controller.$modelValue),
          hours, minutes, meridian;

      if (timeMatch) {
        hours = +timeMatch[1];
        minutes = +timeMatch[2];
        meridian = timeMatch[3];

        if (meridian == 'PM' && hours != 12) hours += 12;
        if (meridian == 'AM' && hours == 12) hours = 0;

        time.setHours(hours, minutes);
      }
    }

    return {
      getSelection: getSelection,
      incrementHour: incrementHour,
      incrementMinute: incrementMinute,
      initializeTime: initializeTime,
      selectHours: selectHours,
      selectMeridian: selectMeridian,
      selectMinutes: selectMinutes,
      selectNextSection: selectNextSection,
      selectPreviousSection: selectPreviousSection,
      selectRange: selectRange,
      setMeridian: setMeridian,
      toggleMeridian: toggleMeridian,
      updateInput: updateInput,
      updateTime: updateTime
    };
  }
]);
