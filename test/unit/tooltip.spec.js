describe("Mac Tooltip", function() {
  var $compile, $rootScope, $timeout;

  function queryTooltip () {
    return document.querySelector(".mac-tooltip");
  }

  beforeEach(module("Mac"));
  beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));

  afterEach(function() {
    var i, tooltip, tooltips;
    tooltips = document.querySelectorAll(".mac-tooltip");
    for (i = 0; i < tooltips.length; i++) {
      tooltip = tooltips[i];
      tooltip.parentNode.removeChild(tooltip);
    }
  });

  describe("Basic Initialization", function() {
    it("should append to body on mouseenter", function() {
      var tip = $compile("<div mac-tooltip='hello world'></div>")($rootScope);
      $rootScope.$digest();

      tip.triggerHandler("mouseenter");

      expect(queryTooltip()).not.toBe(null);
    });

    it("should only append one tooltip", function() {
      var tip, tooltip;
      tip = $compile("<div mac-tooltip='hello world'></div>")($rootScope);
      $rootScope.$digest();

      tip.triggerHandler("mouseenter");
      tip.triggerHandler("mouseenter");

      tooltip = document.querySelectorAll(".mac-tooltip");
      expect(tooltip.length).toBe(1);
    });

    it("should display the correct message", function() {
      var text, tip = $compile("<div mac-tooltip='hello world'></div>")($rootScope);
      $rootScope.$digest();

      tip.triggerHandler("mouseenter");

      text = queryTooltip().innerText || queryTooltip().textContent;
      expect(text).toBe("hello world");
    });
  });

  describe("Trigger", function() {
    it("should remove tooltip on mouseleave", function() {
      var tip = $compile("<div mac-tooltip='hello world'></div>")($rootScope);
      $rootScope.$digest();

      tip.triggerHandler("mouseenter");

      expect(queryTooltip()).not.toBe(null);

      tip.triggerHandler("mouseleave");
      $timeout.flush();

      expect(queryTooltip()).toBe(null);
    });

    it("should show and hide on click", function() {
      var tip = $compile("<div mac-tooltip='test' mac-tooltip-trigger='click'></div>")($rootScope);
      $rootScope.$digest();

      tip.triggerHandler("click");

      expect(queryTooltip()).not.toBe(null);

      tip.triggerHandler("click");
      $timeout.flush();

      expect(queryTooltip()).toBe(null);
    });

    it("should throw an error with invalid trigger", function() {
      var compile = function() {
        $compile("<div mac-tooltip='test' mac-tooltip-trigger='trigger'></div>")($rootScope);
        $rootScope.$digest();
      };
      expect(compile).toThrow();
    });
  });

  describe("Direction", function() {
    it("should set direction to top as default", function() {
      var tip = $compile("<div mac-tooltip='test'></div>")($rootScope);
      $rootScope.$digest();

      tip.triggerHandler("mouseenter");

      expect(queryTooltip().className.indexOf("top")).not.toBe(-1);
    });

    it("should set the direction to bottom", function() {
      var tip = $compile("<div mac-tooltip='test' mac-tooltip-direction='bottom'></div>")($rootScope);
      $rootScope.$digest();

      tip.triggerHandler("mouseenter");

      expect(queryTooltip().className.indexOf("bottom")).not.toBe(-1);
    });
  });

  describe("disabled", function() {
    it("should not create a tooltip", function() {
      var tip = $compile("<div mac-tooltip='test' mac-tooltip-disabled='true'></div>")($rootScope);
      $rootScope.$digest();

      tip.triggerHandler("mouseenter");

      expect(queryTooltip()).toBe(null);
    });

    it("should create a tooltip", function() {
      var tip = $compile("<div mac-tooltip='test' mac-tooltip-disabled='false'></div>")($rootScope);
      $rootScope.$digest();

      tip.triggerHandler("mouseenter");

      expect(queryTooltip()).not.toBe(null);
    });
  });

  describe("Inside", function() {
    it("should append tooltip inside of trigger", function() {
      var tip = $compile("<div mac-tooltip='test' mac-tooltip-inside></div>")($rootScope);
      $rootScope.$digest();

      tip.triggerHandler("mouseenter");

      expect(tip[0].querySelector(".mac-tooltip")).not.toBe(null);
    });

    it("should not append tooltip inside of trigger", function() {
      var tip = $compile("<div mac-tooltip='test'></div>")($rootScope);
      $rootScope.$digest();

      tip.triggerHandler("mouseenter");

      expect(tip[0].querySelector(".mac-tooltip")).toBe(null);
    });
  });
});
