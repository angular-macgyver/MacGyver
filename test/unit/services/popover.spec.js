describe("Popover service", function() {
  var $animate, $rootScope, $timeout, popover;
  beforeEach(module("Mac"));
  beforeEach(module("ngAnimateMock"));

  beforeEach(inject(function(_$animate_, _$rootScope_, _$timeout_, _popover_) {
    $animate = _$animate_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    popover = _popover_;
  }));

  it("should register a popover", function() {
    var result = popover.register("test", {});
    expect(result).toBe(true);
    expect(popover.registered.test).toBeDefined();

    result = popover.register("test", {});
    expect(result).toBe(false);
  });

  it("should unregister a popover", function() {
    popover.register("test", {});
    var result = popover.unregister("test");
    expect(result).toBe(true)
    expect(popover.registered.test).not.toBeDefined();

    result = popover.unregister("test");
    expect(result).toBe(false);
  });

  it("should add popover to opened list", function() {
    popover.add("testover", angular.element("<div></div>"), angular.element("<div class='relative'></div>"), {});
    expect(popover.popoverList.length).toBe(1);

    var item = popover.popoverList[0];
    expect(item.id).toBe('testover');
    expect(item.popover).toBeDefined();
    expect(item.element).toBeDefined();
    expect(item.options).toBeDefined();
  });

  it("should get the last popover", function() {
    var popoverObj;
    popover.add("testover", angular.element("<div></div>"), angular.element("<div class='relative'></div>"), {}, {});
    popoverObj = popover.last();

    expect(popoverObj.id).toBe("testover");
  });

  it("should return null if there are no popovers", function() {
    var popoverObj = popover.last();
    expect(popoverObj).toBe(null);
  });

  it("should return and remove the last popover form the list", function() {
    var popoverObj;
    popover.add("testover", angular.element("<div></div>"), angular.element("<div class='relative'></div>"), {}, {});
    popoverObj = popover.pop();

    expect(popoverObj.id).toBe("testover");
    expect(popover.popoverList.length).toBe(0);
  });

  it("should get the correct popover", function() {
    var relative = angular.element("<div class='relative'></div>");
    popover.add("testover", angular.element("<div></div>"), relative, {}, {});
    popover.add("testing-over", angular.element("<div></div>"), angular.element("<div class='relative'></div>"), {}, {});

    expect(popover.getById("testover", relative).id).toBe("testover");
  });

  it("should return null if no popover is found", function() {
    var relative = angular.element("<div class='relative'></div>");
    expect(popover.getById("testover", relative)).toBe(null);
  });

  it("should return false when id is not registered on show", function() {
    var result = jasmine.createSpy('result');
    popover.show("does-not-exist", angular.element("<div />")).then(null, result);
    $rootScope.$apply();
    expect(result).toHaveBeenCalledWith(false);
  });

  describe('_compilePopover', function () {
    var callback;

    beforeEach(function () {
      callback = jasmine.createSpy('callback');
    });

    it("should create a new scope", function() {
      var popoverObj, scope;
      popover._compilePopover('test', "<div>Test</div>", {}).then(callback);

      $rootScope.$apply();
      popoverObj = callback.calls.argsFor(0)[0];

      scope = popoverObj.scope();
      expect($rootScope.$id).not.toBe(scope.$id);
    });

    it("should create a scope with additional data", function() {
      var popoverObj, scope;
      popover._compilePopover('test', "<div>Test</div>", {
        scope: {
          hello: 'world'
        }
      }).then(callback);

      $rootScope.$apply();
      popoverObj = callback.calls.argsFor(0)[0];

      scope = popoverObj.scope();

      expect(scope.macPopoverClasses).toBeDefined();
      expect(scope.macPopoverTitle).toBe("");
      expect(scope.macPopoverTemplate).toBe("<div>Test</div>");
      expect(scope.hello).toBe('world');
    });

    it('should use the scope passed in', function () {
      var popoverObj, expectedScope = $rootScope.$new(), scope;
      popover._compilePopover('test', "<div>Test</div>", {
        scope: expectedScope
      }).then(callback);

      $rootScope.$apply();
      popoverObj = callback.calls.argsFor(0)[0];

      scope = popoverObj.scope();
      expect(scope.$parent).toBe(expectedScope)
    });

    it('should reposition popover based on defined event', function () {
      var popoverObj, scope;
      popover._compilePopover('test', "<div>Test</div>", {
        refreshOn: 'some-event'
      }).then(callback);

      spyOn(popover, 'reposition');

      $rootScope.$apply();
      $rootScope.$broadcast('some-event');
      $rootScope.$digest();

      expect(popover.reposition).toHaveBeenCalledWith('test');
    });

    it('should add controller', function () {
      var popoverObj, scope;
      popover._compilePopover('test', "<div>Test</div>", {
        controller: function popoverController ($scope) {
          $scope.test = 'hi';
        }
      }).then(callback);

      $rootScope.$apply();
      popoverObj = callback.calls.argsFor(0)[0];
      scope = popoverObj.scope();

      expect(scope.test).toBe('hi');
    });

    it('should extend scope with additional options', function () {
      var popoverObj, scope;
      popover._compilePopover('test', "<div>Test</div>", {
        footer: true,
        header: true,
        title: 'test title'
      }).then(callback);

      $rootScope.$apply();
      popoverObj = callback.calls.argsFor(0)[0];
      scope = popoverObj.scope();

      expect(scope.macPopoverClasses.footer).toBe(true);
      expect(scope.macPopoverClasses.header).toBe(true);
      expect(scope.macPopoverTitle).toBe('test title');
      expect(scope.macPopoverTemplate).toBe('<div>Test</div>');
    });

    it('should set attributes on popover element', function () {
      var popoverObj;
      popover._compilePopover('test', "<div>Test</div>", {
        direction: 'above left'
      }).then(callback);

      $rootScope.$apply();
      popoverObj = callback.calls.argsFor(0)[0];

      expect(popoverObj.attr('id')).toBe('test');
      expect(popoverObj.attr('direction')).toBe('above left');
    });
  });

  describe('_getTemplate', function () {
    var callback, $templateCache;

    beforeEach(inject(function (_$templateCache_) {
      callback = jasmine.createSpy('_getTemplate callback');

      $templateCache = _$templateCache_
    }));

    it('should use template in options', function () {
      popover._getTemplate({
        template: '<div>Testing</div>'
      }).then(callback);

      $rootScope.$apply();

      expect(callback).toHaveBeenCalledWith('<div>Testing</div>');
    });

    it('should get from cache', function () {
      $templateCache.put('/test', '<div>Testing URL</div>')

      popover._getTemplate({
        templateUrl: '/test'
      }).then(callback);

      $rootScope.$apply();

      expect(callback).toHaveBeenCalledWith('<div>Testing URL</div>');
    });

    it('should get from $http get request', inject(function ($httpBackend) {
      $httpBackend.expectGET('/test').respond('<div>Test $http</div>');

      popover._getTemplate({
        templateUrl: '/test'
      }).then(callback);

      $httpBackend.flush();
      $rootScope.$apply();

      expect($templateCache.get('/test')).toBe('<div>Test $http</div>');
      expect(callback).toHaveBeenCalledWith('<div>Test $http</div>');
    }));

    it('should reject when no template option is passed', function () {
      popover._getTemplate({}).then(null, callback);
      $rootScope.$apply();
      expect(callback).toHaveBeenCalled();
    });

    it('should reject when given bad template url', inject(function ($httpBackend) {
      $httpBackend.expectGET('/test.html').respond(404, '');

      popover._getTemplate({
        templateUrl: '/test.html'
      }).then(angular.noop, callback);

      $httpBackend.flush();
      $rootScope.$apply();

      expect(callback).toHaveBeenCalled();
      expect(callback.calls.argsFor(0)[0]).toBe('Failed to load template: /test.html')
    }));
  });

  it('should reject when opening unregistered popover`', function () {
    var callback = jasmine.createSpy('show reject')

    popover.show('test-DNE').then(null, callback);
    $rootScope.$apply();

    expect(callback).toHaveBeenCalledWith(false);
  });

  describe("show popover", function() {
    var callback, trigger;

    beforeEach(function() {
      trigger = angular.element("<a>Click me</a>");
      angular.element(document.body).append(trigger);

      popover.register("test", {
        template: "<div>Test</div>",
        direction: "above right"
      });
      callback = jasmine.createSpy("event");
      $rootScope.$on("popoverWasShown", callback);

      popover.show("test", trigger, {
        scope: $rootScope
      });
      $rootScope.$digest();

      $animate.triggerCallbacks();
      $rootScope.$digest();
    });

    afterEach(function() {
      trigger = null;
    });

    it("should show and add popover to list", function() {
      expect(popover.popoverList.length).toBe(1);
    });

    it("should add active class to trigger", function() {
      expect(trigger.hasClass("active")).toBeTruthy();
    });

    it("should broadcast popoverWasShown", function() {
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('getById', function () {
    var test1El = angular.element('<div />');
    var test2El = angular.element('<div />');

    var popover1 = {id: 'test1', element: test1El};
    var popover2 = {id: 'test2', element: test2El};

    beforeEach(function () {
      popover.popoverList = [popover1, popover2];
    });

    it('should get the first popover', function () {
      var found = popover.getById('test1');

      expect(found).toBe(popover1);
    });

    it('should get the second popover using id and element', function () {
      var found = popover.getById('test2', test2El);

      expect(found).toBe(popover2);
    });

    it('should not get anything', function () {
      var found = popover.getById('test3');
      expect(found).toBe(null);

      var found1 = popover.getById('test', test1El);
      expect(found1).toBe(null);
    });
  });

  describe('reposition', function () {
    var popoverObj

    beforeEach(function () {
      popoverObj = {
        id: 'test-reposition',
        popover: angular.element('<div>popover</div>'),
        element: angular.element('<div>trigger</div>'),
        options: {}
      };

      angular.element(document).append(popoverObj.popover);
      angular.element(document).append(popoverObj.element);
    });

    afterEach(function () {
      popoverObj.popover.remove();
      popoverObj.element.remove();
    });

    it('should reject when there is no popoverObj', function () {
      var callback = jasmine.createSpy('reposition reject');

      popover.reposition().then(null, callback);
      $rootScope.$apply();

      expect(callback).toHaveBeenCalled();
    });

    it("should switch to below with a visible class", function() {
      popoverObj.popover.attr('direction', 'above left');
      popover.reposition(popoverObj);

      $rootScope.$apply();
      var popoverEl = popoverObj.popover;

      expect(popoverEl.hasClass("visible")).toBe(true);
      expect(popoverEl.hasClass("below")).toBe(true);
      expect(popoverEl.hasClass("left")).toBe(true);
    });

    it("should have a visible class for middle left", function() {
      popoverObj.popover.attr('direction', 'middle left');
      popover.reposition(popoverObj);

      $rootScope.$apply();
      var popoverEl = popoverObj.popover;

      expect(popoverEl.hasClass("visible")).toBe(true);
      expect(popoverEl.hasClass("middle")).toBe(true);
      expect(popoverEl.hasClass("left")).toBe(true);
    });

    it("should get the object and add a visible class", function() {
      spyOn(popover, 'getById').and.returnValue(popoverObj);
      popover.reposition('test-reposition');

      $rootScope.$apply();
      var popoverEl = popoverObj.popover;

      expect(popoverEl.hasClass("visible")).toBe(true);
    });

    it("should set left and top offset with 'px'", function() {
      var style, popoverEl;

      popover.reposition(popoverObj);

      $rootScope.$apply();
      popoverEl = popoverObj.popover;
      style = popoverEl[0].style;

      expect(style.top.match(/[\d]px/)).toBeDefined();
      expect(style.left.match(/[\d]px/)).toBeDefined();
    });

    // TODO(adrian): Add additional tests for calculating offset

  });

  describe('calculateOffset', function () {
    var current = {height: 100, width: 200};
    var relative = {height: 300, width: 400};

    var testcases = [
      {position: 'above left', expected: {top: -110, left: 175}},
      {position: 'above right', expected: {top: -110, left: 25}},
      {position: 'below left', expected: {top: 310, left: 175}},
      {position: 'below right', expected: {top: 310, left: 25}},
      {position: 'middle left', expected: {top: 100, left: -210}},
      {position: 'middle right', expected: {top: 100, left: 410}}
    ];

    testcases.forEach(function (testcase) {
      it('should calculate offset correctly for ' + testcase.position, function () {
        var calculated = popover.calculateOffset(testcase.position, current, relative);
        expect(calculated).toEqual(testcase.expected);
      });
    });
  });

  describe("hide popover", function() {
    var callback, destroy, trigger;
    destroy = jasmine.createSpy("destroy");

    beforeEach(function() {
      trigger = angular.element("<a>Click me</a>");
      angular.element(document.body).append(trigger);

      popover.register("test", {
        template: "<div>Test</div>",
        direction: "above right"
      });
      callback = jasmine.createSpy("event");

      $rootScope.$on("popoverBeforeHide", callback);
      $rootScope.$on("$destroy", destroy);

      popover.show("test", trigger, {
        scope: $rootScope
      });
      $rootScope.$digest();

      $animate.triggerCallbacks();
    });

    it("should not close any popover with incorrect selector", function() {
      popover.hide("test2");
      expect(popover.popoverList.length).toBe(1);
    });

    it("should close the popover using id", function() {
      popover.hide("test");
      expect(popover.popoverList.length).toBe(0);
    });

    it("should close the popover with trigger element", function() {
      popover.hide(trigger);
      expect(popover.popoverList.length).toBe(0);
    });

    it("should broadcast popverBeforeHide", function() {
      popover.hide("test");
      expect(callback).toHaveBeenCalled();
    });

    it("should invoke callback", function() {
      var callbackFn = jasmine.createSpy("callback");
      popover.hide("test").then(callbackFn);

      $rootScope.$apply();
      $animate.triggerCallbacks();

      expect(callbackFn).toHaveBeenCalled();
    });

    it("should broadcast popoverWasHidden", function() {
      var broadcastFn = jasmine.createSpy("popoverWasHidden");
      $rootScope.$on("popoverWasHidden", broadcastFn);

      popover.hide("test");
      $rootScope.$digest();

      $animate.triggerCallbacks();
      expect(broadcastFn).toHaveBeenCalled();
    });

    it("should remove active class on trigger", function() {
      popover.hide("test");
      $rootScope.$digest();
      $animate.triggerCallbacks();
      expect(trigger.hasClass("active")).toBe(false);
    });

    it("should not destroy original scope", function() {
      popover.hide("test");
      $rootScope.$digest();
      $animate.triggerCallbacks();
      expect(destroy).not.toHaveBeenCalled();
    });

    it("should destroy popover scope", function() {
      var destroyed, popoverObj, scope;
      popoverObj = popover.popoverList[0];
      scope = popoverObj.popover.scope();
      destroyed = jasmine.createSpy("destroy");
      scope.$on("$destroy", destroyed);
      popover.hide("test");

      $rootScope.$digest();

      $animate.triggerCallbacks();
      expect(destroyed).toHaveBeenCalled();
    });
  });

  describe('hideAll', function () {
    it('should hide all popovers in popoverList', function () {
        spyOn(popover, 'hide').and.callThrough();

        popover.popoverList.length = 10;

        popover.hideAll();

        expect(popover.hide.calls.count()).toBe(10);
    });
  });
});
