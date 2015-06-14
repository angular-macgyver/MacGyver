describe("Mac Time input", function() {
  beforeEach(module("Mac"));
  beforeEach(module("template/time.html"));

  describe("Basic Initialization", function() {
    var $compile, $rootScope, currentDate = new Date().toDateString();

    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

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
      return element.triggerHandler(($sniffer.hasEvent("input") ? "input" : "change"));
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
});
