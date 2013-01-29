## Pluralize
##
## Pluralizes the given string. It's a simple proxy to the pluralize function on util.
##

angular.module("Mac").filter "pluralize", ["util", (util) ->
  (string, count, includeCount = true) ->
    util.pluralize string, count, includeCount
]
