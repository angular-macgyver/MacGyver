angular.module("Mac").factory "Table", ["$q", ($q) ->
    class BaseColumn

    columnFactory = (colName, proto = {}) ->
        Column = (@colName) ->
        Column.prototype = proto
        return new Column(colName)

    class SectionController
        constructor: (@section) ->
        # Value should probably be overridden by the user
        cellValue: (row, colName) -> @defaultCellValue(row, colName)
        # Since accessing a models key is useful
        # we keep this as a separate method
        defaultCellValue: (row, colName) -> row.model[colName]

    sectionFactory = (table, sectionName, controller = SectionController) ->
        Section = (controller, @table, @name, @rows = []) ->
            @ctrl = new controller(this)
            return
        return new Section(controller, table, sectionName)

    cellFactory = (row, proto = {}) ->
        Cell = (@row) ->
            # TODO: Find a better place for this, we can't use our prototype though...
            @value = -> @row?.section?.ctrl.cellValue(@row, @colName)
            return
        Cell.prototype = proto
        return new Cell(row)

    class Row
        constructor: (@section, @model, @cells = [], @cellsMap = {}) ->

    class ColumnsController
        constructor: (@table) ->
        dynamic: (models) ->
            # Should look in more than just the first...
            # but this function should probably be left to the
            # user to implement
            first = models[0]
            columns = []
            for key, model of first
                columns.push key
            @set(columns)
        reset: ->
            @table.columnsOrder = []
            @table.columns = []
            @table.columnsMap = {}
        set: (columns) ->
            @reset()
            # Store the order
            @table.columnsOrder = columns
            for colName in columns
                column = columnFactory(colName, @table.baseColumn)
                @table.columnsMap[colName] = column
                @table.columns.push column
        syncOrder: ->
            # Function might be better in table...
            for section, rows of @table.sections
                for row in rows
                    cells = []
                    for colName in @table.columnsOrder
                        cells.push row.cellsMap[colName]
                    row.cells = cells
            columns = []
            for colName in @table.columnsOrder
                columns.push @table.columnsMap[colName]
            @table.columns = columns



    class RowsController
        constructor: (@table) ->
        set: (sectionName, models, sectionController) ->
            @table.sections[sectionName] = section = sectionFactory(@table, sectionName, sectionController)

            if @table.dynamicColumns
                @table.columnsCtrl.dynamic(models)

            rows = []
            for model in models
                row = new Row(section, model)
                for colName, column of @table.columnsMap
                    cell = cellFactory(row, column)
                    row.cellsMap[colName] = cell
                    row.cells.push cell
                rows.push row

            section.rows = rows


    class Table
        constructor: (columns = 'dynamic', @baseColumn = new BaseColumn()) ->
            this.sections = {}
            this.columns = []
            this.columnsCtrl = new ColumnsController(this)
            this.rowsCtrl = new RowsController(this)
            this.dynamicColumns = columns is 'dynamic'
            if not @dynamicColumns
                this.columnsCtrl.set(columns)
            return
        load: (section, models, sectionController)->
            if !!models.then # deferred
                models.then (models) ->
                    this.rowsCtrl.set(section, models, sectionController)
            else
                this.rowsCtrl.set(section, models, sectionController)
]
