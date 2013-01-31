###
 Table view

 A directive for generating a lazy rendered table

 Dependencies
 - jQuery UI Sortable
 - jQuery UI Resizable

 Attributes:
  - mac-table-data:              Array of objects with table data
  - mac-table-columns:           Array of columns to display
  - mac-table-has-header:        A boolean value to determine if header should be shown
  - mac-table-has-footer:        A boolean value to determine if footer should be shown
  - mac-table-width:             The width of the whole table
  - mac-table-column-width:      The minimum width of a column
  - mac-table-row-height:        The height of each row in the table
  - mac-table-num-display-rows:  The total number of rows to display
  - mac-table-cell-padding:      Should match the css padding value on each cell
  - mac-table-sortable:          Allow user to change the order of columns
  - mac-table-resizable:         Allow each column to be resized by the user
  - mac-table-lock-first-column: Lock first column to a static position
###

angular.module("Mac").directive "macTable", [
  "$rootScope"
  "$compile"
  "util"
  ($rootScope, $compile, util) ->
    restrict:    "EA"
    scope:
      data:            "=macTableData"
      columns:         "=macTableColumns"
      lockTitleColumn: "@macTableLockFirstColumn"
    replace:     true
    transclude:  true
    templateUrl: "/template/table_view.html"

    compile: (element, attrs, transclude) ->
      # Default table view attributes
      defaults =
        hasHeader:       true
        hasFooter:       true
        width:           800
        columnWidth:     140
        rowHeight:       20
        numDisplayRows:  10
        cellPadding:     8
        borderWidth:     1
        sortable:        true
        resizable:       true
        lockFirstColumn: false

      transcludedBlock = $(".table-transclude", element)
      headerBlock      = $(".table-header", element)
      headerRow        = $(".table-row", headerBlock)
      bodyWrapperBlock = $(".table-body-wrapper", element)
      firstColumn      = $(".title-column", bodyWrapperBlock)
      bodyBlock        = $(".table-body", element)
      bodyHeightBlock  = $(".table-body-height", element)
      footerBlock      = $(".table-footer", element)
      emptyCell        = $("<div>").addClass "cell"

      # Calculate all the options based on defaults
      opts = {}
      for own key, value of defaults
        opts[key] = attrs["macTable#{util.capitalize key}"] or value

        # Convert to true boolean if passing in boolean string
        if opts[key] in ["true", "false"]
          opts[key] = opts[key] is "true"
        else if +opts[key] isnt NaN
          opts[key] = +opts[key]

      cellOuterHeight = opts.rowHeight + opts.cellPadding * 2

      # Update the width and height of the whole table
      element.css
        height: cellOuterHeight * opts.numDisplayRows
        width:  opts.width

      ($scope, element, attrs) ->
        numColumns     = $scope.columns.length
        numDisplayRows = opts.numDisplayRows - opts.hasHeader

        createCellTemplate = (section="", column="")->
          templateSelector = """.table-#{section}-template .cell[column="#{column}"]"""
          templateCell     = $(templateSelector, transcludedBlock).clone()
          templateCell     = emptyCell.clone() if templateCell.length is 0

          # Set column property again
          templateCell.prop "column", column

          calculatedWidth = (opts.width / numColumns) - opts.cellPadding * 2 - opts.borderWidth
          width           = Math.max calculatedWidth, opts.columnWidth

          templateCell.css
            padding: opts.cellPadding
            height:  opts.rowHeight
            width:   width

          return templateCell

        createHeaderCellTemplate = (column = "") ->
          cell        = createCellTemplate "header", column
          contextText = cell.text()
          cell.text column if contextText.length is 0
          return cell

        # Create table header
        $scope.drawHeader = ->
          rowWidth = 0

          startIndex = if opts.lockFirstColumn then 1 else 0

          for column in $scope.columns[startIndex..]
            templateColumn = createHeaderCellTemplate column

            rowWidth += templateColumn.outerWidth() + opts.borderWidth

            # Enable column resizing
            if opts.resizable
              templateColumn.resizable
                containment: "parent"
                minHeight:   opts.rowHeight
                maxHeight:   opts.rowHeight
                handles:     "e, w"
              .addClass "resizable"

            headerRow.append(templateColumn)

          # Set the header to be the width of all columns
          headerRow.width rowWidth

          if opts.lockFirstColumn
            fcTemplateCell = createHeaderCellTemplate $scope.columns[0]
            fcTemplateCell.addClass "locked-cell"
            headerBlock.prepend fcTemplateCell

            headerRow.css
              "margin-left": fcTemplateCell.outerWidth()

          # Enable drag and drop on header cell
          if opts.sortable
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

        $scope.drawFooter = ->


        $scope.calculateBodyDimension = ->
          # Calculate the height to display scrollbar correctly
          bodyHeightBlock.height $scope.data.length * cellOuterHeight

          bodyWrapperBlock.css
            height: numDisplayRows * cellOuterHeight

        # Create table body
        $scope.drawBody = ->
          # Create template row with ng-repeat
          tableRow = $("<div>").addClass "table-row"
          tableRow.attr "ng-repeat", "row in displayRows"

          # Create template cell with ng-repeat and ng-switch
          tableCell = $("<div>").addClass "table-cell"
          tableCell.attr
            "ng-switch": ""
            "on":        "column"
            "ng-repeat": "column in columns"

          emptyTemplateRow = $("<div>").addClass "table-row"

          # Set the first set of rows to show up
          endIndex           = @index + numDisplayRows - 1
          $scope.displayRows = $scope.data[@index..endIndex]

          rowWidth   = 0
          startIndex = if opts.lockFirstColumn then 1 else 0

          # Get each template cell and append to cell wrapper
          for column in $scope.columns[startIndex..]
            templateCell = createCellTemplate("body", column)
            templateCell.attr "ng-switch-when", column
            tableCell.append templateCell

            # Calculate the width of each row
            rowWidth += templateCell.outerWidth() + opts.borderWidth

            emptyTemplateRow.append createCellTemplate()

          tableRow.append(tableCell).width rowWidth
          bodyBlock.append tableRow

          # Compile the body block to bind all values correctly
          $compile(bodyBlock) $scope

          # if the first column is locked, create a separate column with
          # fixed position
          if opts.lockFirstColumn
            fcTableRow     = $(".table-row", firstColumn)
            fcTemplateCell = createCellTemplate("body", $scope.columns[0])
            fcTableRow.attr("ng-repeat", "row in displayRows")
                      .append fcTemplateCell
            $compile(firstColumn) $scope

            $scope.headerLeftMargin = fcTemplateCell.outerWidth()

            bodyBlock.css
              "margin-left": $scope.headerLeftMargin


          bodyBlock.width opts.width - $scope.headerLeftMargin

          # Generate empty rows to fill up the table
          emptyRows = numDisplayRows - $scope.displayRows.length
          if emptyRows > 0
            bodyBlock.append(emptyTemplateRow.clone()) for i in [0..emptyRows - 1]

        # Up and down scrolling
        bodyWrapperBlock.scroll ->
          $this     = $(this)
          scrollTop = $this.scrollTop()

          # Fix the table at the same position
          bodyBlock.css "top", scrollTop
          firstColumn.css "top", scrollTop if opts.lockFirstColumn

          $scope.$apply ->
            index              = Math.floor scrollTop / cellOuterHeight
            endIndex           = index + numDisplayRows - 1
            $scope.displayRows = $scope.data[index..endIndex]

        # Left and right scrolling
        bodyBlock.scroll ->
          $this      = $(this)
          scrollLeft = $this.scrollLeft()

          headerRow.css "margin-left", $scope.headerLeftMargin - scrollLeft

        $scope.reset = ->
          $scope.displayRows      = []
          $scope.index            = 0
          $scope.headerLeftMargin = 0

          $scope.drawHeader() if opts.hasHeader

          $scope.calculateBodyDimension()
          $scope.drawBody()

          $scope.drawFooter() if opts.hasFooter

        $scope.reset()
]
