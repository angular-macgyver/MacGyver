describe "Mac scroll spy", ->
  $rootScope = null
  $compile   = null
  scrollspy  = null

  beforeEach module("Mac")
  beforeEach inject (_$rootScope_, _$compile_, _scrollSpy_) ->
    $rootScope = _$rootScope_
    $compile   = _$compile_
    scrollspy  = _scrollSpy_

  describe "scrollspy service", ->
    it "should register an anchor", ->
      element = angular.element("<div></div>")
      angular.element("body").append element
      scrollspy.register "test", element

      expect(scrollspy.registered.length).toBe 1

    it "should unregister an anchor", ->
      element = angular.element("<div></div>")
      angular.element("body").append element
      scrollspy.register "test", element
      scrollspy.unregister "test"

      expect(scrollspy.registered.length).toBe 0

    it "should add listener", ->
      callback = angular.noop

      scrollspy.addListener callback
      expect(scrollspy.listeners.length).toBe 1

    it "should remove listener", ->
      callback = angular.noop

      scrollspy.addListener callback
      scrollspy.removeListener callback
      expect(scrollspy.listeners.length).toBe 0

    it "should update active and fire listener", ->
      callback = jasmine.createSpy "listener"

      scrollspy.addListener callback
      scrollspy.setActive {}

      expect(callback).toHaveBeenCalled()

  describe "initializing an anchor", ->
    it "should register with the service", ->
      element = angular.element "<div mac-scroll-spy-anchor id='test-anchor'></div>"
      angular.element("body").append element
      $compile(element) $rootScope
      $rootScope.$digest()

      expect(scrollspy.registered.length).toBe 1
      expect(scrollspy.registered[0].id).toBe "test-anchor"

  describe "scroll spy target", ->
    it "should add a listener", ->
      element = $compile("<div mac-scroll-spy-target='test'></div>") $rootScope
      $rootScope.$digest()

      expect(scrollspy.listeners.length).toBe 1

    it "should add 'active' class", ->
      element = $compile("<div mac-scroll-spy-target='test'></div>") $rootScope
      $rootScope.$digest()

      $rootScope.$apply ->
        scrollspy.setActive {id: "test", element: angular.element("<div></div>"), top: 123}

      expect(element.hasClass "active").toBeTruthy()
