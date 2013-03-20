##
## Underscore string
##
## Proxy filter for calling underscore string function
##

angular.module("Mac").filter "underscoreString", ->
  (string, fn, params...) ->
    # A single array of params is needed when using function.apply():
    params.unshift string
    _.string[fn].apply this, params
