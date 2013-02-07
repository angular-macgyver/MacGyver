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
## @variables
## {Object} row Each row data
## {Object} total An object with total value
##
## @attributes
## - mac-table-data:              Array of objects with table data
## - mac-table-total-data:        Object with total value
## - mac-table-columns:           Array of columns to display
## - mac-table-has-header:        A boolean value to determine if header should be shown           (default true)
## - mac-table-has-total-footer:  Boolean determining if footer with total should be shown         (default false)
## - mac-table-has-footer:        A boolean value to determine if footer should be shown           (default false)
## - mac-table-width:             The width of the whole table                                     (default 800)
## - mac-table-column-width:      The minimum width of a column                                    (default 140)
## - mac-table-row-height:        The height of each row in the table                              (default 20)
## - mac-table-num-display-rows:  The total number of rows to display                              (default 10)
## - mac-table-cell-padding:      Should match the css padding value on each cell                  (default 8)
## - mac-table-border-width:      Should match the css border width value on each cell             (default 1)
## - mac-table-sortable:          Allow user to change the order of columns                        (default false)
## - mac-table-resizable:         Allow each column to be resized by the user                      (default false)
## - mac-table-lock-first-column: Lock first column to a static position                           (default false)
## - mac-table-allow-reorder:     Allow user to click on the header to reorder rows                (default true)
## - mac-table-object-prefix:     Useful when using backbone object where data is in attributes    (default "")
## - mac-table-calculate-total-locally: A boolean value to determine if total should be calculated (default false)
##

