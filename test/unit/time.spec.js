describe("Mac Time input", function() {
  beforeEach(module("Mac"));
  beforeEach(module("template/time.html"));

  var $compile, $rootScope, timeUtil;

  beforeEach(inject(function(_$compile_, _$rootScope_, _macTimeUtil_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    timeUtil = _macTimeUtil_;
  }));

  describe("Basic Initialization", function() {
    it("should replace with template", function() {
      var element = $compile("<mac-time ng-model='model'></mac-time>")($rootScope);
      $rootScope.$digest();

      expect(element.hasClass("mac-date-time")).toBe(true);
    });

    it("should use default placeholder", function() {
      var element = $compile("<mac-time ng-model='model'></mac-time>")($rootScope);
      $rootScope.$digest();

      expect(element.prop("placeholder")).toBe("--:--");
    });

    it("should use set default time based on user input", function() {
      var element;
      $rootScope.model = "";
      element = $compile("<mac-time ng-model='model' mac-time-default='06:30 PM'></mac-time>")($rootScope);

      $rootScope.$digest();

      element.triggerHandler("click");
      $rootScope.$digest();

      expect($rootScope.model).toBe("06:30 PM");
    });

    it("should update the model with default time", function() {
      var element;
      $rootScope.model = "";
      element = $compile("<mac-time ng-model='model'></mac-time>")($rootScope);

      $rootScope.$digest();

      element.triggerHandler("click");
      $rootScope.$digest();

      expect($rootScope.model).toBe("12:00 AM");
    });

    it("should reset back to default value when clearing model", function() {
      var element;
      $rootScope.model = "2:30 PM";

      element = $compile("<mac-time ng-model='model'></mac-time>")($rootScope);
      $rootScope.$digest();

      $rootScope.model = "";
      $rootScope.$digest();

      element.triggerHandler("click");
      $rootScope.$digest();

      expect($rootScope.model).toBe("12:00 AM");
    });
  });

  describe("view -> model", function() {
    var $compile, $rootScope, $sniffer;

    function changeInputValue (element, value) {
      element.val(value);
      element.triggerHandler(($sniffer.hasEvent("input") ? "input" : "change"));
    }

    beforeEach(inject(function(_$compile_, _$rootScope_, _$sniffer_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $sniffer = _$sniffer_;
    }));

    it("should update the model correctly", function() {
      var element;
      $rootScope.model = "";

      element = $compile("<mac-time ng-model='model'></mac-time>")($rootScope);
      $rootScope.$digest();

      element.triggerHandler('click');
      changeInputValue(element, "06:25 PM");

      expect($rootScope.model).toBe("06:25 PM");
    });

    it("should reset back to the original time when input is invalid - 1", function() {
      var element;
      $rootScope.model = "";
      element = $compile("<mac-time ng-model='model'></mac-time>")($rootScope);
      $rootScope.$digest();

      element.triggerHandler('click');
      $rootScope.$digest();

      changeInputValue(element, "14:41 AM");
      element.triggerHandler('blur');
      $rootScope.$digest();

      expect($rootScope.model).toBe("12:00 AM");
    });

    it("should reset back to the original time when input is invalid - 2", function() {
      var element;
      $rootScope.model = "";
      element = $compile("<mac-time ng-model='model'></mac-time>")($rootScope);
      $rootScope.$digest();

      element.triggerHandler('click');
      $rootScope.$digest();

      changeInputValue(element, "123");
      element.triggerHandler('blur');
      $rootScope.$digest();

      expect($rootScope.model).toBe("12:00 AM");
    });
  });
  describe("model -> view", function() {
    var $compile, $rootScope;

    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it("should update the value of the input", function() {
      var element = $compile("<mac-time ng-model='model'></mac-time>")($rootScope);
      $rootScope.$digest();

      expect(element.val()).toBe("");
      $rootScope.model = "02:30 PM";
      $rootScope.$digest();

      expect(element.val()).toBe("02:30 PM");
    });

    it("initial click should populate time input", function() {
      $rootScope.model = "02:30 PM";
      var element = $compile("<mac-time ng-model='model'></mac-time>")($rootScope);
      $rootScope.$digest();

      element.triggerHandler('click');
      $rootScope.$digest();

      expect(element.val()).toBe("02:30 PM");
    });

    it("initial click should populate time input with 12:00 AM", function() {
      $rootScope.model = "12:00 AM";
      var element = $compile("<mac-time ng-model='model'></mac-time>")($rootScope);
      $rootScope.$digest();

      element.triggerHandler('click');
      $rootScope.$digest();

      expect(element.val()).toBe("12:00 AM");
    });

    it("should clear out text input when clearing model", function() {
      var element = $compile("<mac-time ng-model='model'></mac-time>")($rootScope);
      $rootScope.$digest();

      $rootScope.model = "02:30 PM";
      $rootScope.$digest();

      expect(element.val()).toBe("02:30 PM");
      $rootScope.model = "";
      $rootScope.$digest();

      expect(element.val()).toBe("");
    });

    it("should clear out text input when clearing model with null", function() {
      var element = $compile("<mac-time ng-model='model'></mac-time>")($rootScope);
      $rootScope.$digest();

      $rootScope.model = "02:30 PM";
      $rootScope.$digest();

      $rootScope.model = null;
      $rootScope.$digest();

      expect(element.val()).toBe("");
    });
  });

  // Using spyOn instead of checking selection start and end due to
  // PhantomJS bugs
  describe('click event', function () {
    it("should select hour when model is not set", function() {
      var element = $compile("<mac-time ng-model='model'></mac-time>")($rootScope);

      $rootScope.$digest();

      spyOn(timeUtil, 'selectHours')
      element.triggerHandler("click");
      $rootScope.$digest();

      expect(timeUtil.selectHours).toHaveBeenCalled();
    });

    it("should select hour", function() {
      $rootScope.model = '12:00 AM';
      var element = $compile("<mac-time ng-model='model'></mac-time>")($rootScope);

      $rootScope.$digest();

      spyOn(timeUtil, 'getSelection').and.returnValue('hour');
      spyOn(timeUtil, 'selectHours')
      element.triggerHandler("click");
      $rootScope.$digest();

      expect(timeUtil.selectHours).toHaveBeenCalled();
    });

    it("should select minute", function() {
      $rootScope.model = '12:00 AM';
      var element = $compile("<mac-time ng-model='model'></mac-time>")($rootScope);

      $rootScope.$digest();

      spyOn(timeUtil, 'getSelection').and.returnValue('minute');
      spyOn(timeUtil, 'selectMinutes')
      element.triggerHandler("click");
      $rootScope.$digest();

      expect(timeUtil.selectMinutes).toHaveBeenCalled();
    });

    it("should select meridian", function() {
      $rootScope.model = '12:00 AM';
      var element = $compile("<mac-time ng-model='model'></mac-time>")($rootScope);

      $rootScope.$digest();

      spyOn(timeUtil, 'getSelection').and.returnValue('meridian');
      spyOn(timeUtil, 'selectMeridian')
      element.triggerHandler("click");
      $rootScope.$digest();

      expect(timeUtil.selectMeridian).toHaveBeenCalled();
    });
  });

  describe('keydown event', function () {
    var element;

    beforeEach(function () {
      $rootScope.model = '12:00 AM';
      element = $compile("<mac-time ng-model='model'></mac-time>")($rootScope);
      $rootScope.$digest();
    });

    it('should exit out if key is not whitelisted', function () {
      spyOn(timeUtil, 'getSelection');
      element.triggerHandler('keydown', {which: 74});

      $rootScope.$digest();

      expect(timeUtil.getSelection).not.toHaveBeenCalled();
    });

    describe('pressing UP', function () {
      beforeEach(function () {
        spyOn(timeUtil, 'selectHours');
        spyOn(timeUtil, 'selectMinutes');
        spyOn(timeUtil, 'selectMeridian');
      });

      it('should update hour', function () {
        spyOn(timeUtil, 'getSelection').and.returnValue('hour');

        element.triggerHandler({
          type: 'keydown',
          which: 38
        });

        $rootScope.$digest();

        expect($rootScope.model).toBe('01:00 AM');
        expect(timeUtil.selectHours).toHaveBeenCalled();

      });

      it('should update minute', function () {
        spyOn(timeUtil, 'getSelection').and.returnValue('minute');
        element.triggerHandler({
          type: 'keydown',
          which: 38
        });

        $rootScope.$digest();

        expect($rootScope.model).toBe('12:01 AM');
        expect(timeUtil.selectMinutes).toHaveBeenCalled();
      });

      it('should update meridian', function () {
        spyOn(timeUtil, 'getSelection').and.returnValue('meridian');
        element.triggerHandler({
          type: 'keydown',
          which: 38
        });

        $rootScope.$digest();

        expect($rootScope.model).toBe('12:00 PM');
        expect(timeUtil.selectMeridian).toHaveBeenCalled();
      });
    });

    describe('pressing DOWN', function () {
      beforeEach(function () {
        spyOn(timeUtil, 'selectHours');
        spyOn(timeUtil, 'selectMinutes');
        spyOn(timeUtil, 'selectMeridian');
      });

      it('should update hour', function () {
        spyOn(timeUtil, 'getSelection').and.returnValue('hour');

        element.triggerHandler({
          type: 'keydown',
          which: 40
        });

        $rootScope.$digest();

        expect($rootScope.model).toBe('11:00 PM');
        expect(timeUtil.selectHours).toHaveBeenCalled();

      });

      it('should update minute', function () {
        spyOn(timeUtil, 'getSelection').and.returnValue('minute');
        element.triggerHandler({
          type: 'keydown',
          which: 40
        });

        $rootScope.$digest();

        expect($rootScope.model).toBe('11:59 PM');
        expect(timeUtil.selectMinutes).toHaveBeenCalled();
      });

      it('should update meridian', function () {
        spyOn(timeUtil, 'getSelection').and.returnValue('meridian');
        element.triggerHandler({
          type: 'keydown',
          which: 40
        });

        $rootScope.$digest();

        expect($rootScope.model).toBe('12:00 PM');
        expect(timeUtil.selectMeridian).toHaveBeenCalled();
      });
    });

    it('should select previous section when pressing LEFT', function () {
      spyOn(timeUtil, 'selectPreviousSection');
      spyOn(timeUtil, 'updateInput');

      element.triggerHandler({
        type: 'keydown',
        which: 37
      });

      $rootScope.$digest();

      expect(timeUtil.selectPreviousSection).toHaveBeenCalled();
      expect(timeUtil.updateInput).toHaveBeenCalled();
    });

    it('should select next section when pressing RIGHT', function () {
      spyOn(timeUtil, 'selectNextSection');
      spyOn(timeUtil, 'updateInput');

      element.triggerHandler({
        type: 'keydown',
        which: 39
      });

      $rootScope.$digest();

      expect(timeUtil.selectNextSection).toHaveBeenCalled();
      expect(timeUtil.updateInput).toHaveBeenCalled();
    });

    it('should set to AM when pressing A', function () {
      spyOn(timeUtil, 'getSelection').and.returnValue('meridian');
      spyOn(timeUtil, 'setMeridian');
      spyOn(timeUtil, 'updateInput');
      spyOn(timeUtil, 'selectMeridian');

      element.triggerHandler({
        type: 'keydown',
        which: 65
      });

      $rootScope.$digest();

      expect(timeUtil.setMeridian).toHaveBeenCalled();
      expect(timeUtil.setMeridian.calls.argsFor(0)[1]).toBe('AM');
      expect(timeUtil.updateInput).toHaveBeenCalled();
      expect(timeUtil.selectMeridian).toHaveBeenCalled();
    });

    it('should set to PM when pressing P', function () {
      spyOn(timeUtil, 'getSelection').and.returnValue('meridian');
      spyOn(timeUtil, 'setMeridian');
      spyOn(timeUtil, 'updateInput');
      spyOn(timeUtil, 'selectMeridian');

      element.triggerHandler({
        type: 'keydown',
        which: 80
      });

      $rootScope.$digest();

      expect(timeUtil.setMeridian).toHaveBeenCalled();
      expect(timeUtil.setMeridian.calls.argsFor(0)[1]).toBe('PM');
      expect(timeUtil.updateInput).toHaveBeenCalled();
      expect(timeUtil.selectMeridian).toHaveBeenCalled();
    });

    it('should not change meridian when not in the right section', function () {
      spyOn(timeUtil, 'getSelection').and.returnValue('hour');
      spyOn(timeUtil, 'setMeridian');
      spyOn(timeUtil, 'updateInput');
      spyOn(timeUtil, 'selectMeridian');

      element.triggerHandler({
        type: 'keydown',
        which: 80
      });

      $rootScope.$digest();

      expect(timeUtil.setMeridian).not.toHaveBeenCalled();
      expect(timeUtil.updateInput).not.toHaveBeenCalled();
      expect(timeUtil.selectMeridian).not.toHaveBeenCalled();
    });
  });

  describe('keyup event', function () {
    var element;

    beforeEach(function () {
      $rootScope.model = '12:00 AM';
      element = $compile("<mac-time ng-model='model'></mac-time>")($rootScope);
      $rootScope.$digest();
    });

    it('should updateTime when pressing keyup', function () {
      spyOn(timeUtil, 'updateTime');

      var preventDefault = jasmine.createSpy('preventDefault');

      element.triggerHandler({
        type: 'keyup',
        which: 97,
        preventDefault: preventDefault
      });

      $rootScope.$digest();

      expect(preventDefault).not.toHaveBeenCalled();
      expect(timeUtil.updateTime).toHaveBeenCalled();
    });

    it('should preventDefault when pressing keyup un-whitelisted key', function () {
      spyOn(timeUtil, 'updateTime');

      var preventDefault = jasmine.createSpy('preventDefault');

      element.triggerHandler({
        type: 'keyup',
        which: 65,
        preventDefault: preventDefault
      });

      $rootScope.$digest();

      expect(preventDefault).toHaveBeenCalled();
      expect(timeUtil.updateTime).toHaveBeenCalled();
    });
  });
});
