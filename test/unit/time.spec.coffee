describe "Mac Time input", ->
  beforeEach module("Mac")
  beforeEach module("template/time.html")

  describe "Basic Initialization", ->
    $compile   = null
    $rootScope = null
    currentDate = new Date().toDateString()

    beforeEach inject (_$compile_, _$rootScope_) ->
      $compile   = _$compile_
      $rootScope = _$rootScope_

    it "should replace with template", ->
      element = $compile("<mac-time ng-model='model'></mac-time>") $rootScope
      $rootScope.$digest()

      expect(element.hasClass("mac-date-time")).toBe true

    it "should use default placeholder", ->
      element = $compile("<mac-time ng-model='model'></mac-time>") $rootScope
      $rootScope.$digest()

      expect(element.prop("placeholder")).toBe "--:--"

    it "should use set default time based on user input", ->
      $rootScope.model = ""
      element          = $compile("<mac-time ng-model='model' mac-time-default='06:30 PM'></mac-time>") $rootScope
      $rootScope.$digest()

      element.triggerHandler "click"
      $rootScope.$digest()

      expect($rootScope.model).toBe "06:30 PM"

    it "should update the model with default time", ->
      $rootScope.model = ""
      element          = $compile("<mac-time ng-model='model'></mac-time>") $rootScope
      $rootScope.$digest()

      element.triggerHandler "click"
      $rootScope.$digest()

      expect($rootScope.model).toBe "12:00 AM"

    it "should reset back to default value when clearing model", ->
      $rootScope.model = "2:30 PM"
      element          = $compile("<mac-time ng-model='model'></mac-time>") $rootScope
      $rootScope.$digest()

      $rootScope.model = ""
      $rootScope.$digest()

      element.triggerHandler "click"
      $rootScope.$digest()

      expect($rootScope.model).toBe "12:00 AM"

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
        element.triggerHandler (if $sniffer.hasEvent("input") then "input" else "change")

    it "should update the model correctly", ->
      $rootScope.model = ""
      element          = $compile("<mac-time ng-model='model'></mac-time>") $rootScope
      $rootScope.$digest()

      element.triggerHandler 'click'
      changeInputValue element, "06:25 PM"

      expect($rootScope.model).toBe "06:25 PM"

    it "should reset back to the original time when input is invalid - 1", ->
      $rootScope.model = ""
      element          = $compile("<mac-time ng-model='model'></mac-time>") $rootScope
      $rootScope.$digest()

      element.triggerHandler 'click'
      $rootScope.$digest()

      changeInputValue element, "14:41 AM"
      element.triggerHandler 'blur'
      $rootScope.$digest()

      expect($rootScope.model).toBe("12:00 AM")

    it "should reset back to the original time when input is invalid - 2", ->
      $rootScope.model = ""
      element          = $compile("<mac-time ng-model='model'></mac-time>") $rootScope
      $rootScope.$digest()

      element.triggerHandler 'click'
      $rootScope.$digest()

      changeInputValue element, "123"
      element.triggerHandler 'blur'
      $rootScope.$digest()

      expect($rootScope.model).toBe("12:00 AM")

  describe "model -> view", ->
    $compile   = null
    $rootScope = null

    beforeEach inject (_$compile_, _$rootScope_) ->
      $compile   = _$compile_
      $rootScope = _$rootScope_

    it "should update the value of the input", ->
      element = $compile("<mac-time ng-model='model'></mac-time>") $rootScope
      $rootScope.$digest()

      expect(element.val()).toBe ""

      $rootScope.model = "02:30 PM"
      $rootScope.$digest()

      expect(element.val()).toBe "02:30 PM"

    it "should clear out text input when clearing model", ->
      element = $compile("<mac-time ng-model='model'></mac-time>") $rootScope
      $rootScope.$digest()

      $rootScope.model = "02:30 PM"
      $rootScope.$digest()

      expect(element.val()).toBe "02:30 PM"

      $rootScope.model = ""
      $rootScope.$digest()
      expect(element.val()).toBe ""

    it "should clear out text input when clearing model with null", ->
      element = $compile("<mac-time ng-model='model'></mac-time>") $rootScope
      $rootScope.$digest()

      $rootScope.model = "02:30 PM"
      $rootScope.$digest()

      $rootScope.model = null
      $rootScope.$digest()
      expect(element.val()).toBe ""
