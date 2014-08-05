describe "Popover", ->
  $animate     = null
  $rootScope   = null
  $timeout     = null
  popover      = null
  popoverViews = null

  beforeEach module("Mac")
  beforeEach module("ngAnimateMock")

  beforeEach inject (
    _$animate_
    _$rootScope_
    _$timeout_
    _popover_
    _popoverViews_
  ) ->
    $animate     = _$animate_
    $rootScope   = _$rootScope_
    $timeout     = _$timeout_
    popover      = _popover_
    popoverViews = _popoverViews_

  describe "popover service", ->
    it "should register a popover", ->
      popover.register "test", {}
      expect(popover.registered["test"]).toBeDefined()

    it "should unregister a popover", ->
      popover.register "test", {}
      popover.unregister "test"
      expect(popover.registered["test"]).not.toBeDefined()

    it "should add popover to opened list", ->
      popover.add "testover",
        angular.element("<div></div>"),
        angular.element("<div class='relative'></div>"),
        {}, {}
      expect(popover.popoverList.length).toBe 1

    it "should get the last popover", ->
      popover.add "testover",
        angular.element("<div></div>"),
        angular.element("<div class='relative'></div>"),
        {}, {}

      popoverObj = popover.last()

      expect(popoverObj.id).toBe "testover"

    it "should return and remove the last popover form the list", ->
      popover.add "testover",
        angular.element("<div></div>"),
        angular.element("<div class='relative'></div>"),
        {}, {}

      popoverObj = popover.pop()

      expect(popoverObj.id).toBe "testover"
      expect(popover.popoverList.length).toBe 0

    it "should get the correct popover", ->
      relative = angular.element("<div class='relative'></div>")

      popover.add "testover",
        angular.element("<div></div>"), relative, {}, {}

      popover.add "testing-over",
        angular.element("<div></div>"),
        angular.element("<div class='relative'></div>"),
        {}, {}

      expect(popover.getById("testover", relative).id).toBe "testover"

    it "should return false when id is not registered on show", ->
      result = popover.show "does-not-exist", $("<div />")
      expect(result).toBeFalsy()

    describe "show popover", ->
      trigger  = $("<a>Click me</a>")
      callback = null

      beforeEach ->
        popover.register "test",
          template:  "<div>Test</div>"
          direction: "above right"

        callback = jasmine.createSpy("event")
        $rootScope.$on "popoverWasShown", callback

        popover.show "test", trigger, {scope: $rootScope}
        $rootScope.$digest()

      it "should show and add popover to list", ->
        expect(popover.popoverList.length).toBe 1

      it "should create a scope with additional data", ->
        popoverObj = popover.popoverList[0]
        scope      = popoverObj.popover.scope()

        expect(scope.macPopoverClasses).toBeDefined()
        expect(scope.macPopoverTitle).toBe ""
        expect(scope.macPopoverTemplate).toBe "<div>Test</div>"

      it "should set id and direction on popover element", ->
        popoverObj = popover.popoverList[0]
        popover    = popoverObj.popover

        expect(popover.attr("id")).toBe "test"
        expect(popover.attr("direction")).toBe "above right"

      it "should add active class to trigger", ->
        expect(trigger.hasClass("active")).toBeTruthy()

      it "should broadcast popoverWasShown", ->
        expect(callback).toHaveBeenCalled()

      it "should have a visible class", ->
        popoverObj = popover.popoverList[0]
        popover    = popoverObj.popover

        $animate.triggerCallbacks()

        expect(popover.hasClass("visible")).toBeTruthy()

      it "should set left and top offset with 'px'", ->
        popoverObj = popover.popoverList[0]
        popover    = popoverObj.popover

        $animate.triggerCallbacks()

        style = popover.attr 'style'
        expect(style.match /top: [\d]px/).toBeDefined()
        expect(style.match /left: [\d]px/).toBeDefined()

    describe "hide popover", ->
      trigger  = $("<a>Click me</a>")
      callback = null
      destroy  = jasmine.createSpy("destroy")

      beforeEach ->
        popover.register "test",
          template:  "<div>Test</div>"
          direction: "above right"

        callback = jasmine.createSpy("event")
        $rootScope.$on "popoverBeforeHide", callback
        $rootScope.$on "$destroy", destroy

        popover.show "test", trigger, {scope: $rootScope}

        $animate.triggerCallbacks()

        $animate.queue = []

      it "should not close any popover with incorrect selector", ->
        popover.hide "test2"

        expect(popover.popoverList.length).toBe 1

      it "should close the popover using id", ->
        popover.hide "test"
        expect(popover.popoverList.length).toBe 0

      it "should close the popover with trigger element", ->
        popover.hide trigger
        expect(popover.popoverList.length).toBe 0

      it "should broadcast popverBeforeHide", ->
        popover.hide "test"
        expect(callback).toHaveBeenCalled()

      it "should invoke callback", ->
        callbackFn = jasmine.createSpy("callback")
        popover.hide "test", callbackFn

        # HACK: To invoke the leave callback
        $animate.queue[0].args[1]()

        expect(callbackFn).toHaveBeenCalled()

      it "should broadcast popoverWasHidden", ->
        broadcastFn = jasmine.createSpy("popoverWasHidden")
        $rootScope.$on "popoverWasHidden", broadcastFn

        popover.hide "test"

        # HACK: To invoke the leave callback
        $animate.queue[0].args[1]()

        expect(broadcastFn).toHaveBeenCalled()

      it "should remove active class on trigger", ->
        popover.hide "test"

        # HACK: To invoke the leave callback
        $animate.queue[0].args[1]()

        expect(trigger.hasClass("active")).toBeFalsy()

      it "should not destroy scope", ->
        popover.hide "test"
        $rootScope.$digest()

        expect(destroy).not.toHaveBeenCalled()

  describe "popover directive", ->
    $compile = null
    element  = null

    beforeEach inject (_$compile_) ->
      $compile = _$compile_

      template = "<div><mac-popover id='testPopover'>Test</mac-popover></div>"
      element  = $compile(template) $rootScope

      $rootScope.$digest()

    it "should throw an error when id is missing", ->
      toCompile = ->
        $compile("<mac-popover></mac-popover>") $rootScope

      expect(toCompile).toThrow Error 'macPopover: Missing id'

    it "should register the popover", ->
      expect(popover.registered["testPopover"]).toBeDefined()

    it "should store the correct template", ->
      popoverObj = popover.registered["testPopover"]
      expect(popoverObj.template).toBe "Test"

    it "should be replaced with a comment", ->
      expect(element.contents()[0].nodeType).toBe 8

    it "should interpolate id before registering", ->
      $rootScope.someId = '12345'

      template = "<div><mac-popover id='testPopover{{someId}}'>Test</mac-popover></div>"
      element  = $compile(template) $rootScope

      $rootScope.$digest()

      expect(popover.registered["testPopover12345"]).toBeDefined()
