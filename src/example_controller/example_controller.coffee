module = angular.module("Mac")

module.controller "modalController", ["$scope", "modal", ($scope, modal) ->
  $scope.$on "modalWasShown", (event, id) ->
    if id is "test-modal"
      console.log modal.opened.options.data
]

module.controller "ExampleController", ["$scope", "$timeout", "Table", ($scope, $timeout, Table) ->


  # Table view section

  # MacTableV1

  # Data for table view
  # Current generating 10000 rows of entries to make sure table view can handle large
  # amount of data
  $scope.data = []
  #for i in [1..10000]
  # Added setTimeout to mimic ajax delay
  $scope.loading = true
  setTimeout (->
    #for i in [1..5000]
    for i in [1..23]
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
    $scope.loading = false
    $scope.$digest()
  ), 2500

  $scope.createRow = (event) ->
    event.stopPropagation()
    console.log "Creating row"

  $scope.loadMoreRows = ->
    event.stopPropagation()
    alert "Loading 20 more rows"

  # Columns to display and their order
  $scope.columnOrder = ["Name", "anotherName", "d", "c", "b", "Created"]
  #$scope.columnOrder = ["Name", "Abc"] # Used for testing values inside attributes

  # MacTableV2

  $scope.macGyverSeasonOne = []

  for i in [1..1000]
    $scope.macGyverSeasonOne.push {'No.': '1', 'Title': '"Pilot"', 'Directed by': 'Jerrold Freedman', 'Written by': 'Thackary Pallor', 'Original air date': 'September 29, 1985'}

  $scope.reverse = false

  $scope.genPredicate = (colName) ->
    (row) -> row.cellsMap[colName].value()

  $scope.genSearchPredicate = (colName, value) ->
    (row) ->
      cellValue = String(row.cellsMap[colName].value()).toLowerCase()
      value     = String(value).toLowerCase()
      cellValue.indexOf(value) != -1

  # Editable
  $scope.editableTest = "Hello"

  $scope.getDisplayText = ->
    $scope.editableTest

  $scope.selectOptions = [
    {value: 1, text: "text1"}
    {value: 2, text: "text2"}
    {value: 3, text: "text3"}
  ]
  $scope.selectedOptionValue = "1"
  $scope.convertToText = ->
    for option in $scope.selectOptions when option.value is +$scope.selectedOptionValue
      return option.text

  # Autocomplete section
  # Used in autocomplete to transform data
  $scope.onSuccess = (data) -> data.data

  $scope.autocompleteQuery = ""

  # Url to remotely fetch content
  $scope.autocompleteUrl = "data.json"

  # Selected tags in tag autocomplete
  $scope.tagAutocompleteSelected         = []
  $scope.tagAutocompleteDisabledSelected = []
  $scope.tagAutocompleteEvents           = []

  $scope.tagAutocompletePlaceholder = "Hello"

  $scope.tagAutocompleteOnSelected = (item) ->
    return {key: item}

  $scope.tagAutocompleteOnBlur = (event, item) ->
    # Tokenize on blur
    $scope.tagAutocompleteEvents.push key: item

  $scope.tagAutocompleteOnKeyup = (event, item) ->
    console.debug "You just typed something"

  $scope.tagAutocompleteClearText = ->
    $scope.$broadcast "mac-tag-autocomplete-clear-input"

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
  $scope.uploadRoute         = "/test_upload"
  $scope.fileUploaderEnabled = true
  $scope.uploadPreviews      = []
  $scope.previewImage        = (preview) ->
    if /image./.test(preview.type)  then preview.fileData else "/img/file_icon.png"
  $scope.previewProgress = (preview) ->
    return width: "#{preview.progress}%"

  $scope.fileUploadSubmit  = ($event, $data) -> console.log "submitted"
  $scope.fileUploadSuccess = ($data, $status) -> console.log "success"

  $scope.startDate = "01/01/2013"
  $scope.minDate   = "07/01/2012"
  $scope.startTime = "04:42 PM"

  # timestamp filter
  $scope.fiveMinAgo   = Math.round(Date.now()/1000) - 5 * 60
  $scope.oneDayAgo    = Math.round(Date.now()/1000) - 24 * 60 * 60
  $scope.threeDaysAgo = Math.round(Date.now()/1000) - 72 * 60 * 60
]

window.prettyPrint && prettyPrint()

#Disable certain links in docs
$('section [href^=#]').click (e) ->
  e.preventDefault()
