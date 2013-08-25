###
@chalk overview
@name Menu

@description
A directive for creating a menu with multiple items

@param {Expression} mac-menu-items List of items to display in the menu
        Each item should have a `label` key as display text
@param {Function} mac-menu-select Callback on select
        - `index` - {Integer} Item index
@param {Object} mac-menu-style Styles apply to the menu
@param {Expression} mac-menu-index Index of selected item
        - `index` - {Integer} Item index
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
      select: "&macMenuSelect"

    link: ($scope, element, attrs, ctrls) ->
      $scope.selectItem = (index) ->
        $scope.select {index}

      $scope.setIndex = (index) ->
        $scope.index = index

      $scope.$watch "index", (value) ->
        getter = $parse attrs.macMenuIndex
        if getter.assign? and value
          getter.assign $scope.$parent, value
]
