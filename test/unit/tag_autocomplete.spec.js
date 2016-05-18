describe("Mac tag autocomplete", function() {
  var $compile, $httpBackend, $rootScope, $timeout, keys;

  function hasClass(element, className) {
    return element[0].className.indexOf(className) > -1;
  }

  beforeEach(module("Mac"));
  beforeEach(module("template/tag_autocomplete.html"));
  beforeEach(module("template/menu.html"));

  beforeEach(inject(function(_$compile_, _$httpBackend_, _$rootScope_, _$timeout_, _keys_) {
    $compile = _$compile_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    keys = _keys_;
  }));

  describe("basic initialization", function() {
    it("should be replaced by the template", function() {
      var element;
      element = $compile("<mac-tag-autocomplete></mac-tag-autocomplete>")($rootScope);
      $rootScope.$digest();
      return expect(hasClass(element, "mac-tag-autocomplete")).toBeTruthy();
    });

    it("should set default value and label attribute on mac-autocomplete", function() {
      var element, textInput;
      element = $compile("<mac-tag-autocomplete></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      textInput = element[0].querySelector(".mac-autocomplete");

      expect(textInput.getAttribute("mac-autocomplete-label")).toBe("name");
    });

    it("should set value and label attribute on mac-autocomplete", function() {
      var element, textInput;
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-label='test-name' mac-tag-autocomplete-value='test-id'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      textInput = element[0].querySelector(".mac-autocomplete");

      expect(textInput.getAttribute("mac-autocomplete-label")).toBe("test-name");
    });

    it("should pass empty string as key and value", function() {
      var element, textInput;
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-label='' mac-tag-autocomplete-value=''></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      textInput = element[0].querySelector(".mac-autocomplete");

      expect(textInput.getAttribute("mac-autocomplete-label")).toBe('');
    });

    it("should set query attribute on mac-autocomplete", function() {
      var element, textInput;
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-query='query'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      textInput = element[0].querySelector(".mac-autocomplete");

      expect(textInput.getAttribute("mac-autocomplete-query")).toBe("query");
    });

    it("should set delay attribute on mac-autocomplete", function() {
      var element, textInput;
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-delay='100'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      textInput = element[0].querySelector(".mac-autocomplete");

      expect(textInput.getAttribute("mac-autocomplete-delay")).toBe("100");
    });

    it("should set the source attribute on mac-autocomplete", function() {
      var element, textInput;
      $rootScope.source = ["test", "test1", "test2"];
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-source='source'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      textInput = element[0].querySelector(".mac-autocomplete");

      expect(textInput.getAttribute("mac-autocomplete-source")).toBe("macTagAutocomplete.source");
    });

    it("should have the same source function as the parent scope", function() {
      $rootScope.source = jasmine.createSpy("source");
      var element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-source='source'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      var elementScope = element.isolateScope();
      elementScope.macTagAutocomplete.source();

      expect($rootScope.source).toHaveBeenCalled();
    });

    // Add protractor for this use case
    it("should focus on autocomplete when click on tag autocomplete", function() {
      var element, textInput;
      $rootScope.source = ["test", "test1", "test2"];
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-source='source'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();

      textInput = element[0].querySelector(".mac-autocomplete");
      spyOn(textInput, 'focus');
      element.triggerHandler("click");

      expect(textInput.focus).toHaveBeenCalled();
    });

    it("should model -> view", function() {
      var element, textInput;
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-model='model'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      $rootScope.model = "Here";

      $rootScope.$digest();
      textInput = element[0].querySelector(".mac-autocomplete");

      expect(angular.element(textInput).val()).toBe("Here");
    });

    it('should invoke onSuccess function', function() {
      $rootScope.source = "/test";
      $rootScope.onSuccessFn = function(data, status, headers) {
        expect(data).toBeDefined();
        expect(status).toBeDefined();
        expect(headers).toBeDefined();

        return data.data;
      }

      var element = $compile('<mac-tag-autocomplete mac-tag-autocomplete-model="model" mac-tag-autocomplete-source="source" mac-tag-autocomplete-on-success="onSuccessFn(data, status, headers)"></mac-tag-autocomplete>')($rootScope);
      $rootScope.$digest();

      var textInput = angular.element(element[0].querySelector('.mac-autocomplete'));
      var textInputScope = textInput.isolateScope();

      var autocompleteCtrl = textInputScope.macAutocomplete;
      spyOn(autocompleteCtrl, 'updateItem');

      $httpBackend.whenGET('/test?q=test').respond({data: [
        {name: 'test'}
      ]});

      autocompleteCtrl.getData('/test', 'test');

      $httpBackend.flush();

      expect(autocompleteCtrl.updateItem).toHaveBeenCalled();

      var args = autocompleteCtrl.updateItem.calls.argsFor(0)[0];
      expect(args.length).toBe(1);
      expect(args[0].name).toBe('test');
    });
  });

  it('should clear the text on event', function () {
    var element = $compile("<mac-tag-autocomplete></mac-tag-autocomplete>")($rootScope);
    $rootScope.$digest();

    var elementScope = element.isolateScope();
    elementScope.macTagAutocomplete.textInput = 'testing';

    $rootScope.$broadcast('mac-tag-autocomplete-clear-input');
    $rootScope.$digest();

    expect(elementScope.macTagAutocomplete.textInput).toBe('');
  });

  describe("selected variable", function() {
    it("should have a placeholder", function() {
      $rootScope.selected = [];
      var element = $compile("<mac-tag-autocomplete\n  mac-tag-autocomplete-placeholder = \"'Testing'\"\n  mac-tag-autocomplete-selected='selected'>\n</mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();

      var textInputScope = element.isolateScope();
      expect(textInputScope.macTagAutocomplete.placeholder).toBe("Testing");
    });
  });

  describe("onKeyDown", function() {
    it("should fire keydown callback", function() {
      var element, textInput;
      $rootScope.keydown = jasmine.createSpy("keydown");
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-on-keydown='keydown()'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      textInput = element[0].querySelector(".mac-autocomplete");

      browserTrigger(textInput, "keydown");

      expect($rootScope.keydown).toHaveBeenCalled();
    });

    it("should remove the last tag", function() {
      var element, textInput;
      $rootScope.keydown = jasmine.createSpy('keydown');
      $rootScope.selected = [
        {
          id: "tag1"
        }
      ];
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-selected='selected' mac-tag-autocomplete-on-keydown='keydown()'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      textInput = element[0].querySelector(".mac-autocomplete");

      angular.element(textInput).triggerHandler({
        type: "keydown",
        which: keys.BACKSPACE
      });

      expect($rootScope.selected.length).toBe(0);
    });

    it("should push the text into selected", function() {
      var element, textInput;
      $rootScope.keydown = jasmine.createSpy('keydown')
      $rootScope.selected = [];
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-selected='selected' mac-tag-autocomplete-on-keydown='keydown()' mac-tag-autocomplete-disabled='true'></mac-tag-autocomplete>")($rootScope);

      $rootScope.$digest();
      textInput = angular.element(element[0].querySelector(".mac-autocomplete"));

      var elementScope = element.isolateScope();
      elementScope.macTagAutocomplete.textInput = "Testing";
      textInput.triggerHandler({
        type: "keydown",
        which: keys.ENTER
      });
      $timeout.flush();

      expect($rootScope.selected.length).toBe(1);
    });
  });

  describe("on select callback", function() {
    it("should fire callback", function() {
      var element, textInput;
      $rootScope.onEnter = jasmine.createSpy('onEnter')
      $rootScope.selected = [];
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-selected='selected' mac-tag-autocomplete-on-enter='onEnter(item)' mac-tag-autocomplete-disabled='true'></mac-tag-autocomplete>")($rootScope);
      $rootScope.$digest();

      textInput = element[0].querySelector(".mac-autocomplete");
      var elementScope = element.isolateScope();
      elementScope.macTagAutocomplete.textInput = "Testing";

      angular.element(textInput).triggerHandler({
        type: "keydown",
        which: keys.ENTER
      });
      $timeout.flush();

      expect($rootScope.onEnter).toHaveBeenCalled();
    });
  });

  describe('event callback', function() {
    it('should fire blur callback with parameters', function() {
      $rootScope.onBlurFn = function($event, ctrl, value) {
        expect($event).toBeDefined();
        expect(ctrl).toBeDefined();
        expect(value).toBe('');
      };
      var element = $compile('<mac-tag-autocomplete mac-tag-autocomplete-selected="selected" mac-tag-autocomplete-blur="onBlurFn($event, ctrl, value)"></mac-tag-autocomplete>')($rootScope);

      $rootScope.$digest();

      var textInput = element[0].querySelector('.mac-autocomplete');
      angular.element(textInput).triggerHandler('blur');

      $rootScope.$digest();
    });

    it('should fire blur callback', function() {
      $rootScope.onBlurFn = jasmine.createSpy('onBlurFn');
      var element = $compile('<mac-tag-autocomplete mac-tag-autocomplete-selected="selected" mac-tag-autocomplete-blur="onBlurFn()"></mac-tag-autocomplete>')($rootScope);

      $rootScope.$digest();

      var textInput = element[0].querySelector('.mac-autocomplete');
      angular.element(textInput).triggerHandler('blur');

      $rootScope.$digest();

      expect($rootScope.onBlurFn).toHaveBeenCalled();
    });

    it('should fire focus callback', function() {
      $rootScope.onFocusFn = jasmine.createSpy('onFocusFn');
      var element = $compile('<mac-tag-autocomplete mac-tag-autocomplete-selected="selected" mac-tag-autocomplete-focus="onFocusFn()"></mac-tag-autocomplete>')($rootScope);

      $rootScope.$digest();

      var textInput = element[0].querySelector('.mac-autocomplete');
      angular.element(textInput).triggerHandler('focus');

      $rootScope.$digest();

      expect($rootScope.onFocusFn).toHaveBeenCalled();
    });

    it('should fire keyup callback', function() {
      $rootScope.onKeyupFn = jasmine.createSpy('onKeyupFn');
      var element = $compile('<mac-tag-autocomplete mac-tag-autocomplete-selected="selected" mac-tag-autocomplete-keyup="onKeyupFn()"></mac-tag-autocomplete>')($rootScope);

      $rootScope.$digest();

      var textInput = element[0].querySelector('.mac-autocomplete');
      angular.element(textInput).triggerHandler('keyup');

      $rootScope.$digest();

      expect($rootScope.onKeyupFn).toHaveBeenCalled();
    });

    it('should fire keydown callback', function() {
      $rootScope.onKeydownFn = jasmine.createSpy('onKeydownFn');
      var element = $compile('<mac-tag-autocomplete mac-tag-autocomplete-selected="selected" mac-tag-autocomplete-keydown="onKeydownFn()"></mac-tag-autocomplete>')($rootScope);

      $rootScope.$digest();

      var textInput = element[0].querySelector('.mac-autocomplete');
      angular.element(textInput).triggerHandler('keydown');

      $rootScope.$digest();

      expect($rootScope.onKeydownFn).toHaveBeenCalled();
    });

    it('should fire keypress callback', function() {
      $rootScope.onKeypressFn = jasmine.createSpy('onKeypressFn');
      var element = $compile('<mac-tag-autocomplete mac-tag-autocomplete-selected="selected" mac-tag-autocomplete-keypress="onKeypressFn()"></mac-tag-autocomplete>')($rootScope);

      $rootScope.$digest();

      var textInput = element[0].querySelector('.mac-autocomplete');
      angular.element(textInput).triggerHandler('keypress');

      $rootScope.$digest();

      expect($rootScope.onKeypressFn).toHaveBeenCalled();
    });
  });
});
