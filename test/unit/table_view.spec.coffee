describe "Table Data", ->
  beforeEach module "Mac"

  describe "Normal Table Data", ->
    beforeEach inject ($rootScope, Table, SectionController) ->
      class BodySectionController extends SectionController
        cellValue: (row, colName) ->
            switch colName
                when "fullName" then "#{row.model.first_name} #{row.model.last_name}"
                when "age" then row.model.age
      models = [
          {first_name: "Paul", last_name: "McCartney", age: 30}
          {first_name: "John", last_name: "Lennon", age: 29} ]
      columns = ['fullName', 'age']

      @scope = $rootScope.$new()
      @scope.table = table = new Table(columns)
      table.load("body", models, BodySectionController)
      table.load("header", [{fullName: "Full Name", age: "Age"}])


    it "Should do some stuff", inject (Table) ->
      Table is Table

    it "makes the right number of rows", ->
      table = @scope.table
      expect(table.sections.body.rows.length).toBe 2

    it "makes the right number of cells", ->
      table = @scope.table
      expect(table.sections.body.rows[0].cells.length).toBe 2

    it "sets the column name on cells", ->
      table = @scope.table
      expect(table.sections.body.rows[0].cells[0].colName).toBe "fullName"

    it "gets the right value on cells", ->
      table = @scope.table
      expect(table.sections.body.rows[0].cells[0].value()).toBe "Paul McCartney"

    it "sets table on section", ->
      table = @scope.table
      # Section has table
      expect(table.sections.body.table).toBe table

    it "sets section on row", ->
      table = @scope.table
      # Rows have section
      expect(table.sections.body.rows[0].section).toBe table.sections.body

    it "sets row on cells", ->
      table = @scope.table
      # Cells have row
      expect(table.sections.body.rows[0].cells[0].row).toBe table.sections.body.rows[0]

    it "gets the right value from header cells", ->
      table = @scope.table
      expect(table.sections.header.rows[0].cells[0].value()).toBe "Full Name"

    it "updates the properties on the cells with properties on that column", ->
      table = @scope.table
      table.columns[0].width = 50
      expect(table.sections.body.rows[0].cells[0].width).toBe 50

    it "can remove a row at an index", ->
      table = @scope.table
      table.remove "body", 0
      expect(table.sections.body.rows.length).toBe 1
      expect(table.sections.body.rows[0].cells[0].value()).toBe "John Lennon"

    it "can add a row at an index", ->
      table = @scope.table
      table.insert "body", {first_name: "Ringo", last_name: "Star", age: 40}, 1
      expect(table.sections.body.rows.length).toBe 3
      expect(table.sections.body.rows[1].cells[0].value()).toBe "Ringo Star"

    it "can total a column", inject (SectionController) ->
      table = @scope.table
      class FooterController extends SectionController
        cellValue: (row, colName) ->
          if colName is "age"
            total = 0
            for row in @section.table.sections.body.rows
              total += row.cellsMap[colName].value()
            total
          else
            ""

      table.load("footer", null, FooterController)
      table.insert("footer", table.blankRow())
      expect(table.sections.footer.rows[0].cells[1].value()).toBe 59

    it "can set a header from a blank row", ->
      table = @scope.table
      # Remove the header we set above
      delete table.sections.header
      blankRow = table.blankRow()
      table.load "header", [blankRow]
      expect(table.sections.header.rows[0].model).toEqual blankRow
      expect(table.sections.header.rows[0].cells[0].value()).toBe null

    describe "Dynamic Table", ->
      beforeEach inject ($rootScope, Table, SectionController) ->
        # Our custom header controller, we'll use this later
        class HeaderController extends SectionController
            cellValue: (row, colName) -> colName.replace(/_/g,' ')

         models = [
            {first_name: "Paul", last_name: "McCartney", age: 30, date_of_birth: '6/18/1942'}
            {first_name: "John", last_name: "Lennon", age: 29, date_of_birth: '10/09/1940'} ]
        @table = table = new Table('dynamic')
        table.load("header", null, HeaderController)
        table.load("body", models)

      it "can make a blank model", ->
        columns = []
        columns.push key for key, value of @table.columnsCtrl.blank()
        expect(columns).toEqual ['first_name', 'last_name', 'age', 'date_of_birth']

      it "has dynamicColumns property set to true", ->
        expect(@table.dynamicColumns).toBe true

      it "generates the correct columns", ->
        expect(@table.columnsOrder).toEqual ['first_name', 'last_name', 'age', 'date_of_birth']

      it "generates the correct cells", ->
        cells = @table.sections.body.rows[0].cells
        columns = []
        for cell in cells
          columns.push cell.colName
        expect(columns).toEqual ['first_name', 'last_name', 'age', 'date_of_birth']

      it "can have an empty section become populated", ->
        @table.insert "header", @table.blankRow()
        expect(@table.sections.header.rows[0].cells[0].value()).toBe "first name"

      it "can deal with columns being resorted", ->
        @table.columnsOrder.reverse()
        @table.columnsCtrl.syncOrder()
        columns = []
        columns.push cell.colName for cell in @table.sections.body.rows[0].cells
        expect(columns).toEqual @table.columnsOrder

      it "updates the properties on the cells with properties on that column", ->
        #
        # TODO: There is an issue here, if we used:
        #
        #   @table.load "header", [@table.blankRow()]
        #
        # it would clobber our current columns and make new ones, disjointing
        # them from the other sections (in this case the body)
        # this just applies to dynamic tables
        #
        @table.insert "header", @table.blankRow()
        @table.columns[0].width = 50
        expect(@table.sections.header.rows[0].cells[0].width).toBe 50
        expect(@table.sections.body.rows[0].cells[0].width).toBe 50

