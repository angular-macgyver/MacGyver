/**
 * @chalk overview
 * @name List
 * @description
 * List filter. Use for converting arrays into a string
 *
 * @param {Array} list Array of items
 * @param {String} separator String to separate each element of the array (default ,)
 * @returns {String} Formatted string
 */

angular.module('Mac').filter('list', function() {
  return function(list, separator) {
    if (!separator) {
      separator = ', ';
    }

    if (!angular.isArray(list)) return list;

    return list.join(separator);
  };
});
