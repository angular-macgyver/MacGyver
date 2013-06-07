###
@chalk overview
@name Underscore string

@description
Proxy filter for calling underscore string function

@param {String} string String to filter
@param {String} fn Underscore function to call
@param {Parameters} params Extra parameters to pass to Underscore string
@returns {String} Formatted string
###

angular.module("Mac").filter "underscoreString", ->
  (string, fn, params...) ->
    # A single array of params is needed when using function.apply():
    params.unshift string
    _.string[fn].apply this, params
