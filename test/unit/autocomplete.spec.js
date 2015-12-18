describe("Mac autocomplete", function() {
  var $compile, $rootScope, $sniffer, $timeout, changeInputValue, data, getMenuText, keys, $q, $animate, $httpBackend;
  data = {};

  getMenuText = function() {
    var item = document.querySelector(".mac-menu-item");
    return item.innerText || item.textContent;
  };

  beforeEach(module("Mac"));
  beforeEach(module("template/autocomplete.html"));
  beforeEach(module("template/menu.html"));

  describe('MacAutocompleteController', function () {
    var ctrl, scope, element, $timeout;

    beforeEach(inject(function($rootScope, $controller, _$timeout_, _$q_, _$animate_, _$httpBackend_) {
      element = angular.element("<input type='text' />");
      scope = $rootScope;
      $timeout = _$timeout_;
      $q = _$q_;
      $animate = _$animate_;
      $httpBackend = _$httpBackend_;

      ctrl = $controller('MacAutocompleteController', {
        $scope: scope,
        $element: element,
        $attrs: {
          macAutocompleteLabel: 'testLabel'
        },
        $timeout: $timeout
      });
    }));

    afterEach(function() {
      element.off().removeData();
    });

    it('should initialize corectly', function () {
      expect(ctrl.$scope).toBe(scope);
      expect(ctrl.$element).toBe(element);

      expect(ctrl.preventParser).toBe(false);
      expect(ctrl.isMenuAppended).toBe(false);
      expect(ctrl.inside).toBe(false);
      expect(ctrl.previousPromise).toBe(null);
      expect(ctrl.$menuScope).toBe(null);
      expect(ctrl.menuEl).toBe(null);
    });

    it('should initialize the menu correctly', function () {
      ctrl.class = 'test-class';
      var ngModelCtrl = jasmine.createSpy('ngModelCtrl');

      var transcludeWrapper = {
        transcludeFn: function (scope, fn) {
          fn(angular.element("<div>testing-clone</div>"));
        }
      }

      spyOn(transcludeWrapper, 'transcludeFn').and.callThrough();

      ctrl.initializeMenu(ngModelCtrl, transcludeWrapper.transcludeFn);

      var menuScope = ctrl.$menuScope;
      expect(menuScope).toBeDefined();
      expect(menuScope.items.length).toBe(0);
      expect(menuScope.index).toBe(0);
      expect(menuScope.class).toBe('test-class');
      expect(menuScope.$macAutocompleteCtrl).toBe(ctrl);
      expect(menuScope.select).toBeDefined();

      expect(ctrl.menuEl).toBeDefined();
      expect(transcludeWrapper.transcludeFn).toHaveBeenCalled();
    });

    describe('parser', function () {
      beforeEach(function () {
        spyOn(ctrl, 'queryData');
        spyOn(ctrl, 'reset');
      });

      it('should return value with no sideeffect', function () {
        var output = ctrl.parser('');
        expect(output).toBe('');
        expect(ctrl.timeoutPromise).toBe(null);
        expect(ctrl.queryData).not.toHaveBeenCalled();
        expect(ctrl.reset).toHaveBeenCalled();
      });

      it('should return value with no sideeffect with preventParser is true', function() {
        ctrl.preventParser = true;

        var output = ctrl.parser('');
        expect(output).toBe('');
        expect(ctrl.timeoutPromise).toBe(null);
        expect(ctrl.queryData).not.toHaveBeenCalled();
        expect(ctrl.reset).toHaveBeenCalled();
        expect(ctrl.preventParser).toBe(false);
      });

      it('should return value with no sideeffect with disabled is true', function() {
        ctrl.disabled = true;

        var output = ctrl.parser('');
        expect(output).toBe('');
        expect(ctrl.timeoutPromise).toBe(null);
        expect(ctrl.queryData).not.toHaveBeenCalled();
        expect(ctrl.reset).toHaveBeenCalled();
      });

      it('should return value and queryData', function() {
        var output = ctrl.parser('abc');

        $timeout.flush();

        expect(output).toBe('abc');
        expect(ctrl.timeoutPromise).toBeDefined();
        expect(ctrl.queryData).toHaveBeenCalled();
        expect(ctrl.reset).not.toHaveBeenCalled();
      });

      it('should return value and queryData with no delay', function() {
        ctrl.delay = '0';
        var output = ctrl.parser('abc');

        expect(output).toBe('abc');
        expect(ctrl.timeoutPromise).toBeDefined();
        expect(ctrl.queryData).toHaveBeenCalled();
        expect(ctrl.reset).not.toHaveBeenCalled();
      });
    });

    describe('updateItem', function() {
      beforeEach(function () {
        spyOn(ctrl, 'appendMenu').and.returnValue($q.when());
        spyOn(ctrl, 'positionMenu');
        ctrl.$menuScope = {};
      });

      it('should reset when empty array is passed in', function () {
        spyOn(ctrl, 'reset');
        ctrl.updateItem([]);

        expect(ctrl.reset).toHaveBeenCalled();
        expect(ctrl.appendMenu).not.toHaveBeenCalled();

        expect(ctrl.currentAutocompleteData).toEqual([]);
      });

      it('should reset when null is passed in', function () {
        spyOn(ctrl, 'reset');
        ctrl.updateItem();

        expect(ctrl.reset).toHaveBeenCalled();
        expect(ctrl.appendMenu).not.toHaveBeenCalled();

        expect(ctrl.currentAutocompleteData).toEqual([]);
      });

      it('should set items and append menu', function () {
        var data = [
          {label: 'bacon', value: 'Bacon'},
          {label: 'banana', value: 'Banana'},
          {label: 'band', value: 'Band'}
        ];

        ctrl.updateItem(data);
        scope.$apply();

        expect(ctrl.currentAutocompleteData).toBe(data);
        expect(ctrl.appendMenu).toHaveBeenCalled();
        expect(ctrl.positionMenu).toHaveBeenCalled();
      });

      it('should update value and label based on label key', function () {
        var data = [
          {testLabel: 'bacon'},
          {testLabel: 'banana'},
          {testLabel: 'band'}
        ];

        ctrl.updateItem(data);

        expect(ctrl.currentAutocompleteData).toBe(data);
        expect(ctrl.$menuScope.items.length).toBe(3);
        expect(ctrl.$menuScope.items[0].value).toBe('bacon');
        expect(ctrl.$menuScope.items[0].label).toBe('bacon');
      });

      it('should update value and label when getting an array of strings', function () {
        var data = ['bacon', 'banana', 'band'];

        ctrl.updateItem(data);

        expect(ctrl.currentAutocompleteData).toBe(data);
        expect(ctrl.$menuScope.items.length).toBe(3);
        expect(ctrl.$menuScope.items[0].value).toBe('bacon');
        expect(ctrl.$menuScope.items[0].label).toBe('bacon');
      });
    });

    describe('appendMenu', function () {
      var menuEl;
      beforeEach(function () {
        menuEl = angular.element("<mac-menu />");

        ctrl.menuEl = menuEl;

        spyOn($animate, 'enter');
        spyOn(ctrl.$element, 'bind');
        spyOn(ctrl.menuEl, 'on');
      });

      it('should bind handlers', function () {
        ctrl.isMenuAppended = false;

        ctrl.appendMenu();

        expect(ctrl.$element.bind).toHaveBeenCalled();
        expect(ctrl.menuEl.on).toHaveBeenCalled();

        expect(ctrl.isMenuAppended).toBe(true);

        expect(menuEl[0].style.visibility).toBe('hidden');
        expect($animate.enter).toHaveBeenCalled();
      });

      it('should not bind handlers', function () {
        ctrl.isMenuAppended = true;

        ctrl.appendMenu();

        expect(ctrl.$element.bind).not.toHaveBeenCalled();
        expect(ctrl.menuEl.on).not.toHaveBeenCalled();

        expect(ctrl.isMenuAppended).toBe(true);

        expect(menuEl[0].style.visibility).toBe('hidden');
        expect($animate.enter).toHaveBeenCalled();
      });

      it('should append inside $element', function() {
        ctrl.inside = true;
        ctrl.appendMenu();

        expect($animate.enter).toHaveBeenCalledWith(menuEl, undefined, ctrl.$element);
      });

      it('should append on document', function() {
        ctrl.inside = false;
        ctrl.appendMenu();

        expect($animate.enter).toHaveBeenCalledWith(menuEl, angular.element(document.body));
      });
    });

    describe('positionMenu', function () {
      var menuEl;
      beforeEach(function () {
        menuEl = angular.element("<mac-menu />");

        ctrl.menuEl = menuEl;
      });

      it('should set on menu style', function () {
        ctrl.positionMenu();

        expect(menuEl[0].style.top).toBeDefined();
        expect(menuEl[0].style.left).toBeDefined();
        expect(menuEl[0].style.minWidth).toBeDefined();

        expect(menuEl[0].style.visibility).toBe('visible');
      });
    });

    describe('getData', function () {
      beforeEach(function () {
        ctrl.onSuccess = angular.noop;
        spyOn(ctrl, 'updateItem');
      });

      it('should call $http with options and call success', function () {
        var respondData = [{name: 'test'}];
        ctrl.onSuccess = jasmine.createSpy('onSuccess')
        $httpBackend.whenGET('/test?q=test').respond({data: respondData});

        ctrl.getData('/test', 'test');

        $httpBackend.flush();

        expect(ctrl.onSuccess).toHaveBeenCalled();

        var param = ctrl.onSuccess.calls.argsFor(0)[0];
        expect(param.data).toEqual({data: respondData});
        expect(param.status).toBeDefined();
        expect(param.headers).toBeDefined();
        expect(ctrl.updateItem).toHaveBeenCalledWith(respondData);
      });

      it('should call call onError when fail', function () {
        ctrl.onError = jasmine.createSpy('onError')
        $httpBackend.whenGET('/test?q=test').respond(500, '');

        ctrl.getData('/test', 'test');

        $httpBackend.flush();

        expect(ctrl.onError).toHaveBeenCalled();

        var param = ctrl.onError.calls.argsFor(0)[0];
        expect(param.data).toBe('');
        expect(param.status).toBeDefined();
        expect(param.headers).toBeDefined();
      });

      it('should use the proper query', function () {
        ctrl.queryKey = 'query';
        var respondData = [{name: 'test'}];

        $httpBackend.expectGET('/test?query=test').respond({data: respondData});
        ctrl.getData('/test', 'test');
        $httpBackend.flush();
      });

      it('should resolve the previous timeout', function () {
        var previousPromise = {
          resolve: jasmine.createSpy('resolve')
        };

        ctrl.previousPromise = previousPromise;
        $httpBackend.whenGET('/test?q=test').respond({data: {}});

        ctrl.getData('/test', 'test');
        expect(previousPromise.resolve).toHaveBeenCalled();
      });

      it('should set previousPromise and timeout when requesting', function () {
        spyOn(ctrl, '$http').and.callThrough();
        $httpBackend.whenGET('/test?q=test').respond({data: {}});

        ctrl.getData('/test', 'test');
        expect(ctrl.previousPromise).toBeDefined();
        expect(ctrl.$http.calls.argsFor(0)[0].timeout).toBeDefined();
      });
    });

    describe('queryData', function () {
      it('should use array as source', function () {
        spyOn(ctrl, 'updateItem');

        var data = [
          {label: 'mouse down', value: 'mousedown'},
          {label: 'mouse leave', value: 'mouseleave'},
          {label: 'mouse over', value: 'mouseover'},
          {label: 'mouse up', value: 'mouseup'}
        ];

        ctrl.source = data;
        ctrl.queryData('down');

        expect(ctrl.updateItem).toHaveBeenCalledWith([{label: 'mouse down', value: 'mousedown'}]);
      });

      it('should use source string as url', function () {
        spyOn(ctrl, 'getData');

        ctrl.source = '/test';
        ctrl.queryData('test-query');

        expect(ctrl.getData).toHaveBeenCalledWith('/test', 'test-query');
      });

      it('should call provided function', function () {
        var data = [
          {label: 'mouse down', value: 'mousedown'},
          {label: 'mouse leave', value: 'mouseleave'},
          {label: 'mouse over', value: 'mouseover'},
          {label: 'mouse up', value: 'mouseup'}
        ];

        spyOn(ctrl, 'updateItem');

        ctrl.source = angular.noop;
        spyOn(ctrl, 'source').and.callFake(function (query, callback) {
          expect(query).toBe('testing');
          callback(data);
        });

        ctrl.queryData('testing');

        expect(ctrl.source).toHaveBeenCalled();
        expect(ctrl.updateItem).toHaveBeenCalledWith(data);
      })
    });

    describe('_getDelay', function () {
      it('should default to 800', function () {
        expect(ctrl._getDelay()).toBe(800);
      });

      it('should use the provided delay', function () {
        ctrl.delay = 239;
        expect(ctrl._getDelay()).toBe(239);
      });

      it('should convert a numeric string', function () {
        ctrl.delay = '283';
        expect(ctrl._getDelay()).toBe(283);
      });

      it('should default to 800 with invalid value', function () {
        ctrl.delay = 'invalid';
        expect(ctrl._getDelay()).toBe(800);
      });
    })
  });

  describe('Autocomplete directive', function () {
    beforeEach(inject(function(_$compile_, _$rootScope_, _keys_, _$sniffer_, _$timeout_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      keys = _keys_;
      $sniffer = _$sniffer_;
      $timeout = _$timeout_;

      data = ["foo", "world", "bar"];

      changeInputValue = function(element, value) {
        element.val(value);
        element.triggerHandler(($sniffer.hasEvent("input") ? "input" : "change"));
      };
    }));

    afterEach(function() {
      var menu = document.querySelector(".mac-menu");
      if (menu != null) {
        menu.parentNode.removeChild(menu);
      }
    });

    describe("Basic Initialization", function() {
      it("should be compiled as text input", function() {
        var element = $compile("<mac-autocomplete ng-model='test'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();
        expect(element[0].nodeName).toBe("INPUT");
        expect(element[0].getAttribute("type")).toBe("text");
      });

      it("should throw an error if ng-model is not defined", function() {
        var init = function() {
          $compile("<mac-autocomplete></mac-autocomplete>")($rootScope);
          $rootScope.$digest();
        };
        expect(init).toThrow();
      });

      it("should not append menu", function() {
        $compile("<mac-autocomplete ng-model='value'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();
        expect(document.querySelectorAll(".mac-menu").length).toBe(0);
      });
    });

    describe("source", function() {
      it("should use local array", function() {
        $rootScope.source = data;
        $rootScope.test = "";

        var element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-autocomplete-delay='0'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        changeInputValue(element, "fo");
        $rootScope.$digest();

        expect(getMenuText()).toBe("foo");
      });

      it("should use local label, value object", function() {
        $rootScope.source = [
          {
            name: "foo",
            value: "foo"
          }, {
            name: "world",
            value: "world"
          }, {
            name: "bar",
            value: "bar"
          }
        ];

        var element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-autocomplete-delay='0'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        changeInputValue(element, "f");

        expect(getMenuText()).toBe("foo");
      });

      it("should use a callback function", function() {
        $rootScope.source = function(query, callback) {
          return callback(["foo"]);
        };

        var element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-autocomplete-delay='0'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        changeInputValue(element, "f");
        $rootScope.$digest();

        expect(getMenuText()).toBe("foo");
      });
    });

    describe("label", function() {
      it("should use default 'name' label", function() {
        $rootScope.source = [
          {
            name: "foo",
            value: "foo"
          }, {
            name: "world",
            value: "world"
          }, {
            name: "bar",
            value: "bar"
          }
        ];

        var element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-autocomplete-delay='0'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        changeInputValue(element, "f");

        expect(getMenuText()).toBe("foo");
      });

      it("should not be able to find anything", function() {
        $rootScope.source = [
          {
            key: "foo",
            value: "foo"
          }, {
            key: "world",
            value: "world"
          }, {
            key: "bar",
            value: "bar"
          }
        ];

        var element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-autocomplete-delay='0'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        changeInputValue(element, "f");

        expect(getMenuText()).not.toBe("foo");
      });

      it("should use 'label' as the key", function() {
        $rootScope.source = [
          {
            label: "foo",
            value: "foo"
          }, {
            label: "world",
            value: "world"
          }, {
            label: "bar",
            value: "bar"
          }
        ];

        var element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-autocomplete-label='label' mac-autocomplete-delay='0'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        changeInputValue(element, "f");

        expect(getMenuText()).toBe("foo");
      });

      it("should evaulate expression on label attribute correctly", function() {
        $rootScope.source = [
          {
            name: "foo",
            attributes: {
              value: "foo"
            }
          }
        ];

        var element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-autocomplete-label='attributes.value' mac-autocomplete-delay='0'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        changeInputValue(element, "f");

        expect(getMenuText()).toBe("foo");
      });
    });

    describe("updateItem", function() {
      it("should convert key to label", function() {
        $rootScope.source = function(query, cb) {
          cb([
            {
              key: "foo",
              value: "foo"
            }, {
              key: "world",
              value: "world"
            }, {
              key: "bar",
              value: "bar"
            }
          ]);
        };
        var element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-autocomplete-label='key' mac-autocomplete-delay='0'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        changeInputValue(element, "f");

        var items = $rootScope.$$childHead.macAutocomplete.$menuScope.items;
        expect(items[0].label).toBeDefined();
      });

      it("should keep all the parameters", function() {
        $rootScope.source = function(query, cb) {
          cb([
            {
              key: "foo",
              value: "foo",
              param1: "1",
              param2: "2"
            }, {
              key: "world",
              value: "world",
              param3: "3"
            }, {
              key: "bar",
              value: "bar"
            }
          ]);
        };

        var element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-autocomplete-label='key' mac-autocomplete-delay='0'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        changeInputValue(element, "f");

        var items = $rootScope.$$childHead.macAutocomplete.$menuScope.items;
        expect(items[0].param2).toBe("2");
      });

      it("should convert string to object", function() {
        $rootScope.source = function(query, cb) {
          cb(["foo", "bar", "world"]);
        };

        var element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-autocomplete-label='key' mac-autocomplete-delay='0'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        changeInputValue(element, "f");

        var items = $rootScope.$$childHead.macAutocomplete.$menuScope.items;
        expect(items[0].label).toBe("foo");
        expect(items[0].value).toBe("foo");
      });
    });

    describe("options", function() {
      it("should use default delay - 800ms", function() {
        $rootScope.source = data;
        var element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        var menu = document.querySelector(".mac-menu");
        expect(menu).toBe(null);

        changeInputValue(element, "f");
        $rootScope.$digest();

        $timeout.flush();

        menu = document.querySelector(".mac-menu");
        expect(menu.className.indexOf("visible")).not.toBe(-1);
      });

      it("should delay for 200ms", function() {
        $rootScope.source = data;
        var element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-autocomplete-delay='200'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        var menu = document.querySelector(".mac-menu");
        expect(menu).toBe(null);

        changeInputValue(element, "f");
        $rootScope.$digest();

        $timeout.flush();

        menu = document.querySelector(".mac-menu");
        expect(menu.className.indexOf("visible")).not.toBe(-1);
      });

      it("should disable autocomplete", function() {
        $rootScope.disabled = true;
        var element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-disabled='disabled'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        var menu = document.querySelector(".mac-menu");
        expect(menu).toBe(null);

        changeInputValue(element, "f");
        $rootScope.$digest();

        menu = document.querySelector(".mac-menu");
        expect(menu).toBe(null);
      });
    });

    describe("callbacks", function() {
      var $httpBackend;
      beforeEach(inject(function(_$httpBackend_, _$timeout_) {
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
      }));

      it("should call select", function() {
        $rootScope.source = data;
        $rootScope.select = jasmine.createSpy("select");

        var element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-autocomplete-on-select='select(selected)'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        changeInputValue(element, "f");
        $rootScope.$digest();

        $timeout.flush();

        element.triggerHandler({
          type: "keydown",
          which: keys.ENTER
        });

        expect($rootScope.select).toHaveBeenCalled();
      });

      it("should call success", function() {
        $httpBackend.when("GET", "/api/autocomplete?q=f").respond({
          data: data
        });
        var result = [];

        $rootScope.url = "/api/autocomplete";
        $rootScope.success = function(data) {
          result = data;
        };

        var element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='url' mac-autocomplete-on-success='success(data)'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        changeInputValue(element, "f");
        $rootScope.$digest();

        $timeout.flush();
        $httpBackend.flush();

        expect(result.data.length).toBe(3);
      });

      it("should have three items in autocomplete list", function() {
        $httpBackend.when("GET", "/api/autocomplete?q=f").respond({
          data: data
        });

        $rootScope.url = "/api/autocomplete";
        $rootScope.success = function(data) {
          return data.data;
        };

        var element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='url' mac-autocomplete-on-success='success(data)'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        changeInputValue(element, "f");
        $rootScope.$digest();

        $timeout.flush();
        $httpBackend.flush();

        expect(document.querySelectorAll(".mac-menu-item").length).toBe(3);
      });

      it("should call error", function() {
        $httpBackend.when("GET", "/api/404?q=f").respond(404);

        $rootScope.url = "/api/404";
        $rootScope.error = jasmine.createSpy("error");

        var element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='url' mac-autocomplete-on-error='error(data)'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        changeInputValue(element, "f");
        $rootScope.$digest();

        $timeout.flush();
        $httpBackend.flush();

        expect($rootScope.error).toHaveBeenCalled();
      });
    });

    describe("model -> view", function() {
      it("should update the view", function() {
        var element = $compile("<mac-autocomplete ng-model='value'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        $rootScope.value = "hello";
        $rootScope.$digest();

        expect(element.val()).toBe("hello");
      });
    });

    describe("mac-menu class", function() {
      it("should set classes", function() {
        $rootScope.source = data;
        $rootScope.classes = {
          test: true,
          hello: false
        };

        var element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-menu-class='classes'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        changeInputValue(element, "f");
        $rootScope.$digest();

        $timeout.flush();

        var menuEl = document.querySelector(".mac-menu");
        expect(menuEl.className.indexOf("test")).not.toBe(-1);
        expect(menuEl.className.indexOf("hello")).toBe(-1);
      });

      it("should not set classes", function() {
        $rootScope.source = data;

        var element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source'></mac-autocomplete>")($rootScope);
        $rootScope.$digest();

        changeInputValue(element, "f");
        $rootScope.$digest();

        $timeout.flush();

        var menuEl = document.querySelector(".mac-menu");
        expect(menuEl.className).toBe("mac-menu ng-isolate-scope visible");
      });
    });
  });
});
