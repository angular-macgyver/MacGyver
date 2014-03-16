describe "Mac Tooltip", ->
  $compile   = null
  $rootScope = null
  $timeout   = null

  beforeEach module("Mac")
  beforeEach inject (_$compile_, _$rootScope_, _$timeout_) ->
    $compile   = _$compile_
    $rootScope = _$rootScope_
    $timeout   = _$timeout_

  afterEach ->
    $(".mac-tooltip").remove()

  describe "Basic Initialization", ->

    it "should append to body on mouseenter", ->
      tip = $compile("<div mac-tooltip='hello world'></div>") $rootScope
      $rootScope.$digest()
      tip.trigger "mouseenter"

      expect($(".mac-tooltip").length).toBe 1

    it "should display the correct message", ->
      tip = $compile("<div mac-tooltip='hello world'></div>") $rootScope
      $rootScope.$digest()
      tip.trigger "mouseenter"

      expect($(".tooltip-message").text()).toBe "hello world"

  describe "Trigger", ->

    it "should remove tooltip on mouseleave", ->
      tip = $compile("<div mac-tooltip='hello world'></div>") $rootScope
      $rootScope.$digest()
      tip.trigger "mouseenter"

      expect($(".mac-tooltip").length).toBe 1

      tip.trigger "mouseleave"
      $timeout.flush()

      expect($(".mac-tooltip").length).toBe 0

    it "should show and hide on click", ->
      tip = $compile("<div mac-tooltip='test' mac-tooltip-trigger='click'></div>") $rootScope
      $rootScope.$digest()
      # show
      tip.trigger "click"
      expect($(".mac-tooltip").length).toBe 1

      # hide
      tip.trigger "click"
      $timeout.flush()

      expect($(".tooltip").length).toBe 0

    it "should throw an error with invalid trigger", ->
      compile = ->
        tip = $compile("<div mac-tooltip='test' mac-tooltip-trigger='trigger'></div>") $rootScope
        $rootScope.$digest()
      expect(compile).toThrow()

  describe "Direction", ->

    it "should set direction to top as default", ->
      tip = $compile("<div mac-tooltip='test'></div>") $rootScope
      $rootScope.$digest()

      tip.trigger "mouseenter"

      expect($(".mac-tooltip").hasClass "top").toBe true

    it "should set the direction to bottom", ->
      tip = $compile("<div mac-tooltip='test' mac-tooltip-direction='bottom'></div>") $rootScope
      $rootScope.$digest()

      tip.trigger "mouseenter"

      expect($(".mac-tooltip").hasClass "bottom").toBe true

  describe "disabled", ->

    it "should not create a tooltip", ->
      tip = $compile("<div mac-tooltip='test' mac-tooltip-disabled='true'></div>") $rootScope
      $rootScope.$digest()

      tip.trigger "mouseenter"
      expect($(".mac-tooltip").length).toBe 0

    it "should create a tooltip", ->
      tip = $compile("<div mac-tooltip='test' mac-tooltip-disabled='false'></div>") $rootScope
      $rootScope.$digest()

      tip.trigger "mouseenter"
      expect($(".mac-tooltip").length).toBe 1

  describe "Inside", ->

    it "should append tooltip inside of trigger", ->
      tip = $compile("<div mac-tooltip='test' mac-tooltip-inside></div>") $rootScope
      $rootScope.$digest()

      tip.trigger "mouseenter"

      expect($(".mac-tooltip", tip).length).toBe 1

    it "should not append tooltip inside of trigger", ->
      tip = $compile("<div mac-tooltip='test'></div>") $rootScope
      $rootScope.$digest()

      tip.trigger "mouseenter"

      expect($(".mac-tooltip", tip).length).toBe 0
