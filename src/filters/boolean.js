/**
 * @name Boolean filter
 * @description
 * Takes in a value and returns either true or false string
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

angular.module('Mac')
  .filter('boolean', booleanFactory('true', 'false'))
  .filter('true', booleanFactory('true', ''))
  .filter('false', booleanFactory('', 'false'));
