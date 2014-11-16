xdescribe "Mac modal", ->
  $animate       = null
  $compile       = null
  $rootScope     = null
  $templateCache = null
  modal          = null
  keys           = null

  showModal = null

  beforeEach module("Mac")
  beforeEach module("ngAnimateMock")
  beforeEach module("template/modal.html")
  beforeEach inject (
    _$animate_
    _$compile_
    _$rootScope_
    _$templateCache_
    _keys_
    _modal_
  ) ->
    $animate       = _$animate_
    $compile       = _$compile_
    $rootScope     = _$rootScope_
    $templateCache = _$templateCache_
    keys           = _keys_
    modal          = _modal_

    showModal = (id) ->
      modal.show id

      # HACK: To invoke the callback for second function.
      $animate.triggerCallbacks()
      $animate.queue[1].args[2]()

  describe "modal service", ->
    it "should register a modal element", ->
      element = angular.element("<div></div>")
      modal.register "test-modal", element, {}
      expect(modal.registered["test-modal"]).toBeDefined()

    it "should unregister a modal element", ->
      element = angular.element("<div></div>")
      modal.register "test-modal", element, {}
      modal.unregister "test-modal"
      expect(modal.registered["test-modal"]).not.toBeDefined()

    it "should update the waiting object", ->
      modal.show "test-modal"

      expect(modal.waiting.id).toBe "test-modal"

      isEmpty = (obj) ->
          return true unless obj?
          return false for key in obj when obj[key]?
          return true

      expect(isEmpty(modal.waiting.options)).toBe true

    it "should resize the modal after open", ->
      element = angular.element("<div></div>")
      element.append $templateCache.get("template/modal.html")

      modal.register "test-modal", element, {position: true}

      showModal "test-modal"

      modalElement = element[0].querySelector(".mac-modal")
      expect(modalElement.style.length).toBe 1

    it "should not resize the modal by setting modal style", ->
      element = angular.element("<div></div>")
      element.append $templateCache.get("template/modal.html")

      modal.register "test-modal", element, {position: false}

      showModal "test-modal"

      modalElement = element[0].querySelector(".mac-modal")
      expect(modalElement.style.length).toBe 0

    it "should broadcast modalWasShown", ->
      called   = false
      openedId = ""
      element  = angular.element("<div></div>")
      element.append $templateCache.get("template/modal.html")

      modal.register "test-modal", element, {}

      $rootScope.$on "modalWasShown", (event, id) ->
        openedId = id
        called   = true

      $rootScope.$apply -> showModal "test-modal"

      expect(openedId).toBe "test-modal"

    it "should broadcast modalWasHidden after hiding the modal", ->
      closedId = ""
      element  = angular.element("<div></div>")
      element.append $templateCache.get("template/modal.html")

      $rootScope.$on "modalWasHidden", (event, id) -> closedId = id

      modal.register "test-modal", element, {}

      showModal "test-modal"

      modal.hide()
      $animate.triggerCallbacks()

      expect(modal.opened).toBe null
      expect(closedId).toBe "test-modal"

  describe "initializing a modal", ->
    it "should register the modal", ->
      modalElement = $compile("<mac-modal id='test-modal'></mac-modal>") $rootScope
      $rootScope.$digest()

      expect(modal.registered["test-modal"]).toBeDefined()

    it "should unregister the modal when $scope is destroyed", ->
      modalElement = $compile("<mac-modal id='test-modal'></mac-modal>") $rootScope
      $rootScope.$digest()

      $rootScope.$destroy()

      expect(modal.registered["test-modal"]).not.toBeDefined()

    it "should unregister the correct one", ->
      scope        = $rootScope.$new()
      scope1       = $rootScope.$new()
      modalElement = $compile("<mac-modal id='test-modal'></mac-modal>") scope
      modalElement = $compile("<mac-modal id='test-modal-1'></mac-modal>") scope1
      $rootScope.$digest()

      scope.$destroy()

      expect(modal.registered["test-modal"]).not.toBeDefined()
      expect(modal.registered["test-modal-1"]).toBeDefined()

    it "should execute callback when opening the modal", ->
      opened            = false
      $rootScope.opened = -> opened = true
      modalElement      = $compile("<mac-modal id='test-modal' mac-modal-open='opened()'></mac-modal>") $rootScope
      $rootScope.$digest()

      expect(opened).toBe false
      showModal "test-modal"

      expect(opened).toBe true

    it "should execute beforeShow when showing the modal", ->
      $rootScope.beforeShow = jasmine.createSpy "beforeShow"
      modalElement          = $compile("<mac-modal id='test-modal' mac-modal-before-show='beforeShow()'></mac-modal>") $rootScope
      $rootScope.$digest()

      expect($rootScope.beforeShow).not.toHaveBeenCalled()

      showModal "test-modal"

      expect($rootScope.beforeShow).toHaveBeenCalled()

    it "should execute afterShow when showing the modal", ->
      $rootScope.afterShow = jasmine.createSpy "afterShow"
      modalElement         = $compile("<mac-modal id='test-modal' mac-modal-after-show='afterShow()'></mac-modal>") $rootScope
      $rootScope.$digest()

      expect($rootScope.afterShow).not.toHaveBeenCalled()

      showModal "test-modal"

      expect($rootScope.afterShow).toHaveBeenCalled()

    it "should execute beforeHide when hiding the modal", ->
      $rootScope.beforeHide = jasmine.createSpy "beforeHide"
      modalElement          = $compile("<mac-modal id='test-modal' mac-modal-before-hide='beforeHide()'></mac-modal>") $rootScope
      $rootScope.$digest()

      expect($rootScope.beforeHide).not.toHaveBeenCalled()

      showModal "test-modal"

      expect($rootScope.beforeHide).not.toHaveBeenCalled()

      modal.hide()

      expect($rootScope.beforeHide).toHaveBeenCalled()

    it "should execute afterHide when hiding the modal", ->
      $rootScope.afterHide = jasmine.createSpy "afterHide"
      modalElement         = $compile("<mac-modal id='test-modal' mac-modal-after-hide='afterHide()'></mac-modal>") $rootScope
      $rootScope.$digest()

      expect($rootScope.afterHide).not.toHaveBeenCalled()

      showModal "test-modal"

      expect($rootScope.afterHide).not.toHaveBeenCalled()

      modal.hide()

      $animate.triggerCallbacks()

      expect($rootScope.afterHide).toHaveBeenCalled()

  describe "modal trigger", ->
    it "should bind a click event to trigger a modal", ->
      modalElement = $compile("<mac-modal id='test-modal'></mac-modal>") $rootScope
      element      = $compile("<button mac-modal='test-modal'></button>") $rootScope
      $rootScope.$digest()

      element.triggerHandler "click"

      $animate.triggerCallbacks()
      $animate.queue[1].args[2]()

      expect(modal.opened.id).toBe "test-modal"

    it "should bind data to opened modal", ->
      $rootScope.data = text: "hello"
      modalElement    = $compile("<mac-modal id='test-modal'></mac-modal>") $rootScope
      element         = $compile("<button mac-modal='test-modal' mac-modal-data='data'></button>") $rootScope

      $rootScope.$digest()

      element.triggerHandler "click"

      $animate.triggerCallbacks()
      $animate.queue[1].args[2]()

      expect(modal.opened.options.data.text).toBe "hello"

  describe "modal method", ->
    beforeEach ->
      angular.module("Mac").modal "testing",
        template:  "<div>Test Modal Content</div>"
        keyboard:  true
        resize:    false
        topOffset: 10

    afterEach ->
      overlay = document.querySelector ".mac-modal-overlay"
      overlay.parentNode.removeChild overlay if overlay?

    it "should register a new modal", ->
      expect(modal.registered["testing"]).toBeDefined()

    it "should add moduleMethod to options", ->
      options = modal.registered["testing"].options
      expect(options.moduleMethod).toBe true

    it "should update options", ->
      options = modal.registered["testing"].options

      expect(options.keyboard).toBe true
      expect(options.overlayClose).toBe false

    it "should not overwrite default options", inject (modalViews) ->
      defaults = modalViews.defaults

      expect(defaults.keyboard).toBe false
      expect(defaults.resize).toBe true

    it "should compile on show", ->
      showModal "testing"

      wrapper     = document.querySelector(".mac-modal-content-wrapper")
      contentText = wrapper.innerText or wrapper.textContent
      expect(contentText).toBe "Test Modal Content"

    it "should remove modal on hide", ->
      showModal "testing"

      $animate.triggerCallbacks()

      callback = jasmine.createSpy "select"

      modal.hide(callback)

      $animate.triggerCallbacks()

      expect(callback).toHaveBeenCalled()
