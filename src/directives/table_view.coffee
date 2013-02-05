##
## @name
## Table view
##
## @description
## A directive for generating a lazy rendered table
##
## @dependencies
## - jQuery UI Sortable
## - jQuery UI Resizable
##
## @attributes
## - mac-table-data:              Array of objects with table data
## - mac-table-columns:           Array of columns to display
## - mac-table-has-header:        A boolean value to determine if header should be shown        (default true)
## - mac-table-has-footer:        A boolean value to determine if footer should be shown        (default true)
## - mac-table-width:             The width of the whole table                                  (default 800)
## - mac-table-column-width:      The minimum width of a column                                 (default 140)
## - mac-table-row-height:        The height of each row in the table                           (default 20)
## - mac-table-num-display-rows:  The total number of rows to display                           (default 10)
## - mac-table-cell-padding:      Should match the css padding value on each cell               (default 8)
## - mac-table-border-width:      Should match the css border width value on each cell          (default 1)
## - mac-table-sortable:          Allow user to change the order of columns                     (default false)
## - mac-table-resizable:         Allow each column to be resized by the user                   (default false)
## - mac-table-lock-first-column: Lock first column to a static position                        (default false)
## - mac-table-allow-reorder:     Allow user to click on the header to reorder rows             (default true)
## - mac-table-object-prefix:     Useful when using backbone object where data is in attributes (default "")
##

