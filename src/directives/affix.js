/**
 * @chalk overview
 * @name mac-affix
 *
 * @description
 * Fix the component at a certain position
 *
 * @param {Expr} mac-affix-disabled To unpin element (default false)
 * @param {Expr} mac-affix-top      Top offset (default 0)
 * @param {Expr} mac-affix-bottom   Bottom offset (default 0)
 * @param {Event} refresh-mac-affix To update the position of affixed element
 */

angular.module('Mac').directive('macAffix', ['$window', function($window) {
  return {
    require: 'macAffix',
    bindToController: true,
    controllerAs: 'macAffix',
    controller: 'MacAffixController',
    link: function($scope, element, attrs, macAffixCtrl) {
      var scrollEventWrapper = function () {
        macAffixCtrl.scrollEvent();
      }
      var windowEl = angular.element($window);

      if (attrs.macAffixTop !== null) {
        macAffixCtrl.updateOffset('top', $scope.$eval(attrs.macAffixTop), true);
        $scope.$watch(attrs.macAffixTop, function(value) {
          macAffixCtrl.updateOffset('top', value);
        });
      }

      if (attrs.macAffixBottom !== null) {
        macAffixCtrl.updateOffset('bottom', $scope.$eval(attrs.macAffixBottom), true);
        $scope.$watch(attrs.macAffixBottom, function(value) {
          macAffixCtrl.updateOffset('bottom', value);
        });
      }

      if (attrs.macAffixDisabled) {
        macAffixCtrl.setDisabled($scope.$eval(attrs.macAffixDisabled));

        $scope.$watch(attrs.macAffixDisabled, function (value) {
          if (value === null || value === macAffixCtrl.disabled) return;

          macAffixCtrl.setDisabled(value);

          var action = value ? 'unbind' : 'bind';
          windowEl[action]('scroll', scrollEventWrapper);
        });
      }

      if (!macAffixCtrl.disabled) {
        windowEl.bind('scroll', scrollEventWrapper);
      }

      $scope.$on('refresh-mac-affix', function () {
        macAffixCtrl.scrollEvent();
      });

      $scope.$on('$destroy', function () {
        windowEl.unbind('scroll', scrollEventWrapper);
      });
    }
  };
}]);
