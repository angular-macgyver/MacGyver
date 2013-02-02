module = angular.module("Mac")

module.controller "ExampleController", ["$scope", ($scope) ->


  # Adrian's stuff...he should comment this for clarity..hint hint.
  $scope.data = []

  for i in [1..10000]
    obj =
      name: "Test " + i
      clicks: Math.random() * 100000
      spent: Math.random() * 10000
      cpm: Math.random()
      cpc: Math.random()
      created: (new Date()).getTime()

    $scope.data.push obj

  $scope.hello = (data) ->
    data.data

  $scope.onTextBlur = () ->
    alert "You just blurred out of text input"

  $scope.columnOrder = ["Name", "Clicks", "CPC", "CPM", "Spent", "Created"]
  $scope.autocompleteUrl = "data.json"
  $scope.extraTagInputs  = [{"name": "United States", "id": "123"},{"name": "United Kingdom", "id": "234"},{"name": "United Arab Emirates", "id": "345"}]
  $scope.selected        = []

  # File Uploader handling
  $scope.uploadRoute          = "/test_upload"
  $scope.fileUploaderEndabled = true

  $scope.fileUploadSubmit = ($event, $response) ->
    console.log "submitted"

  $scope.fileUploadSuccess = ($data, $status) ->
    console.log "success"

]
