/**
 * @ngdoc filter
 * @name list
 * @description
 * List filter. Use for converting arrays into a string
 *
 * @param {Array} list Array of items
 * @param {String} separator String to separate each element of the array (default ,)
 * @returns {String} Formatted string
 *
 * @example
   <span>{{['item1', 'item2', 'item3'] | list}}</span>
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
