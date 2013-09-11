describe "List filter", ->
  $rootScope = null
  $compile   = null
  listFilter = null

  beforeEach module("Mac")
  beforeEach inject (_$rootScope_, _$compile_, _listFilter_) ->
    $rootScope = _$rootScope_
    $compile   = _$compile_
    listFilter = _listFilter_

  it "should format an array into a string", ->
    array = [1, 2, 3, 4]
    expect(listFilter array).toBe "1, 2, 3, 4"

  it "should format an array into a string with a custom separator", ->
    array = [1, 2, 3, 4]
    expect(listFilter array, " | ").toBe "1 | 2 | 3 | 4"

  it "should interpolate correctly", ->
    $rootScope.array = [1, 2, 3, 4]
    element = $compile("<span>{{ array | list }}</span>") $rootScope
    $rootScope.$digest()
    expect(element.text()).toBe "1, 2, 3, 4"
