###
@chalk overview
@name Menu

@description
A directive for creating a menu with multiple items
###

angular.module("Mac").directive "macMenu", [
  "$parse",
  ($parse) ->
    restrict:    "EA"
    templateUrl: "template/menu.html"
    controller:  ["$scope", ($scope) ->]
    link:        ($scope, element, attrs, ctrls) ->

]
