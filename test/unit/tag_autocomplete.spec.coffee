describe "Mac tag autocomplete", ->
  $compile   = null
  $rootScope = null
  keys       = null

  beforeEach module("Mac")
  beforeEach module("template/tag_autocomplete.html")
  beforeEach module("template/autocomplete.html")

  beforeEach inject (_$compile_, _$rootScope_, _keys_) ->
    $compile   = _$compile_
    $rootScope = _$rootScope_
    keys       = _keys_

  describe "basic initialization", ->
    it "should be replaced by the template", ->
      element = $compile("<mac-tag-autocomplete></mac-tag-autocomplete>") $rootScope
      $rootScope.$digest()

      expect(element.hasClass("mac-tag-autocomplete")).toBe true

