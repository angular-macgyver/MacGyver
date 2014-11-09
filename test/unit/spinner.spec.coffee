describe "Mac Spinner", ->
  beforeEach module("Mac")

  describe "Basic Initialization", ->
    $compile   = null
    $rootScope = null
    prefixes   = ["webkit", "Moz", "ms", "O"]

    beforeEach inject (_$compile_, _$rootScope_) ->
      $compile   = _$compile_
      $rootScope = _$rootScope_

    it "should replace with template", ->
      element = $compile("<mac-spinner></mac-spinner>") $rootScope
      $rootScope.$digest()

      expect(element[0].className.indexOf "mac-spinner").not.toBe -1

    it "should create 10 bars", ->
      element = $compile("<mac-spinner></mac-spinner>") $rootScope
      $rootScope.$digest()

      bars = element[0].querySelectorAll ".bar"

      expect(bars.length).toBe 10

    it "should update animation", ->
      element = $compile("<mac-spinner></mac-spinner>") $rootScope
      $rootScope.$digest()

      bar          = element[0].querySelector ".bar"
      hasAnimation = false

      for prefix in prefixes
        if bar.style["#{prefix}Animation"]?
          hasAnimation = true

      expect(hasAnimation).toBe true

    it "should update transform", ->
      element = $compile("<mac-spinner></mac-spinner>") $rootScope
      $rootScope.$digest()

      bar          = element[0].querySelector ".bar"
      hasTransform = false

      for prefix in prefixes
        if bar.style["#{prefix}Transform"]?
          hasTransform = true

      expect(hasTransform).toBe true

    it "should update spinner size", ->
      element = $compile("<mac-spinner mac-spinner-size='30'></mac-spinner>") $rootScope
      $rootScope.$digest()

      isCorrectSize = element[0].style.height is "30px" and element[0].style.width is "30px"
      expect(isCorrectSize).toBe true

    it "should update z-index", ->
      element = $compile("<mac-spinner mac-spinner-z-index='9001'></mac-spinner>") $rootScope
      $rootScope.$digest()

      expect(element.css("zIndex")).toBe "9001"

    it "should update the background color", ->
      element = $compile("<mac-spinner mac-spinner-color='#123123'></mac-spinner>") $rootScope
      $rootScope.$digest()

      # FF extends background style to 'none repeat scroll 0% 0% rgb(18, 49, 35)'
      bar = element[0].querySelector ".bar"

      expect(bar.style.background.indexOf("rgb(18, 49, 35)")).not.toBe -1
