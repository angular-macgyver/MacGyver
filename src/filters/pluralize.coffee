## Pluralize
##
## Pluralizes the given string. It's a simple proxy to the pluralize function on util.
##
angular.module("Mac").filter "pluralize", [
  "$filter"
  "util"
  (
    $filter
    util
  ) ->
    (string, count, includeCount = true) ->
      pluralized = util.pluralize string, count, false
      if includeCount
        number = $filter("number") count
        "#{number} #{pluralized}"
      else
        pluralized
]
