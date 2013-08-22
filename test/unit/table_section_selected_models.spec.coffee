describe "Table Section Selected Models", ->
  # Initialize these values up here
  scope     = null
  $document = null
  models    = null
  columns   = null
  element   = null
  template  = """
    <table mac-table mac-table-columns="tableColumns">
      <thead mac-table-section="header" mac-table-section-blank-row>
        <tr mac-table-row>
          <th mac-cell-template mac-column-width="auto">Header Cell</th>
        </tr>
      </thead>
      <tbody 
        mac-table-section="body" 
        mac-table-section-models="tableData"
        mac-table-section-selected-models="$parent.$parent.selectedModels">
        <tr mac-table-row mac-table-selectable="rowsSelectable">
          <td mac-cell-template="first_name last_name">{{cell.value()}}</td>
        </tr>
      </tbody>
      <tfoot mac-table-section="footer" mac-table-section-blank-row>
        <tr mac-table-row>
          <td mac-cell-template>Footer Cell</td>
        </tr>
      </tfoot>
    </table>
  """

  triggerKeyDown = (keycode) ->
    event         = jQuery.Event "keydown"
    event.which   = keycode
    $document.trigger event

  triggerKeyUp = (keycode) ->
    event         = jQuery.Event "keyup"
    event.which   = keycode
    $document.trigger event

  beforeEach module "Mac"

  beforeEach inject ($rootScope, $compile, _$document_) ->
    $document = _$document_
    scope     = $rootScope.$new()
    models    = [
      first_name: "Paul"
      last_name:  "McCartney"
    ,
      first_name: "John"
      last_name:  "Lennon"
    ,
      first_name: "Ringo"
      last_name:  "Star"
    ,
      first_name: "George"
      last_name:  "Harrison"
    ]
    columns = ["first_name", "last_name"]
    element = $compile(template)(scope)

    scope.$apply ->
      scope.rowsSelectable = true
      scope.selectedModels = []
      scope.tableData      = models
      scope.tableColumns   = columns

  describe "Selected Models Binding", ->
    it "should populate the selected models array when a row is selected", ->
      element.find("[mac-table-selectable]:first").click()
      expect(scope.selectedModels[0]).toBe models[0]

    it "should mark the row as selected when models are passed to selected models array", ->
      scope.$apply ->
        scope.selectedModels = models.slice 0
      
      for row in element.scope().table.sections.body.rows
        expect(row.selected).toBe true
  
  describe "Selection Behavior", ->
    it "should not allow selections if selectable attribute is false", ->
      scope.$apply ->
        scope.rowsSelectable = false

      element.find("[mac-table-selectable]:first").click()
      expect(scope.selectedModels.length).toBe 0

    it "should not let you select multiple rows by default", ->
      element.find("[mac-table-selectable]:first").click()
      element.find("[mac-table-selectable]:last").click()
      expect(scope.selectedModels.length).toBe 1
      expect(scope.selectedModels[0]).toBe models[3]

    it "should select each row between the first and last when shift is held down", ->
      element.find("[mac-table-selectable]:first").click()
      triggerKeyDown 16
      element.find("[mac-table-selectable]:last").click()
      expect(scope.selectedModels.length).toBe 4

    it "should unselect range when shift is not held down anymore", ->
      element.find("[mac-table-selectable]:first").click()
      triggerKeyDown 16
      element.find("[mac-table-selectable]:last").click()
      triggerKeyUp 16
      element.find("[mac-table-selectable]:first").click()
      expect(scope.selectedModels.length).toBe 1

    it "should select each row when command is held", ->
      element.find("[mac-table-selectable]:first").click()
      triggerKeyDown 91
      element.find("[mac-table-selectable]:last").click()
      expect(scope.selectedModels.length).toBe 2

    it "should unselect each in range when command is held", ->
      element.find("[mac-table-selectable]:first").click()
      triggerKeyDown 16
      element.find("[mac-table-selectable]:last").click()
      triggerKeyUp 16
      triggerKeyDown 91
      element.find("[mac-table-selectable]:last").click()
      expect(scope.selectedModels.length).toBe 3
