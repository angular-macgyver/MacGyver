describe "Mac Fileupload", ->
  beforeEach module("Mac")

  describe "Options updates", ->
    $compile   = null
    $rootScope = null

    beforeEach inject (_$compile_, _$rootScope_) ->
      $compile   = _$compile_
      $rootScope = _$rootScope_

    it "should initialize fileupload plugin", ->
      element = $compile("<input type='file' mac-upload />") $rootScope
      expect(element.data("blueimp-fileupload")).not.toBe null

    it "should update url", ->
      scope     = $rootScope.$new()
      scope.url = "/test_upload"
      element   = $compile("<input type='file' mac-upload mac-upload-route='url' />") scope
      scope.url = "/test"
      scope.$digest()

      expect(element.fileupload("option", "url")).toBe "/test"

    it "should update form data", ->
      scope          = $rootScope.$new()
      scope.formData = {randomText: "helloWorld"}
      element        = $compile("<input type='file' mac-upload mac-upload-form-data='formData' />") scope
      scope.$digest()
      expect(element.fileupload("option", "formData").randomText).toBe "helloWorld"

      scope.formData = {randomText: "foobar"}
      scope.$digest()
      expect(element.fileupload("option", "formData").randomText).toBe "foobar"

    it "should update default options", ->
      scope         = $rootScope.$new()
      scope.options = {singleFileUploads: false}
      element       = $compile("<input type='file' mac-upload mac-upload-options='options' />") scope
      scope.$digest()

      expect(element.fileupload("option", "singleFileUploads")).toBe false

