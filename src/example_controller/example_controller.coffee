module = angular.module("Mac")

module.controller "ExampleController", ["$scope", ($scope) ->

  # Table view section
  # Data for table view
  # Current generating 10000 rows of entries to make sure table view can handle large
  # amount of data
  $scope.data = []
  for i in [1..10000]
    obj =
      name: "Test " + i
      clicks: Math.random() * 100000
      spent: Math.random() * 10000
      cpm: Math.random()
      cpc: Math.random()
      created: (new Date()).getTime()
      attributes:
        abc: Math.random() * 1000

    $scope.data.push obj

  # Columns to display and their order
  $scope.columnOrder = ["Name", "Clicks", "CPC", "CPM", "Spent", "Created"]

  # Autocomplete section
  # Used in autocomplete to transform data
  $scope.onSuccess = (data) -> data.data

  # Url to remotely fetch content
  $scope.autocompleteUrl = "data.json"

  # Selected tags in tag autocomplete
  $scope.tagAutocompleteSelected = []

  # Blur section
  # Called with blur directive on blur
  $scope.onTextBlur = () ->
    alert "You just blurred out of text input"

  # Tag input section
  # tag input options
  $scope.extraTagInputs  = [{"name": "United States", "id": "123"},{"name": "United Kingdom", "id": "234"},{"name": "United Arab Emirates", "id": "345"}]

  # Selected option tags
  $scope.selected        = [{"name": "United States", "id": "123"}]

  # File Uploader handling
  $scope.uploadRoute          = "/test_upload"
  $scope.fileUploaderEndabled = true

  $scope.fileUploadSubmit = ($event, $response) ->
    console.log "submitted"

  $scope.fileUploadSuccess = ($data, $status) ->
    console.log "success"

]
