module = angular.module("Mac")

module.controller "ExampleController", ["$scope", "Table", ($scope, Table) ->
  # Table view section
  columns = ["name", "a", "b", "c", "d", "created"]
  $scope.table = new Table(columns)
  headerObject =
      name: "Name"
      a: "A"
      b: "B"
      c: "C"
      d: "D"
      created: "Created"
  $scope.table.load("header", [headerObject])
  # Data for table view
  # Current generating 10000 rows of entries to make sure table view can handle large
  # amount of data
  $scope.data = []
  #for i in [1..10000]
  # Added setTimeout to mimic ajax delay
  $scope.loading = true
  setTimeout (->
    #for i in [1..5000]
    for i in [1..1]
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
    $scope.table.load("body", $scope.data)
    $scope.loading = false
    $scope.$digest()
    $scope.$apply ->
      #$scope.setColumnWidths $scope.table, 830, 8
  ), 0 #2500



  $scope.setColumnWidths = (table) ->
    colNumber = table.columnsOrder.length
    percent   = Math.floor 100/colNumber
    for column in table.columns
      column.width = "#{percent}%"

  $scope.logIt = () ->
    console.log.apply console, arguments

  $scope.reorderIt = (elements, element, event, ui, scope) ->
    columnsOrder = []
    elements.each ->
      columnsOrder.push angular.element(this).scope().cell.colName
    $scope.$apply ->
      $scope.table.columnsOrder = columnsOrder
      $scope.table.columnsCtrl.syncOrder()

  $scope.resizeIt = (element, event, ui) ->
    column  = element.scope().cell.column
    width   = ui.size.width
    element.css("width", "")
    $scope.$apply ->
      column.ratio = (width/830)*100

  $scope.createRow = (event) ->
    event.stopPropagation()
    console.log "Creating row"

  $scope.loadMoreRows = ->
    event.stopPropagation()
    alert "Loading 20 more rows"

  # Columns to display and their order
  $scope.columnOrder = ["Name", "anotherName", "d", "c", "b", "Created"]
  #$scope.columnOrder = ["Name", "Abc"] # Used for testing values inside attributes

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
  $scope.uploadRoute          = "/test_upload"
  $scope.fileUploaderEnabled = true

  $scope.fileUploadSubmit = ($event, $response) ->
    console.log "submitted"

  $scope.fileUploadSuccess = ($data, $status) ->
    console.log "success"

  $scope.startDate = "01/01/2013"
  $scope.startTime = "04:42 PM"

]
