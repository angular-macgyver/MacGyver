/**
 * @ngdoc directive
 * @name macModal
 * @description
 * Element directive to define the modal dialog. Modal content is transcluded into a
 * modal template
 *
 * @param {Boolean} mac-modal-keyboard      Allow closing modal with keyboard (default false)
 * @param {Boolean} mac-modal-overlay-close Allow closing modal when clicking on overlay (default false)
 * @param {Boolean} mac-modal-resize        Allow modal to resize on window resize event (default false)
 * @param {Integer} mac-modal-topOffset     Top offset when the modal is larger than window height (default 20)
 * @param {Expr}    mac-modal-open          Callback when the modal is opened
 * @param {Expr}    mac-modal-before-show   Callback before showing the modal
 * @param {Expr}    mac-modal-after-show    Callback when modal is visible with CSS transitions completed
 * @param {Expr}    mac-modal-before-hide   Callback before hiding the modal
 * @param {Expr}    mac-modal-after-hide    Callback when modal is hidden from the user with CSS transitions completed
 * @param {Boolean} mac-modal-position      Calculate size and position with JS (default true)
 *
 * @example
<example>
  <mac-modal id="test-modal" mac-modal-keyboard ng-cloak>
   <div class="mac-modal-content" ng-controller="modalController">
     <h1>Just another modal</h1>
   </div>
  </mac-modal>
  <button mac-modal="test-modal">Show Modal</button>
</example>
<mac-modal id="test-modal" mac-modal-keyboard ng-cloak>
  <div class="mac-modal-content" ng-controller="modalController">
    <h1>Just another modal</h1>
  </div>
</mac-modal>
<button mac-modal="test-modal">Show Modal</button>
 */
angular.module('Mac').directive('macModal', [
  '$parse',
  'modal',
  'util',
  function($parse, modal, util) {
    return {
      restrict: 'E',
      template: modal.defaults.template,
      replace: true,
      transclude: true,
      link: function($scope, element, attrs, controller, transclude) {
        transclude($scope, function (clone) {
          angular.element(element[0].querySelector('.mac-modal-content-wrapper')).replaceWith(clone);
        });

        var opts = util.extendAttributes('macModal', modal.defaults, attrs);

        if (opts.overlayClose) {
          element.on('click', function ($event) {
            if (angular.element($event.target).hasClass('mac-modal-overlay')) {
              $scope.$apply(function () {
                modal.hide();
              });
            }
          });
        }

        var callbacks = ['beforeShow', 'afterShow', 'beforeHide', 'afterHide', 'open'];
        callbacks.forEach(function (callback) {
          var key = 'macModal' + util.capitalize(callback);
          opts[callback] = $parse(attrs[key]) || angular.noop;
        });

        var registerModal = function (id) {
          if (!id) return;

          modal.register(id, element, opts);
          // NOTE: Remove from modal service when mac-modal directive is removed
          // from DOM
          $scope.$on('$destroy', function () {
            if (modal.opened && modal.opened.id == id) {
              modal.hide();
            }

            modal.unregister(id);
          });
        }

        if (attrs.id) {
          registerModal(attrs.id);
        } else {
          attrs.$observe('macModal', function (id) {
            registerModal(id);
          });
        }
      }
    };
  }
])
.directive('macModal', [
  '$parse',
  'modal',
  function ($parse, modal) {
    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {
        if (!attrs.macModal) {
          return;
        }

        element.bind('click', function () {
          $scope.$apply(function () {
            var data = $parse(attrs.macModalData)($scope) || {};
            modal.show(attrs.macModal, {
              data: data,
              scope: $scope
            });
          });

          return true;
        });
      }
    };
  }
])
.directive('macModalClose', [
  'modal',
  function (modal) {
    return {
      restrict: 'A',
      link: function($scope, element) {
        element.bind('click', function () {
          $scope.$apply(function () {
            modal.hide();
          });
        });
      }
    };
  }
]);
