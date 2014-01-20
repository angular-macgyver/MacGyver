describe "Popover", ->
  $rootScope   = null
  $timeout     = null
  popover      = null
  popoverViews = null

  beforeEach module("Mac")

  beforeEach inject (_$rootScope_, _$timeout_, _popover_, _popoverViews_) ->
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
