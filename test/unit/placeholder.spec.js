describe("Mac placeholder", function() {
  beforeEach(module("Mac"));

  describe("initialization", function() {
    var $compile, $rootScope;
    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it("should set placeholder with a scope variable", function() {
      var element = $compile("<input mac-placeholder='placeholder' />")($rootScope);
      $rootScope.placeholder = "Test";
      $rootScope.$digest();

      expect(element.prop("placeholder")).toBe("Test");
    });

    it("should set placeholder with string variable", function() {
      var element = $compile("<input mac-placeholder='\"foobar\"' />")($rootScope);
      $rootScope.$digest();

      expect(element.prop("placeholder")).toBe("foobar");
    });

    it("should not have placeholder property", function() {
      var element = $compile("<input mac-placeholder='placeholder' />")($rootScope);
      $rootScope.$digest();

      expect(element.prop("placeholder")).toBe("");
    });
  });
});
