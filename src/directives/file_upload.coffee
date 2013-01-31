# mac-upload
# mac-upload-route:     The route we're uploading our files
# mac-upload-previews:  ????
# mac-upload-submit:    function to call on submit
# mac-upload-success:   upload success callback
# mac-upload-error:     upload error callback
# mac-upload-selector:  ????
# mac-upload-drop-zone: The selector that we can drop files onto

angular.module("Mac").directive "macUploader", [ ->
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

            # Handle previews.
            if attributes.macUploadPreviews? and response.files?.length > 0
              for file in response.files
                if file.type.match /image.*/
                  fileType = "image"
                else
                  fileType = "generic"
                do (file) ->
                  reader = new FileReader
                  previews = $parse(attributes.macUploadPreviews) scope
                  reader.onload = (event) ->
                    previews?.push
                      fileName:  file.name
                      src:       if fileType is "image" then event.target.result else "/images/file_icon.png"
                      isGeneric: if fileType is "generic" then true else false
                    runExpression()
                    scope.$digest()
                  reader.onerror = (evt) ->
                    # Fail to read the file locally, but should upload the file to S3
                    previews?.push
                      fileName:  file.name
                      src:       "/images/file_icon.png"
                      isGeneric: true
                    runExpression()
                    scope.$digest()

                  reader.readAsDataURL file
            else
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
  ]
