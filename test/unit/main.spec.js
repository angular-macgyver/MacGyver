describe("Mac main", function() {
  var $rootScope;
  beforeEach(module("Mac"));

  beforeEach(inject(function(_$rootScope_) {
    $rootScope = _$rootScope_;
  }));
  
  describe("isScope", function() {
    it("should be an Angular public method", function() {
      expect(angular.isScope).toBeDefined();
    });

    it("should return false on normal object", function() {
      expect(angular.isScope({})).toBe(false);
    });

    it("should return true for Angular scope", function() {
      expect(angular.isScope($rootScope)).toBe(true);
    });
  });
});
