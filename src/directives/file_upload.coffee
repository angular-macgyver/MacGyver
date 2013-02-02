# mac-upload
# mac-upload-route:     The route we're uploading our files
# mac-upload-previews:  ????
# mac-upload-submit:    function to call on submit
# mac-upload-success:   upload success callback
# mac-upload-error:     upload error callback
# mac-upload-selector:  ????
# mac-upload-drop-zone: The selector that we can drop files onto

angular.module("Mac").directive "macUpload", ["$parse", ($parse)->
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

      scope.$watch attributes.macUploadRoute, (route) ->
        return if disabled
        options =
          url:              route
          replaceFileInput: true

          submit: (event, response) ->
            runExpression = ->
              if attributes.macUploadSubmit?
                expression = $parse attributes.macUploadSubmit
                scope.$apply expression scope, $event: event, $response: response

              runExpression()

          error: (response, status) ->
            $rootScope.$broadcast "showError", "Failed to upload file. Please try again."
            if attributes.macUploadError?
              expression = $parse attributes.macUploadError
              scope.$apply expression scope, $response: response, $data: response.data, $status: status

          success: (response, status) ->
            if attributes.macUploadSuccess?
              expression = $parse attributes.macUploadSuccess
              scope.$apply expression scope, $response: response, $data: response.data, $status: status

        options.dropZone = if attributes.macUploadDropZone? then $(attributes.macUploadDropZone) else null

        element.fileupload options

        element.fileupload(
          add: (event, data) ->
            data.submit()
        )
  ]
