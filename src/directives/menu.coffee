###
@chalk overview
@name Menu

@description
A directive for creating a menu with multiple items

@param {Expression} mac-menu-item
@param {Function} mac-menu-select Callback on select
@param {Object} mac-menu-style Styles apply to the menu
@param {Expression} mac-menu-index Index of selected item
###

angular.module("Mac").directive "macMenu", [
  "$parse",
  ($parse) ->
    restrict:    "EA"
    replace:     true
    templateUrl: "template/menu.html"
    scope:
      items:  "=macMenuItems"
      style:  "=macMenuStyle"
      index:  "=macMenuIndex"
      select: "&macMenuSelect"

    link: ($scope, element, attrs, ctrls) ->
      $scope.selectItem = (index) ->
        $scope.select {index}

      $scope.setIndex = (index) ->
        $scope.index = index
]
