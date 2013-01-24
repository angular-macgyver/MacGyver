###
 Table view

 A directive for generating a lazy rendered table

 Example data:
  stat_data - array of stat objects
  columns   - array of column object

  column = {name, key, index, sort}
    - name: display name on header
    -



 Attributes:
  - has-header: true
  - has-footer: true
  - width:
  - height:
  - row-height:
###

angular.module("Util").directive "utilTableView", [
  "$rootScope"
  "$compile"
  ($rootScope, $compile) ->
    restrict:    "EA"
    scope:       {}
    replace:     true
    transclude:  true
    templateUrl: "/template/table_view.html"

    compile: (element, attrs, transclude) ->
      # Default table view attributes
      defaults =
        hasHeader:      true
        hasFooter:      true
        width:          800
        rowHeight:      20
        numDisplayRows: 10
        cellPadding:    8

      transcludedBlock = $(".table-transclude", element)
      headerBlock      = $(".table-header", element)
      headerRow        = $(".table-row", headerBlock)
      bodyWrapperBlock = $(".table-body-wrapper", element)
      bodyBlock        = $(".table-body", element)
      bodyHeightBlock  = $(".table-body-height", element)
      footerBlock      = $(".table-footer", element)
      emptyCell        = $("<div>").addClass "cell"

      # Calculate all the options based on defaults
      opts = angular.extend defaults, attrs

      cellOuterHeight = opts.rowHeight + opts.cellPadding * 2

      # Update the width and height of the whole table
      element.css
        height: cellOuterHeight * opts.numDisplayRows
        width:  opts.width

      ($scope, element, attrs) ->
        # Get the attribute name for table data
        # Access the array of data on parent scope
        tableDataName = attrs.tableData
        data          = if tableDataName? then $scope.$parent[tableDataName] else []

        # Get the attribute name for the order of columns
        # Access the array of columns on parent scope
        tableColumns   = attrs.tableColumns
        $scope.columns = if tableColumns? then $scope.$parent[tableColumns] else []

        numColumns     = $scope.columns.length
        numDisplayRows = opts.numDisplayRows - opts.hasHeader

        createCellTemplate = (section="", column="")->
          templateSelector = """.table-#{section}-template .cell[column="#{column}"]"""
          templateCell     = $(templateSelector, transcludedBlock).clone()
          templateCell     = emptyCell.clone() if templateCell.length is 0

          # Set column property again
          templateCell.prop "column", column

          templateCell.css
            padding: opts.cellPadding
            height:  opts.rowHeight
            width:   (opts.width / numColumns - opts.cellPadding * 2 - 1)

          return templateCell

        # Create table header
        $scope.drawHeader = ->
          for column in $scope.columns
            templateColumn = createCellTemplate "header", column
            contentText    = templateColumn.text()
            templateColumn.text column if contentText.length is 0

            templateColumn.resizable
              ghost: true
            headerRow.append(templateColumn)

          # Enable drag and drop on heaer cell
          headerRow.sortable
            items:       "> .cell"
            cursor:      "move"
            containment: "parent"
            opacity:     0.8
            tolerance:   "pointer"
            update:      (event, ui) ->
              newOrder = []
              $(".cell", headerRow).each (i, e) ->
                newOrder.push $(e).prop "column"
              $scope.$apply -> $scope.columns = newOrder

        $scope.calculateBodyDimension = ->
          # Calculate the height to display scrollbar correctly
          bodyHeightBlock.css
            height: data.length * cellOuterHeight

          bodyWrapperBlock.css
            height: numDisplayRows * cellOuterHeight

        # Create table body
        $scope.drawBody = ->
          # Create template row
          tableRow = $("<div>").addClass "table-row"
          tableRow.attr "ng-repeat", "row in displayRows"

          tableCell = $("<div>").addClass "table-cell"
          tableCell.attr
            "ng-switch": ""
            "on":        "column"
            "ng-repeat": "column in columns"

          emptyTemplateRow = $("<div>").addClass "table-row"

          endIndex           = @index + numDisplayRows - 1
          $scope.displayRows = data[@index..endIndex]

          for column in $scope.columns
            templateCell = createCellTemplate("body", column)
            templateCell.attr "ng-switch-when", column
            tableCell.append templateCell

            emptyTemplateRow.append createCellTemplate()

          tableRow.append tableCell
          bodyBlock.append tableRow

          $compile(bodyBlock) $scope

          # Generate empty rows to fill up the table
          emptyRows = numDisplayRows - $scope.displayRows.length
          if emptyRows > 0
            bodyBlock.append(emptyTemplateRow.clone()) for i in [0..emptyRows - 1]

        bodyWrapperBlock.scroll ->
          $this     = $(this)
          scrollTop = $this.scrollTop()

          # Fix the table at the same position
          bodyBlock.css "top", scrollTop

          $scope.$apply ->
            $scope.index = Math.floor scrollTop / cellOuterHeight

        $scope.$watch "index", (newValue, oldValue) ->
          endIndex           = newValue + numDisplayRows - 1
          $scope.displayRows = data[newValue..endIndex]

        $scope.reset = ->
          $scope.displayRows = []
          $scope.index       = 0

          $scope.drawHeader()
          $scope.calculateBodyDimension()
          $scope.drawBody()

        $scope.reset()
]
