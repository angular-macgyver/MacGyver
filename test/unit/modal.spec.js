describe('Mac modal', function() {
  var $animate, $compile, $rootScope, $q, $timeout, $parse, keys, modal, showModal;

  beforeEach(module('Mac'));
  beforeEach(module('ngAnimateMock'));

  beforeEach(inject(function(_$animate_, _$compile_, _$rootScope_, _$q_, _$timeout_, _$parse_, _keys_, _modal_) {
    $animate = _$animate_;
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    $timeout = _$timeout_;
    $parse = _$parse_;
    keys = _keys_;
    modal = _modal_;

    showModal = function(id) {
      modal.show(id);
      $rootScope.$digest();
      $animate.triggerCallbacks();
    };
  }));

  describe('modal service', function() {
    it('should register a modal element', function() {
      var element = angular.element('<div></div>');
      modal.register('test-modal', element, {});
      expect(modal.registered['test-modal']).toBeDefined();
    });

    it('should unregister a modal element', function() {
      var element = angular.element('<div></div>');
      modal.register('test-modal', element, {});
      modal.unregister('test-modal');
      expect(modal.registered['test-modal']).not.toBeDefined();
    });

    describe('show', function () {
      it('should update the waiting object', function() {
        modal.show('test-modal');
        expect(modal.waiting.id).toBe('test-modal');
        expect(modal.waiting.options).toEqual({});
      });

      it('should hide the currently opened modal', function () {
        var element = angular.element('<div />');
        modal.register('test-modal', element, {});
        modal.opened = {
          id: 'test-modal',
          element: element,
          options: {}
        };

        spyOn(modal, 'hide');

        modal.show('test-modal');
        expect(modal.hide).toHaveBeenCalled();
      });

      it('should call all callbacks when using moduleMethod', function () {
        var element = angular.element('<div />');
        angular.module('Mac').modal('test-modal', {});

        spyOn(modal, '_getTemplate').and.callFake(function() {
          return $q.when('<div>hi</div>');
        });
        spyOn(modal, '_renderModal').and.callThrough();
        spyOn(modal, '_showModal');

        modal.show('test-modal', {});
        $timeout.flush();
        $animate.triggerCallbacks();

        expect(modal._getTemplate).toHaveBeenCalled();
        expect(modal._renderModal).toHaveBeenCalled();
        expect(modal._showModal).toHaveBeenCalled();
      });

      it('should show modal when element exist', function () {
        var element = angular.element('<div />');
        modal.register('test-modal', element, {});

        spyOn(modal, '_showModal');

        modal.show('test-modal', {});

        expect(modal._showModal).toHaveBeenCalled();
      });
    });

    describe('resize', function () {
      var element;
      beforeEach(function () {
        element = angular.element('<div></div>');
        element.append(modal.defaults.template);

        angular.element(document.body).append(element);
        element.addClass('visible');
      });

      afterEach(function () {
        element.remove();
        element = null;
      });

      it('should resize the modal', function() {
        modal.resize({
          element: element,
          options: {
            position: true
          }
        });

        var modalElement = element[0].querySelector('.mac-modal');
        expect(modalElement.getAttribute('style')).toBeDefined();
      });

      it('should not resize the modal', function() {
        modal.resize({
          element: element,
          options: {
            position: false
          }
        });

        var modalElement = element[0].querySelector('.mac-modal');
        expect(modalElement.style.length).toBe(0);
      });
    });

    describe('hide', function () {
      var element, scope;
      beforeEach(function () {
        element = angular.element('<div></div>');
        element.addClass('visible');
        element.append(modal.defaults.template);

        scope = $rootScope.$new();

        scope.beforeHide = jasmine.createSpy('beforeHide');
        scope.afterHide = jasmine.createSpy('afterHide');

        $compile(element)(scope);

        modal.opened = {
          id: 'test-modal',
          element: element,
          options: {
            beforeHide: $parse('beforeHide()'),
            afterHide: $parse('afterHide()')
          }
        };
      });

      afterEach(function() {
        modal.opened = null;
      });

      it('should exit out immediately if nothing is opened', function () {
        modal.opened = null;

        spyOn($animate, 'removeClass');

        modal.hide();
        expect($animate.removeClass).not.toHaveBeenCalled();
      });

      it('should call beforeHide', function () {
        modal.hide();

        expect(scope.beforeHide).toHaveBeenCalled();
      });

      it('should remove visible and clean up element', function () {
        var destroy = jasmine.createSpy('destroy');

        spyOn(modal, 'bindingEvents');

        scope.$on('$destroy', destroy);

        modal.hide();
        scope.$digest();

        expect(element.hasClass('visible')).toBe(false);
        $animate.triggerCallbacks();

        expect(destroy).toHaveBeenCalled();
        expect(scope.afterHide).toHaveBeenCalled();
        expect(modal.bindingEvents).toHaveBeenCalled();
        expect(modal.opened).toBe(null);
      });

      it('should remove visible and clear style', function () {
        modal.registered['test-modal'] = {
          element: element
        };

        var destroy = jasmine.createSpy('destroy');
        scope.$on('$destroy', destroy);

        modal.hide();
        scope.$digest();

        expect(element.hasClass('visible')).toBe(false);
        $animate.triggerCallbacks();

        expect(destroy).not.toHaveBeenCalled();
        expect(scope.afterHide).toHaveBeenCalled();

        var modalEl = element[0].querySelector('.mac-modal');
        expect(modalEl.getAttribute('style')).toBe(null);
        expect(modal.opened).toBe(null);
      });

      it('should broadcast modalWasHidden after hiding the modal', function() {
        var closedId = '';
        $rootScope.$on('modalWasHidden', function(event, id) {
          closedId = id;
        });

        modal.hide();

        $rootScope.$digest();
        $animate.triggerCallbackPromise();

        expect(modal.opened).toBe(null);
        expect(closedId).toBe('test-modal');
      });
    });

    describe('bindingEvents', function () {
      beforeEach(function () {
        spyOn(modal, '_escapeHandler');
        spyOn(modal, '_resizeHandler');
      });

      it('should default to on', function () {
        modal.opened = {
          options: {
            keyboard: true,
            resize: true
          }
        };

        modal.bindingEvents();

        angular.element(window.document).triggerHandler('keydown');
        angular.element(window).triggerHandler('resize');

        expect(modal._escapeHandler).toHaveBeenCalled();
        expect(modal._resizeHandler).toHaveBeenCalled();
      });

      it('should exit out', function () {
        // No opened
        expect(modal.bindingEvents()).toBe(false);

        // Invalid action
        expect(modal.bindingEvents('doSomething')).toBe(false);
      });

      it('should not bind anything', function () {
        modal.opened = {
          options: {
            keyboard: false,
            resize: false
          }
        };

        modal.bindingEvents();

        angular.element(window.document).triggerHandler('keydown');
        angular.element(window).triggerHandler('resize');

        expect(modal._escapeHandler).not.toHaveBeenCalled();
        expect(modal._resizeHandler).not.toHaveBeenCalled();
      });

      it('should unbind', function () {
        modal.opened = {
          options: {
            keyboard: true,
            resize: true
          }
        };

        modal.bindingEvents();
        modal.bindingEvents('off');

        angular.element(window.document).triggerHandler('keydown');
        angular.element(window).triggerHandler('resize');

        expect(modal._escapeHandler).not.toHaveBeenCalled();
        expect(modal._resizeHandler).not.toHaveBeenCalled();
      });
    });

    describe('register', function () {
      var element = angular.element('<div />');

      it('should register and extend options', function () {
        modal.register('test-modal-register', element, {});

        expect(modal.registered['test-modal-register']).toBeDefined();
        var registered = modal.registered['test-modal-register'];
        expect(registered.id).toBe('test-modal-register');
        expect(registered.element).toBe(element);
        expect(registered.options.keyboard).toBe(false);
      });

      it('should throw error when modal has already been registered', function () {
        modal.register('test-modal-register', element, {});

        expect(function () {
          modal.register('test-modal-register', element, {});
        }).toThrowError('Modal test-modal-register already registered')
      });

      it('should show if waiting', function () {
        spyOn(modal, 'show');
        modal.waiting = {
          id: 'test-modal-register'
        };
        modal.register('test-modal-register', element, {});

        expect(modal.show).toHaveBeenCalled();
      });
    });

    describe('unregister', function () {
      it('should throw error when modal is not registered', function () {
        expect(function () {
          modal.unregister('test-modal-unregister');
        }).toThrowError('Modal test-modal-unregister is not registered');
      });

      it('should hide and unregister', function () {
        modal.registered['test-modal-unregister'] = {};

        modal.opened = {
          id: 'test-modal-unregister'
        };

        spyOn(modal, 'hide');
        spyOn(modal, 'clearWaiting');

        modal.unregister('test-modal-unregister');

        expect(modal.hide).toHaveBeenCalled();
        expect(modal.clearWaiting).toHaveBeenCalled();

        expect(modal.registered['test-modal-unregister']).toBeUndefined();
      });
    });

    describe('clearWaiting', function () {
      it('should clear waiting', function () {
        modal.waiting = {
          id: 'waiting'
        };

        modal.clearWaiting('waiting');

        expect(modal.waiting).toBe(null);
      });

      it('should not clear', function () {
        modal.waiting = {
          id: 'not-waiting'
        };

        modal.clearWaiting('waiting');

        expect(modal.waiting.id).toBe('not-waiting');
      });
    });

    describe('_showModal', function () {
      var element, options, scope;

      beforeEach(function () {
        element = angular.element('<div></div>');
        element.append(modal.defaults.template);

        scope = $rootScope.$new();
        scope.open = jasmine.createSpy('open');
        scope.beforeShow = jasmine.createSpy('beforeShow');
        scope.afterShow = jasmine.createSpy('afterShow');

        options = {
          open: $parse('open()'),
          beforeShow: $parse('beforeShow()'),
          afterShow: $parse('afterShow()')
        };

        $compile(element)(scope);
      });

      afterEach(function () {
        modal.registered = {};
      });

      it('should show modal', function () {
        spyOn(modal, 'resize');
        spyOn(modal, 'bindingEvents');
        spyOn(modal, 'clearWaiting');

        modal._showModal('test-modal', element, options);

        expect(scope.beforeShow).toHaveBeenCalled();

        scope.$digest();
        $animate.triggerCallbacks();

        expect(modal.opened).toBeDefined();
        expect(modal.opened).toEqual({
          id: 'test-modal',
          element: element,
          options: options
        });

        expect(modal.resize).toHaveBeenCalled();
        expect(modal.bindingEvents).toHaveBeenCalled();

        expect(scope.open).toHaveBeenCalled();
        expect(scope.afterShow).toHaveBeenCalled();

        expect(modal.clearWaiting).toHaveBeenCalled();
      });

      it('should broadcast modalWasShown', function() {
        var openedId = '';
        $rootScope.$on('modalWasShown', function(event, id) {
          openedId = id;
        });

        modal._showModal('test-modal', element, options);
        $rootScope.$digest();
        $animate.triggerCallbacks();
        expect(openedId).toBe('test-modal');
      });
    });

    describe('_renderModal', function () {
      var options, scope;

      beforeEach(function () {
        scope = $rootScope.$new();
        scope.isUsingScope = true

        options = {
          scope: scope,
          attributes: {
            testAttr: 'hi'
          },
          overlayClose: true,
          controller: function ($scope) {
            $scope.testController = 'here';
          }
        };
      });

      it('should render modal', function (done) {
        modal._renderModal('test-modal', '<p>hi</p>', options)
        .then(function (element) {
          expect(element).toBeDefined();

          expect(element.attr('id')).toBe('test-modal');
          expect(element.attr('testAttr')).toBe('hi');

          expect(element.scope().isUsingScope).toBe(true);

          expect(element[0].querySelector('.mac-modal-content-wrapper').innerHTML).toBe('<p>hi</p>');

          expect(element.scope().testController).toBe('here');

          expect(document.body.querySelector('#test-modal')).not.toBe(null);

          spyOn(modal, 'hide');
          element.triggerHandler('click');

          expect(modal.hide).toHaveBeenCalled();

          done();
        });

        $rootScope.$digest();
        $animate.triggerCallbacks();
      });

      it('should create new isolated scope', function (done) {
        options.scope = {
          isObject: true
        };

        modal._renderModal('test-modal', '<p>hi</p>', options)
        .then(function (element) {
          expect(element).toBeDefined();

          expect(element.scope().isObject).toBe(true);

          done();
        });

        $rootScope.$digest();
        $animate.triggerCallbacks();
      })
    });

    describe('_escapeHandler', function () {
      it('should hide on escape', function () {
        var element = angular.element('<div></div>');
        element.append(modal.defaults.template);

        scope = $rootScope.$new();
        $compile(element)(scope);

        spyOn(modal, 'hide');

        modal.opened = {
          element: element
        };

        modal._escapeHandler({keyCode: 27});
        $rootScope.$digest();

        expect(modal.hide).toHaveBeenCalled();
      });
    });

    describe('_resizeHandler', function () {
      it('should call resize', function () {
        spyOn(modal, 'resize');
        modal._resizeHandler();
        expect(modal.resize).toHaveBeenCalled();
      });
    });

    describe('_getTemplate', function () {
      var $httpBackend, $templateCache;

      beforeEach(inject(function (_$templateCache_, _$httpBackend_) {
        $templateCache = _$templateCache_;
        $templateCache.put('/test.html', '<div>cached</div>');

        $httpBackend = _$httpBackend_;
      }));

      it('should throw error if options is not set properly', function () {
        expect(function () {
          modal._getTemplate({});
        }).toThrowError('Missing template for modal')
      });

      it('should use templateUrl', function (done) {
        modal._getTemplate({templateUrl: '/test.html'})
        .then(function (template) {
          expect(template).toBe('<div>cached</div>');
          done();
        });

        $timeout.flush();
      });

      it('should request with templateUrl', function (done) {
        $httpBackend.whenGET('/other-test.html').respond('<div>requested</div>');

        modal._getTemplate({templateUrl: '/other-test.html'})
        .then(function (template) {
          var expectedTemplate = '<div>requested</div>';

          expect(template).toBe(expectedTemplate);
          expect($templateCache.get('/other-test.html')).toBe(expectedTemplate);

          done();
        });

        $timeout.flush();
        $httpBackend.flush();
      });

      it('should throw when error out', function () {
        $httpBackend.whenGET('/404.html').respond(404, '');

        expect(function () {
          modal._getTemplate({templateUrl: '/404.html'});
          $httpBackend.flush();
        }).toThrowError('Failed to load template: /404.html');
      });

      it('should just return the template when in options', function (done) {
        modal._getTemplate({template: '<div>original</div>'})
        .then(function (template) {
          expect(template).toBe('<div>original</div>');

          done();
        });

        $timeout.flush();
      });
    });
  });

  describe('initializing a modal', function() {
    it('should register the modal', function() {
      var modalElement = $compile('<mac-modal id="test-modal"></mac-modal>')($rootScope);
      $rootScope.$digest();

      expect(modal.registered['test-modal']).toBeDefined();
    });

    it('should unregister the modal when $scope is destroyed', function() {
      var modalElement = $compile('<mac-modal id="test-modal"></mac-modal>')($rootScope);
      $rootScope.$digest();
      $rootScope.$destroy();

      expect(modal.registered['test-modal']).not.toBeDefined();
    });

    it('should unregister the correct one', function() {
      var modalElement, scope, scope1;
      scope = $rootScope.$new();
      scope1 = $rootScope.$new();
      modalElement = $compile('<mac-modal id="test-modal"></mac-modal>')(scope);
      modalElement = $compile('<mac-modal id="test-modal-1"></mac-modal>')(scope1);

      $rootScope.$digest();
      scope.$destroy();

      expect(modal.registered['test-modal']).not.toBeDefined();
      expect(modal.registered['test-modal-1']).toBeDefined();
    });

    it('should execute callback when opening the modal', function() {
      $rootScope.opened = jasmine.createSpy('opened');
      var modalElement = $compile('<mac-modal id="test-modal" mac-modal-open="opened()"></mac-modal>')($rootScope);
      $rootScope.$digest();

      expect($rootScope.opened).not.toHaveBeenCalled();

      showModal('test-modal');

      expect($rootScope.opened).toHaveBeenCalled();
    });

    it('should execute beforeShow when showing the modal', function() {
      $rootScope.beforeShow = jasmine.createSpy('beforeShow');
      var modalElement = $compile('<mac-modal id="test-modal" mac-modal-before-show="beforeShow()"></mac-modal>')($rootScope);
      $rootScope.$digest();

      expect($rootScope.beforeShow).not.toHaveBeenCalled();

      showModal('test-modal');

      expect($rootScope.beforeShow).toHaveBeenCalled();
    });

    it('should execute afterShow when showing the modal', function() {
      $rootScope.afterShow = jasmine.createSpy('afterShow');
      var modalElement = $compile('<mac-modal id="test-modal" mac-modal-after-show="afterShow()"></mac-modal>')($rootScope);
      $rootScope.$digest();

      expect($rootScope.afterShow).not.toHaveBeenCalled();

      showModal('test-modal');

      expect($rootScope.afterShow).toHaveBeenCalled();
    });

    it('should execute beforeHide when hiding the modal', function() {
      $rootScope.beforeHide = jasmine.createSpy('beforeHide');
      var modalElement = $compile('<mac-modal id="test-modal" mac-modal-before-hide="beforeHide()"></mac-modal>')($rootScope);
      $rootScope.$digest();

      expect($rootScope.beforeHide).not.toHaveBeenCalled();
      showModal('test-modal');
      expect($rootScope.beforeHide).not.toHaveBeenCalled();
      modal.hide();
      expect($rootScope.beforeHide).toHaveBeenCalled();
    });

    it('should execute afterHide when hiding the modal', function() {
      $rootScope.afterHide = jasmine.createSpy('afterHide');
      var modalElement = $compile('<mac-modal id="test-modal" mac-modal-after-hide="afterHide()"></mac-modal>')($rootScope);
      $rootScope.$digest();

      expect($rootScope.afterHide).not.toHaveBeenCalled();
      showModal('test-modal');
      expect($rootScope.afterHide).not.toHaveBeenCalled();

      $animate.triggerReflow();
      modal.hide();
      $rootScope.$digest();

      $animate.triggerCallbackPromise();
      expect($rootScope.afterHide).toHaveBeenCalled();
    });
  });

  describe('modal trigger', function() {
    it('should bind a click event to trigger a modal', function() {
      var element, modalElement;
      modalElement = $compile('<mac-modal id="test-modal"></mac-modal>')($rootScope);
      element = $compile('<button mac-modal="test-modal"></button>')($rootScope);
      $rootScope.$digest();

      element.triggerHandler('click');
      $rootScope.$digest();

      $animate.triggerCallbackPromise();
      expect(modal.opened.id).toBe('test-modal');
    });

    it('should bind data to opened modal', function() {
      var element, modalElement;
      $rootScope.data = {
        text: 'hello'
      };
      modalElement = $compile('<mac-modal id="test-modal"></mac-modal>')($rootScope);
      element = $compile('<button mac-modal="test-modal" mac-modal-data="data"></button>')($rootScope);
      $rootScope.$digest();

      element.triggerHandler('click');
      $rootScope.$digest();

      $animate.triggerCallbackPromise();
      expect(modal.opened.options.data.text).toBe('hello');
    });
  });

  describe('modal method', function() {
    beforeEach(function() {
      angular.module('Mac').modal('testing', {
        template: '<div>Test Modal Content</div>',
        keyboard: true,
        resize: false,
        topOffset: 10
      });
    });

    afterEach(function() {
      var overlay = document.querySelector('.mac-modal-overlay');
      if (overlay != null) {
        overlay.parentNode.removeChild(overlay);
      }
    });

    it('should register a new modal', function() {
      expect(modal.registered['testing']).toBeDefined();
    });

    it('should update options', function() {
      var options = modal.registered['testing'].options;
      expect(options.keyboard).toBe(true);
      expect(options.overlayClose).toBe(false);
    });

    it('should not overwrite default options', function() {
      var defaults = modal.defaults;

      expect(defaults.keyboard).toBe(false);
    });

    it('should compile on show', function() {
      var contentText, wrapper;
      showModal('testing');

      wrapper = document.querySelector('.mac-modal-content-wrapper');
      contentText = wrapper.innerText || wrapper.textContent;
      expect(contentText).toBe('Test Modal Content');
    });

    it('should remove modal on hide', function() {
      showModal('testing');
      $animate.triggerReflow();

      modal.hide();
      $rootScope.$digest();

      $animate.triggerCallbacks();
      $rootScope.$digest();

      var overlay = document.querySelector('.mac-modal-overlay');
      expect(overlay).toBe(null);
    });
  });
});
