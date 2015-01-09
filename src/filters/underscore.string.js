/**
 * @chalk overview
 * @name Underscore string
 *
 * @description
 * Proxy filter for calling underscore string function
 *
 * @param {String} string String to filter
 * @param {String} fn Underscore function to call
 * @param {Parameters} params Extra parameters to pass to Underscore string
 * @returns {String} Formatted string
 */

angular.module("Mac").filter("underscoreString", function() {
  return function(string, fn) {
    var params = 3 <= arguments.length ? [].slice.call(arguments, 2) : [];

    // A single array of params is needed when using function.apply():
    params.unshift(string);
    return _.string[fn].apply(this, params);
  };
});
