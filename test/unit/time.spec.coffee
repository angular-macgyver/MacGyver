describe "Mac Time input", ->
  beforeEach module("Mac")
  beforeEach module("template/time.html")

  describe "Basic Initialization", ->
    $compile   = null
    $rootScope = null

    beforeEach inject (_$compile_, _$rootScope_) ->
      $compile   = _$compile_
      $rootScope = _$rootScope_

    it "should replace with template", ->
      element = $compile("<mac-time></mac-time>") $rootScope
      $rootScope.$digest()

      expect(element.hasClass("date-time")).toBe true

    it "should use default placeholder", ->
      element = $compile("<mac-time></mac-time>") $rootScope
      $rootScope.$digest()

      expect($("input", element).prop("placeholder")).toBe "--:--"

    it "should use default time (12:00AM)", ->
      $rootScope.model = ""
      element          = $compile("<mac-time mac-time-model='model'></mac-time>") $rootScope
      $rootScope.$digest()

      expectTime = new Date "Jan 1, 1970, 12:00 AM"
      expect($("input", element).scope().time.getTime()).toBe expectTime.getTime()

    it "should use set default time based on user input", ->
      $rootScope.model = ""
      element          = $compile("<mac-time mac-time-default='06:30 PM'></mac-time>") $rootScope
      $rootScope.$digest()

      expectTime = new Date "Jan 1, 1970, 06:30 PM"
      expect($("input", element).scope().time.getTime()).toBe expectTime.getTime()

    it "should update the model with default time", ->
      $rootScope.model = ""
      element          = $compile("<mac-time mac-time-model='model'></mac-time>") $rootScope
      $rootScope.$digest()

      $("input", element).click()

      expect($rootScope.model).toBe "12:00 AM"

  describe "Events", ->
    $compile   = null
    $rootScope = null

    beforeEach inject (_$compile_, _$rootScope_) ->
      $compile   = _$compile_
      $rootScope = _$rootScope_

    it "should change the model after pressing down button", ->
      element = $compile("<mac-time mac-time-model='model'></mac-time>") $rootScope
      $rootScope.$digest()

      input           = $("input", element)
      downEvent       = $.Event("keydown")
      downEvent.which = 40
      input.focus()
      input.trigger downEvent

      expect($rootScope.model).toBe "11:00 PM"

    it "should change the model after pressing up button", ->
      element = $compile("<mac-time mac-time-model='model'></mac-time>") $rootScope
      $rootScope.$digest()

      input           = $("input", element)
      downEvent       = $.Event("keydown")
      downEvent.which = 38
      input.focus()
      input.trigger downEvent

      expect($rootScope.model).toBe "01:00 AM"

  describe "view -> model", ->
    $compile         = null
    $rootScope       = null
    $sniffer         = null
    changeInputValue = null

    beforeEach inject (_$compile_, _$rootScope_, _$sniffer_) ->
      $compile   = _$compile_
      $rootScope = _$rootScope_
      $sniffer   = _$sniffer_

      changeInputValue = (element, value) ->
        element.val value
        element.trigger (if $sniffer.hasEvent("input") then "input" else "change")

    it "should update the model correctly", ->
      $rootScope.model = ""
      element          = $compile("<mac-time mac-time-model='model'></mac-time>") $rootScope
      $rootScope.$digest()

      input = $("input", element)
      input.click()
      changeInputValue input, "06:25 PM"

      expect($rootScope.model).toBe "06:25 PM"

    it "should reset back to the original time when input is invalid", ->
      $rootScope.model = ""
      element          = $compile("<mac-time mac-time-model='model'></mac-time>") $rootScope
      $rootScope.$digest()

      input = $("input", element)
      input.click()
      changeInputValue input, "06:25 PM"

      changeInputValue input, "14:41 AM"

      expect($rootScope.model).toBe "06:25 PM"

    it "should reset back to the original time when input is invalid", ->
      $rootScope.model = ""
      element          = $compile("<mac-time mac-time-model='model'></mac-time>") $rootScope
      $rootScope.$digest()

      input = $("input", element)
      input.click()
      changeInputValue input, "06:25 PM"

      changeInputValue input, "123"

      expect($rootScope.model).toBe "06:25 PM"

  describe "model -> view", ->
    $compile   = null
    $rootScope = null

    beforeEach inject (_$compile_, _$rootScope_) ->
      $compile   = _$compile_
      $rootScope = _$rootScope_

    it "should update the value of the input", ->
      element = $compile("<mac-time mac-time-model='model'></mac-time>") $rootScope
      $rootScope.$digest()

      input = $("input", element)
      expect(input.val()).toBe ""

      $rootScope.model = "02:30 PM"
      $rootScope.$digest()

      expect(input.val()).toBe "02:30 PM"

  describe "disabled", ->
    $compile   = null
    $rootScope = null

    beforeEach inject (_$compile_, _$rootScope_) ->
      $compile   = _$compile_
      $rootScope = _$rootScope_

    it "should disable the input", ->
      $rootScope.disabled = true
      element             = $compile("<mac-time mac-time-disabled='disabled'></mac-time>") $rootScope
      $rootScope.$digest()

      input = $("input", element)
      expect(input.prop("disabled")).toBe true

    it "should disable the input when scope variable changes", ->
      $rootScope.disabled = false
      element             = $compile("<mac-time mac-time-disabled='disabled'></mac-time>") $rootScope
      $rootScope.$digest()

      input = $("input", element)
      expect(input.prop("disabled")).toBe false

      $rootScope.disabled = true
      $rootScope.$digest()

      expect(input.prop("disabled")).toBe true
