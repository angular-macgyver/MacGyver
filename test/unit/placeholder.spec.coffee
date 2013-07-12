describe "Mac placeholder", ->
  beforeEach module("Mac")

  describe "initialization", ->
    $compile   = null
    $rootScope = null

    beforeEach inject (_$compile_, _$rootScope_) ->
      $compile   = _$compile_
      $rootScope = _$rootScope_

    it "should set placeholder with a scope variable", ->
      $rootScope.placeholder = "Test"
      element = $compile("<input mac-placeholder='placeholder' />") $rootScope
      $rootScope.$digest()

      expect(element.prop("placeholder")).toBe "Test"

    it "should set placeholder with string variable", ->
      element = $compile("<input mac-placeholder='\"foobar\"' />") $rootScope
      $rootScope.$digest()

      expect(element.prop("placeholder")).toBe "foobar"

    it "should not have placeholder property", ->
      element = $compile("<input mac-placeholder='placeholder' />") $rootScope
      $rootScope.$digest()

      expect(element.prop("placeholder")).toBe ""
