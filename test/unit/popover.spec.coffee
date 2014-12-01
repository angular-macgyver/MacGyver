describe "Popover", ->
  $animate     = null
  $rootScope   = null
  $timeout     = null
  popover      = null

  beforeEach module("Mac")
  beforeEach module("ngAnimateMock")

  beforeEach inject (
    _$animate_
    _$rootScope_
    _$timeout_
    _popover_
  ) ->
    $animate     = _$animate_
    $rootScope   = _$rootScope_
    $timeout     = _$timeout_
    popover      = _popover_

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
      result = popover.show "does-not-exist", angular.element("<div />")
      expect(result).toBeFalsy()

    describe "show popover", ->
      trigger = null
      callback = null

      beforeEach ->
        trigger = angular.element("<a>Click me</a>")
        angular.element(document.body).append trigger

        popover.register "test",
          template:  "<div>Test</div>"
          direction: "above right"

        callback = jasmine.createSpy("event")
        $rootScope.$on "popoverWasShown", callback

        popover.show "test", trigger, {scope: $rootScope}

        $rootScope.$digest()
        $animate.triggerCallbacks()

        $rootScope.$digest()

      afterEach ->
        trigger = null

      it "should show and add popover to list", ->
        expect(popover.popoverList.length).toBe 1

      it "should create a new scope", ->
        popoverObj = popover.popoverList[0]
        scope      = popoverObj.popover.scope()

        expect($rootScope.$id).not.toBe scope.$id

      it "should create a scope with additional data", ->
        popoverObj = popover.popoverList[0]
        scope      = popoverObj.popover.scope()

        expect(scope.macPopoverClasses).toBeDefined()
        expect(scope.macPopoverTitle).toBe ""
        expect(scope.macPopoverTemplate).toBe "<div>Test</div>"

      it "should set id and direction on popover element", ->
        popoverObj = popover.popoverList[0]
        popoverEl    = popoverObj.popover

        expect(popoverEl.attr("id")).toBe "test"
        expect(popoverEl.attr("direction")).toBe "above right"

      it "should add active class to trigger", ->
        expect(trigger.hasClass("active")).toBeTruthy()

      it "should broadcast popoverWasShown", ->
        expect(callback).toHaveBeenCalled()

      it "should have a visible class", ->
        popoverObj = popover.popoverList[0]
        popover    = popoverObj.popover

        expect(popover.hasClass("visible")).toBe true

      it "should set left and top offset with 'px'", ->
        popoverObj = popover.popoverList[0]
        popover    = popoverObj.popover

        style = popover[0].style
        expect(style.top.match /[\d]px/).toBeDefined()
        expect(style.left.match /[\d]px/).toBeDefined()

    describe "hide popover", ->
      trigger  = null
      callback = null
      destroy  = jasmine.createSpy("destroy")

      beforeEach ->
        trigger = angular.element("<a>Click me</a>")
        angular.element(document.body).append trigger

        popover.register "test",
          template:  "<div>Test</div>"
          direction: "above right"

        callback = jasmine.createSpy("event")
        $rootScope.$on "popoverBeforeHide", callback
        $rootScope.$on "$destroy", destroy

        popover.show "test", trigger, {scope: $rootScope}

        $rootScope.$digest()
        $animate.triggerCallbacks()

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

        $rootScope.$digest()
        $animate.triggerCallbacks()

        expect(callbackFn).toHaveBeenCalled()

      it "should broadcast popoverWasHidden", ->
        broadcastFn = jasmine.createSpy("popoverWasHidden")
        $rootScope.$on "popoverWasHidden", broadcastFn

        popover.hide "test"

        $rootScope.$digest()
        $animate.triggerCallbacks()

        expect(broadcastFn).toHaveBeenCalled()

      it "should remove active class on trigger", ->
        popover.hide "test"

        $rootScope.$digest()
        $animate.triggerCallbacks()

        expect(trigger.hasClass("active")).toBe false

      it "should not destroy original scope", ->
        popover.hide "test"

        $rootScope.$digest()
        $animate.triggerCallbacks()

        expect(destroy).not.toHaveBeenCalled()

      it "should destroy popover scope", ->
        popoverObj = popover.popoverList[0]
        scope      = popoverObj.popover.scope()

        destroyed = jasmine.createSpy "destroy"
        scope.$on "$destroy", destroyed

        popover.hide "test"

        $rootScope.$digest()
        $animate.triggerCallbacks()

        expect(destroyed).toHaveBeenCalled()

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
