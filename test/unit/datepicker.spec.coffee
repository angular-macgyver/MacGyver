describe "Mac datepicker", ->
  $compile   = null
  $rootScope = null
  keys       = null
  equalsDate = null

  beforeEach module("Mac")
  beforeEach module("template/datepicker.html")

  beforeEach inject (_$compile_, _$rootScope_, _keys_) ->
    $compile   = _$compile_
    $rootScope = _$rootScope_
    keys       = _keys_

    equalsDate = (d1, d2, message) ->
      d1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate())
      d2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate())
      expect(d1.toString()).toBe d2.toString()

  describe "basic initialization", ->
    it "should be replaced with template", ->
      element = $compile("<mac-datepicker></mac-datepicker>") $rootScope
      $rootScope.$digest()

      expect(element.hasClass("mac-date-time")).toBe true

    it "should set mac-id on input", ->
      element = $compile("<mac-datepicker mac-datepicker-id='test-picker'></mac-datepicker>") $rootScope
      $rootScope.$digest()

      inputElement = $("input", element)
      expect(inputElement.attr("mac-id")).toBe "test-picker"

    it "should not set ng-disabled on input", ->
      element = $compile("<mac-datepicker></mac-datepicker>") $rootScope
      $rootScope.$digest()

      inputElement = $("input", element)
      expect(inputElement.attr("ng-disabled")).not.toBeDefined()

    it "should set ng-disabled on input", ->
      $rootScope.disabled = true
      element = $compile("<mac-datepicker mac-datepicker-disabled='disabled'></mac-datepicker>") $rootScope
      $rootScope.$digest()

      inputElement = $("input", element)
      expect(inputElement.attr("ng-disabled")).toBe "disabled"
      expect(inputElement.prop("disabled")).toBe true

  describe "options", ->
    it "should set options using attributes", ->
      element = $compile("<mac-datepicker mac-datepicker-append-text='test'></mac-datepicker>") $rootScope
      $rootScope.$digest()

      inputElement = $("input", element)
      expect(inputElement.datepicker("option", "appendText")).toBe "test"

    it "should set dateFormat correctly", ->
      element = $compile("<mac-datepicker mac-datepicker-date-format='yyyy/mm/dd'></mac-datepicker>") $rootScope
      $rootScope.$digest()

      inputElement = $("input", element)
      expect(inputElement.datepicker("option", "dateFormat")).toBe "yyyy/mm/dd"

  describe "defaultDate", ->
    it "should set defaultDate to null", ->
      date    = new Date()
      element = $compile("<mac-datepicker></mac-datepicker>") $rootScope
      $("body").append element
      $rootScope.$digest()

      inputElement = $("input", element)
      inputElement.val("").datepicker("show").
        trigger $.Event("keydown", keyCode: keys.ENTER)

      equalsDate inputElement.datepicker("getDate"), date

    it "should set defaultDate with numerical value", ->
      $rootScope.defaultDate = 2
      date                   = new Date()
      date.setDate date.getDate() + 2

      element = $compile("<mac-datepicker mac-datepicker-default-date='defaultDate'></mac-datepicker>") $rootScope
      $("body").append element
      $rootScope.$digest()

      inputElement = $("input", element)
      inputElement.val("").datepicker("show").
        trigger $.Event("keydown", keyCode: keys.ENTER)

      equalsDate inputElement.datepicker("getDate"), date

    it "should set defaultDate with numerical value", ->
      $rootScope.defaultDate = "-3d"
      date                   = new Date()
      date.setDate date.getDate() - 3

      element = $compile("<mac-datepicker mac-datepicker-default-date='defaultDate'></mac-datepicker>") $rootScope
      $("body").append element
      $rootScope.$digest()

      inputElement = $("input", element)
      inputElement.val("").datepicker("show").
        trigger $.Event("keydown", keyCode: keys.ENTER)

      equalsDate inputElement.datepicker("getDate"), date

  describe "min/max", ->
    it "should set the min date correctly", ->
      date = new Date()
      date.setMonth date.getMonth() - 6
      $rootScope.minDate = date

      element = $compile("<mac-datepicker mac-datepicker-min-date='minDate'></mac-datepicker>") $rootScope
      $rootScope.$digest()

      inputElement = $("input", element)
      equalsDate inputElement.datepicker("option", "minDate"), date

    it "should set the min date correctly", ->
      date = new Date()
      date.setMonth date.getMonth() - 6
      $rootScope.maxDate = date

      element = $compile("<mac-datepicker mac-datepicker-max-date='maxDate'></mac-datepicker>") $rootScope
      $rootScope.$digest()

      inputElement = $("input", element)
      equalsDate inputElement.datepicker("option", "maxDate"), date

  describe "validation", ->
    it "should set to invalid", ->
      $rootScope.model = "01/01/2014"

      element = $compile("<mac-datepicker mac-datepicker-model='model'></mac-datepicker>") $rootScope
      $rootScope.$digest()

      input = $("input", element)
      expect(input.hasClass("ng-valid")).toBeTruthy()

      $rootScope.model = "13/01/2014"
      $rootScope.$digest()

      expect(input.hasClass("ng-invalid")).toBeTruthy()

  describe "view -> model", ->
    $sniffer         = null
    changeInputValue = ->

    beforeEach inject (_$sniffer_) ->
      $sniffer = _$sniffer_

      changeInputValue = (element, value) ->
        element.val value
        element.trigger (if $sniffer.hasEvent("input") then "input" else "change")

    it "should update model", ->
      $rootScope.model = "01/01/2014"

      element = $compile("<mac-datepicker mac-datepicker-model='model'></mac-datepicker>") $rootScope
      $rootScope.$digest()

      input = $("input", element)
      changeInputValue input, "10/21/2015"

      expect($rootScope.model).toBe "10/21/2015"

  describe "callbacks", ->
    it "should call on select callback and set the model", ->
      called           = false
      date             = new Date()
      $rootScope.model = ""

      $rootScope.onSelect = (date) -> called = true

      element = $compile("<mac-datepicker mac-datepicker-on-select='onSelect(date)' mac-datepicker-model='model'></mac-datepicker>") $rootScope
      $rootScope.$digest()
      $("body").append element

      inputElement = $("input", element)

      runs ->
        inputElement.val("").datepicker("show").
          trigger $.Event("keydown", keyCode: keys.ENTER)

      waitsFor ->
        return called
      , "on select callback to fire", 150

      runs ->
        equalsDate new Date($rootScope.model), date

    it "should call on close", ->
      called             = false
      closedDate         = ""
      date               = new Date()
      $rootScope.onClose = (onCloseDate) ->
        closedDate = onCloseDate
        called     = true

      element = $compile("<mac-datepicker mac-datepicker-on-close='onClose(date)'></mac-datepicker>") $rootScope
      $rootScope.$digest()
      $("body").append element

      inputElement = $("input", element)

      runs ->
        inputElement.val("").datepicker("show").
          trigger $.Event("keydown", keyCode: keys.ENTER)

      waitsFor ->
        return called
      , "on close callback to fire", 150

      runs ->
        equalsDate new Date(closedDate), date
