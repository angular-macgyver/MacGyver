# mac-upload
# mac-upload-route:     The route we're uploading our files
# mac-upload-previews:  ????
# mac-upload-submit:    function to call on submit
# mac-upload-success:   upload success callback
# mac-upload-error:     upload error callback
# mac-upload-selector:  ????
# mac-upload-drop-zone: The selector that we can drop files onto

angular.module("Mac").directive "macUpload", [ () ->
    scope: {
      macUploadSubmit:    "&macUploadSubmit"
      macUploadError:     "&macUploadError"
      macUploadSuccess:   "&macUploadSuccess"
      macUploadRoute:     "=macUploadRoute"
      macUploadEnableOn:  "=macUploadEnableOn"
      macUploadDisableOn: "=macUploadDisableOn"
    }
    link: (scope, element, attributes) ->
      disableOn = attributes.macUploadDisableOn if attributes.macUploadDisableOn?
      enableOn  = attributes.macUploadEnableOn  if attributes.macUploadEnableOn?
      disabled = attributes.macUploadDisabled is "true"

      if attributes.macUploadSelector?
        # Clicks on the usually hidden upload file input field via another selector
        element.parents(attributes.macUploadSelector).click (event) -> element.click()

        # Stops the child element from going into an infinite click loop
        element.click (event) ->
          $rootScope.$broadcast "clickedOnAttachment"
          event.stopPropagation()

      # Disable the browser's default drag and drop behavior so we can have our own.
      $(document).on "drop dragover", (event) -> event.preventDefault()

      scope.$on(disableOn, -> element.fileupload "disable") if disableOn?
      scope.$on(enableOn,  -> element.fileupload "enable")  if enableOn?

      scope.$watch "macUploadRoute", (route) ->
        return if disabled
        options =
          url:              route
          replaceFileInput: true

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

        options.dropZone = if attributes.macUploadDropZone? then $(attributes.macUploadDropZone) else null

        element.fileupload options

        element.fileupload(
          add: (event, data) ->
            data.submit()
        )
  ]
