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

  describe('position', function () {
    it('should be on angular element', function() {
      expect(angular.element.prototype.position).toBeDefined();
    });

    it('should get as offset relative to body', function () {
      var element = angular.element('<div style="top: 100px; position: relative;"></div>');
      angular.element(document.body).append(element);

      var position = element.position();
      expect(position.top).toBe(100);
      expect(position.left).toBe(0);

      element.remove();
    });

    it('should get position relative to parent element', function () {
      var element = angular.element('<div style="top: 100px; position: relative;"></div>');
      var parent = angular.element('<div style="top: 100px; position: relative;"></div>');

      parent.append(element);
      angular.element(document.body).append(parent);

      var position = element.position();
      expect(position.top).toBe(100);
      expect(position.left).toBe(0);

      parent.remove();
    });
  });

  describe('offset', function () {
    beforeEach(function () {
      angular.element(document.body).css({
        margin: 0,
        padding: 0
      });
    });

    it('should be on angular element', function() {
      expect(angular.element.prototype.offset).toBeDefined();
    });

    it('should get offset', function () {
      var element = angular.element('<div style="top: 100px; position: relative;"></div>');
      angular.element(document.body).append(element);

      var position = element.offset();
      expect(position.top).toBe(100);
      expect(position.left).toBe(0);

      element.remove();
    });

    it('should get offset correctly with parent element', function () {
      var element = angular.element('<div style="top: 100px; position: relative;"></div>');
      var parent = angular.element('<div style="top: 100px; position: relative;"></div>');

      parent.append(element);
      angular.element(document.body).append(parent);

      var position = element.offset();
      expect(position.top).toBe(200);
      expect(position.left).toBe(0);

      parent.remove();
    });
  });
});
