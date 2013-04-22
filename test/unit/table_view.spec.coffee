describe "Table View", ->
  beforeEach module "Mac"

  it "Should do some stuff", inject ($q, Table) ->
    Table is Table
