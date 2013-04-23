describe "Table", ->
  beforeEach module "Mac"

  describe "Normal Table", ->
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

    describe "Dynamic Table", ->
      beforeEach inject ($rootScope, Table, SectionController) ->
        # Our custom header controller, we'll use this later
        class HeaderController extends SectionController
            cellValue: (row, colName) -> colName.replace(/_/g,' ')

         models = [
            {first_name: "Paul", last_name: "McCartney", age: 30, date_of_birth: '6/18/1942'}
            {first_name: "John", last_name: "Lennon", age: 29, date_of_birth: '10/09/1940'} ]
        @table = table = new Table('dynamic')
        table.load("body", models)
        table.load("header", null, HeaderController)

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
