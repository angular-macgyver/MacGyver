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
      a: Math.random() * 100000
      b: Math.random() * 10000
      c: Math.random()
      d: Math.random()
      created: (new Date()).getTime()
      attributes:
        name: "Test " + i
        abc: Math.random() * 1000

    $scope.data.push obj

  $scope.createRow = (event) ->
    event.stopPropagation()
    console.log "Creating row"

  $scope.loadMoreRows = ->
    event.stopPropagation()
    alert "Loading 20 more rows"

  # Columns to display and their order
  $scope.columnOrder = ["Name", "anotherName", "d", "c", "b", "Created"]
  #$scope.columnOrder = ["Name", "Abc"] # Used for testing values inside attributes

  # Autocomplete section
  # Used in autocomplete to transform data
  $scope.onSuccess = (data) -> data.data

  # Url to remotely fetch content
  $scope.autocompleteUrl = "data.json"

  # Selected tags in tag autocomplete
  $scope.tagAutocompleteSelected         = []
  $scope.tagAutocompleteDisabledSelected = []

  $scope.tagAutocompletePlaceholder = "Hello"

  $scope.tagAutocompleteOnSelected = (item) ->
    return {key: item}

  # Blur section
  # Called with blur directive on blur
  $scope.onTextBlur = ->
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
