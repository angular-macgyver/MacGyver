describe("Mac Spinner", function() {
  beforeEach(module("Mac"));
  describe("Basic Initialization", function() {
    var $compile, $rootScope, prefixes;
    prefixes = ["webkit", "Moz", "ms", "O"];

    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it("should replace with template", function() {
      var element = $compile("<mac-spinner></mac-spinner>")($rootScope);
      $rootScope.$digest();

      expect(element[0].className.indexOf("mac-spinner")).not.toBe(-1);
    });

    it("should create 10 bars", function() {
      var bars, element;
      element = $compile("<mac-spinner></mac-spinner>")($rootScope);
      $rootScope.$digest();

      bars = element[0].querySelectorAll(".bar");

      return expect(bars.length).toBe(10);
    });

    it("should update animation", function() {
      var bar, element, hasAnimation, i, len, prefix;
      element = $compile("<mac-spinner></mac-spinner>")($rootScope);
      $rootScope.$digest();

      bar = element[0].querySelector(".bar");
      hasAnimation = false;

      for (i = 0, len = prefixes.length; i < len; i++) {
        prefix = prefixes[i];
        if (bar.style[prefix + "Animation"] != null) {
          hasAnimation = true;
        }
      }

      expect(hasAnimation).toBe(true);
    });

    it("should update transform", function() {
      var bar, element, hasTransform, i, len, prefix;

      element = $compile("<mac-spinner></mac-spinner>")($rootScope);
      $rootScope.$digest();

      bar = element[0].querySelector(".bar");
      hasTransform = false;

      for (i = 0, len = prefixes.length; i < len; i++) {
        prefix = prefixes[i];
        if (bar.style[prefix + "Transform"] != null) {
          hasTransform = true;
        }
      }

      expect(hasTransform).toBe(true);
    });

    it("should update spinner size", function() {
      var element, isCorrectSize;
      element = $compile("<mac-spinner mac-spinner-size='30'></mac-spinner>")($rootScope);
      $rootScope.$digest();

      isCorrectSize = element[0].style.height === "30px" && element[0].style.width === "30px";

      expect(isCorrectSize).toBe(true);
    });

    it("should update z-index", function() {
      var element = $compile("<mac-spinner mac-spinner-z-index='9001'></mac-spinner>")($rootScope);
      $rootScope.$digest();

      expect(element.css("zIndex")).toBe("9001");
    });

    it("should update the background color", function() {
      var bar, element;
      element = $compile("<mac-spinner mac-spinner-color='#123123'></mac-spinner>")($rootScope);
      $rootScope.$digest();

      bar = element[0].querySelector(".bar");
      
      expect(bar.style.background.indexOf("rgb(18, 49, 35)")).not.toBe(-1);
    });
  });
});
