
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
      link: function(scope, element, attributes, controller) {
        return element.on("blur", function(event) {
          return scope.$apply($parse(attributes.utilModelBlur)(scope, {
            $event: event
          }));
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
    - name: display name on header
    -



 Attributes:
  - has-header: true
  - has-footer: true
  - width:
  - height:
  - row-height:
*/

angular.module("Util").directive("utilTableView", [
  "$rootScope", "$compile", function($rootScope, $compile) {
    return {
      restrict: "EA",
      scope: {},
      replace: true,
      transclude: true,
      template: """
<div class="table-container">
  <div class="table-header">
    <div class="table-row"></div>
  </div>
  <div class="table-body-wrapper">
    <div class="table-body">
      <div ng-repeat="row in displayRows" class="table-row">
        <div ng-repeat="column in columns" ng-switch="ng-switch" on="column" class="table-cell"></div>
      </div>
    </div>
    <div class="table-body-height"></div>
  </div>
  <div class="table-footer">
    <div class="table-row"></div>
  </div>
  <div ng-transclude="ng-transclude" ng-cloak="ng-cloak" class="table-transclude"></div>
</div>""",
      compile: function(element, attrs, transclude) {
        var bodyBlock, bodyHeightBlock, bodyWrapperBlock, cellOuterHeight, defaults, emptyCell, footerBlock, headerBlock, headerRow, opts, transcludedBlock;
        defaults = {
          hasHeader: true,
          hasFooter: true,
          width: 800,
          rowHeight: 20,
          numDisplayRows: 10,
          cellPadding: 8
        };
        transcludedBlock = $(".table-transclude", element);
        headerBlock = $(".table-header", element);
        headerRow = $(".table-row", headerBlock);
        bodyWrapperBlock = $(".table-body-wrapper", element);
        bodyBlock = $(".table-body", element);
        bodyHeightBlock = $(".table-body-height", element);
        footerBlock = $(".table-footer", element);
        emptyCell = $("<div>").addClass("cell");
        opts = angular.extend(defaults, attrs);
        cellOuterHeight = opts.rowHeight + opts.cellPadding * 2;
        element.css({
          height: cellOuterHeight * opts.numDisplayRows,
          width: opts.width
        });
        return function($scope, element, attrs) {
          var createCellTemplate, data, numColumns, numDisplayRows, numRows, tableColumns, tableDataName;
          tableDataName = attrs.tableData;
          data = tableDataName != null ? $scope.$parent[tableDataName] : [];
          tableColumns = attrs.tableColumns;
          $scope.columns = tableColumns != null ? $scope.$parent[tableColumns] : [];
          numColumns = $scope.columns.length;
          numRows = data.length;
          numDisplayRows = opts.numDisplayRows - opts.hasHeader;
          createCellTemplate = function(section, column) {
            var templateCell, templateSelector;
            if (section == null) {
              section = "";
            }
            if (column == null) {
              column = "";
            }
            templateSelector = ".table-" + section + "-template .cell[column=\"" + column + "\"]";
            templateCell = $(templateSelector, transcludedBlock).clone();
            if (templateCell.length === 0) {
              templateCell = emptyCell.clone();
            }
            templateCell.prop("column", column);
            templateCell.css({
              padding: opts.cellPadding,
              height: opts.rowHeight,
              width: opts.width / numColumns - opts.cellPadding * 2 - 1
            });
            return templateCell;
          };
          $scope.drawHeader = function() {
            var column, contentText, templateColumn, _i, _len, _ref, _results;
            _ref = $scope.columns;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              column = _ref[_i];
              templateColumn = createCellTemplate("header", column);
              contentText = templateColumn.text();
              if (contentText.length === 0) {
                templateColumn.text(column);
              }
              _results.push(headerRow.append(templateColumn).sortable({
                items: "> .cell",
                update: function(event, ui) {
                  var newOrder;
                  newOrder = [];
                  $(".cell", headerRow).each(function(i, e) {
                    return newOrder.push($(e).prop("column"));
                  });
                  return $scope.$apply(function() {
                    return $scope.columns = newOrder;
                  });
                }
              }));
            }
            return _results;
          };
          $scope.calculateBodyDimension = function() {
            bodyHeightBlock.css({
              height: data.length * cellOuterHeight
            });
            return bodyWrapperBlock.css({
              height: numDisplayRows * cellOuterHeight
            });
          };
          $scope.drawBody = function() {
            var column, emptyRows, emptyTemplateRow, endIndex, i, tableCell, templateCell, _i, _j, _len, _ref, _ref1, _results;
            tableCell = $(".table-cell", bodyBlock);
            emptyTemplateRow = $("<div>").addClass("table-row");
            endIndex = this.index + numDisplayRows - 1;
            $scope.displayRows = data.slice(this.index, +endIndex + 1 || 9e9);
            _ref = $scope.columns;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              column = _ref[_i];
              templateCell = createCellTemplate("body", column);
              templateCell.prop("ng-switch-when", column);
              tableCell.append(templateCell);
              emptyTemplateRow.append(createCellTemplate());
            }
            $compile(bodyBlock)($scope);
            emptyRows = numDisplayRows - $scope.displayRows.length;
            if (emptyRows > 0) {
              _results = [];
              for (i = _j = 0, _ref1 = emptyRows - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
                _results.push(bodyBlock.append(emptyTemplateRow.clone()));
              }
              return _results;
            }
          };
          bodyWrapperBlock.scroll(function() {
            var $this, scrollTop;
            $this = $(this);
            scrollTop = $this.scrollTop();
            bodyBlock.css("top", scrollTop);
            return $scope.$apply(function() {
              return $scope.index = Math.floor(scrollTop / cellOuterHeight);
            });
          });
          $scope.$watch("index", function(newValue, oldValue) {
            var endIndex;
            endIndex = newValue + numDisplayRows - 1;
            return $scope.displayRows = data.slice(newValue, +endIndex + 1 || 9e9);
          });
          $scope.reset = function() {
            $scope.displayRows = [];
            $scope.index = 0;
            $scope.drawHeader();
            $scope.calculateBodyDimension();
            return $scope.drawBody();
          };
          return $scope.reset();
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
