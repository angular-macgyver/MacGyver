describe("Popover directive", function() {
  var $rootScope, popover, $compile;
  beforeEach(module("Mac"));

  beforeEach(inject(function(_$compile_, _$rootScope_, _popover_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    popover = _popover_;
  }));

  describe("popover element", function() {
    var element;

    beforeEach(function () {
      var template = "<div><mac-popover id='testPopover'>Test</mac-popover></div>";
      element = $compile(template)($rootScope);
      $rootScope.$digest();
    });

    it("should throw an error when id is missing", function() {
      var toCompile = function() {
        $compile("<mac-popover></mac-popover>")($rootScope);
      };

      expect(toCompile).toThrow(Error('macPopover: Missing id'));
    });

    it("should register the popover", function() {
      expect(popover.registered.testPopover).toBeDefined();
    });

    it("should store the correct template", function() {
      var popoverObj = popover.registered.testPopover;
      expect(popoverObj.template).toBe("Test");
    });

    it("should be replaced with a comment", function() {
      expect(element.contents()[0].nodeType).toBe(8);
    });

    it("should interpolate id before registering", function() {
      var template;
      $rootScope.someId = '12345';
      template = "<div><mac-popover id='testPopover{{someId}}'>Test</mac-popover></div>";
      element = $compile(template)($rootScope);
      $rootScope.$digest();
      expect(popover.registered.testPopover12345).toBeDefined();
    });
  });

  describe("popover element register", function() {
    it('should register with refreshOn options', function() {
      var template = "<div><mac-popover id='testPopover' mac-popover-refresh-on='testEvent'>Test</mac-popover></div>";
      $compile(template)($rootScope);
      $rootScope.$digest();

      var testPopoverOptions = popover.registered.testPopover
      expect(testPopoverOptions).toBeDefined();
      expect(testPopoverOptions.refreshOn).toBe('testEvent');
    });
  });

  describe("popover trigger", function () {
    var trigger, $timeout;

    beforeEach(inject(function (_$timeout_) {
      $timeout = _$timeout_;

      trigger = $compile("<div mac-popover='test'></div>")($rootScope);
      $rootScope.$digest();

      spyOn(popover, 'show');
      spyOn(popover, 'hide');
    }));

    it('should bind click event', function () {
      var bindTrigger = angular.element("<div mac-popover='bind-test'></div>");
      spyOn(bindTrigger[0], 'addEventListener');

      $compile(bindTrigger)($rootScope);
      $rootScope.$digest();

      expect(bindTrigger[0].addEventListener).toHaveBeenCalled();
      expect(bindTrigger[0].addEventListener.calls.argsFor(0)[0]).toEqual('click');
    });

    it('should bind focus event', function () {
      var bindTrigger = angular.element("<div mac-popover='bind-test' mac-popover-trigger='focus'></div>");
      spyOn(bindTrigger[0], 'addEventListener');

      $compile(bindTrigger)($rootScope);
      $rootScope.$digest();

      expect(bindTrigger[0].addEventListener).toHaveBeenCalled();
      expect(bindTrigger[0].addEventListener.calls.argsFor(0)[0]).toEqual('focusin');
      expect(bindTrigger[0].addEventListener.calls.argsFor(1)[0]).toEqual('focusout');
    });

    it('should bind hover event', function () {
      var bindTrigger = angular.element("<div mac-popover='bind-test' mac-popover-trigger='hover'></div>");
      spyOn(bindTrigger[0], 'addEventListener');

      $compile(bindTrigger)($rootScope);
      $rootScope.$digest();

      expect(bindTrigger[0].addEventListener).toHaveBeenCalled();
      expect(bindTrigger[0].addEventListener.calls.argsFor(0)[0]).toEqual('mouseover');
      expect(bindTrigger[0].addEventListener.calls.argsFor(1)[0]).toEqual('mouseout');
    });

    it('should show popover', function () {
      trigger.triggerHandler('click');
      $timeout.flush();

      expect(popover.show).toHaveBeenCalled();
    });

    it('should toggle and hide popover when clicking the same trigger', function () {
      spyOn(popover, 'last').and.returnValue({
        element: trigger
      });

      trigger.triggerHandler('click');
      $timeout.flush();

      expect(popover.hide).toHaveBeenCalled();
      expect(popover.show).not.toHaveBeenCalled();
    });

    it('should hide and show new popover', function () {
      spyOn(popover, 'last').and.returnValue({
        element: angular.element('<div />')
      });

      trigger.triggerHandler('click');
      $timeout.flush();

      expect(popover.hide).toHaveBeenCalled();
      expect(popover.show).toHaveBeenCalled();
    });

    it('should hide on scope $destroy', function () {
      $rootScope.$destroy();
      $timeout.flush();

      expect(popover.hide).toHaveBeenCalledWith(trigger);
    });
  });
});