angular.module("Mac").directive "macTable", [
  "$rootScope"
  "$compile"
  "util"
  ($rootScope, $compile, util) ->
    restrict: "EA"
    scope:
      data:            "=macTableData"
      totalData:       "=macTableTotalData"
      columns:         "=macTableColumns"
      lockTitleColumn: "@macTableLockFirstColumn"
    replace:     true
    transclude:  true
    templateUrl: "/template/table_view.html"

    compile: (element, attrs, transclude) ->
      # Default table view attributes
      defaults =
        hasHeader:             true
        hasTotalFooter:        false
        hasFooter:             false
        width:                 800
        columnWidth:           140
        rowHeight:             20
        numDisplayRows:        10
        cellPadding:           8
        borderWidth:           1
        sortable:              false
        resizable:             false
        lockFirstColumn:       false
        allowReorder:          true
        objectPrefix:          ""
        calculateTotalLocally: false


      transcludedBlock = $(".table-transclude", element)
      headerBlock      = $(".table-header", element)
      headerRow        = $(".table-row", headerBlock)
      bodyWrapperBlock = $(".table-body-wrapper", element)
      firstColumn      = $(".title-column", bodyWrapperBlock)
      bodyBlock        = $(".table-body", element)
      bodyHeightBlock  = $(".table-body-height", element)
      footerBlock      = $(".table-footer", element)
      totalRow         = $(".total-footer-row", footerBlock)
      customRow        = $(".custom-footer-row", footerBlock)
      customFooterRow  = $(".custom-footer-row", footerBlock)
      bodyBackground   = $(".table-body-background", element)
      emptyCell        = $("<div>").addClass "cell"

      # Calculate all the options based on defaults
      opts = util.extendAttributes "macTable", defaults, attrs

      cellOuterHeight = opts.rowHeight + opts.cellPadding * 2
      totalRows       = opts.numDisplayRows
      totalRows      += opts.hasFooter + opts.hasTotalFooter

      # Update the width and height of the whole table
      element.css
        height: cellOuterHeight * totalRows
        width:  opts.width - 2 * opts.borderWidth

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

            $scope.calculateTotal() if opts.calculateTotalLocally

        Object.defineProperty $scope, "total",
          get: ->
            totalKey = if opts.calculateTotalLocally then "localTotal" else "totalData"
            $scope[totalKey]

        #
        # @name getTemplateCell
        # @description
        # Get the correct template cell transcluded block
        # @params {String} section Either header, body or footer (default "")
        # @params {String} column Column needed                  (default "")
        #
        getTemplateCell = (section = "", column = "") ->
          templateSelector = """.table-#{section}-template .cell[column="#{column}"]"""
          $(templateSelector, transcludedBlock)

        #
        # @name createCellTemplate
        # @description
        # Get the template cell user has defined in template, create empty cell if not found
        # The width and height will be calculated and set before returning
        #
        # @params {String} section Either header, body or footer (default "")
        # @params {String} column Column needed                  (default "")
        #
        createCellTemplate = (section="", column="") ->
          templateCell = getTemplateCell(section, column).clone()
          templateCell = emptyCell.clone() if templateCell.length is 0

          # Set column property again
          templateCell.prop "column", column

          if section is "body"
            # Original width of the cell set in the template
            setWidth = templateCell.width()
          else
            #Check if body cell has set width
            bodyCell = getTemplateCell "body", column
            setWidth = bodyCell.width()

          if setWidth is 0
            # Calculate the relative width of each cell
            calculatedWidth = (opts.width / numColumns) - opts.cellPadding * 2 - opts.borderWidth

            # Use minimum width if the relative width is too small
            width = Math.max calculatedWidth, opts.columnWidth
          else
            width = setWidth

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
        # @params {String} column Column needed (default "")
        #
        createHeaderCellTemplate = (column = "") ->
          cell        = createCellTemplate "header", column
          contextText = cell.text()

          cellClass  = """caret {{$parent.$parent.reverse | boolean:"up":"down"}} """
          cellClass += """{{$parent.$parent.predicate == column.toLowerCase() | false:'hide'}}"""

          cell.text column if contextText.length is 0
          cell
            .attr("for", column)
            .append $("<span>").attr "class", cellClass

          return cell

        #
        # @name $scope.orderBy
        # @description
        # Function to call when user click on header cell
        # $scope.predicate and $scope.reverse
        # @params {jQuery Object} column The element to bind click event to
        #
        $scope.orderBy = (column) ->
          columnTitle = column.toLowerCase()
          if opts.objectPrefix
            columnTitle = opts.objectPrefix + "." + columnTitle

          if columnTitle is $scope.predicate
            $scope.reverse = not $scope.reverse
          else
            $scope.predicate = columnTitle
            $scope.reverse   = false

        #
        # @name $scope.calculateTotal
        # @description
        # Caclculate the total for each column of all rows and store in total
        #
        $scope.calculateTotal = ->
          $scope.localTotal = _($scope.data).reduce (memo, row) ->
            row = row[opts.objectPrefix] if opts.objectPrefix
            for key, value of row
              memo[key] ?= 0
              memo[key] += if isNaN(value) then 0 else +value
            return memo
          , {}

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

          # Create template cell with ng-repeat and ng-switch
          tableCell = $("<div>").addClass("table-header-cell").attr
                        "ng-switch":   ""
                        "on":          "column"
                        "ng-repeat":   "column in columns"
                        "data-column": "{{column}}"

          # Enable reordering
          if opts.allowReorder
            tableCell.attr "ng-click", "orderBy(column)"

          # TODO: Enable column resizing
          if opts.resizable
            tableCell.resizable
              containment: "parent"
              minHeight:   opts.rowHeight
              maxHeight:   opts.rowHeight
              handles:     "e, w"
            .addClass "resizable"

          for column in $scope.columns[startIndex..]
            templateCell = createHeaderCellTemplate column
            templateCell.attr "ng-switch-when", column
            tableCell.append templateCell

            rowWidth += templateCell.outerWidth() + opts.borderWidth

          # Set the header to be the width of all columns
          headerRow.append(tableCell).width rowWidth

          # Compile the column to render carets
          $compile(headerRow) $scope

          # Create a separate cell if the first cell is locked
          if opts.lockFirstColumn
            columnName     = $scope.columns[0]
            fcTemplateCell = createHeaderCellTemplate $scope.columns[0]
            fcTemplateCell.addClass("locked-cell").attr
              "ng-click": "orderBy('#{columnName}')"

            headerBlock.prepend fcTemplateCell

            headerRow.css
              "margin-left": fcTemplateCell.outerWidth()

            # Compile the column to render carets
            $compile(headerBlock) $scope

          # Enable drag and drop on header cell
          if opts.sortable
            headerRow.sortable
              items:       "> .table-header-cell"
              cursor:      "move"
              opacity:     0.8
              tolerance:   "pointer"
              update:      (event, ui) ->
                newOrder = []
                $(".table-header-cell", headerRow).each (i, e) ->
                  newOrder.push $(e).data "column"
                $scope.$apply -> $scope.columns = newOrder

                setTimeout (->
                  bodyBlock.scrollLeft headerBlock.scrollLeft()
                ), 0

        #
        # @name $scope.drawTotalFooter
        # @description
        # To create the footer with total value of the table
        #
        $scope.drawTotalFooter = ->
          rowWidth   = 0
          startIndex = if opts.lockFirstColumn then 1 else 0

          # Create template cell with ng-repeat and ng-switch
          tableCell = $("<div>").addClass("table-total-footer-cell").attr
                        "ng-switch":   ""
                        "on":          "column"
                        "ng-repeat":   "column in columns"
                        "data-column": "{{column}}"

          for column in $scope.columns[startIndex..]
            templateCell = createCellTemplate "total-footer", column
            templateCell.attr "ng-switch-when", column
            tableCell.append templateCell

            rowWidth += templateCell.outerWidth() + opts.borderWidth

          # Set the header to be the width of all columns
          totalRow.append(tableCell).width rowWidth

          # Compile the column to render carets
          $compile(totalRow) $scope

        $scope.drawFooter = ->
          footerTemplate = $(".table-footer-template", transcludedBlock)
          customRow.html(footerTemplate.html()).css
            "height":  opts.rowHeight
            "padding": opts.cellPadding
          $compile(customRow) $scope

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

          headerBlock.scrollLeft scrollLeft if opts.hasHeader
          footerBlock.scrollLeft scrollLeft if opts.hasFooter

        #
        # @name $scope.reset
        # @description
        # Reset table view scope
        #
        $scope.reset = ->
          $scope.displayRows      = []
          $scope.index            = 0
          $scope.headerLeftMargin = 0

          objectPrefix     = if opts.objectPrefix then "#{opts.objectPrefix}." else ""
          $scope.predicate = if $scope.columns.length > 0
                               "#{objectPrefix}#{$scope.columns[0].toLowerCase()}"
                             else
                               ""
          $scope.reverse = false

          if opts.hasHeader
            $scope.drawHeader()

          $scope.calculateBodyDimension()
          $scope.drawBody()

          # Only calculate total value if footer exist
          if opts.calculateTotalLocally
            $scope.calculateTotal()

          if opts.hasTotalFooter
            $scope.drawTotalFooter()

          if opts.hasFooter
            $scope.drawFooter()

        $scope.reset()
]
