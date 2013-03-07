##
## Underscore string
##
## Proxy filter for calling underscore string function
##

angular.module("Mac").filter "underscoreString", ->
  (string, fn) -> _.string[fn] string
