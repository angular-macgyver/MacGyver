describe "Mac Affix", ->
  $rootScope = null
  $compile   = null
  element    = null

  beforeEach module("Mac")
  beforeEach inject (_$rootScope_, _$compile_) ->
    $rootScope = _$rootScope_
    $compile   = _$compile_

  afterEach ->
    element.remove()
    element = null

  it "should remove affix class when disabled", ->
    $rootScope.affixDisabled = false

    element = angular.element("<div mac-affix mac-affix-disabled='affixDisabled'></div>")
    angular.element(document.body).append element
    $compile(element) $rootScope

    $rootScope.$digest()
    angular.element(window).trigger "scroll"

    $rootScope.affixDisabled = true
    $rootScope.$digest()

    expect(element.hasClass("affix-top")).toBeFalsy()

  it "should re-enable mac-affix", ->
    $rootScope.affixDisabled = true

    element = angular.element("<div mac-affix mac-affix-disabled='affixDisabled'></div>")
    angular.element(document.body).append element
    $compile(element) $rootScope

    $rootScope.$digest()

    expect(element.hasClass("affix-top")).toBeFalsy()

    $rootScope.affixDisabled = false
    $rootScope.$digest()

    expect(element.hasClass("affix-top")).toBeTruthy()
