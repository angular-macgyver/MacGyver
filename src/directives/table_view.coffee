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
## - mac-table-fluid-width:       When true, width of the table is 100% of the parent container    (default false)
## - mac-table-column-width:      The minimum width of a column                                    (default 140)
## - mac-table-header-height:     The height of the header row                                     (default mac-table-row-height)
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
    templateUrl: "template/table_view.html"

    compile: (element, attrs, transclude) ->
      # Default table view attributes
      defaults =
        hasHeader:             true
        hasTotalFooter:        false
        hasFooter:             false
        width:                 800
        columnWidth:           140
        headerHeight:          20
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
        fluidWidth:            false

      transcludedBlock = $(".mac-table-transclude", element)
      headerBlock      = $(".mac-table-header", element)
      headerRow        = $(".mac-table-row", headerBlock)
      bodyWrapperBlock = $(".mac-table-body-wrapper", element)
      firstColumn      = $(".mac-title-column", bodyWrapperBlock)
      bodyBlock        = $(".mac-table-body", element)
      bodyHeightBlock  = $(".mac-table-body-height", element)
      footerBlock      = $(".mac-table-footer", element)
      totalRow         = $(".total-footer-row", footerBlock)
      customFooterRow  = $(".custom-footer-row", footerBlock)
      bodyBackground   = $(".mac-table-body-background", element)
      emptyCell        = $("<div>").addClass "mac-cell"

      # Calculate all the options based on defaults
      opts = util.extendAttributes "macTable", defaults, attrs

      # Default header height to row height if header height is not defined
      opts.headerHeight = opts.rowHeight unless attrs.macTableHeaderHeight?

      cellOuterHeight = opts.rowHeight + opts.cellPadding * 2
      totalRows       = opts.numDisplayRows
      totalRows      += opts.hasFooter + opts.hasTotalFooter

      (->
        # Update the width and height of the whole table
        width = if opts.fluidWidth then "100%" else (opts.width - 2 * opts.borderWidth)
        element.css
          height: cellOuterHeight * totalRows
          width:  width
      )()

      ($scope, element, attrs) ->
        numDisplayRows = opts.numDisplayRows - opts.hasHeader

        $scope.$watch "data", ->
          if $scope.data?
            scrollTop          = bodyWrapperBlock.scrollTop()
            index              = Math.floor scrollTop / cellOuterHeight
            endIndex           = index + numDisplayRows - 1
            $scope.displayRows = $scope.data[index..endIndex]

            $scope.calculateTotal() if opts.calculateTotalLocally

            # Recalculate all the column css with latest data
            calculateColumnCss() if $scope.columns?

            # Recalculate body block width after cells are populated
            if opts.lockFirstColumn and $scope.columns?
              firstColumnName = $scope.columns[0]
              width           = $scope.columnsCss[firstColumnName]?.width or 0
              bodyBlock.width element.width() - width

        $scope.$watch "columns", ->
          if $scope.columns?
            $scope.renderTable() unless $scope.tableInitialized
            calculateColumnCss()

        Object.defineProperty $scope, "total",
          get: ->
            totalKey = if opts.calculateTotalLocally then "localTotal" else "totalData"
            $scope[totalKey]

        #
        # @name calculateColumnCss
        # @description
        # Calculate CSS attributes of all columns and store to $scope.columnCss
        # @return {Boolean} true
        #
        calculateColumnCss = ->
          for column in $scope.columns
            #Check if body cell has set width
            bodyCell = getTemplateCell "body", column
            setWidth = bodyCell.css "width"

            # Distinguish between percentage and pixels

            if (widthMatch = /(\d+)(px|%)?/.exec setWidth)?
              setWidth = +widthMatch[1]
              unit     = widthMatch[2]
            setWidth ?= 0

            if setWidth is 0
              # Calculate the relative width of each cell
              numColumns      = $scope.columns.length
              calculatedWidth = (opts.width / numColumns) - opts.cellPadding * 2 - opts.borderWidth

              # Use minimum width if the relative width is too small
              width = Math.max calculatedWidth, opts.columnWidth
            else
              # Convert percentage to real width
              setWidth = element.width() * (setWidth / 100) if unit is "%"
              width    = setWidth

            $scope.columnsCss[column] =
              width:   width
              padding: opts.cellPadding
              height:  opts.rowHeight

          return true

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
          cell = getTemplateCell(section, column).clone()
          cell = emptyCell.clone() if cell.length is 0

          # Set column property again
          cell.prop("column", column).addClass "mac-cell"

          width = $scope.columnsCss[column].width + 2 * opts.cellPadding + opts.borderWidth

          return {cell, width}

        #
        # @name createHeaderCellTemplate
        # @description
        # This is a shortcut call for header version of createCellTemplate
        # Caret is added to the cell before returning
        # @params {String} column Column needed (default "")
        #
        createHeaderCellTemplate = (column = "", firstColumn = false) ->
          {cell, width} = createCellTemplate "header", column
          contextText   = cell.text()

          parentScope  = if firstColumn then "" else "$parent.$parent."

          cellClass  = """mac-table-caret {{#{parentScope}reverse | boolean:"up":"down"}} """
          cellClass += """{{#{parentScope}predicate == "#{column.toLowerCase()}" | false:'hide'}}"""

          cell.text column if contextText.length is 0
          cell
            .attr("for", column)
            .append $("<span>").attr "class", cellClass

          return {cell, width}

        #
        # @name createRowTemplate
        # @description
        # Create template row with switches to select the correct column template
        # @params {String} section Table section
        # @return {jQuery Element} template row
        #
        createRowTemplate = (section="") ->
          rowWidth   = 0
          startIndex = if opts.lockFirstColumn then 1 else 0

          # Create template cell with ng-repeat and ng-switch
          cssClass  = "mac-table-#{section}-cell"
          cssClass += " mac-table-cell" unless section is "header"
          row       = $("<div>").addClass(cssClass).attr
                        "ng-switch":   ""
                        "on":          "column"
                        "ng-repeat":   "column in columns.slice(#{startIndex})"
                        "data-column": "{{column}}"
                        "ng-style":    "getColumnCss(column, '#{section}')"

          for column in $scope.columns[startIndex..]
            {cell, width} = if section is "header"
                              createHeaderCellTemplate column
                            else
                              createCellTemplate section, column
            cell.attr "ng-switch-when", column
            row.append cell

            rowWidth += width

          return {row, width: rowWidth}

        #
        # @name $scope.getColumnCss
        # @description
        # A get function for getting CSS object
        # @params {String} column Column name
        # @params {String} section Section for the css
        # @result {Object} Object with CSS attributes
        #
        $scope.getColumnCss = (column, section) ->
          css        = angular.copy $scope.columnsCss[column]
          css.height = opts.headerHeight if section is "header"
          return css

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
          {row, width} = createRowTemplate "header"

          # Enable reordering
          if opts.allowReorder
            row.attr "ng-click", "orderBy(column)"

          # TODO: Enable column resizing
          if opts.resizable
            row.resizable
              containment: "parent"
              minHeight:   opts.rowHeight
              maxHeight:   opts.rowHeight
              handles:     "e, w"
            .addClass "resizable"

          # Set the header to be the width of all columns
          headerRow.append(row).width width

          # Compile the column to render carets
          $compile(headerRow) $scope

          # Create a separate cell if the first cell is locked
          if opts.lockFirstColumn
            columnName    = $scope.columns[0]
            {cell, width} = createHeaderCellTemplate columnName, true
            cell.addClass("mac-table-locked-cell mac-table-header-cell").attr
              "ng-click": "orderBy('#{columnName}')"
              "ng-style": "getColumnCss('#{columnName}', 'header')"

            headerBlock.append cell

            headerRow.css "margin-left", width

            # Compile the column to render carets
            $compile(headerBlock) $scope

          # Enable drag and drop on header cell
          if opts.sortable
            headerRow.sortable
              items:       "> .mac-table-header-cell"
              cursor:      "move"
              opacity:     0.8
              tolerance:   "pointer"
              update:      (event, ui) ->
                newOrder = []
                $(".mac-table-header-cell", headerRow).each (i, e) ->
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
          {row, width} = createRowTemplate "total-footer"

          # Set the header to be the width of all columns
          totalRow.append(row).width width

          if opts.lockFirstColumn
            columnName  = $scope.columns[0]
            paddingLeft = $scope.columnsCss[columnName].width + 2 * opts.cellPadding + opts.borderWidth
            totalRow.css "padding-left", paddingLeft

          # Compile the column to render carets
          $compile(totalRow) $scope

        $scope.drawFooter = ->
          footerTemplate = $(".table-footer-template", transcludedBlock)
          customFooterRow.html(footerTemplate.html()).css
            "height":  opts.rowHeight
            "padding": opts.cellPadding
          $compile(customFooterRow) $scope

        #
        # @name $scope.calculateBodyDimension
        # @description
        # Calculate the height and the scrolling height of the table
        #
        $scope.calculateBodyDimension = ->
          data = $scope.data or []
          # Calculate the height to display scrollbar correctly
          bodyHeightBlock.height data.length * cellOuterHeight

          setTimeout ( ->
            wrapperHeight  = (numDisplayRows - opts.hasHeader) * cellOuterHeight
            wrapperHeight += opts.headerHeight * opts.hasHeader

            # Check if x-axis scrollbar exist
            if bodyBlock[0].scrollWidth > bodyBlock.width()
              wrapperHeight += 15
              element.height element.height() + 15 + opts.hasHeader * (opts.headerHeight - opts.rowHeight) / 2

            bodyWrapperBlock.height wrapperHeight
          ), 0

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
          tableRow = $("<div>").addClass "mac-table-row"
          tableRow.attr
            "ng-repeat": "row in displayRows #{orderBy}"
            "ng-cloak":  "ng-cloak"

          # Set the first set of rows to show up
          endIndex           = @index + numDisplayRows - 1
          $scope.displayRows = data[@index..endIndex]

          {row, width} = createRowTemplate "body"

          tableRow.append(row).width width
          bodyBlock.append tableRow

          # Compile the body block to bind all values correctly
          $compile(bodyBlock) $scope

          # if the first column is locked, create a separate column with
          # fixed position
          if opts.lockFirstColumn
            fcTableRow    = $(".mac-table-row", firstColumn)
            columnName    = $scope.columns[0]
            {cell, width} = createCellTemplate "body", columnName
            cell.attr
              "ng-style": "getColumnCss('#{columnName}', 'body')"
            fcTableRow.attr
                        "ng-repeat": "row in displayRows #{orderBy}"
                        "ng-cloak":  "ng-cloak"
                      .append cell
            # Compile the column to render ng-repeat
            $compile(firstColumn) $scope

            $scope.headerLeftMargin = width

            bodyBlock.css
              "margin-left": $scope.headerLeftMargin
              "width":       element.width() - width

          # Generate empty rows to fill up table background
          emptyTemplateRow = $("<div>").addClass "mac-table-row"
          emptyTemplateRow.height cellOuterHeight
          bodyBackground.append(emptyTemplateRow.clone()) for i in [0..numDisplayRows-opts.hasHeader]

          if opts.hasHeader
            bodyBackground.css "top", opts.headerHeight + 2 * opts.cellPadding + opts.borderWidth

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
        # @name $scope.renderTable
        # @description
        # Function tto draw all components of the table
        # @return {Boolean} true
        #
        $scope.renderTable = ->
          objectPrefix     = if opts.objectPrefix then "#{opts.objectPrefix}." else ""
          $scope.predicate =  if $scope.columns?.length > 0
                                "#{objectPrefix}#{$scope.columns[0].toLowerCase()}"
                              else
                                ""

          calculateColumnCss()

          if opts.hasHeader
            $scope.drawHeader()

          $scope.drawBody()

          # Only calculate total value if footer exist
          if opts.calculateTotalLocally
            $scope.calculateTotal()

          if opts.hasTotalFooter
            $scope.drawTotalFooter()

          if opts.hasFooter
            $scope.drawFooter()

          $scope.calculateBodyDimension()

          $scope.tableInitialized = true

          # Update body width if the table is fluid
          if opts.fluidWidth
            clearTimeout $scope.bodyBlockTimeout if $scope.bodyBlockTimeout?
            $scope.bodyBlockTimeout = setInterval (->
                leftMargin = bodyBlock.css "margin-left"
                bodyBlock.width element.width() - parseInt(leftMargin)
              ), 500

          return true

        #
        # @name $scope.reset
        # @description
        # Reset table view scope
        #
        $scope.reset = ->
          $scope.displayRows      = []
          $scope.index            = 0
          $scope.headerLeftMargin = 0
          $scope.columnsCss       = {}
          $scope.bodyBlockTimeout = null

          # Use to determine if table has been initialized
          $scope.tableInitialized = false

          $scope.predicate = ""
          $scope.reverse = false

        $scope.reset()
]
