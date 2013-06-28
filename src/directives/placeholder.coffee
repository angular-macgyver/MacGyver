###
@chalk overview
@name Placeholder

@description
Dynamically fill out the placeholder text of input

@param {String} mac-placeholder Variable that contains the placeholder text
###

angular.module("Mac").directive "macPlaceholder", ->
  restrict: "A"

  link: ($scope, element, attrs) ->
    $scope.$watch attrs.macPlaceholder, (value) ->
      attrs.$set "placeholder", value
