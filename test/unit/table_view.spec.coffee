describe "Table View", ->
  beforeEach module "Mac"

  it "Should pass this test", inject ($q) ->
    expect("hoopla").toBe "hoopla"
