describe("Mac Affix", function() {
  var $compile, $rootScope, element;

  beforeEach(module("Mac"));
  beforeEach(inject(function(_$rootScope_, _$compile_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));

  afterEach(function() {
    element.remove();
    element = null;
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
});
