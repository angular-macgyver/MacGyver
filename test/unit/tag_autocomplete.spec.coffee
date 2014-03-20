describe "Mac tag autocomplete", ->
  $compile   = null
  $rootScope = null
  $timeout   = null
  keys       = null

  beforeEach module("Mac")
  beforeEach module("template/tag_autocomplete.html")
  beforeEach module("template/autocomplete.html")
  beforeEach module("template/menu.html")

  beforeEach inject (_$compile_, _$rootScope_, _$timeout_, _keys_) ->
    $compile   = _$compile_
    $rootScope = _$rootScope_
    $timeout   = _$timeout_
    keys       = _keys_

  describe "basic initialization", ->
    it "should be replaced by the template", ->
      element = $compile("<mac-tag-autocomplete></mac-tag-autocomplete>") $rootScope
      $rootScope.$digest()

      expect(element.hasClass("mac-tag-autocomplete")).toBeTruthy()

    it "should set default value and label attribute on mac-autocomplete", ->
      element = $compile("<mac-tag-autocomplete></mac-tag-autocomplete>") $rootScope
      $rootScope.$digest()

      textInput = $(".mac-autocomplete", element)
      expect(textInput.attr("mac-autocomplete-value")).toBe "id"
      expect(textInput.attr("mac-autocomplete-label")).toBe "name"

    it "should set value and label attribute on mac-autocomplete", ->
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-label='test-name' mac-tag-autocomplete-value='test-id'></mac-tag-autocomplete>") $rootScope
      $rootScope.$digest()

      textInput = $(".mac-autocomplete", element)
      expect(textInput.attr("mac-autocomplete-value")).toBe "test-id"
      expect(textInput.attr("mac-autocomplete-label")).toBe "test-name"

    it "should pass empty string as key and value", ->
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-label='' mac-tag-autocomplete-value=''></mac-tag-autocomplete>") $rootScope
      $rootScope.$digest()

      textInput = $(".mac-autocomplete", element)
      expect(textInput.attr("mac-autocomplete-value")).toBe ""
      expect(textInput.attr("mac-autocomplete-label")).toBe ""

    it "should set query attribute on mac-autocomplete", ->
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-query='query'></mac-tag-autocomplete>") $rootScope
      $rootScope.$digest()

      textInput = $(".mac-autocomplete", element)
      expect(textInput.attr("mac-autocomplete-query")).toBe "query"

    it "should set delay attribute on mac-autocomplete", ->
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-delay='100'></mac-tag-autocomplete>") $rootScope
      $rootScope.$digest()

      textInput = $(".mac-autocomplete", element)
      expect(textInput.attr("mac-autocomplete-delay")).toBe "100"

    it "should set the url attribute on mac-autocomplete", ->
      $rootScope.url = "/test"

      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-url='url'></mac-tag-autocomplete>") $rootScope
      $rootScope.$digest()

      textInput = $(".mac-autocomplete", element)
      expect(textInput.attr("mac-autocomplete-url")).toBe "url"

    it "should set the source attribute on mac-autocomplete", ->
      $rootScope.source = ["test", "test1", "test2"]
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-source='source'></mac-tag-autocomplete>") $rootScope
      $rootScope.$digest()

      textInput = $(".mac-autocomplete", element)
      expect(textInput.attr("mac-autocomplete-source")).toBe "autocompleteSource"

    it "should have the same source function as the parent scope", ->
      $rootScope.source = jasmine.createSpy "source"
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-source='source'></mac-tag-autocomplete>") $rootScope
      $rootScope.$digest()
      $rootScope.$$childHead.autocompleteSource()

      expect($rootScope.source).toHaveBeenCalled()

    xit "should focus on autocomplete when click on tag autocomplete", ->
      $rootScope.source = ["test", "test1", "test2"]
      element           = $compile("<mac-tag-autocomplete mac-tag-autocomplete-source='source'></mac-tag-autocomplete>") $rootScope
      $rootScope.$digest()

      element.click()

      textInput = $(".mac-autocomplete", element)
      expect(textInput.is(":focus")).toBeTruthy()

    it "should model -> view", ->
      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-model='model'></mac-tag-autocomplete>") $rootScope
      $rootScope.$digest()

      $rootScope.model = "Here"
      $rootScope.$digest()

      textInput = $(".mac-autocomplete", element)
      expect(textInput.val()).toBe "Here"

  describe "binding events", ->
    it "should bind events to autocomplete", ->
      $rootScope.keyup = jasmine.createSpy "keyup"

      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-events='keyup' mac-tag-autocomplete-on-keyup='keyup()'></mac-tag-autocomplete>") $rootScope
      $rootScope.$digest()
      $timeout.flush()

      textInput = $(".mac-autocomplete", element)
      textInput.trigger "keyup", keyCode: keys.A

      expect($rootScope.keyup).toHaveBeenCalled()

  describe "selected variable", ->
    it "should filter out used tags", ->
      $rootScope.source   = [
        {id: "tag1"},
        {id: "tag2"},
        {id: "tag3"}
      ]
      $rootScope.selected = [{id: "tag1"}]

      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-source='source' mac-tag-autocomplete-selected='selected'></mac-tag-autocomplete>") $rootScope
      $rootScope.$digest()

      textInputScope = $rootScope.$$childHead

      expect(textInputScope.autocompleteSource.length).toBe 2

    it "should update autocompleteSource when source changes", ->
      $rootScope.source   = [
        {id: "tag1"},
        {id: "tag2"},
        {id: "tag3"}
      ]
      $rootScope.selected = [{id: "tag1"}]

      element = $compile("""
        <mac-tag-autocomplete
          mac-tag-autocomplete-source='source'
          mac-tag-autocomplete-selected='selected'>
        </mac-tag-autocomplete>""") $rootScope
      $rootScope.$digest()

      textInputScope = $rootScope.$$childHead

      $rootScope.source.push {id: "tag5"}
      $rootScope.$digest()

      expect(textInputScope.autocompleteSource.length).toBe 3

    it "should have a placeholder", ->
      $rootScope.selected = []
      element = $compile("""
        <mac-tag-autocomplete
          mac-tag-autocomplete-placeholder = \"'Testing'\"
          mac-tag-autocomplete-selected='selected'>
        </mac-tag-autocomplete>""") $rootScope
      $rootScope.$digest()

      textInputScope = $rootScope.$$childHead
      expect(textInputScope.autocompletePlaceholder).toBe "Testing"

    it "should not have a placeholder when there is selcted tag", ->
      $rootScope.selected = [{id: "tag123"}]
      element = $compile("""
        <mac-tag-autocomplete
          mac-tag-autocomplete-placeholder = \"'Testing'\"
          mac-tag-autocomplete-selected='selected'>
        </mac-tag-autocomplete>""") $rootScope
      $rootScope.$digest()

      textInputScope = $rootScope.$$childHead
      expect(textInputScope.autocompletePlaceholder).toBe ""

  describe "onKeyDown", ->
    it "should fire keydown callback", ->
      $rootScope.keydown = jasmine.createSpy "keydown"

      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-on-keydown='keydown()'></mac-tag-autocomplete>") $rootScope
      $rootScope.$digest()

      textInput = $(".mac-autocomplete", element)
      browserTrigger textInput, "keydown"

      expect($rootScope.keydown).toHaveBeenCalled()

    it "should remove the last tag", ->
      called              = false
      $rootScope.keydown  = -> called = true
      $rootScope.selected = [{id: "tag1"}]

      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-selected='selected' mac-tag-autocomplete-on-keydown='keydown()'></mac-tag-autocomplete>") $rootScope
      $rootScope.$digest()

      textInput = $(".mac-autocomplete", element)
      textInput.trigger $.Event("keydown", which: keys.BACKSPACE)

      expect($rootScope.selected.length).toBe 0

    it "should push the text into selected", ->
      called              = false
      $rootScope.keydown  = -> called = true
      $rootScope.selected = []

      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-selected='selected' mac-tag-autocomplete-on-keydown='keydown()' mac-tag-autocomplete-disabled='true'></mac-tag-autocomplete>") $rootScope
      $rootScope.$digest()

      textInput = $(".mac-autocomplete", element)
      $rootScope.$$childHead.textInput = "Testing"
      textInput.trigger $.Event("keydown", which: keys.ENTER)

      $timeout.flush()

      expect($rootScope.selected.length).toBe 1

  describe "on select callback", ->
    it "should fire callback", ->
      called              = false
      $rootScope.onEnter  = ->
        called = true
        return "Testing"
      $rootScope.selected = []

      element = $compile("<mac-tag-autocomplete mac-tag-autocomplete-selected='selected' mac-tag-autocomplete-on-enter='onEnter(item)' mac-tag-autocomplete-disabled='true'></mac-tag-autocomplete>") $rootScope
      $rootScope.$digest()

      textInput = $(".mac-autocomplete", element)
      $rootScope.$$childHead.textInput = "Testing"
      textInput.trigger $.Event("keydown", which: keys.ENTER)

      $timeout.flush()

      expect(called).toBeTruthy()
