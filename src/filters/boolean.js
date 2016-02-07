/**
 * @name booleanFactory
 * @description
 * A boolean factory that creates a function that returns certain strings
 * based on the `boolean` variable
 * @param {string} trueDefault Default string for true
 * @param {string} falseDefault Default string for false
 * @returns {Function}
 * @private
 */
function booleanFactory(trueDefault, falseDefault) {
  return function() {
    return function(boolean, trueString, falseString) {
      trueString = trueString || trueDefault;
      falseString = falseString || falseDefault;
      return boolean ? trueString : falseString;
    };
  };
}

/**
 * @ngdoc filter
 * @name boolean
 * @description
 * Print out string based on passed in value
 *
 * @param {*} boolean Value to check
 * @param {string} trueString String to print when boolean is truthy
 * @param {string} falseString String to print when boolean is falsy
 * @returns {string} Either trueString or falseString based on boolean
 *
 * @example
   <span class="{{isHidden | boolean:'is-hidden':'is-shown'}}"></span>
 */
var booleanFilter = booleanFactory('true', 'false');

/**
 * @ngdoc filter
 * @name true
 * @description
 * Print out string when boolean is truthy
 *
 * @param {*} boolean Value to check
 * @param {string} trueString String to print when boolean is truthy
 * @returns {string}
 *
 * @example
   <span class="{{isHidden | true:'is-hidden'}}"></span>
 */
var trueFilter = booleanFactory('true', '');

/**
 * @ngdoc filter
 * @name false
 * @description
 * Print out string when boolean is falsy
 *
 * @param {*} boolean Value to check
 * @param {string} falseString String to print when boolean is falsy
 * @returns {string}
 *
 * @example
   <span class="{{isHidden | false:'is-shown'}}"></span>
 */
var falseFilter = booleanFactory('', 'false');

angular.module('Mac')
  .filter('boolean', booleanFilter)
  .filter('true', trueFilter)
  .filter('false', falseFilter);
