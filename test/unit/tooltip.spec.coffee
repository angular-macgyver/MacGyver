describe "Mac Tooltip", ->
  $compile   = null
  $rootScope = null
  $timeout   = null

  queryTooltip = -> document.querySelector(".mac-tooltip")

  beforeEach module("Mac")
  beforeEach inject (_$compile_, _$rootScope_, _$timeout_) ->
    $compile   = _$compile_
    $rootScope = _$rootScope_
    $timeout   = _$timeout_

  afterEach ->
    tooltip = document.querySelector(".mac-tooltip")
    tooltip.parentNode.removeChild tooltip if tooltip?

  describe "Basic Initialization", ->

    it "should append to body on mouseenter", ->
      tip = $compile("<div mac-tooltip='hello world'></div>") $rootScope
      $rootScope.$digest()
      tip.triggerHandler "mouseenter"

      expect(queryTooltip()).not.toBe(null)

    it "should display the correct message", ->
      tip = $compile("<div mac-tooltip='hello world'></div>") $rootScope
      $rootScope.$digest()
      tip.triggerHandler "mouseenter"

      text = queryTooltip().innerText or queryTooltip().textContent

      expect(text).toBe "hello world"

  describe "Trigger", ->

    it "should remove tooltip on mouseleave", ->
      tip = $compile("<div mac-tooltip='hello world'></div>") $rootScope
      $rootScope.$digest()
      tip.triggerHandler "mouseenter"

      expect(queryTooltip()).not.toBe null

      tip.triggerHandler "mouseleave"
      $timeout.flush()

      expect(queryTooltip()).toBe null

    it "should show and hide on click", ->
      tip = $compile("<div mac-tooltip='test' mac-tooltip-trigger='click'></div>") $rootScope
      $rootScope.$digest()
      # show
      tip.triggerHandler "click"
      expect(queryTooltip()).not.toBe null

      # hide
      tip.triggerHandler "click"
      $timeout.flush()

      expect(queryTooltip()).toBe null

    it "should throw an error with invalid trigger", ->
      compile = ->
        tip = $compile("<div mac-tooltip='test' mac-tooltip-trigger='trigger'></div>") $rootScope
        $rootScope.$digest()
      expect(compile).toThrow()

  describe "Direction", ->

    it "should set direction to top as default", ->
      tip = $compile("<div mac-tooltip='test'></div>") $rootScope
      $rootScope.$digest()

      tip.triggerHandler "mouseenter"

      expect(queryTooltip().className.indexOf "top").not.toBe -1

    it "should set the direction to bottom", ->
      tip = $compile("<div mac-tooltip='test' mac-tooltip-direction='bottom'></div>") $rootScope
      $rootScope.$digest()

      tip.triggerHandler "mouseenter"

      expect(queryTooltip().className.indexOf "bottom").not.toBe -1

  describe "disabled", ->

    it "should not create a tooltip", ->
      tip = $compile("<div mac-tooltip='test' mac-tooltip-disabled='true'></div>") $rootScope
      $rootScope.$digest()

      tip.triggerHandler "mouseenter"
      expect(queryTooltip()).toBe null

    it "should create a tooltip", ->
      tip = $compile("<div mac-tooltip='test' mac-tooltip-disabled='false'></div>") $rootScope
      $rootScope.$digest()

      tip.triggerHandler "mouseenter"
      expect(queryTooltip()).not.toBe null

  describe "Inside", ->

    it "should append tooltip inside of trigger", ->
      tip = $compile("<div mac-tooltip='test' mac-tooltip-inside></div>") $rootScope
      $rootScope.$digest()

      tip.triggerHandler "mouseenter"

      expect(tip[0].querySelector(".mac-tooltip")).not.toBe null

    it "should not append tooltip inside of trigger", ->
      tip = $compile("<div mac-tooltip='test'></div>") $rootScope
      $rootScope.$digest()

      tip.triggerHandler "mouseenter"

      expect(tip[0].querySelector(".mac-tooltip")).toBe null
