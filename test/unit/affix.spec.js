describe("Mac Affix", function() {
  var $compile, $rootScope, element, ctrl, ctrlElement, windowEl;

  beforeEach(module("Mac"));
  beforeEach(inject(function(_$rootScope_, _$compile_, $controller, $window) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;

    ctrlElement = angular.element('<div />');

    ctrl = $controller('MacAffixController', {
      $element: ctrlElement
    });

    windowEl = angular.element($window);
  }));

  afterEach(function() {
    if (element) {
      element.scope().$destroy();
      element.remove();
    }
    element = null;
  });

  describe('MacAffixController', function () {
    it('should initialize affix controller', function () {
      expect(ctrl.$document).toBeDefined();
      expect(ctrl.defaults).toBeDefined();

      expect(ctrl.$element).toBe(ctrlElement);

      expect(ctrl.offset.top).toBe(0);
      expect(ctrl.offset.bottom).toBe(0);

      expect(ctrl.windowEl).toBeDefined();
      expect(ctrl.disabled).toBe(false);

      expect(ctrl.lastAffix).toBe(null);
      expect(ctrl.unpin).toBe(null);
      expect(ctrl.pinnedOffset).toBe(null);
    });

    describe('updateOffset', function () {
      it('should not update offset', function () {
        ctrl.updateOffset('doesNotExist', 'hi');

        expect(ctrl.offset.doesNotExist).toBeUndefined();
      });

      it('should use default value', function () {
        ctrl.defaults.top = 321;
        ctrl.updateOffset('top', null, true);

        expect(ctrl.offset.top).toBe(321);
      });

      it('should not update key', function () {
        ctrl.defaults.top = 321;
        ctrl.offset.top = 123;
        ctrl.updateOffset('top');

        expect(ctrl.offset.top).toBe(123);
      });

      it('should update based on passed in value', function () {
        ctrl.updateOffset('top', 245);
        expect(ctrl.offset.top).toBe(245);
      });

      it('should not update when the value is invalid', function () {
        ctrl.offset.top = 0;
        ctrl.updateOffset('top', 'nop');

        expect(ctrl.offset.top).toBe(0);
      });
    });
  });

  it("should remove affix class when disabled", function() {
    $rootScope.affixDisabled = false;

    element = angular.element("<div mac-affix mac-affix-disabled='affixDisabled'></div>");
    angular.element(document.body).append(element);
    $compile(element)($rootScope);

    $rootScope.$digest();
    angular.element(window).triggerHandler("scroll");

    $rootScope.affixDisabled = true;
    $rootScope.$digest();

    expect(element.hasClass("affix-top")).toBe(false);
  });

  it("should re-enable mac-affix", function() {
    $rootScope.affixDisabled = true;

    element = angular.element("<div mac-affix mac-affix-disabled='affixDisabled'></div>");
    angular.element(document.body).append(element);
    $compile(element)($rootScope);
    $rootScope.$digest();

    expect(element.hasClass("affix-top")).toBe(false);

    $rootScope.affixDisabled = false;
    $rootScope.$digest();

    expect(element.hasClass("affix-top")).toBe(true);
  });

  it('should update top offset', function () {
    element = angular.element("<div mac-affix mac-affix-top='topOffset'></div>");
    angular.element(document.body).append(element);

    $rootScope.topOffset = 100;

    $compile(element)($rootScope);
    $rootScope.$digest();

    var testCtrl = element.controller('macAffix')

    expect(testCtrl.offset.top).toBe(100);

    $rootScope.topOffset = 200;
    $rootScope.$digest();

    expect(testCtrl.offset.top).toBe(200);
  });

  it('should update bottom offset', function () {
    element = angular.element("<div mac-affix mac-affix-bottom='bottomOffset'></div>");
    angular.element(document.body).append(element);

    $rootScope.bottomOffset = 100;

    $compile(element)($rootScope);
    $rootScope.$digest();

    var testCtrl = element.controller('macAffix')

    expect(testCtrl.offset.bottom).toBe(100);

    $rootScope.bottomOffset = 200;
    $rootScope.$digest();

    expect(testCtrl.offset.bottom).toBe(200);
  });

  it('should reposition when calling refresh-mac-affix', function () {
    element = angular.element("<div mac-affix></div>");
    angular.element(document.body).append(element);
    $compile(element)($rootScope);
    $rootScope.$digest();

    var testCtrl = element.controller('macAffix')

    spyOn(testCtrl, 'scrollEvent');

    $rootScope.$broadcast('refresh-mac-affix');
    $rootScope.$digest();

    expect(testCtrl.scrollEvent).toHaveBeenCalled();
  });

  it('should unbind scrollEvent', function () {
    element = angular.element("<div mac-affix></div>");
    angular.element(document.body).append(element);
    $compile(element)($rootScope);
    $rootScope.$digest();

    var testCtrl = element.controller('macAffix');
    spyOn(testCtrl, 'scrollEvent');

    $rootScope.$destroy();
    $rootScope.$digest();

    windowEl.triggerHandler('scroll');
    $rootScope.$digest();

    expect(testCtrl.scrollEvent).not.toHaveBeenCalled();
  });
});
