describe "Mac autocomplete", ->
  data       = {}
  $compile   = null
  $rootScope = null
  keys       = null

  beforeEach module("Mac")
  beforeEach module("template/autocomplete.html")

  beforeEach inject (_$compile_, _$rootScope_, _keys_) ->
    $compile   = _$compile_
    $rootScope = _$rootScope_
    keys       = _keys_

    data = ["foo", "world", "bar"]

  describe "Basic Initialization", ->
    it "should be compiled as text input", ->
      element = $compile("<mac-autocomplete></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      expect(element.is(":input[type='text']")).toBe true

    it "should initialized jquery ui autocomplete", ->
      init = ->
        element = $compile("<mac-autocomplete></mac-autocomplete>") $rootScope
        $rootScope.$digest()
        element.autocomplete("widget")

      expect(init).not.toThrow()

  describe "source", ->
    it "should use local array", ->
      $rootScope.source = data
      element           = $compile("<mac-autocomplete mac-autocomplete-source='source'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      menu = element.autocomplete("widget")

      element.val("fo").autocomplete("search")
      expect(menu.find(".ui-menu-item").text() == "foo").toBe true

    it "should use local label, value object", ->
      $rootScope.source = [
        {name: "foo", value: "foo"}
        {name: "world", value: "world"}
        {name: "bar", value: "bar"}
      ]
      element           = $compile("<mac-autocomplete mac-autocomplete-source='source'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      menu = element.autocomplete("widget")

      element.val("f").autocomplete("search")
      expect(menu.find(".ui-menu-item").text() == "foo").toBe true

  describe "label", ->
    it "should use default 'name' label", ->
      $rootScope.source = [
        {name: "foo", value: "foo"}
        {name: "world", value: "world"}
        {name: "bar", value: "bar"}
      ]
      element = $compile("<mac-autocomplete mac-autocomplete-source='source'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      menu = element.autocomplete("widget")

      element.val("f").autocomplete("search")
      expect(menu.find(".ui-menu-item").text() == "foo").toBe true

    it "should not be able to find anything", ->
      $rootScope.source = [
        {key: "foo", value: "foo"}
        {key: "world", value: "world"}
        {key: "bar", value: "bar"}
      ]
      element = $compile("<mac-autocomplete mac-autocomplete-source='source'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      menu = element.autocomplete("widget")

      element.val("f").autocomplete("search")
      expect(menu.find(".ui-menu-item").text() == "foo").toBe false

    it "should use 'label' as the key", ->
      $rootScope.source = [
        {label: "foo", value: "foo"}
        {label: "world", value: "world"}
        {label: "bar", value: "bar"}
      ]
      element = $compile("<mac-autocomplete mac-autocomplete-source='source' mac-autocomplete-label='label'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      menu = element.autocomplete("widget")

      element.val("f").autocomplete("search")
      expect(menu.find(".ui-menu-item").text() == "foo").toBe true

  describe "options", ->
    it "should use default delay", ->
      called            = false
      $rootScope.source = data

      element = $compile("<mac-autocomplete mac-autocomplete-source='source'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      menu = element.autocomplete("widget")

      runs ->
        element.val("f").keydown()
        expect(menu.is(":hidden")).toBe true

        setTimeout ->
          called = true
        , 850

      waitsFor ->
        return called
      , "Menu delay", 850

      runs ->
        expect(menu.is(":visible")).toBe true

    it "should delay for 200ms", ->
      called            = false
      $rootScope.source = data

      element = $compile("<mac-autocomplete mac-autocomplete-source='source' mac-autocomplete-delay='200'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      menu = element.autocomplete("widget")

      runs ->
        element.val("f").keydown()
        expect(menu.is(":hidden")).toBe true

        setTimeout ->
          called = true
        , 250

      waitsFor ->
        return called
      , "Menu delay for 200ms", 250

      runs ->
        expect(menu.is(":visible")).toBe true

    it "should disable autocomplete", ->
      $rootScope.disabled = true
      element             = $compile("<mac-autocomplete mac-autocomplete-disabled='disabled'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      menu = element.autocomplete("widget")
      element.val("test").keydown()

      expect(menu.is(":hidden")).toBe true

      expect(menu.hasClass("ui-autocomplete-disabled")).toBe true

  describe "callbacks", ->
    $httpBackend = null
    beforeEach inject (_$httpBackend_) ->
      $httpBackend = _$httpBackend_

    it "should call select", ->
      called            = false
      selectedItem      = ""
      $rootScope.source = data
      $rootScope.select = (selected) ->
        selectedItem = selected
        called       = true

      element = $compile("<mac-autocomplete mac-autocomplete-source='source' mac-autocomplete-delay='0' mac-autocomplete-on-select='select(selected)'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      menu = element.autocomplete("widget")

      runs ->
        element.val("f").keydown()
        element.trigger $.Event("keydown", {keyCode: keys.DOWN})
        element.trigger $.Event("keydown", {keyCode: keys.ENTER})

      waitsFor ->
        return called
      , "selected item", 200

      runs ->
        expect(selectedItem).toBe "foo"

    it "should call success", ->
      $httpBackend.when("GET", "/api/autocomplete?q=f").respond({data})

      called             = false
      result             = []
      $rootScope.url     = "/api/autocomplete"
      $rootScope.success = (data) ->
        result = data
        called = true

      element = $compile("<mac-autocomplete mac-autocomplete-url='url' mac-autocomplete-delay='0' mac-autocomplete-on-success='success(data)'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      runs ->
        element.val("f").autocomplete("search")
        $httpBackend.flush()

      waitsFor ->
        return called
      , "Remote source", 750

      runs ->
        expect(result.data.length).toBe 3

    it "should have three items in autocomplete list", ->
      $httpBackend.when("GET", "/api/autocomplete?q=f").respond({data})

      called             = false
      $rootScope.url     = "/api/autocomplete"
      $rootScope.success = (data) ->
        called = true
        return data.data

      element = $compile("<mac-autocomplete mac-autocomplete-url='url' mac-autocomplete-delay='0' mac-autocomplete-on-success='success(data)'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      menu = element.autocomplete("widget")

      runs ->
        element.val("f").autocomplete("search")
        $httpBackend.flush()

      waitsFor ->
        return called
      , "Remote source", 750

      runs ->
        expect(menu.find(".ui-menu-item").length).toBe 3

    it "should call error", ->
      $httpBackend.when("GET", "/api/404?q=f").respond(404)

      called           = false
      $rootScope.url   = "/api/404"
      $rootScope.error = (data) -> called = true

      element = $compile("<mac-autocomplete mac-autocomplete-url='url' mac-autocomplete-delay='0' mac-autocomplete-on-error='error(data)'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      runs ->
        element.val("f").autocomplete("search")
        $httpBackend.flush()

      waitsFor ->
        return called
      , "Remote source", 750

      runs ->
        expect(called).toBe true

  describe "model -> view", ->
    it "should update the view", ->
      element = $compile("<mac-autocomplete ng-model='value'></mac-autocomplete>") $rootScope
      $rootScope.$digest()

      $rootScope.value = "hello"
      $rootScope.$digest()

      expect(element.val()).toBe "hello"
