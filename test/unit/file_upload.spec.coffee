describe "Mac Fileupload", ->
  element = null

  beforeEach inject ($compile, $rootScope) ->
    scope     = $rootScope.$new()
    scope.url = "/test_upload"
    element   = $compile("<input type='file' mac-upload mac-upload-route='url' />") scope
    scope.$digest()

  afterEach ->
    element = null

  it "should initialize fileupload plugin", ->
    expect(element.data("blueimp-fileupload")).not.toBe null
