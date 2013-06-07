###
@chalk overview
@name Pluralize
@description
Pluralizes the given string. It's a simple proxy to the pluralize function on util.

@param {String} string Noun to pluralize
@param {Integer} count The numer of objects
@param {Boolean} includeCount To include the number in formatted string
@returns {String} Formatted plural
###
angular.module("Mac").filter "pluralize", [
  "util"
  (
    util
  ) ->
    (string, count, includeCount = true) ->
      util.pluralize string, count, includeCount
]
