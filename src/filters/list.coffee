###
@chalk overview
@name List
@description
List filter. Use for converting arrays into a string

@param {Array} list Array of items
@param {String} separator String to separate each element of the array (default ,)
@returns {String} Formatted string
###

angular.module("Mac").filter "list", [ ->
  (list, separator = ", ") ->
    list.join separator
]
