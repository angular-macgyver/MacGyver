###
@chalk overview
@name File upload
@description
Directive for proxying jQuery file upload

@dependencies
- jQuery file upload

@param {String}     mac-upload-route      File upload route
@param {Function}   mac-upload-submit     Function to call on submit
@param {Function}   mac-upload-success    Upload success callback
@param {Function}   mac-upload-error      Upload error callback
@param {Expression} mac-upload-previews   List of uploaded files {Array}
@param {Function}   mac-upload-progress   Upload progress callback
@param {String}     mac-upload-drop-zone  The selector that we can drop files onto
@param {Expression} mac-upload-form-data  Additional form data {Array|Object|Function|FormData}
###

angular.module("Mac").
directive("macUpload", ["$rootScope", "$parse", ($rootScope, $parse) ->
  require:    ["macUpload", "?macUploadPreviews"]
  controller: ["$scope", ->]
  link:       ($scope, element, attrs, ctrls) ->
    uploadCtrl  = ctrls[0]
    previewCtrl = ctrls[1]

    setOptions = (option, value) ->
      element.fileupload("option", option, value) if value?

    applyCallback = (action, $event, $data) ->
      callbackFn = $parse attrs["macUpload#{action}"]
      if callbackFn?
        $scope.$apply ->
          $status        = $data.jqXHR?.status
          args           = {$event, $data, $status}
          args.$response = $data.result.data if action is "Success"
          callbackFn $scope, args

    options =
      url:    $parse(attrs.macUploadRoute)($scope) or ""
      submit: ($event, $data) ->
        submitEvent = -> applyCallback "Submit", $event, $data

        # Handle previews.
        if previewCtrl?
          previewCtrl.add $data.files, submitEvent
        else
          submitEvent()

      fail:     ($event, $data) -> applyCallback "Error", $event, $data
      done:     ($event, $data) -> applyCallback "Success", $event, $data
      progress: ($event, $data) ->
        previewCtrl?.updateProgress? $data
        applyCallback "Progress", $event, $data

    if attrs.macUploadDropZone?
      $(document).on "drop dragover", (event) -> event.preventDefault()

      # Add and remove droppable class
      dragoverTimeout = null
      dropZone        = element.parents attrs.macUploadDropZone

      $(document).bind "dragover", (event) ->
        clearTimeout(dragoverTimeout) if dragoverTimeout?

        node   = $(event.target).parents attrs.macUploadDropZone
        method = if node.length then "addClass" else "removeClass"
        dropZone[method] "droppable"

        dragoverTimeout = setTimeout ->
          clearTimeout(dragoverTimeout) if dragoverTimeout?
          dropZone.removeClass "droppable"
        , 250

    options.dropZone = dropZone

    element.fileupload(options).
    on([
      'fileuploadadd',
      'fileuploadsubmit',
      'fileuploadsend',
      'fileuploaddone',
      'fileuploadfail',
      'fileuploadalways',
      'fileuploadprogress',
      'fileuploadprogressall',
      'fileuploadstart',
      'fileuploadstop',
      'fileuploadchange',
      'fileuploadpaste',
      'fileuploaddrop',
      'fileuploaddragover',
      'fileuploadchunksend',
      'fileuploadchunkdone',
      'fileuploadchunkfail',
      'fileuploadchunkalways',
      'fileuploadprocessstart',
      'fileuploadprocess',
      'fileuploadprocessdone',
      'fileuploadprocessfail',
      'fileuploadprocessalways',
      'fileuploadprocessstop'
    ].join(' '), (event, data) ->
      $scope.$emit event.type, data
    )

    $scope.$watch attrs.macUploadRoute,     (route) -> setOptions "url", route
    $scope.$watch attrs.macUploadFormData,  (value) -> setOptions "formData", value
]).

directive("macUploadPreviews", ["$rootScope", ($rootScope) ->
  restrict:   "A"
  require:    ["macUploadPreviews", "macUpload"]
  controller: ["$scope", "$attrs", "$parse", ($scope, $attrs, $parse) ->
    @previews = (value) ->
      previewsGet = $parse $attrs.macUploadPreviews
      previewsSet = previewsGet.assign

      if value?
        previewsSet $scope, value
      else
        previewsGet $scope

    @getByFilename = (filename) ->
      previews = @previews() or []
      for i in [previews.length - 1..0] by -1
        preview = previews[i]
        return preview if preview.fileName is filename

    @add = (files = [], callback) ->
      for file in files
        reader = new FileReader

        pushToPreviews = (event, state) ->
          previews = @previews()
          if previews?
            newFile =
              fileName: file.name
              type:     file.type
              fileData: event.target.result
            previews.push newFile
            @previews previews

          callback? newFile

        reader.onload  = (event) => pushToPreviews.apply this, [event, "load"]
        reader.onerror = (event) => pushToPreviews.apply this, [event, "error"]

        reader.readAsDataURL file

    return
  ]
  link: ($scope, element, attrs, ctrls) ->
    previewCtrl = ctrls[0]
]).

directive("macUploadProgress", [->
  restrict:   "A"
  require:    ["macUploadProgress", "macUploadPreviews"]
  controller: ["$scope", ($scope) ->
    updateProgress = (data) ->
      preview           = @getByFilename data.files[0].name
      preview?.progress = parseInt(data.loaded / data.total * 100, 10)

    # Extending preview controller with progress
    @updatePreviewCtrl = (ctrl) ->
      ctrl.updateProgress = updateProgress
  ]
  link: ($scope, element, attrs, ctrls) ->
    progressCtrl = ctrls[0]
    previewsCtrl = ctrls[1]

    progressCtrl?.updatePreviewCtrl previewsCtrl
])
