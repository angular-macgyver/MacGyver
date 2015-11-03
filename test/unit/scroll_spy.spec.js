describe("Mac scroll spy", function() {
  var $compile, $rootScope, scrollspy;
  beforeEach(module("Mac"));

  beforeEach(inject(function(_$rootScope_, _$compile_, _scrollSpy_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    scrollspy = _scrollSpy_;
  }));

  describe("scrollspy service", function() {
    it("should register an anchor", function() {
      var element = angular.element("<div></div>"), anchor;
      angular.element(document.body).append(element);
      anchor = scrollspy.register("test", element);

      expect(scrollspy.registered.length).toBe(1);
      expect(anchor).toBeDefined();
    });

    it("should unregister an anchor", function() {
      var element = angular.element("<div></div>");
      angular.element(document.body).append(element);
      scrollspy.register("test", element);
      scrollspy.unregister("test");

      expect(scrollspy.registered.length).toBe(0);
    });

    it("should sort correctly based on top", function () {
      scrollspy.registered.push({id: 'test1', top: 200});
      scrollspy.registered.push({id: 'test1', top: 300});
      scrollspy.registered.push({id: 'test1', top: 100});
      scrollspy.registered.push({id: 'test1', top: 400});

      scrollspy.sort();

      expect(scrollspy.registered[0].top).toBe(100);
      expect(scrollspy.registered[1].top).toBe(200);
      expect(scrollspy.registered[2].top).toBe(300);
      expect(scrollspy.registered[3].top).toBe(400);
    });

    it("should add listener", function() {
      var callback = angular.noop;

      scrollspy.addListener(callback);
      expect(scrollspy.listeners.length).toBe(1);
    });

    it("should remove listener", function() {
      var callback = angular.noop;

      scrollspy.addListener(callback);
      scrollspy.removeListener(callback);

      expect(scrollspy.listeners.length).toBe(0);
    });

    it("should not update when active is the same element", function() {
      var callback = jasmine.createSpy("listener");
      scrollspy.active = {
        id: 'current'
      };

      scrollspy.addListener(callback);
      scrollspy.setActive({
        id: 'current'
      });

      expect(callback).not.toHaveBeenCalled();
    });

    it("should update active and fire listener", function() {
      var callback = jasmine.createSpy("listener");
      scrollspy.active = {
        id: 'previous'
      };

      scrollspy.addListener(callback);
      scrollspy.setActive({});

      expect(callback).toHaveBeenCalled();
    });
  });

  describe("initializing container", function () {
    var container;

    beforeEach(function () {
      container = angular.element('<div mac-scroll-spy />');
    });

    afterEach(function () {
      container.remove();
    });

    it('should not call setActive when there is nothing registered', function () {
      spyOn(scrollspy, 'setActive');
      spyOn(scrollspy, 'last');

      $compile(container)($rootScope);
      $rootScope.$digest();

      container.triggerHandler('scroll');

      expect(scrollspy.setActive).not.toHaveBeenCalled();
    });

    it('should call setActive with last anchor', function () {
      scrollspy.registered[0] = {};

      spyOn(scrollspy, 'setActive');
      spyOn(scrollspy, 'last');

      $compile(container)($rootScope);
      $rootScope.$digest();

      container.triggerHandler('scroll');

      expect(scrollspy.setActive).toHaveBeenCalled();
      expect(scrollspy.last).toHaveBeenCalled();
    });

    it('should set the anchor active', function () {
      spyOn(scrollspy, 'setActive');

      container[0].setAttribute('style', 'height: 200px; padding-bottom: 500px;');
      angular.element(document.body).append(container);

      var anchor = {top: 0};
      scrollspy.registered[0] = anchor;

      $compile(container)($rootScope);
      $rootScope.$digest();

      container.triggerHandler('scroll');

      expect(scrollspy.setActive).toHaveBeenCalled();
      expect(scrollspy.setActive.calls.argsFor(0)[0]).toBe(anchor);
    });
  });

  describe("initializing an anchor", function() {
    it("should register with the service", function() {
      var element = angular.element("<div mac-scroll-spy-anchor id='test-anchor'></div>");
      angular.element(document.body).append(element);
      $compile(element)($rootScope);
      $rootScope.$digest();

      expect(scrollspy.registered.length).toBe(1);
      expect(scrollspy.registered[0].id).toBe("test-anchor");
    });

    it("should register with the service with an interpolated id in mac-scroll-spy-anchor attr", function() {
      var element;
      $rootScope.name = 'test-anchor2';
      element = angular.element("<div mac-scroll-spy-anchor='{{name}}'></div>");
      angular.element(document.body).append(element);
      $compile(element)($rootScope);
      $rootScope.$digest();

      expect(scrollspy.registered.length).toBe(1);
      expect(scrollspy.registered[0].id).toBe("test-anchor2");
    });

    it("should register with the service with an interpolated id", function() {
      var element;
      $rootScope.name = 'test-anchor4';
      element = angular.element("<div id='{{name}}' mac-scroll-spy-anchor='mac-scroll-spy-anchor'></div>");
      angular.element(document.body).append(element);
      $compile(element)($rootScope);
      $rootScope.$digest();

      expect(scrollspy.registered.length).toBe(1);
      expect(scrollspy.registered[0].id).toBe("test-anchor4");
    });

    it("should throw an error when id is not provided", function() {
      var create = function() {
        $compile("<div mac-scroll-spy-anchor></div>")($rootScope);
      };
      expect(create).toThrow();
    });

    it("should update anchor on refresh-scroll-spy event", function() {
      var element, origTop;
      element = angular.element("<div mac-scroll-spy-anchor id='test'></div>");
      angular.element(document.body).append(element);
      $compile(element)($rootScope);

      origTop = element.offset().top;
      element.css("margin-top", "200px");

      $rootScope.$broadcast("refresh-scroll-spy");
      $rootScope.$digest();

      expect(origTop).not.toBe(scrollspy.registered[0].top);
    });

    it("should unregister when scope gets destroy", function() {
      var element = angular.element("<div mac-scroll-spy-anchor id='test'></div>");
      angular.element(document.body).append(element);
      $compile(element)($rootScope);
      $rootScope.$digest();

      $rootScope.$destroy();
      expect(scrollspy.registered.length).toBe(0);
    });
  });

  describe("scroll spy target", function() {
    it("should throw an error when name is not provided", function() {
      var create = function() {
        $compile("<div mac-scroll-spy-target></div>")($rootScope);
      };
      expect(create).toThrow();
    });

    it("should add a listener with interpolated name", function() {
      $rootScope.name = "test";
      $compile("<div mac-scroll-spy-target='{{name}}'></div>")($rootScope);
      $rootScope.$digest();

      expect(scrollspy.listeners.length).toBe(1);
    });

    it("should add a listener", function() {
      var element = $compile("<div mac-scroll-spy-target='test'></div>")($rootScope);
      $rootScope.$digest();

      expect(scrollspy.listeners.length).toBe(1);
    });

    it("should add 'active' class", function() {
      var element = $compile("<div mac-scroll-spy-target='test'></div>")($rootScope);
      $rootScope.$digest();

      $rootScope.$apply(function() {
        scrollspy.setActive({
          id: "test",
          element: angular.element("<div></div>"),
          top: 123
        });
      });

      expect(element.hasClass("active")).toBeTruthy();
    });

    it("should add custom set class", function() {
      var element = $compile("<div mac-scroll-spy-target='test' mac-scroll-spy-target-class='class2'></div>")($rootScope);
      $rootScope.$digest();

      $rootScope.$apply(function() {
        scrollspy.setActive({
          id: "test",
          element: angular.element("<div></div>"),
          top: 123
        });
      });

      expect(element.hasClass("class2")).toBeTruthy();
    });

    it("should remove listener when scope is destroyed", function() {
      var element = $compile("<div mac-scroll-spy-target='test'></div>")($rootScope);
      $rootScope.$digest();

      $rootScope.$destroy();
      expect(scrollspy.listeners.length).toBe(0);
    });
  });
});
