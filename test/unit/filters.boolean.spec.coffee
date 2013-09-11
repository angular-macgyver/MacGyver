describe "Boolean filter", ->
  booleanFilter = null

  beforeEach module("Mac")
  beforeEach inject ($injector) ->
    booleanFilter = $injector.get "booleanFilter"

  it "should format booleans", ->
    expect(booleanFilter true).toBe  "true"
    expect(booleanFilter false).toBe "false"

  it "should allow custom strings for booleans", ->
    expect(booleanFilter true,  "on", "off").toBe "on"
    expect(booleanFilter false, "on", "off").toBe "off"
