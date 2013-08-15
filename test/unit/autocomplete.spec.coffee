describe "Mac autocomplete", ->
  data             = {}
  $compile         = null
  $rootScope       = null
  keys             = null
  $sniffer         = null
  changeInputValue = null

  beforeEach module("Mac")
  beforeEach module("template/autocomplete.html")
  beforeEach module("template/menu.html")

  beforeEach inject (_$compile_, _$rootScope_, _keys_, _$sniffer_) ->
    $compile   = _$compile_
    $rootScope = _$rootScope_
    keys       = _keys_
    $sniffer   = _$sniffer_

    data = ["foo", "world", "bar"]

    changeInputValue = (element, value) ->
      element.val value
      element.trigger (if $sniffer.hasEvent("input") then "input" else "change")

  afterEach ->
    $(".mac-menu").remove()

  describe "Basic Initialization", ->
    it "should be compiled as text input", ->
      element = $compile("<mac-autocomplete ng-model='test'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      expect(element.is(":input[type='text']")).toBe true

    it "should throw an error if ng-model is not defined", ->
      init = ->
        element = $compile("<mac-autocomplete></mac-autocomplete>") $rootScope
        $rootScope.$digest()

      expect(init).toThrow()

  describe "source", ->
    it "should use local array", ->
      $rootScope.source = data
      $rootScope.test   = ""
      element           = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-autocomplete-delay='0'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      changeInputValue element, "fo"
      $rootScope.$digest()

      expect($(".mac-menu-item").text() == "foo").toBe true

    it "should use local label, value object", ->
      $rootScope.source = [
        {name: "foo", value: "foo"}
        {name: "world", value: "world"}
        {name: "bar", value: "bar"}
      ]
      element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-autocomplete-delay='0'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      changeInputValue element, "f"
      expect($(".mac-menu-item").text() == "foo").toBe true

  describe "label", ->
    it "should use default 'name' label", ->
      $rootScope.source = [
        {name: "foo", value: "foo"}
        {name: "world", value: "world"}
        {name: "bar", value: "bar"}
      ]
      element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-autocomplete-delay='0'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      changeInputValue element, "f"
      expect($(".mac-menu-item").text() == "foo").toBe true

    it "should not be able to find anything", ->
      $rootScope.source = [
        {key: "foo", value: "foo"}
        {key: "world", value: "world"}
        {key: "bar", value: "bar"}
      ]
      element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-autocomplete-delay='0'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      changeInputValue element, "f"
      expect($(".mac-menu-item").text() == "foo").toBe false

    it "should use 'label' as the key", ->
      $rootScope.source = [
        {label: "foo", value: "foo"}
        {label: "world", value: "world"}
        {label: "bar", value: "bar"}
      ]
      element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-autocomplete-label='label' mac-autocomplete-delay='0'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      changeInputValue element, "f"
      expect($(".mac-menu-item").text() == "foo").toBe true

  describe "options", ->
    $timeout = null

    beforeEach inject (_$timeout_) ->
      $timeout = _$timeout_

    it "should use default delay - 800ms", ->
      $rootScope.source = data

      element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      expect($(".mac-menu").hasClass "visible").toBe false

      changeInputValue element, "f"
      $rootScope.$digest()

      $timeout.flush()

      expect($(".mac-menu").hasClass "visible").toBe true

    it "should delay for 200ms", ->
      $rootScope.source = data

      element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-autocomplete-delay='200'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      expect($(".mac-menu").hasClass "visible").toBe false

      changeInputValue element, "f"
      $rootScope.$digest()

      $timeout.flush()

      expect($(".mac-menu").hasClass "visible").toBe true

    it "should disable autocomplete", ->
      $rootScope.disabled = true
      element             = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-disabled='disabled'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      expect($(".mac-menu").hasClass "visible").toBe false

      changeInputValue element, "f"
      $rootScope.$digest()

      expect($(".mac-menu").hasClass "visible").toBe false

  describe "callbacks", ->
    $httpBackend = null
    $timeout     = null

    beforeEach inject (_$httpBackend_, _$timeout_) ->
      $httpBackend = _$httpBackend_
      $timeout     = _$timeout_

    it "should call select", ->
      called            = false
      selectedItem      = ""
      $rootScope.source = data
      $rootScope.select = (selected) ->
        selectedItem = selected
        called       = true

      element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-source='source' mac-autocomplete-on-select='select(selected)'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      runs ->
        changeInputValue element, "f"
        $rootScope.$digest()

        $timeout.flush()

        element.trigger $.Event("keydown", {which: keys.ENTER})

      waitsFor ->
        return called
      , "selected item", 200

      runs ->
        expect(selectedItem).toBe "foo"

    it "should call success", ->
      $httpBackend.when("GET", "/api/autocomplete?q=f").respond({data})

      result             = []
      $rootScope.url     = "/api/autocomplete"
      $rootScope.success = (data) ->
        result = data

      element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-url='url' mac-autocomplete-on-success='success(data)'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      changeInputValue element, "f"
      $rootScope.$digest()

      $timeout.flush()
      $httpBackend.flush()

      expect(result.data.length).toBe 3

    it "should have three items in autocomplete list", ->
      $httpBackend.when("GET", "/api/autocomplete?q=f").respond({data})

      $rootScope.url     = "/api/autocomplete"
      $rootScope.success = (data) ->
        return data.data

      element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-url='url' mac-autocomplete-on-success='success(data)'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      changeInputValue element, "f"
      $rootScope.$digest()

      $timeout.flush()
      $httpBackend.flush()

      expect($(".mac-menu-item").length).toBe 3

    it "should call error", ->
      $httpBackend.when("GET", "/api/404?q=f").respond(404)

      called           = false
      $rootScope.url   = "/api/404"
      $rootScope.error = (data) -> called = true

      element = $compile("<mac-autocomplete ng-model='test' mac-autocomplete-url='url' mac-autocomplete-on-error='error(data)'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      changeInputValue element, "f"
      $rootScope.$digest()

      $timeout.flush()
      $httpBackend.flush()

      expect(called).toBe true

  describe "model -> view", ->
    it "should update the view", ->
      element = $compile("<mac-autocomplete ng-model='value'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      $rootScope.value = "hello"
      $rootScope.$digest()

      expect(element.val()).toBe "hello"
