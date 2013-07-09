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

  describe "Callbacks", ->
    $compile   = null
    $rootScope = null

    beforeEach inject (_$compile_, _$rootScope_) ->
      $compile   = _$compile_
      $rootScope = _$rootScope_

    it "should call submit", ->
      param        = {files: [{name: 'test'}]}
      called       = false
      scope        = $rootScope.$new()
      scope.submit = -> called = true

      element = $compile("<input type='file' mac-upload mac-upload-submit='submit()' />") scope
      scope.$digest()

      waitsFor ->
        element.fileupload "add", param
        return called
      , "Submit function should be called", "750"

      runs ->
        expect(called).toBe true

    it "should call success", ->
      param         = {files: [{name: 'test'}]}
      called        = false
      scope         = $rootScope.$new()
      scope.success = -> called = true

      element = $compile("<input type='file' mac-upload mac-upload-success='success()' />") scope
      scope.$digest()

      waitsFor ->
        element.fileupload "send", param
        return called
      , "Success function should be called", "750"

      runs ->
        expect(called).toBe true

    it "should call error", ->
      param       = {files: [{name: 'test'}]}
      called      = false
      scope       = $rootScope.$new()
      scope.error = -> called = true
      scope.route = "404"

      element = $compile("<input type='file' mac-upload mac-upload-error='error()' mac-upload-route='route' />") scope
      scope.$digest()

      waitsFor ->
        element.fileupload "send", param
        return called
      , "Error function should be called", "750"

      runs ->
        expect(called).toBe true

    it "should call always", ->
      param        = {files: [{name: 'test'}]}
      called       = false
      scope        = $rootScope.$new()
      scope.always = -> called = true

      element = $compile("<input type='file' mac-upload mac-upload-always='always()' />") scope
      scope.$digest()

      waitsFor ->
        element.fileupload "add", param
        return called
      , "Always function should be called", "750"

      runs ->
        expect(called).toBe true

    it "should call progress", ->
      param          = {files: [{name: 'test'}]}
      called         = false
      scope          = $rootScope.$new()
      scope.progress = -> called = true

      element = $compile("<input type='file' mac-upload mac-upload-progress='progress()' />") scope
      scope.$digest()

      waitsFor ->
        element.fileupload "send", param
        return called
      , "Progress function should be called", "750"

      runs ->
        expect(called).toBe true

  describe "Previews", ->
    $compile   = null
    $rootScope = null

    beforeEach inject (_$compile_, _$rootScope_) ->
      $compile   = _$compile_
      $rootScope = _$rootScope_

    it "should push one file to preview array", ->
      param          = {files: [{name: 'test'}]}
      called         = false
      scope          = $rootScope.$new()
      scope.previews = []
      scope.submit   = ->
        called = true

      element = $compile("<input type='file' mac-upload mac-upload-previews='previews' mac-upload-submit='submit()' />") scope
      scope.$digest()

      waitsFor ->
        element.fileupload "add", param
        return called
      , "Files should be added to preview array", "750"

      runs ->
        scope.$digest()
        expect(scope.previews.length).toBeGreaterThan 0

  describe "dropZone", ->
    $compile   = null
    $rootScope = null

    beforeEach inject (_$compile_, _$rootScope_) ->
      $compile   = _$compile_
      $rootScope = _$rootScope_

    it "should add droppable class on dragover", ->
      scope   = $rootScope.$new()
      element = $compile("<div class='wrapper'><input type='file' mac-upload mac-upload-drop-zone='.wrapper' /></div>") scope
      scope.$digest()

      event               = $.Event("dragover")
      event.target        = $("input", element)[0]
      event.originalEvent = dataTransfer: {files: [{}]}
      $(document).trigger event

      expect(element.hasClass("droppable")).toBe true
