
angular.module("Util", []);
var event, key, _fn, _fn1, _i, _j, _len, _len1, _ref, _ref1;

_ref = ["Blur", "Focus", "Keydown", "Keyup", "Mouseenter", "Mouseleave"];
_fn = function(event) {
  return angular.module("Util").directive("util" + event, [
    "$parse", function($parse) {
      return {
        restrict: "A",
        link: function(scope, element, attributes) {
          var expression;
          expression = $parse(attributes["util" + event]);
          return element.on(event.toLowerCase(), function(event) {
            scope.$apply(function() {
              return expression(scope, {
                $event: event
              });
            });
            return true;
          });
        }
      };
    }
  ]);
};
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  event = _ref[_i];
  _fn(event);
}

_ref1 = ["Enter", "Escape", "Space", "Left", "Up", "Right", "Down"];
_fn1 = function(key) {
  return angular.module("Util").directive("utilKeydown" + key, [
    "$parse", "Util.keys", function($parse, keys) {
      return {
        restrict: "A",
        link: function(scope, element, attributes) {
          var expression;
          expression = $parse(attributes["utilKeydown" + key]);
          return element.on("keydown", function(event) {
            if (event.which === keys["" + (key.toUpperCase())]) {
              event.preventDefault();
              return scope.$apply(function() {
                return expression(scope, {
                  $event: event
                });
              });
            }
          });
        }
      };
    }
  ]);
};
for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
  key = _ref1[_j];
  _fn1(key);
}

angular.module("Util").directive("utilModelBlur", [
  "$parse", function($parse) {
    return {
      restrict: "A",
      require: "ngModel",
      link: function(scope, element, attributes, controller) {
        return element.on("blur", function(event) {
          if (controller.$valid) {
            return scope.$apply($parse(attributes.utilModelBlur)(scope, {
              $event: event
            }));
          }
        });
      }
    };
  }
]);

angular.module("Util").directive("utilPauseTyping", [
  "$parse", function($parse) {
    return {
      restrict: "A",
      link: function(scope, element, attributes) {
        var delay, expression, keyupTimer;
        expression = $parse(attributes["utilPauseTyping"]);
        delay = scope.$eval(attributes["utilPauseTypingDelay"]) || 800;
        keyupTimer = "";
        return element.on("keyup", function(event) {
          clearTimeout(keyupTimer);
          return keyupTimer = setTimeout((function() {
            return scope.$apply(function() {
              return expression(scope, {
                $event: event
              });
            });
          }), delay);
        });
      }
    };
  }
]);

angular.module("Util").factory("Util.keys", function() {
  return {
    CANCEL: 3,
    HELP: 6,
    BACKSPACE: 8,
    TAB: 9,
    CLEAR: 12,
    ENTER: 13,
    RETURN: 13,
    SHIFT: 16,
    CONTROL: 17,
    ALT: 18,
    PAUSE: 19,
    CAPS_LOCK: 20,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    PRINT_SCREEN: 44,
    INSERT: 45,
    DELETE: 46,
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    FIVE: 53,
    SIX: 54,
    SEVEN: 55,
    EIGHT: 56,
    NINE: 57,
    SEMICOLON: $.browser.safari ? 186 : 59,
    EQUALS: 61,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    CONTEXT_MENU: 93,
    NUMPAD0: 96,
    NUMPAD1: 97,
    NUMPAD2: 98,
    NUMPAD3: 99,
    NUMPAD4: 100,
    NUMPAD5: 101,
    NUMPAD6: 102,
    NUMPAD7: 103,
    NUMPAD8: 104,
    NUMPAD9: 105,
    MULTIPLY: 106,
    ADD: 107,
    SEPARATOR: 108,
    SUBTRACT: 109,
    DECIMAL: 110,
    DIVIDE: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    F13: 124,
    F14: 125,
    F15: 126,
    F16: 127,
    F17: 128,
    F18: 129,
    F19: 130,
    F20: 131,
    F21: 132,
    F22: 133,
    F23: 134,
    F24: 135,
    NUM_LOCK: 144,
    SCROLL_LOCK: 145,
    COMMA: 188,
    PERIOD: 190,
    SLASH: 191,
    BACK_QUOTE: 192,
    OPEN_BRACKET: 219,
    BACK_SLASH: 220,
    CLOSE_BRACKET: 221,
    QUOTE: 222,
    META: 224
  };
});
var __hasProp = {}.hasOwnProperty;

angular.module("Util").directive("utilSpinner", function() {
  return {
    restrict: "EA",
    compile: function(element, attributes) {
      var k, key, options, spinner, value;
      element.addClass("ge-spinner");
      options = {};
      options.lines = 10;
      options.width = 2;
      for (key in attributes) {
        if (!__hasProp.call(attributes, key)) continue;
        value = attributes[key];
        if (key.indexOf("spinner") === 0 && key !== "spinner") {
          k = key.slice("spinner".length + 1);
          if (k === "Size") {
            options.radius = value / 5;
            options.length = value / 5;
          } else {
            options[k.toLowerCase()] = value;
          }
        }
      }
      return spinner = new Spinner(options).spin(element[0]);
    }
  };
});
/*
 Table view

 A directive for generating a lazy rendered table

 Example data:
  stat_data - array of stat objects
  columns   - array of column object

  column = {name, key, index, sort}



 Attributes:
  - has-header: true
  - has-footer: true
  - width:
  - height:
  - row-height:
*/

angular.module("Util").directive("utilTableView", [
  function() {
    return {
      restrict: "EA",
      scope: {},
      replace: true,
      templateUrl: "/template/table_view.html",
      compile: function(element, attrs) {
        var defaults, opts;
        defaults = {
          "has-header": true,
          "has-footer": true,
          "width": 500,
          "height": 500,
          "row-height": 20
        };
        opts = angular.extend(defaults, attrs);
        element.css({
          height: opts.height,
          width: opts.width
        });
        return function($scope, element, attrs) {
          var data, tableDataName;
          tableDataName = attrs.tableData;
          data = tableDataName != null ? $scope.$parent[tableDataName] : [];
          return console.log(data);
        };
      }
    };
  }
]);

angular.module("Util").directive("utilTagInput", [
  "$rootScope", function($rootScope) {
    return {
      restrict: "A",
      scope: false,
      compile: function(element, attr) {
        var noResult, options, placeholder, tag, tags, tagsList, _i, _len;
        tagsList = attr.tagsList || [];
        tags = attr.tags || [];
        placeholder = attr.placeholder || "";
        noResult = attr.noResult;
        options = {};
        element.attr("data-placeholder", placeholder);
        for (_i = 0, _len = tagsList.length; _i < _len; _i++) {
          tag = tagsList[_i];
          element.append($("<option>").attr("value", tag).text(tag));
        }
        if (noResult != null) {
          options.no_results_text = noResult;
        }
        return element.chosen(options);
      }
    };
  }
]);
