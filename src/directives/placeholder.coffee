angular.module("Mac").directive "macPlaceholder", ->
  restrict: "A"

  link: ($scope, element, attrs) ->
    $scope.$watch attrs.macPlaceholder, (value) ->
      element.attr "placeholder", value
