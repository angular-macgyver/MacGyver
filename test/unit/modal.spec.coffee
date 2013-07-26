describe "Mac modal", ->
  $compile       = null
  $rootScope     = null
  $templateCache = null
  modal          = null
  keys           = null

  beforeEach module("Mac")
  beforeEach module("template/modal.html")
  beforeEach inject (_$compile_, _$rootScope_, _modal_, _$templateCache_, _keys_) ->
    $compile       = _$compile_
    $rootScope     = _$rootScope_
    modal          = _modal_
    $templateCache = _$templateCache_
    keys           = _keys_

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
      called  = false
      element = $("<div></div>")
      modal.register "test-modal", element, {}

      runs ->
        modal.show "test-modal"
        setTimeout ->
          called = true
        , 0

      waitsFor ->
        return called
      , "set visible", 100

      runs ->
        expect(element.hasClass "visible").toBe true
        expect(modal.opened.id).toBe "test-modal"

    it "should update the waiting object", ->
      modal.show "test-modal"

      expect(modal.waiting.id).toBe "test-modal"
      expect(_(modal.waiting.options).isEmpty()).toBe true

    it "should resize the modal after open", ->
      element = $("<div></div>")
      element.append $templateCache.get("template/modal.html")

      modal.register "test-modal", element, {}
      modal.show "test-modal"

      modalElement = $(".modal", element)
      expect(modalElement.attr("style")).toBeDefined()

    it "should broadcast modalWasShown", ->
      called   = false
      openedId = ""
      element  = $("<div></div>")
      element.append $templateCache.get("template/modal.html")

      modal.register "test-modal", element, {}

      $rootScope.$on "modalWasShown", (event, id) ->
        openedId = id
        called   = true

      runs ->
        $rootScope.$apply -> modal.show "test-modal"

      waitsFor ->
        return called
      , "reciving message 'modalWasShown'", 500

      runs ->
        expect(openedId).toBe "test-modal"

    it "should hide the modal", ->
      opened   = false
      called   = false
      closedId = ""
      element  = $("<div></div>")
      element.append $templateCache.get("template/modal.html")

      $rootScope.$on "modalWasHidden", (event, id) ->
        closedId = id

      modal.register "test-modal", element, {}
      runs ->
        modal.show "test-modal"
        setTimeout ->
          opened = true
        , 100

      waitsFor ->
        return opened
      , "modal to be opened", 120

      runs ->
        modal.hide()
        setTimeout ->
          called = true
        , 350

      waitsFor ->
        return called
      , "modal to be hidden", 400

      runs ->
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

      runs ->
        modal.show "test-modal"
        setTimeout ->
          opened = true
        , 100

      waitsFor ->
        return opened
      , "modal to be opened", 120

      runs ->
        $(document).trigger $.Event("keydown", {which: keys.ESCAPE})
        expect(modalElement.hasClass("visible")).toBe false

    it "should close the modal after clicking on overlay", ->
      opened       = false
      modalElement = $compile("<mac-modal id='test-modal' mac-modal-overlay-close></mac-modal>") $rootScope
      $rootScope.$digest()

      runs ->
        modal.show "test-modal"
        setTimeout ->
          opened = true
        , 100

      waitsFor ->
        return opened
      , "modal to be opened", 120

      runs ->
        modalElement.click()
        expect(modalElement.hasClass("visible")).toBe false

    it "should execute callback when opening the modal", ->
      opened            = false
      $rootScope.opened = -> opened = true
      modalElement      = $compile("<mac-modal id='test-modal' mac-modal-open='opened()'></mac-modal>") $rootScope
      $rootScope.$digest()

      runs ->
        modal.show "test-modal"

      waitsFor ->
        return opened
      , "modal to be opened", 100

      runs ->
        expect(opened).toBe true

    it "should close the modal clicking on the close button", ->
      opened       = false
      modalElement = $compile("<mac-modal id='test-modal'></mac-modal>") $rootScope
      $rootScope.$digest()

      runs ->
        modal.show "test-modal"
        setTimeout ->
          opened = true
        , 100

      waitsFor ->
        return opened
      , "modal to be opened", 100

      runs ->
        $(".close-modal", modalElement).click()
        expect(modalElement.hasClass("visible")).toBe false

  describe "modal trigger", ->
    it "should bind a click event to trigger a modal", ->
      modalElement = $compile("<mac-modal id='test-modal'></mac-modal>") $rootScope
      element      = $compile("<button mac-modal='test-modal'></button>") $rootScope
      $rootScope.$digest()

      element.click()
      expect(modal.opened.id).toBe "test-modal"
