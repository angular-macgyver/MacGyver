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
@param {Function}   mac-upload-always     Callback for completed (success, abort or error) requests
@param {Expression} mac-upload-previews   List of uploaded files {Array}
@param {Function}   mac-upload-progress   Upload progress callback
@param {String}     mac-upload-drop-zone  The selector that we can drop files onto
@param {Expression} mac-upload-form-data  Additional form data {Array|Object|Function|FormData}
@param {Expression} mac-upload-options    Additional options to pass to jquery fileupload
###

angular.module("Mac").
directive("macUpload", ["$rootScope", "$parse", "$timeout", "util", ($rootScope, $parse, $timeout, util) ->
  require:    ["macUpload", "?macUploadPreviews"]
  controller: ["$scope", ->]
  link:       ($scope, element, attrs, ctrls) ->
    uploadCtrl  = ctrls[0]
    previewCtrl = ctrls[1]

    defaults =
      route:    ""
      dropZone: null
      submit:   ""
      success:  ""
      error:    ""
      always:   ""
      progress: ""
      formData: ""
      options:  ""
    opts = util.extendAttributes "macUpload", defaults, attrs

    setOptions = (option, value) ->
      element.fileupload("option", option, value) if value?

    applyCallback = (action, $event, $data) ->
      callbackFn = $parse opts[action]
      if callbackFn?
        $scope.$apply ->
          $xhr         = $data.jqXHR
          $status      = $data.jqXHR?.status
          responseText = $data.jqXHR?.responseText or ""
          try
            $response = JSON.parse responseText
          catch err
            $response = responseText
          args = {$event, $data, $status, $xhr, $response}
          callbackFn $scope, args

    options =
      url:              $parse(opts.route)($scope) or ""
      replaceFileInput: false
      submit:           ($event, $data) ->
        submitEvent = -> applyCallback "submit", $event, $data

        # Handle previews.
        if previewCtrl?
          previewCtrl.add $data.files, submitEvent
        else
          submitEvent()

      fail:     ($event, $data) -> applyCallback "error", $event, $data
      done:     ($event, $data) -> applyCallback "success", $event, $data
      always:   ($event, $data) ->
        element.val ""
        applyCallback "always", $event, $data
      progress: ($event, $data) ->
        previewCtrl?.updateProgress? $data
        applyCallback "progress", $event, $data

    if opts.dropZone?
      $(document).on "drop dragover", (event) -> event.preventDefault()

      # Add and remove droppable class
      dragoverTimeout = null
      dropZone        = element.parents opts.dropZone

      $(document).bind "dragover", (event) ->
        $timeout.cancel dragoverTimeout if dragoverTimeout?

        node   = $(event.target).parents opts.dropZone
        method = if node.length then "addClass" else "removeClass"
        dropZone[method] "droppable"

        dragoverTimeout = $timeout ->
          clearTimeout(dragoverTimeout) if dragoverTimeout?
          dropZone.removeClass "droppable"
        , 250

    options.dropZone  = dropZone or $()
    options.pasteZone = null

    if opts.options
      extraOptions = $scope.$eval(opts.options) or {}
      angular.extend options, extraOptions

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

    $scope.$watch opts.route,    (route) -> setOptions "url", route
    $scope.$watch opts.formData, (value) -> setOptions "formData", value
    $scope.$watch opts.options,  (value) -> element.fileupload "option", value
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
        pushToPreviews = (event) ->
          previews = @previews()
          if previews?
            newFile =
              fileName: file.name
              type:     file.type
              fileData: event?.target.result
            previews.push newFile
            @previews previews

          callback? newFile

        if file.constructor?.name is "File"
          reader = new FileReader
          reader.onload  = (event) => pushToPreviews.apply this, [event, "load"]
          reader.onerror = (event) => pushToPreviews.apply this, [event, "error"]

          reader.readAsDataURL file
        else
          pushToPreviews.apply this

    return
  ]
  link: ($scope, element, attrs, ctrls) ->
    previewCtrl = ctrls[0]
]).

directive("macUploadProgress", [->
  restrict:   "A"
  require:    ["macUploadProgress", "?macUploadPreviews"]
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

    if progressCtrl? and previewCtrl?
      progressCtrl?.updatePreviewCtrl previewsCtrl
])
