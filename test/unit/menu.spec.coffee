describe "Mac menu", ->
  $compile   = null
  $rootScope = null
  items = [
    {label: "item1"}
    {label: "item2"}
    {label: "item3"}
  ]

  beforeEach module("Mac")
  beforeEach module("template/menu.html")

  beforeEach inject (_$compile_, _$rootScope_) ->
    $compile   = _$compile_
    $rootScope = _$rootScope_

  describe "templating", ->
    it "should use default template", ->
      $rootScope.items = items
      element = $compile("<mac-menu mac-menu-items='items'></mac-menu>") $rootScope
      $rootScope.$digest()

      expect($($(".mac-menu-item", element)[0]).text()).toBe "item1"

    it "should use custom template", ->
      $rootScope.items = items
      element = $compile("<mac-menu mac-menu-items='items'><span>{{item.label}} {{$index}}</span></mac-menu>") $rootScope
      $rootScope.$digest()

      expect($($(".mac-menu-item", element)[0]).text()).toBe "item1 0"

  it "should show three items", ->
    $rootScope.items = items
    element = $compile("<mac-menu mac-menu-items='items'></mac-menu>") $rootScope
    $rootScope.$digest()

    expect($(".mac-menu-item", element).length).toBe 3

  it "should update scope index", ->
    $rootScope.items = items
    $rootScope.index = 0

    element = $compile("<mac-menu mac-menu-items='items' mac-menu-index='index'></mac-menu>") $rootScope
    $rootScope.$digest()

    $rootScope.$$childHead.setIndex 2
    $rootScope.$digest()

    expect($rootScope.index).toBe 2

  it "should add custom style", ->
    $rootScope.items = items
    $rootScope.style = {color: 'red'}

    element = $compile("<mac-menu mac-menu-items='items' mac-menu-style='style'></mac-menu>") $rootScope
    $rootScope.$digest()

    expect(element[0].style.color).toBe("red")

  it "should fire select callback", ->
    callback         = jasmine.createSpy "select"
    $rootScope.items = items
    $rootScope.select = callback

    element = $compile("<mac-menu mac-menu-items='items' mac-menu-select='select(index)'></mac-menu>") $rootScope
    $rootScope.$digest()

    $rootScope.$$childHead.selectItem 3

    expect(callback).toHaveBeenCalled()
