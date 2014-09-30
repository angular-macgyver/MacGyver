/**
 * MacGyver v0.4.0
 * @link http://angular-macgyver.github.io/MacGyver
 * @license MIT
 */
(function(window, angular, undefined) {

/*
@chalk overview
@name Underscore string

@description
Proxy filter for calling underscore string function

@param {String} string String to filter
@param {String} fn Underscore function to call
@param {Parameters} params Extra parameters to pass to Underscore string
@returns {String} Formatted string
 */
var __slice = [].slice;

angular.module("Mac").filter("underscoreString", function() {
  return function() {
    var fn, params, string;
    string = arguments[0], fn = arguments[1], params = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    params.unshift(string);
    return _.string[fn].apply(this, params);
  };
});

})(window, window.angular);