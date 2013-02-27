##
##
## Takes in a value and returns "true" or "false" based on its boolean value. The true and false
## strings can be customized.
angular.module("Mac").filter "boolean", ->
  (boolean, trueString = "true", falseString = "false") ->
    if boolean then trueString else falseString

# Similar to the boolean filter, but you only need to provide a true string.
angular.module("Mac").filter "true", ->
  (boolean, trueString = "true") ->
    if boolean then trueString else ""

# Similar to the boolean filter, but you only need to provide a false string.
angular.module("Mac").filter "false", ->
  (boolean, falseString = "false") ->
    if boolean then "" else falseString
