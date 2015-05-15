/**
 * @chalk overview
 * @name Menu
 *
 * @description
 * A directive for creating a menu with multiple items
 *
 * Menu allows for custom html templating for each item.
 *
 * Since macMenu is using ngRepeat, some ngRepeat properties along with `item` are exposed on the local scope of each template instance, including:
 *
 * | Variable  | Type    | Details                                                                     |
 * |-----------|---------|-----------------------------------------------------------------------------|
 * | `$index`  | Number  | iterator offset of the repeated element (0..length-1)                       |
 * | `$first`  | Boolean | true if the repeated element is first in the iterator.                      |
 * | `$middle` | Boolean | true if the repeated element is between the first and last in the iterator. |
 * | `$last`   | Boolean | true if the repeated element is last in the iterator.                       |
 * | `$even`   | Boolean | true if the iterator position `$index` is even (otherwise false).           |
 * | `$odd`    | Boolean | true if the iterator position `$index` is odd (otherwise false).            |
 * | `item`    | Object  | item object                                                                 |
 *
 * To use custom templating
 * ```
 * <mac-menu>
 *   <span> {{item.label}} </span>
 * </mac-menu>
 * ```
 *
 * Template default to `{{item.label}}` if not defined
 *
 * @param {Expression} mac-menu-items List of items to display in the menu
 *         Each item should have a `label` key as display text
 * @param {Function} mac-menu-select Callback on select
 * - `index` - {Integer} Item index
 * @param {Object} mac-menu-style Styles apply to the menu
 * @param {Expression} mac-menu-index Index of selected item
 */

angular.module('Mac').directive('macMenu', function () {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'template/menu.html',
    transclude: true,
    scope: {
      items: '=macMenuItems',
      style: '=macMenuStyle',
      select: '&macMenuSelect',
      pIndex: '=macMenuIndex'
    },
    link: function ($scope, element, attrs) {
      $scope.selectItem = function (index) {
        $scope.select({index: index});
      };

      $scope.setIndex = function (index) {
        $scope.index = index;

        if (attrs.macMenuIndex) {
          $scope.pIndex = parseInt(index);
        }
      };

      // NOTE: sync local index with user index
      if (attrs.macMenuIndex) {
        $scope.$watch('pIndex', function (value) {
          $scope.index = parseInt(value);
        });
      }

      $scope.$watchCollection('items', function (items) {
        if (!!items.length) {
          attrs.$addClass('visible');
        } else {
          attrs.$removeClass('visible');
        }
      });
    }
  };
}).

// INFO: Used internally by mac-menu
// TODO(adrian): Look into removing this
directive('macMenuTransclude', ['$compile', function ($compile) {
  return {
    link: function ($scope, element, attrs, ctrls, transclude) {
      transclude($scope, function (clone) {
        element.empty();
        if (!clone.length) {
          // default item template
          clone = $compile('<span>{{item.label}}<span>')($scope);
        }
        element.append(clone);
      });
    }
  };
}]);
