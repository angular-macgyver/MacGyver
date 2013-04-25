angular.module("Mac").directive "macRows", [ "$compile", ($compile) ->
  require: "^macTable"
  compile: ($scope, $element, $attrs) ->
    section = $attrs.macRows
    $element.attr "ng-repeat", "row in table.sections['#{section}'].rows"
    $compile($element)($scope)

    ($scope, $element, $attrs, ctrl) ->

  # link: ($scope, $element, $attrs, ctrl) ->
  #   section = $attrs.macRows
  #   #$element.attr "ng-repeat", "row in table.sections['#{section}'].rows"
  #   console.log ctrl, section
  #   #$compile($element)($scope)
]
