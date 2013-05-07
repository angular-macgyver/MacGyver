###
@chalk overview
@name File upload
@description
Directive for proxying jQuery file upload

@dependencies
- jQuery file upload

@param {String}   mac-upload-route      The route we're uploading our files
@param {Function} mac-upload-submit     Function to call on submit
@param {Function} mac-upload-success    Upload success callback
@param {Function} mac-upload-error      Upload error callback
@param {String}   mac-upload-selector   Selector to proxy clicking on file upload
@param {String}   mac-upload-drop-zone  The selector that we can drop files onto
@param {String}   mac-upload-enable-on  The broadcast message to catch to enable file upload
@param {String}   mac-upload-disable-on The broadcast message to catch to disable file upload
@param {Boolean}  mac-upload-disabled   Boolean value to disable or enable file upload
@param {String}   mac-upload-form-data  Additional form data
@param {String}   mac-upload-param-name Parameter name for the file
###

angular.module("Mac").directive "macUpload", [ ->
  scope:
    macUploadSubmit:    "&macUploadSubmit"
    macUploadError:     "&macUploadError"
    macUploadSuccess:   "&macUploadSuccess"
    macUploadRoute:     "=macUploadRoute"
    macUploadEnableOn:  "=macUploadEnableOn"
    macUploadDisableOn: "=macUploadDisableOn"
    macUploadDisabled:  "=macUploadDisabled"
    macUploadFormData:  "=macUploadFormData"
    macUploadParamName: "=macUploadParamName"

  link: (scope, element, attributes) ->
    isInitialized = false
    disableOn     = attributes.macUploadDisableOn if attributes.macUploadDisableOn?
    enableOn      = attributes.macUploadEnableOn  if attributes.macUploadEnableOn?
    parent        = element.parent()
    input         = parent.find "input"

    initialize = ->
      return if (attributes.macUploadDisabled? and scope.macUploadDisabled) or not scope.route

      input.fileupload "destroy" if isInitialized
      options =
        url:              scope.route
        replaceFileInput: true

        add: (event, data) ->
          data.submit()

        submit: (event, response) ->
          if attributes.macUploadSubmit?
            scope.$apply scope.macUploadSubmit $event: event, $response: response

        error: (response, status) ->
          if attributes.macUploadError?
            responseObject = {}
            for own key, value of response
              unless typeof value is "function"
                responseObject[key] = value

            args =
              $response: responseObject
              $data:     response.data
              $status:   status

            scope.$apply scope.macUploadError args

        success: (response, status) ->
          if attributes.macUploadSuccess?
            scope.$apply scope.macUploadSuccess $response: response, $data: response.data, $status: status

      options.dropZone  = if attributes.macUploadDropZone? then $(attributes.macUploadDropZone) else null
      options.formData  = scope.macUploadFormData if attributes.macUploadFormData?
      options.paramName = scope.macUploadParamName if attributes.macUploadParamName?

      input.fileupload options
      isInitialized = true

    if attributes.macUploadSelector?
      # Clicks on the usually hidden upload file input field via another selector
      element.parents(attributes.macUploadSelector).click (event) -> element.click()

      # Stops the child element from going into an infinite click loop
      element.click (event) ->
        $rootScope.$broadcast "clickedOnAttachment"
        event.stopPropagation()

    # Disable the browser's default drag and drop behavior so we can have our own.
    $(document).on "drop dragover", (event) -> event.preventDefault()

    scope.$watch "macUploadDisabled", (isDisabled) ->
      return unless isDisabled?
      if isDisabled
        input.prop("disabled", "disabled")
      else
        input.removeProp "disabled"
      initialize()

    scope.$watch "macUploadFormData", (value) ->
      if value? and isInitialized
        input.fileupload "options", formData: value

    scope.$on(disableOn, -> input.fileupload "disable") if disableOn?
    scope.$on(enableOn,  -> input.fileupload "enable")  if enableOn?

    scope.$watch "macUploadRoute", (route) ->
      return unless route
      scope.route = route
      initialize()
  ]
