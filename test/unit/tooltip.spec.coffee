describe "Mac Tooltip", ->
  beforeEach module("Mac")

  describe "Basic Initialization", ->
    $compile   = null
    $rootScope = null

    beforeEach inject (_$compile_, _$rootScope_) ->
      $compile   = _$compile_
      $rootScope = _$rootScope_

    afterEach ->
      $(".tooltip").remove()

    it "should append to body on mouseenter", ->
      tip = $compile("<div mac-tooltip='hello world'></div>") $rootScope
      $rootScope.$digest()
      tip.trigger "mouseenter"

      expect($(".tooltip").length).toBe 1

    it "should display the correct message", ->
      tip = $compile("<div mac-tooltip='hello world'></div>") $rootScope
      $rootScope.$digest()
      tip.trigger "mouseenter"

      expect($(".tooltip-message").text()).toBe "hello world"

  describe "Trigger", ->
    $compile   = null
    $rootScope = null

    beforeEach inject (_$compile_, _$rootScope_) ->
      $compile   = _$compile_
      $rootScope = _$rootScope_

    afterEach ->
      $(".tooltip").remove()

    it "should remove tooltip on mouseleave", ->
      called = false
      tip    = $compile("<div mac-tooltip='hello world'></div>") $rootScope
      $rootScope.$digest()
      tip.trigger "mouseenter"

      expect($(".tooltip").length).toBe 1

      # Add 150ms delay as tooltip is removed after 100ms
      runs ->
        tip.trigger "mouseleave"
        setTimeout (-> called = true), 150

      waitsFor ->
        return called
      , "Tooltip should be removed", "750"

      runs ->
        expect($(".tooltip").length).toBe 0

    it "should show and hide on click", ->
      called = false
      tip    = $compile("<div mac-tooltip='test' mac-tooltip-trigger='click'></div>") $rootScope
      $rootScope.$digest()
      # show
      tip.trigger "click"
      expect($(".tooltip").length).toBe 1
      # hide
      runs ->
        tip.trigger "click"
        setTimeout (-> called = true), 150

      waitsFor ->
        return called
      , "Tooltip should be removed", "750"

      runs ->
        expect($(".tooltip").length).toBe 0

    it "should throw an error with invalid trigger", ->
      compile = ->
        tip = $compile("<div mac-tooltip='test' mac-tooltip-trigger='trigger'></div>") $rootScope
        $rootScope.$digest()
      expect(compile).toThrow()

  describe "Direction", ->
    $compile   = null
    $rootScope = null

    beforeEach inject (_$compile_, _$rootScope_) ->
      $compile   = _$compile_
      $rootScope = _$rootScope_

    afterEach ->
      $(".tooltip").remove()

    it "should set direction to top as default", ->
      tip = $compile("<div mac-tooltip='test'></div>") $rootScope
      $rootScope.$digest()

      tip.trigger "mouseenter"

      expect($(".tooltip").hasClass "top").toBe true

    it "should set the direction to bottom", ->
      tip = $compile("<div mac-tooltip='test' mac-tooltip-direction='bottom'></div>") $rootScope
      $rootScope.$digest()

      tip.trigger "mouseenter"

      expect($(".tooltip").hasClass "bottom").toBe true

  describe "Inside", ->
    $compile   = null
    $rootScope = null

    beforeEach inject (_$compile_, _$rootScope_) ->
      $compile   = _$compile_
      $rootScope = _$rootScope_

    afterEach ->
      $(".tooltip").remove()

    it "should append tooltip inside of trigger", ->
      tip = $compile("<div mac-tooltip='test' mac-tooltip-inside></div>") $rootScope
      $rootScope.$digest()

      tip.trigger "mouseenter"

      expect($(".tooltip", tip).length).toBe 1

    it "should not append tooltip inside of trigger", ->
      tip = $compile("<div mac-tooltip='test'></div>") $rootScope
      $rootScope.$digest()

      tip.trigger "mouseenter"

      expect($(".tooltip", tip).length).toBe 0