angular.module("Mac").directive "macTable", [
  "$rootScope"
  "$compile"
  "util"
  ($rootScope, $compile, util) ->
    restrict: "EA"
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
        sortable:        false
        resizable:       false
        lockFirstColumn: false
        allowReorder:    true
        objectPrefix:    ""

      transcludedBlock = $(".table-transclude", element)
      headerBlock      = $(".table-header", element)
      headerRow        = $(".table-row", headerBlock)
      bodyWrapperBlock = $(".table-body-wrapper", element)
      firstColumn      = $(".title-column", bodyWrapperBlock)
      bodyBlock        = $(".table-body", element)
      bodyHeightBlock  = $(".table-body-height", element)
      footerBlock      = $(".table-footer", element)
      bodyBackground   = $(".table-body-background", element)
      emptyCell        = $("<div>").addClass "cell"

      # Calculate all the options based on defaults
      opts = util.extendAttributes "macTable", defaults, attrs

      cellOuterHeight = opts.rowHeight + opts.cellPadding * 2

      # Update the width and height of the whole table
      element.css
        height: cellOuterHeight * opts.numDisplayRows
        width:  opts.width

      ($scope, element, attrs) ->
        # Make sure columns are defined
        throw "Table view missing columns" unless $scope.columns?

        numColumns     = $scope.columns.length
        numDisplayRows = opts.numDisplayRows - opts.hasHeader

        $scope.$watch "data", ->
          if $scope.data?
            scrollTop          = bodyWrapperBlock.scrollTop()
            index              = Math.floor scrollTop / cellOuterHeight
            endIndex           = index + numDisplayRows - 1
            $scope.displayRows = $scope.data[index..endIndex]

        #
        # @name createCellTemplate
        # @description
        # Get the template cell user has defined in template, create empty cell if not found
        # The width and height will be calculated and set before returning
        #
        # @params {String} section Either header, body or footer (default "")
        # @params {String} column Column needed                  (default "")
        #
        createCellTemplate = (section="", column="")->
          templateSelector = """.table-#{section}-template .cell[column="#{column}"]"""
          templateCell     = $(templateSelector, transcludedBlock).clone()
          templateCell     = emptyCell.clone() if templateCell.length is 0

          # Set column property again
          templateCell.prop "column", column

          # Calculate the relative width of each cell
          calculatedWidth = (opts.width / numColumns) - opts.cellPadding * 2 - opts.borderWidth

          # Use minimum width if the relative width is too small
          width = Math.max calculatedWidth, opts.columnWidth

          templateCell.css
            padding: opts.cellPadding
            height:  opts.rowHeight
            width:   width

          return templateCell

        #
        # @name createHeaderCellTemplate
        # @description
        # This is a shortcut call for header version of createCellTemplate
        # Caret is added to the cell before returning
        # @params {String} column Column need (default "")
        #
        createHeaderCellTemplate = (column = "") ->
          cell        = createCellTemplate "header", column
          contextText = cell.text()
          cell
            .text(if contextText.length is 0 then column else contextText)
            .attr("for", column)
            .append $("<span>").attr
                                  "ng-show": "predicate == '#{column.toLowerCase()}'"
                                  "class": """caret {{reverse | boolean:"up":"down"}}"""

          return cell

        #
        # @name addOrderByFunction
        # @description
        # Add order by click event to an element which modify
        # $scope.predicate and $scope.reverse
        # @params {jQuery Object} column The element to bind click event to
        #
        addOrderByFunction = (column) ->
          column.on "click", (event) ->
            columnTitle  = opts.objectPrefix + $(this).attr("for").toLowerCase()

            $scope.$apply ->
              if columnTitle is $scope.predicate
                $scope.reverse = not $scope.reverse
              else
                $scope.predicate = columnTitle
                $scope.reverse   = false

        #
        # @name $scope.drawHeader
        # @description
        # Create table header.
        # A separate header cell is created if first column is locked
        # Enabling order by, resizable columns and drag and drop columns
        #
        $scope.drawHeader = ->
          rowWidth = 0

          startIndex = if opts.lockFirstColumn then 1 else 0

          for column in $scope.columns[startIndex..]
            templateColumn = createHeaderCellTemplate column

            rowWidth += templateColumn.outerWidth() + opts.borderWidth

            # Enable order by
            if opts.allowReorder
              addOrderByFunction templateColumn

            # Enable column resizing
            if opts.resizable
              templateColumn.resizable
                containment: "parent"
                minHeight:   opts.rowHeight
                maxHeight:   opts.rowHeight
                handles:     "e, w"
              .addClass "resizable"

            headerRow.append templateColumn

          # Compile the column to render carets
          $compile(headerRow) $scope

          # Set the header to be the width of all columns
          headerRow.width rowWidth

          # Create a separate cell if the first cell is locked
          if opts.lockFirstColumn
            fcTemplateCell = createHeaderCellTemplate $scope.columns[0]
            fcTemplateCell.addClass "locked-cell"

            addOrderByFunction fcTemplateCell

            headerBlock.prepend fcTemplateCell

            headerRow.css
              "margin-left": fcTemplateCell.outerWidth()

            # Compile the column to render carets
            $compile(headerBlock) $scope

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

        #
        # @name $scope.drawFooter
        # @description
        # To create the footer of the table. Not implemented yet.
        # TODO Implement footer
        #
        $scope.drawFooter = ->


        #
        # @name $scope.calculateBodyDimension
        # @description
        # Calculate the height and the scrolling height of the table
        #
        $scope.calculateBodyDimension = ->
          data = $scope.data or []
          # Calculate the height to display scrollbar correctly
          bodyHeightBlock.height data.length * cellOuterHeight

          bodyWrapperBlock.css
            height: numDisplayRows * cellOuterHeight

        #
        # @name $scope.drawBody
        # @description
        # Create table body with 2 ng-repeats
        # One ng-repeat to render all the rows dispalyed based on the height
        # Another ng-repeat to render all the columns correctly and to redraw when the order change
        # Create a separate column if first column is locked with a ng-repeat
        #
        $scope.drawBody = ->
          data    = $scope.data or []
          orderBy = if opts.allowReorder then "| orderBy:predicate:reverse" else ""

          # Create template row with ng-repeat
          tableRow = $("<div>").addClass "table-row"
          tableRow.attr "ng-repeat", "row in displayRows #{orderBy}"

          # Create template cell with ng-repeat and ng-switch
          tableCell = $("<div>").addClass "table-cell"
          tableCell.attr
            "ng-switch": ""
            "on":        "column"
            "ng-repeat": "column in columns"

          # Set the first set of rows to show up
          endIndex           = @index + numDisplayRows - 1
          $scope.displayRows = data[@index..endIndex]

          rowWidth   = 0
          startIndex = if opts.lockFirstColumn then 1 else 0

          # Get each template cell and append to cell wrapper
          for column in $scope.columns[startIndex..]
            templateCell = createCellTemplate("body", column)
            templateCell.attr "ng-switch-when", column
            tableCell.append templateCell

            # Calculate the width of each row
            rowWidth += templateCell.outerWidth() + opts.borderWidth

          tableRow.append(tableCell).width rowWidth
          bodyBlock.append tableRow

          # Compile the body block to bind all values correctly
          $compile(bodyBlock) $scope

          # if the first column is locked, create a separate column with
          # fixed position
          if opts.lockFirstColumn
            fcTableRow     = $(".table-row", firstColumn)
            fcTemplateCell = createCellTemplate("body", $scope.columns[0])
            fcTableRow.attr("ng-repeat", "row in displayRows #{orderBy}")
                      .append fcTemplateCell
            # Compile the column to render ng-repeat
            $compile(firstColumn) $scope

            $scope.headerLeftMargin = fcTemplateCell.outerWidth()

            bodyBlock.css
              "margin-left": $scope.headerLeftMargin


          bodyBlock.width opts.width - $scope.headerLeftMargin

          # Generate empty rows to fill up table background
          emptyTemplateRow = $("<div>").addClass "table-row"
          emptyTemplateRow.height cellOuterHeight
          bodyBackground.append(emptyTemplateRow.clone()) for i in [0..numDisplayRows]

        # Up and down scrolling
        bodyWrapperBlock.scroll ->
          $this     = $(this)
          scrollTop = $this.scrollTop()

          # Fix the table at the same position
          bodyBlock.css "top", scrollTop
          firstColumn.css "top", scrollTop if opts.lockFirstColumn

          $scope.$apply ->
            data               = $scope.data or []
            index              = Math.floor scrollTop / cellOuterHeight
            endIndex           = index + numDisplayRows - 1
            $scope.displayRows = data[index..endIndex]

        # Left and right scrolling
        bodyBlock.scroll ->
          $this      = $(this)
          scrollLeft = $this.scrollLeft()

          headerRow.css "margin-left", $scope.headerLeftMargin - scrollLeft

        #
        # @name $scope.reset
        # @description
        # Reset table view scope
        #
        $scope.reset = ->
          $scope.displayRows      = []
          $scope.index            = 0
          $scope.headerLeftMargin = 0

          $scope.predicate =  if $scope.columns.length > 0
                                "#{opts.objectPrefix}#{$scope.columns[0].toLowerCase()}"
                              else
                                ""
          $scope.reverse   = false

          $scope.drawHeader() if opts.hasHeader

          $scope.calculateBodyDimension()
          $scope.drawBody()

          $scope.drawFooter() if opts.hasFooter

        $scope.reset()
]
