describe "Base events", ->
  $compile   = null
  $rootScope = null

  beforeEach module("Mac")
  beforeEach inject (_$compile_, _$rootScope_) ->
    $compile   = _$compile_
    $rootScope = _$rootScope_

  it "should evaluate callback on blur", ->
    called              = false
    $rootScope.callback = -> called = true

    element = $compile("<input type='text' mac-blur='callback()' />") $rootScope
    $rootScope.$digest()

    browserTrigger element, "blur"
    expect(called).toBe true

  it "should evaluate callback on focus", ->
    called              = false
    $rootScope.callback = -> called = true
    $rootScope.$digest()

    element = $compile("<input type='text' mac-focus='callback()' />") $rootScope

    browserTrigger element, "focus"
    expect(called).toBe true
