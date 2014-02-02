describe "Mac Spinner", ->
  beforeEach module("Mac")

  describe "Basic Initialization", ->
    $compile   = null
    $rootScope = null

    beforeEach inject (_$compile_, _$rootScope_) ->
      $compile   = _$compile_
      $rootScope = _$rootScope_

    it "should replace with template", ->
      element = $compile("<mac-spinner></mac-spinner>") $rootScope
      $rootScope.$digest()

      expect(element.hasClass "mac-spinner").toBe true

    it "should create 10 bars", ->
      element = $compile("<mac-spinner></mac-spinner>") $rootScope
      $rootScope.$digest()

      expect($(".bar", element).length).toBe 10

    it "should update spinner size", ->
      element = $compile("<mac-spinner mac-spinner-size='30'></mac-spinner>") $rootScope
      $rootScope.$digest()

      isCorrectSize = element.height() is 30 and element.width() is 30
      expect(isCorrectSize).toBe true

    it "should update z-index", ->
      element = $compile("<mac-spinner mac-spinner-z-index='9001'></mac-spinner>") $rootScope
      $rootScope.$digest()

      expect(element.css("zIndex")).toBe "9001"

    it "should update the background color", ->
      element = $compile("<mac-spinner mac-spinner-color='#123123'></mac-spinner>") $rootScope
      $rootScope.$digest()

      # FF extends background style to 'none repeat scroll 0% 0% rgb(18, 49, 35)'
      expect($(".bar", element).css("background").indexOf("rgb(18, 49, 35)")).not.toBe -1
