describe "Mac modal", ->
  $compile       = null
  $rootScope     = null
  $templateCache = null
  $timeout       = null
  modal          = null
  keys           = null

  beforeEach module("Mac")
  beforeEach module("template/modal.html")
  beforeEach inject (_$compile_, _$rootScope_, _modal_, _$templateCache_, _keys_, _$timeout_) ->
    $compile       = _$compile_
    $rootScope     = _$rootScope_
    modal          = _modal_
    $templateCache = _$templateCache_
    keys           = _keys_
    $timeout       = _$timeout_

  describe "modal service", ->
    it "should register a modal element", ->
      element = $("<div></div>")
      modal.register "test-modal", element, {}
      expect(modal.registered["test-modal"]).toBeDefined()

    it "should unregister a modal element", ->
      element = $("<div></div>")
      modal.register "test-modal", element, {}
      modal.unregister "test-modal"
      expect(modal.registered["test-modal"]).not.toBeDefined()

    it "should show the registered modal", ->
      element = $("<div></div>")
      modal.register "test-modal", element, {}, angular.noop

      modal.show "test-modal"
      $timeout.flush()

      expect(element.hasClass "visible").toBe true
      expect(modal.opened.id).toBe "test-modal"

    it "should update the waiting object", ->
      modal.show "test-modal"

      expect(modal.waiting.id).toBe "test-modal"

      isEmpty = (obj) ->
          return true unless obj?
          return false for key in obj when obj[key]?
          return true

      expect(isEmpty(modal.waiting.options)).toBe true

    it "should resize the modal after open", ->
      element = $("<div></div>")
      element.append $templateCache.get("template/modal.html")

      modal.register "test-modal", element, {}, angular.noop
      modal.show "test-modal"
      $timeout.flush()

      modalElement = $(".modal", element)
      expect(modalElement.attr("style")).toBeDefined()

    it "should broadcast modalWasShown", ->
      called   = false
      openedId = ""
      element  = $("<div></div>")
      element.append $templateCache.get("template/modal.html")

      modal.register "test-modal", element, {}, angular.noop

      $rootScope.$on "modalWasShown", (event, id) ->
        openedId = id
        called   = true

      $rootScope.$apply -> modal.show "test-modal"

      $timeout.flush()

      expect(openedId).toBe "test-modal"

    it "should hide the modal", ->
      closedId = ""
      element  = $("<div></div>")
      element.append $templateCache.get("template/modal.html")

      $rootScope.$on "modalWasHidden", (event, id) ->
        closedId = id

      modal.register "test-modal", element, {}, angular.noop
      modal.show "test-modal"
      $timeout.flush()

      modal.hide()
      $timeout.flush()

      expect(element.hasClass("visible")).toBe false
      expect(element.hasClass("hide")).toBe true
      expect(modal.opened).toBe null
      expect(closedId).toBe "test-modal"

  describe "initializing a modal", ->
    it "should register the modal", ->
      modalElement = $compile("<mac-modal id='test-modal'></mac-modal>") $rootScope
      $rootScope.$digest()

      expect(modal.registered["test-modal"]).toBeDefined()

    it "should close the modal was 'escape' key", ->
      opened       = false
      modalElement = $compile("<mac-modal id='test-modal' mac-modal-keyboard></mac-modal>") $rootScope
      $rootScope.$digest()

      modal.show "test-modal"
      $timeout.flush()

      $(document).trigger $.Event("keydown", {which: keys.ESCAPE})
      expect(modalElement.hasClass("visible")).toBe false

    it "should close the modal after clicking on overlay", ->
      opened       = false
      modalElement = $compile("<mac-modal id='test-modal' mac-modal-overlay-close></mac-modal>") $rootScope
      $rootScope.$digest()

      modal.show "test-modal"
      $timeout.flush()

      modalElement.click()
      expect(modalElement.hasClass("visible")).toBe false

    it "should execute callback when opening the modal", ->
      opened            = false
      $rootScope.opened = -> opened = true
      modalElement      = $compile("<mac-modal id='test-modal' mac-modal-open='opened()'></mac-modal>") $rootScope
      $rootScope.$digest()

      modal.show "test-modal"
      $timeout.flush()

      expect(opened).toBe true

    it "should close the modal after hiding the modal", ->
      modalElement = $compile("<mac-modal id='test-modal'></mac-modal>") $rootScope
      $rootScope.$digest()

      modal.show "test-modal"
      $timeout.flush()

      modal.hide()

      expect(modalElement.hasClass("visible")).toBe false

  describe "modal trigger", ->
    it "should bind a click event to trigger a modal", ->
      modalElement = $compile("<mac-modal id='test-modal'></mac-modal>") $rootScope
      element      = $compile("<button mac-modal='test-modal'></button>") $rootScope
      $rootScope.$digest()

      element.click()
      $timeout.flush()
      expect(modal.opened.id).toBe "test-modal"

    it "should bind data to opened modal", ->
      $rootScope.data = text: "hello"
      modalElement    = $compile("<mac-modal id='test-modal'></mac-modal>") $rootScope
      element         = $compile("<button mac-modal='test-modal' mac-modal-data='data'></button>") $rootScope

      $rootScope.$digest()

      element.click()
      $timeout.flush()
      expect(modal.opened.options.data.text).toBe "hello"

  describe "modal method", ->
    beforeEach ->
      angular.module("Mac").modal "testing",
        template:  "<div>Test Modal Content</div>"
        keyboard:  true
        resize:    false
        topOffset: 10

    afterEach ->
      angular.element(".modal-overlay").remove()

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
      modal.show "testing"

      $timeout.flush()
      contentText = angular.element(".modal-content-wrapper").text()
      expect(contentText).toBe "Test Modal Content"

    it "should have modal service on scope", ->
      modal.show "testing"
      $timeout.flush()

      scope = angular.element(".modal-overlay").scope()
      expect(scope.modal).toBeDefined()

    it "should remove modal on hide", ->
      modal.show "testing"
      $timeout.flush()

      callback = jasmine.createSpy "select"

      modal.hide(callback)
      $timeout.flush()

      expect(callback).toHaveBeenCalled()