describe "Table View", ->
  # Initialize these values up here
  scope    = null
  $compile = null
  models   = null
  columns  = null

  beforeEach module "Mac"

  describe "Normal Table View", ->
    beforeEach inject ($rootScope, _$compile_) ->
      $compile = _$compile_
      scope = $rootScope.$new()
      models = [
          {first_name: "Paul", last_name: "McCartney"}
          {first_name: "John", last_name: "Lennon"} ]
      columns = ["first_name", "last_name"]

    describe "Table Structure", ->
      element  = null
      template =
      """<table mac-table-v2 columns="tableColumns">
          <thead table-section="header">
            <tr table-row ng-repeat="row in section.rows">
              <th cell-template initial-width="auto">Test</th>
            </tr>
          </thead>
          <tbody table-section="body" models="tableData">
            <tr table-row ng-repeat="row in section.rows">
              <th cell-template initial-width="auto">{{cell.value()}}</th>
            </tr>
          </tbody>
        </table>"""

      beforeEach ->
        element = $compile(template)(scope)
        scope.$apply ->
          scope.tableData    = models
          scope.tableColumns = columns

      it "Should repeat table-row for each item", ->
        expect(element.find("[table-section=body] [table-row]").length).toBe 2

      it "Should repeat cell-template for each column", ->
        expect(element.find("[table-section=body] [table-row] [cell-template]").length).toBe 4

      it "Should adjust when columns are removed", ->
        scope.$apply -> scope.tableColumns.pop()
        expect(element.find("[table-section=body] [table-row] [cell-template]").length).toBe 2

      it "Should set mac-columns attribute on parent of initial-width directives", ->
        expect(element.find("[table-section=header] [table-row][mac-columns]").length).toBe 1

      it "Should set a width attribute on every cell-template", ->
        # Counts header (1*2) + body (2*2)
        expect(element.find("[cell-template][width]").length).toBe 6

      it "Should set the width automatically", ->
        expect(element.find("[cell-template]").first().attr("width")).toBe "50%"

      describe "macColumns behaviour", ->
        # We are collecting all this information to pass as arguments to our mac-columns event listener
        changeColumnWidth = (width) ->
          column                           = element.find("[table-section=header] [table-row] [cell-template]").first()
          columnId                         = column.scope().$id
          macColumnsId                     = element.find("[mac-columns]").scope().$id
          column.scope().cell.column.width = width

          return [macColumnsId, columnId]

        it "Should adjust the widths correctly", ->
          macColumnsId = null

          scope.$apply ->
            [macColumnsId, columnId] = changeColumnWidth 70
            scope.$broadcast "mac-columns-#{macColumnsId}-changed", columnId, 70, 50

          expect(element.find("[table-section=header] [table-row] [cell-template]").last().attr("width")).toBe "30%"

        it "Should abort if it causes a column to be less than 5%", ->
          macColumnsId = null

          scope.$apply ->
            [macColumnsId, columnId] = changeColumnWidth 100
            scope.$broadcast "mac-columns-#{macColumnsId}-changed", columnId, 100, 50

          expect(element.find("[table-section=header] [table-row] [cell-template]").last().attr("width")).toBe "50%"
