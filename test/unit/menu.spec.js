describe("Mac menu", function() {
  var $compile, $rootScope, getMenuText, items, queryMenu;
  items = [
    {
      label: "item1"
    }, {
      label: "item2"
    }, {
      label: "item3"
    }
  ];

  queryMenu = function(element) {
    return element.querySelector(".mac-menu-item");
  };

  getMenuText = function(element) {
    var item;
    item = queryMenu(element);
    return item.innerText || item.textContent;
  };

  beforeEach(module("Mac"));
  beforeEach(module("template/menu.html"));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  describe("templating", function() {
    it("should use default template", function() {
      var element;
      $rootScope.items = items;
      element = $compile("<mac-menu mac-menu-items='items'></mac-menu>")($rootScope);
      $rootScope.$digest();

      expect(getMenuText(element[0])).toBe("item1");
    });

    it("should use custom template", function() {
      var element;
      $rootScope.items = items;
      element = $compile("<mac-menu mac-menu-items='items'><span>{{item.label}} {{$index}}</span></mac-menu>")($rootScope);
      $rootScope.$digest();

      return expect(getMenuText(element[0])).toBe("item1 0");
    });
  });

  it("should show three items", function() {
    var element;
    $rootScope.items = items;
    element = $compile("<mac-menu mac-menu-items='items'></mac-menu>")($rootScope);
    $rootScope.$digest();

    expect(element[0].querySelectorAll(".mac-menu-item").length).toBe(3);
  });

  it("should update scope index", function() {
    var element;
    $rootScope.items = items;
    $rootScope.index = 0;

    element = $compile("<mac-menu mac-menu-items='items' mac-menu-index='index'></mac-menu>")($rootScope);
    $rootScope.$digest();

    $rootScope.$$childHead.setIndex(2);
    $rootScope.$digest();

    expect($rootScope.index).toBe(2);
  });

  it("should add custom style", function() {
    var element;
    $rootScope.items = items;
    $rootScope.style = {
      color: 'red'
    };

    element = $compile("<mac-menu mac-menu-items='items' mac-menu-style='style'></mac-menu>")($rootScope);
    $rootScope.$digest();

    expect(element[0].style.color).toBe("red");
  });

  it("should fire select callback", function() {
    var callback, element;
    callback = jasmine.createSpy("select");
    $rootScope.items = items;
    $rootScope.select = callback;

    element = $compile("<mac-menu mac-menu-items='items' mac-menu-select='select(index)'></mac-menu>")($rootScope);
    $rootScope.$digest();

    $rootScope.$$childHead.selectItem(3);
    expect(callback).toHaveBeenCalled();
  });
});
