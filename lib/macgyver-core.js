/**
 * MacGyver v0.4.0
 * @link http://angular-macgyver.github.io/MacGyver
 * @license MIT
 */
(function(window, angular, undefined) {
var augmentWidthOrHeight, core_pnum, cssExpand, extendjQuery, getStyles, getWidthOrHeight, getWindow, isScope, isWindow, jqLiteExtend, modules, rnumnonpx;

modules = ["Mac.Util"];

try {
  angular.module("ngAnimate");
  modules.push("ngAnimate");
} catch (_error) {}

angular.module("Mac", modules);


/*
@chalk overview
@name angular.element

@description
Angular comes with jqLite, a tiny, API-compatible subset of jQuery. However, its
functionality is very limited and MacGyver extends jqLite to make sure MacGyver
components work properly.

Real jQuery will continue to take precedence over jqLite and all functions MacGyver extends.

MacGyver adds the following methods:
- [height()](http://api.jquery.com/height/) - Does not support set
- [width()](http://api.jquery.com/width/) - Does not support set
- [outerHeight()](http://api.jquery.com/outerHeight/) - Does not support set
- [outerWidth()](http://api.jquery.com/outerWidth/) - Does not support set
- [offset()](http://api.jquery.com/offset/)
- [scrollTop()](http://api.jquery.com/scrollTop/)
 */

cssExpand = ["Top", "Right", "Bottom", "Left"];

core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;

rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i");

getStyles = function(element) {
  return window.getComputedStyle(element, null);
};

isWindow = function(obj) {
  return obj && obj.document && obj.location && obj.alert && obj.setInterval;
};

isScope = function(obj) {
  return obj && (obj.$evalAsync != null) && (obj.$watch != null);
};

getWindow = function(element) {
  if (isWindow(element)) {
    return element;
  } else {
    return element.nodeType === 9 && element.defaultView;
  }
};

augmentWidthOrHeight = function(element, name, extra, isBorderBox, styles) {
  var i, start, _i;
  if (extra === (isBorderBox ? "border" : "content")) {
    return 0;
  }
  start = name === "Width" ? 1 : 0;
  for (i = _i = start; _i <= 3; i = _i += 2) {
    if (extra === "margin") {
      val += parseFloat(styles["" + extra + cssExpand[i]]);
    }
    if (isBorderBox) {
      if (extra === "content") {
        val -= parseFloat(styles["padding" + cssExpand[i]]);
      }
      if (extra !== "margin") {
        val -= parseFloat(styles["border" + cssExpand[i]]);
      }
    } else {
      val += parseFloat(styles["padding" + cssExpand[i]]);
      if (extra !== "padding") {
        val += parseFloat(styles["border" + cssExpand + "Width"]);
      }
    }
  }
  return val;
};

getWidthOrHeight = function(type, prefix, element) {
  return function(margin) {
    var defaultExtra, doc, extra, isBorderBox, name, styles, value, valueIsBorderBox;
    defaultExtra = (function() {
      switch (prefix) {
        case "inner":
          return "padding";
        case "outer":
          return "";
        default:
          return "content";
      }
    })();
    extra = defaultExtra || (margin === true ? "margin" : "border");
    if (isWindow(element)) {
      return element.document.documentElement["client" + type];
    }
    if (element.nodeType === 9) {
      doc = element.documentElement;
      return Math.max(element.body["scroll" + type], doc["scroll" + type], element.body["offset" + type], doc["offset" + type], doc["client" + type]);
    }
    valueIsBorderBox = true;
    styles = getStyles(element);
    name = type.toLowerCase();
    value = type === "Height" ? element.offsetHeight : element.offsetWidth;
    isBorderBox = element.style.boxSizing === "border-box";
    if (value <= 0 || value === null) {
      value = styles[name];
      if (value < 0 || value === null) {
        value = element.style[name];
      }
      if (rnumnonpx.test(value)) {
        return value;
      }
      valueIsBorderBox = isBorderBox;
      value = parseFloat(value) || 0;
    }
    return value + augmentWidthOrHeight(element, type, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles);
  };
};

jqLiteExtend = {
  height: function(element) {
    return getWidthOrHeight("Height", "", element)();
  },
  width: function(element) {
    return getWidthOrHeight("Width", "", element)();
  },
  outerHeight: function(element, margin) {
    return getWidthOrHeight("Height", "outer", element)(margin);
  },
  outerWidth: function(element, margin) {
    return getWidthOrHeight("Width", "outer", element)(margin);
  },
  offset: function(element) {
    var box, doc, docElem, win;
    box = {
      top: 0,
      left: 0
    };
    doc = element && element.ownerDocument;
    if (!doc) {
      return;
    }
    docElem = doc.documentElement;
    if (element.getBoundingClientRect != null) {
      box = element.getBoundingClientRect();
    }
    win = getWindow(doc);
    return {
      top: box.top + win.pageYOffset - docElem.clientTop,
      left: box.left + win.pageXOffset - docElem.clientLeft
    };
  },
  scrollTop: function(element, value) {
    var win;
    win = getWindow(element);
    if (value == null) {
      if (win) {
        return win["pageYOffset"];
      } else {
        return element["scrollTop"];
      }
    }
    if (win) {
      return win.scrollTo(window.pageYOffset, value);
    } else {
      return element["scrollTop"] = value;
    }
  },
  scrollLeft: function(element, value) {
    var win;
    win = getWindow(element);
    if (value == null) {
      if (win) {
        return win["pageXOffset"];
      } else {
        return element["scrollLeft"];
      }
    }
    if (win) {
      return win.scrollTo(window.pageXOffset, value);
    } else {
      return element["scrollLeft"] = value;
    }
  }
};

extendjQuery = function() {
  var jqLite;
  if ((window.jQuery != null) && (angular.element.prototype.offset != null)) {
    return;
  }
  jqLite = angular.element;
  return angular.forEach(jqLiteExtend, function(fn, name) {
    return jqLite.prototype[name] = function(arg1, arg2) {
      if (this.length) {
        return fn(this[0], arg1, arg2);
      }
    };
  });
};

extendjQuery();

var __hasProp = {}.hasOwnProperty;

angular.module("Mac.Util", []).factory("util", [
  "$filter", function($filter) {
    return {
      _inflectionConstants: {
        uncountables: ["sheep", "fish", "moose", "series", "species", "money", "rice", "information", "info", "equipment", "min"],
        irregulars: {
          child: "children",
          man: "men",
          woman: "women",
          person: "people",
          ox: "oxen",
          goose: "geese"
        },
        pluralizers: [[/(quiz)$/i, "$1zes"], [/([m|l])ouse$/i, "$1ice"], [/(matr|vert|ind)(ix|ex)$/i, "$1ices"], [/(x|ch|ss|sh)$/i, "$1es"], [/([^aeiouy]|qu)y$/i, "$1ies"], [/(?:([^f])fe|([lr])f)$/i, "$1$2ves"], [/sis$/i, "ses"], [/([ti])um$/i, "$1a"], [/(buffal|tomat)o$/i, "$1oes"], [/(bu)s$/i, "$1ses"], [/(alias|status)$/i, "$1es"], [/(octop|vir)us$/i, "$1i"], [/(ax|test)is$/i, "$1es"], [/x$/i, "xes"], [/s$/i, "s"], [/$/, "s"]]
      },

      /*
      @name pluralize
      @description
      Pluralize string based on the count
      
      @param {String}  string       String to pluralize (default "")
      @param {Integer} count        Object counts
      @param {Boolean} includeCount Include the number or not (default false)
      
      @returns {String} Pluralized string based on the count
       */
      pluralize: function(string, count, includeCount) {
        var irregulars, isUppercase, lowercaseWord, pluralizedString, pluralizedWord, pluralizer, pluralizers, uncountables, word, _i, _len, _ref;
        if (string == null) {
          string = "";
        }
        if (includeCount == null) {
          includeCount = false;
        }
        if (!angular.isString(string) || this.trim(string).length === 0) {
          return string;
        }
        if (includeCount && isNaN(+count)) {
          return "";
        }
        if (count == null) {
          count = 2;
        }
        _ref = this._inflectionConstants, pluralizers = _ref.pluralizers, uncountables = _ref.uncountables, irregulars = _ref.irregulars;
        word = string.split(/\s/).pop();
        isUppercase = word.toUpperCase() === word;
        lowercaseWord = word.toLowerCase();
        pluralizedWord = count === 1 || uncountables.indexOf(lowercaseWord) >= 0 ? word : null;
        if (pluralizedWord == null) {
          if (irregulars[lowercaseWord] != null) {
            pluralizedWord = irregulars[lowercaseWord];
          }
        }
        if (pluralizedWord == null) {
          for (_i = 0, _len = pluralizers.length; _i < _len; _i++) {
            pluralizer = pluralizers[_i];
            if (!(pluralizer[0].test(lowercaseWord))) {
              continue;
            }
            pluralizedWord = word.replace(pluralizer[0], pluralizer[1]);
            break;
          }
        }
        pluralizedWord || (pluralizedWord = word);
        if (isUppercase) {
          pluralizedWord = pluralizedWord.toUpperCase();
        }
        pluralizedString = string.slice(0, -word.length) + pluralizedWord;
        if (includeCount) {
          return "" + ($filter("number")(count)) + " " + pluralizedString;
        } else {
          return pluralizedString;
        }
      },
      trim: function(string) {
        var str;
        str = String(string) || "";
        if (String.prototype.trim != null) {
          return str.trim();
        } else {
          return str.replace(/^\s+|\s+$/gm, "");
        }
      },
      capitalize: function(string) {
        var str;
        str = String(string) || "";
        return str.charAt(0).toUpperCase() + str.substring(1);
      },
      uncapitalize: function(string) {
        var str;
        str = String(string) || "";
        return str.charAt(0).toLowerCase() + str.substring(1);
      },
      toCamelCase: function(string) {
        if (string == null) {
          string = "";
        }
        return this.trim(string).replace(/[-_\s]+(.)?/g, function(match, c) {
          return c.toUpperCase();
        });
      },
      toSnakeCase: function(string) {
        if (string == null) {
          string = "";
        }
        return this.trim(string).replace(/([a-z\d])([A-Z]+)/g, "$1_$2").replace(/[-\s]+/g, "_").toLowerCase();
      },
      convertKeysToCamelCase: function(object) {
        var key, result, value;
        result = {};
        for (key in object) {
          if (!__hasProp.call(object, key)) continue;
          value = object[key];
          key = this.toCamelCase(key);
          if (typeof value === "object" && (value != null ? value.constructor : void 0) !== Array) {
            value = this.convertKeysToCamelCase(value);
          }
          result[key] = value;
        }
        return result;
      },
      convertKeysToSnakeCase: function(object) {
        var key, result, value;
        result = {};
        for (key in object) {
          if (!__hasProp.call(object, key)) continue;
          value = object[key];
          key = this.toSnakeCase(key);
          if (typeof value === "object" && (value != null ? value.constructor : void 0) !== Array) {
            value = this.convertKeysToSnakeCase(value);
          }
          result[key] = value;
        }
        return result;
      },
      pyth: function(a, b) {
        return Math.sqrt(a * a + b * b);
      },
      degrees: function(radian) {
        return (radian * 180) / Math.PI;
      },
      radian: function(degrees) {
        return (degrees * Math.PI) / 180;
      },
      hex2rgb: function(hex) {
        var color, rgb, value;
        if (hex.indexOf('#') === 0) {
          hex = hex.substring(1);
        }
        hex = hex.toLowerCase();
        rgb = {};
        if (hex.length === 3) {
          rgb.r = hex.charAt(0) + hex.charAt(0);
          rgb.g = hex.charAt(1) + hex.charAt(1);
          rgb.b = hex.charAt(2) + hex.charAt(2);
        } else {
          rgb.r = hex.substring(0, 2);
          rgb.g = hex.substring(2, 4);
          rgb.b = hex.substring(4);
        }
        for (color in rgb) {
          value = rgb[color];
          rgb[color] = parseInt(value, 16);
        }
        return rgb;
      },
      timeRegex: /^(0?[1-9]|1[0-2]):([0-5][0-9])[\s]([AP]M)$/,
      _urlRegex: /(?:(http[s]?):\/\/)?(?:(www|[\d\w\-]+)\.)?([\d\w\-]+)\.([A-Za-z]{2,6})(:[\d]*)?([:\/?#\[\]@!$&'()*+,;=\w\d-._~%\\]*)?/i,
      _emailRegex: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      validateUrl: function(url) {
        var match;
        match = this._urlRegex.exec(url);
        if (match != null) {
          match = {
            url: match[0],
            protocol: match[1] || "http",
            subdomain: match[2],
            name: match[3],
            domain: match[4],
            port: match[5],
            path: match[6] || "/"
          };
          match["url"] = match.url;
        }
        return match;
      },
      validateEmail: function(email) {
        return this._emailRegex.test(email);
      },
      getQueryString: function(url, name) {
        var regex, regexS, results;
        if (name == null) {
          name = "";
        }
        name = name.replace(/[[]/, "\[").replace(/[]]/, "\]");
        regexS = "[\?&]" + name + "=([^&#]*)";
        regex = new RegExp(regexS);
        results = regex.exec(url);
        if (results != null) {
          return results[1];
        } else {
          return "";
        }
      },
      parseUrlPath: function(fullPath) {
        var path, pathComponents, queries, queryString, queryStrings, urlComponents, values, verb, _i, _len, _ref;
        urlComponents = fullPath.split("?");
        pathComponents = urlComponents[0].split("/");
        path = pathComponents.slice(0, pathComponents.length - 1).join("/");
        verb = pathComponents[pathComponents.length - 1];
        queries = {};
        if (urlComponents.length > 1) {
          queryStrings = urlComponents[urlComponents.length - 1];
          _ref = queryStrings.split("&");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            queryString = _ref[_i];
            values = queryString.split("=");
            queries[values[0]] = values[1] != null ? values[1] : "";
          }
        }
        return {
          fullPath: fullPath,
          path: path,
          pathComponents: pathComponents,
          verb: verb,
          queries: queries
        };
      },
      extendAttributes: function(prefix, defaults, attributes) {
        var altKey, key, macKey, output, value, _ref, _ref1;
        if (prefix == null) {
          prefix = "";
        }
        output = {};
        for (key in defaults) {
          if (!__hasProp.call(defaults, key)) continue;
          value = defaults[key];
          altKey = prefix ? this.capitalize(key) : key;
          macKey = "" + prefix + altKey;
          output[key] = attributes[macKey] != null ? attributes[macKey] || true : value;
          if ((_ref = output[key]) === "true" || _ref === "false") {
            output[key] = output[key] === "true";
          } else if (((_ref1 = output[key]) != null ? _ref1.length : void 0) > 0 && !isNaN(+output[key])) {
            output[key] = +output[key];
          }
        }
        return output;
      }
    };
  }
]);

angular.module("Mac").factory("keys", function() {
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
    SEMICOLON: 59,
    EQUALS: 61,
    COMMAND: 91,
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


/*
@chalk overview
@name Keydown events

@description
A directive for handling certain keys on keydown event
Currently MacGyver supports enter, escape, space, left, up, right and down

@param {Expression} mac-keydown-enter  Expression to evaluate on hitting enter
@param {Expression} mac-keydown-escape Expression to evaluate on hitting escape
@param {Expression} mac-keydown-space  Expression to evaluate on hitting space
@param {Expression} mac-keydown-left   Expression to evaluate on hitting left
@param {Expression} mac-keydown-up     Expression to evaluate on hitting up
@param {Expression} mac-keydown-right  Expression to evaluate on hitting right
@param {Expression} mac-keydown-down   Expression to evaluate on hitting down
 */
var key, _fn, _i, _len, _ref;

_ref = ["Enter", "Escape", "Space", "Left", "Up", "Right", "Down"];
_fn = function(key) {
  return angular.module("Mac").directive("macKeydown" + key, [
    "$parse", "keys", function($parse, keys) {
      return {
        restrict: "A",
        link: function(scope, element, attributes) {
          var expression;
          expression = $parse(attributes["macKeydown" + key]);
          return element.bind("keydown", function($event) {
            if ($event.which === keys["" + (key.toUpperCase())]) {
              $event.preventDefault();
              return scope.$apply(function() {
                return expression(scope, {
                  $event: $event
                });
              });
            }
          });
        }
      };
    }
  ]);
};
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  key = _ref[_i];
  _fn(key);
}


/*
@chalk overview
@name Pause Typing

@description
macPauseTyping directive allow user to specify custom behavior after user stops typing for more than (delay) milliseconds

@param {Expression} mac-pause-typing       Expression to evaluate after delay
@param {Expression} mac-pause-typing-delay Delay value to evaluate expression (default 800)
 */
angular.module("Mac").directive("macPauseTyping", [
  "$parse", "$timeout", function($parse, $timeout) {
    return {
      restrict: "A",
      link: function(scope, element, attributes) {
        var delay, expression, keyupTimer;
        expression = $parse(attributes["macPauseTyping"]);
        delay = scope.$eval(attributes["macPauseTypingDelay"]) || 800;
        keyupTimer = null;
        return element.bind("keyup", function($event) {
          if (keyupTimer != null) {
            $timeout.cancel(keyupTimer);
          }
          return keyupTimer = $timeout(function() {
            return expression(scope, {
              $event: $event
            });
          }, delay);
        });
      }
    };
  }
]);


/*
@chalk overview
@name Windows Resize

@description
Binding custom behavior on window resize event

@param {Expression} mac-window-resize Expression to evaluate on window resize
 */
angular.module("Mac").directive("macWindowResize", [
  "$parse", "$window", function($parse, $window) {
    return {
      restrict: "A",
      link: function($scope, element, attrs) {
        var handler;
        handler = function($event) {
          var callbackFn;
          callbackFn = $parse(attrs.macWindowResize);
          $scope.$apply(function() {
            return callbackFn($scope, {
              $event: $event
            });
          });
          return true;
        };
        angular.element($window).bind("resize", handler);
        return $scope.$on("destroy", function() {
          return angular.element($window).unbind("resize", handler);
        });
      }
    };
  }
]);


/*
@chalk overview
@name Autocomplete

@description
A directive for providing suggestions while typing into the field

Autocomplete allows for custom html templating in the dropdown and some properties are exposed on the local scope on each template instance, including:

| Variable  | Type    | Details                                                                     |
|-----------|---------|-----------------------------------------------------------------------------|
| `$index`  | Number  | iterator offset of the repeated element (0..length-1)                       |
| `$first`  | Boolean | true if the repeated element is first in the iterator.                      |
| `$middle` | Boolean | true if the repeated element is between the first and last in the iterator. |
| `$last`   | Boolean | true if the repeated element is last in the iterator.                       |
| `$even`   | Boolean | true if the iterator position `$index` is even (otherwise false).           |
| `$odd`    | Boolean | true if the iterator position `$index` is odd (otherwise false).            |
| `item`    | Object  | item object with `value` and `label` if label-key is set                    |

To use custom templating

```
<mac-autocomplete mac-autocomplete-url="someUrl" ng-model="model">
  <span> {{item.label}} </span>
</mac-autocomplete>
```

Template default to `{{item.label}}` if not defined

@dependencies
- mac-menu

@param {String} ng-model Assignable angular expression to data-bind to (required)
@param {String} mac-placeholder Placeholder text
@param {String} mac-autocomplete-url Url to fetch autocomplete dropdown list data. URL may include GET params e.g. "/users?nocache=1"
@param {Expression} mac-autocomplete-source Data to use.
Source support multiple types:
- Array: An array can be used for local data and there are two supported formats:
  - An array of strings: ["Item1", "Item2"]
  - An array of objects with mac-autocomplete-label key: [{name:"Item1"}, {name:"Item2"}]
- String: Using a string as the source is the same as passing the variable into mac-autocomplete-url
- Function: A callback when querying for data. The callback receive two arguments:
  - {String} Value currently in the text input
  - {Function} A response callback which expects a single argument, data to user. The data will be
  populated on the menu and the menu will adjust accordingly
@param {Boolean} mac-autocomplete-disabled Boolean value if autocomplete should be disabled
@param {Function} mac-autocomplete-on-select Function called when user select on an item
- `selected` - {Object} The item selected
@param {Function} mac-autocomplete-on-success function called on success ajax request
- `data` - {Object} Data returned from the request
- `status` - {Number} The status code of the response
- `header` - {Object} Header of the response
@param {Function} mac-autocomplete-on-error Function called on ajax request error
- `data` - {Object} Data returned from the request
- `status` - {Number} The status code of the response
- `header` - {Object} Header of the response
@param {String}  mac-autocomplete-label The label to display to the users (default "name")
@param {String}  mac-autocomplete-query The query parameter on GET command (default "q")
@param {Integer} mac-autocomplete-delay Delay on fetching autocomplete data after keyup (default 800)

@param {Expr} mac-menu-class Classes for mac-menu used by mac-autocomplete. For more info, check [ngClass](http://docs.angularjs.org/api/ng/directive/ngClass)
 */
angular.module("Mac").directive("macAutocomplete", [
  "$animate", "$compile", "$filter", "$http", "$parse", "$rootScope", "$timeout", "keys", function($animate, $compile, $filter, $http, $parse, $rootScope, $timeout, keys) {
    return {
      restrict: "EA",
      template: "<input type=\"text\"/>",
      transclude: true,
      replace: true,
      require: "ngModel",
      link: function($scope, element, attrs, ctrl, transclude) {
        var $menuScope, appendMenu, autocompleteUrl, blurHandler, currentAutocomplete, delay, disabled, getData, inside, isMenuAppended, labelGetter, labelKey, menuEl, onError, onSelect, onSuccess, positionMenu, preventParser, queryData, queryKey, reset, source, timeoutId, updateItem;
        labelKey = attrs.macAutocompleteLabel || "name";
        labelGetter = $parse(labelKey);
        queryKey = attrs.macAutocompleteQuery || "q";
        delay = +(attrs.macAutocompleteDelay || 800);
        inside = attrs.macAutocompleteInside != null;
        autocompleteUrl = $parse(attrs.macAutocompleteUrl);
        onSelect = $parse(attrs.macAutocompleteOnSelect);
        onSuccess = $parse(attrs.macAutocompleteOnSuccess);
        onError = $parse(attrs.macAutocompleteOnError);
        source = $parse(attrs.macAutocompleteSource);
        disabled = $parse(attrs.macAutocompleteDisabled);
        currentAutocomplete = [];
        timeoutId = null;
        isMenuAppended = false;
        preventParser = false;
        $menuScope = $scope.$new();
        $menuScope.items = [];
        $menuScope.index = 0;
        $menuScope.select = function(index) {
          var label, selected;
          selected = currentAutocomplete[index];
          onSelect($scope, {
            selected: selected
          });
          label = $menuScope.items[index].label || "";
          preventParser = true;
          if (attrs.ngModel != null) {
            ctrl.$setViewValue(label);
            ctrl.$render();
          }
          return reset();
        };
        menuEl = angular.element(document.createElement("mac-menu"));
        menuEl.attr({
          "ng-class": attrs.macMenuClass || null,
          "mac-menu-items": "items",
          "mac-menu-select": "select(index)",
          "mac-menu-index": "index"
        });
        transclude($menuScope, function(clone) {
          return menuEl.append(clone);
        });
        $compile(menuEl)($menuScope);
        ctrl.$parsers.push(function(value) {
          if (value && !disabled($scope) && !preventParser) {
            if (timeoutId != null) {
              $timeout.cancel(timeoutId);
            }
            if (delay > 0) {
              timeoutId = $timeout(function() {
                return queryData(value);
              }, delay);
            } else {
              queryData(value);
            }
          } else {
            reset();
          }
          preventParser = false;
          return value;
        });

        /*
        @name blurHandler
        @description
        Create a blur handler function to make sure directive is unbinding
        the correct handler
         */
        blurHandler = function() {
          return $scope.$apply(function() {
            return reset();
          });
        };

        /*
        @function
        @name appendMenu
        @description
        Adding menu to DOM
        @param {Function} callback Callback after enter animation completes
         */
        appendMenu = function(callback) {
          if (!isMenuAppended) {
            element.bind("blur", blurHandler);
            menuEl.on('mousedown', function(event) {
              return event.preventDefault();
            });
          }
          isMenuAppended = true;
          if (inside) {
            return $animate.enter(menuEl, void 0, element, callback);
          } else {
            return $animate.enter(menuEl, angular.element(document.body), void 0, callback);
          }
        };

        /*
        @function
        @name reset
        @description
        Resetting autocomplete
         */
        reset = function() {
          $animate.leave(menuEl, function() {
            $menuScope.index = 0;
            $menuScope.items.length = 0;
            menuEl[0].style.top = "";
            menuEl[0].style.left = "";
            isMenuAppended = false;
            return element.unbind("blur", blurHandler);
          });
        };

        /*
        @function
        @name positionMenu
        @description
        Calculate the style include position and width for menu
         */
        positionMenu = function() {
          var offset, parentElement, parentStyles;
          parentElement = inside ? element[0] : document.body;
          parentStyles = window.getComputedStyle(parentElement);
          offset = element.offset();
          offset.left -= parseInt(parentStyles.marginLeft);
          offset.top += element.outerHeight() - parseInt(parentStyles.marginTop);
          offset.minWidth = element.outerWidth();
          return angular.forEach(offset, function(value, key) {
            if (!isNaN(+value) && angular.isNumber(+value)) {
              value = "" + value + "px";
            }
            return menuEl[0].style[key] = value;
          });
        };

        /*
        @function
        @name updateItem
        @description
        Update list of items getting passed to menu
        @param {Array} data Array of data
         */
        updateItem = function(data) {
          if ((data != null ? data.length : void 0) > 0) {
            currentAutocomplete = data;
            $menuScope.items = data.map(function(item) {
              if (angular.isObject(item)) {
                if (item.value == null) {
                  item.value = labelGetter(item) || "";
                }
                if (item.label == null) {
                  item.label = labelGetter(item) || "";
                }
                return item;
              } else {
                return {
                  label: item,
                  value: item
                };
              }
            });
            return appendMenu(positionMenu);
          } else {
            return reset();
          }
        };

        /*
        @function
        @name getData
        @description
        GET request to fetch data from server, update menu items and position
        menu
        @param {String} url URL to fetch data from
         */
        getData = function(url, query) {
          var options;
          options = {
            method: "GET",
            url: url,
            params: {}
          };
          options.params[queryKey] = query;
          return $http(options).success(function(data, status, headers, config) {
            var dataList;
            dataList = onSuccess($scope, {
              data: data,
              status: status,
              headers: headers
            });
            if (dataList == null) {
              dataList = data.data;
            }
            return updateItem(dataList);
          }).error(function(data, status, headers, config) {
            return onError($scope, {
              data: data,
              status: status,
              headers: headers
            });
          });
        };

        /*
        @function
        @name queryData
        @description
        Used for querying data
        @param {String} query Search query
         */
        queryData = function(query) {
          var sourceData, url;
          url = autocompleteUrl($scope);
          if (url) {
            return getData(url, query);
          } else {
            sourceData = source($scope);
            if (angular.isArray(sourceData)) {
              return updateItem($filter("filter")(sourceData, query));
            } else if (angular.isString(sourceData)) {
              return getData(sourceData, query);
            } else if (angular.isFunction(sourceData)) {
              return sourceData(query, updateItem);
            }
          }
        };
        element.bind("keydown", function(event) {
          if ($menuScope.items.length === 0) {
            return true;
          }
          switch (event.which) {
            case keys.DOWN:
              $scope.$apply(function() {
                $menuScope.index = ($menuScope.index + 1) % $menuScope.items.length;
                return event.preventDefault();
              });
              break;
            case keys.UP:
              $scope.$apply(function() {
                $menuScope.index = ($menuScope.index ? $menuScope.index : $menuScope.items.length) - 1;
                return event.preventDefault();
              });
              break;
            case keys.ENTER:
              $scope.$apply(function() {
                $menuScope.select($menuScope.index);
                return event.preventDefault();
              });
              break;
            case keys.ESCAPE:
              $scope.$apply(function() {
                reset();
                return event.preventDefault();
              });
          }
          return true;
        });
        $scope.$on("$destroy", function() {
          $menuScope.$destroy();
          return reset();
        });

        /*
        @event
        @name reset-mac-autocomplete
        @description
        Event to reset autocomplete
         */
        return $scope.$on("reset-mac-autocomplete", function() {
          return reset();
        });
      }
    };
  }
]);


/*
@chalk overview
@name mac-focus-on-event

@description
Scroll window to the element and focus on the element

@param {String}  mac-focus-on-event Event to focus on element
@param {Boolean} mac-focus-on-event-scroll Scroll to element location or not
 */
angular.module("Mac").directive("macFocusOnEvent", [
  "$timeout", function($timeout) {
    return function(scope, element, attributes) {
      return scope.$on(attributes.macFocusOnEvent, function() {
        return $timeout(function() {
          var x, y;
          element.focus();
          if (attributes.macFocusOnEventScroll) {
            x = window.scrollX;
            y = window.scrollY;
            return window.scrollTo(x, y);
          }
        }, 0, false);
      });
    };
  }
]);


/*
@chalk overview
@name Menu

@description
A directive for creating a menu with multiple items

Menu allows for custom html templating for each item.

Since macMenu is using ngRepeat, some ngRepeat properties along with `item` are exposed on the local scope of each template instance, including:

| Variable  | Type    | Details                                                                     |
|-----------|---------|-----------------------------------------------------------------------------|
| `$index`  | Number  | iterator offset of the repeated element (0..length-1)                       |
| `$first`  | Boolean | true if the repeated element is first in the iterator.                      |
| `$middle` | Boolean | true if the repeated element is between the first and last in the iterator. |
| `$last`   | Boolean | true if the repeated element is last in the iterator.                       |
| `$even`   | Boolean | true if the iterator position `$index` is even (otherwise false).           |
| `$odd`    | Boolean | true if the iterator position `$index` is odd (otherwise false).            |
| `item`    | Object  | item object                                                                 |

To use custom templating
```
<mac-menu>
  <span> {{item.label}} </span>
</mac-menu>
```

Template default to `{{item.label}}` if not defined

@param {Expression} mac-menu-items List of items to display in the menu
        Each item should have a `label` key as display text
@param {Function} mac-menu-select Callback on select
- `index` - {Integer} Item index
@param {Object} mac-menu-style Styles apply to the menu
@param {Expression} mac-menu-index Index of selected item
 */
angular.module("Mac").directive("macMenu", [
  function() {
    return {
      restrict: "EA",
      replace: true,
      template: "<div ng-style=\"style\" class=\"mac-menu\"><ul><li mac-menu-transclude=\"mac-menu-transclude\" ng-repeat=\"item in items\" ng-click=\"selectItem($index)\" ng-class=\"{'active': $index == index}\" ng-mouseenter=\"setIndex($index)\" class=\"mac-menu-item\"></li></ul></div>",
      transclude: true,
      controller: angular.noop,
      scope: {
        items: "=macMenuItems",
        style: "=macMenuStyle",
        select: "&macMenuSelect",
        pIndex: "=macMenuIndex"
      },
      link: function($scope, element, attrs, ctrls) {
        $scope.selectItem = function(index) {
          return $scope.select({
            index: index
          });
        };
        $scope.setIndex = function(index) {
          $scope.index = index;
          if (attrs.macMenuIndex != null) {
            return $scope.pIndex = parseInt(index);
          }
        };
        if (attrs.macMenuIndex != null) {
          $scope.$watch("pIndex", function(value) {
            return $scope.index = parseInt(value);
          });
        }
        return $scope.$watch("items.length", function(value) {
          if (!!value) {
            return attrs.$addClass("visible");
          } else {
            return attrs.$removeClass("visible");
          }
        });
      }
    };
  }
]).directive("macMenuTransclude", [
  "$compile", function($compile) {
    return {
      link: function($scope, element, attrs, ctrls, transclude) {
        return transclude($scope, function(clone) {
          element.empty();
          if (clone.length === 0) {
            clone = $compile("<span>{{item.label}}</span>")($scope);
          }
          return element.append(clone);
        });
      }
    };
  }
]);


/*
@chalk overview
@name Modal Service

@description
There are multiple components used by modal.
- A modal service is used to keep state of modal opened in the applications.
- A modal element directive to define the modal dialog box
- A modal attribute directive as a modal trigger

@param {Function} show Show a modal based on the modal id
- {String} id The id of the modal to open
- {Object} triggerOptions Additional options to open modal

@param {Function} resize Update the position and also the size of the modal
- {Modal Object} modalObject The modal to reposition and resize (default opened modal)

@param {Function} hide Hide currently opened modal
- {Function} callback Callback after modal has been hidden

@param {Function} bindingEvents Binding escape key or resize event
- {String} action Either to bind or unbind events (default "bind")

@param {Function} register Registering modal with the service
- {String} id ID of the modal
- {DOM element} element The modal element
- {Object} options Additional options for the modal

@param {Function} unregister Remove modal from modal service
- {String} id ID of the modal to unregister

@param {Function} clearWaiting Remove certain modal id from waiting list
- {String} id ID of the modal
 */
angular.module("Mac").service("modal", [
  "$rootScope", "$animate", "$templateCache", "$compile", "$http", "$controller", "modalViews", "keys", function($rootScope, $animate, $templateCache, $compile, $http, $controller, modalViews, keys) {
    return {
      registered: modalViews.registered,
      waiting: null,
      opened: null,
      modalTemplate: "<div class=\"mac-modal-overlay hide\">\n  <div class=\"mac-modal\">\n    <a mac-modal-close class=\"mac-close-modal\"></a>\n    <div class=\"mac-modal-content-wrapper\"></div>\n  </div>\n</div>",
      show: function(id, triggerOptions) {
        var modalObject, options, path, renderModal, showModal, showOptions, template;
        if (triggerOptions == null) {
          triggerOptions = {};
        }
        if ((this.registered[id] != null) && (this.opened != null)) {
          return this.hide();
        } else if (this.registered[id] != null) {
          modalObject = this.registered[id];
          options = modalObject.options;
          showOptions = {};
          angular.extend(showOptions, options, triggerOptions);
          showModal = (function(_this) {
            return function(element) {
              showOptions.beforeShow(element.scope());
              return $animate.removeClass(element, "hide", function() {
                return $animate.addClass(element, "visible", function() {
                  _this.opened = {
                    id: id,
                    element: element,
                    options: showOptions
                  };
                  _this.resize(_this.opened);
                  _this.bindingEvents();
                  showOptions.open(element.scope());
                  showOptions.afterShow(element.scope());
                  $rootScope.$broadcast("modalWasShown", id);
                  return _this.clearWaiting();
                });
              });
            };
          })(this);
          if (showOptions.moduleMethod != null) {
            renderModal = (function(_this) {
              return function(template) {
                var element, viewScope, wrapper;
                if (isScope(showOptions.scope)) {
                  viewScope = showOptions.scope;
                } else {
                  viewScope = $rootScope.$new(true);
                  if (angular.isObject(showOptions.scope)) {
                    angular.extend(viewScope, showOptions.scope);
                  }
                }
                angular.extend(showOptions.attributes, {
                  id: id
                });
                element = angular.element(_this.modalTemplate).attr(showOptions.attributes);
                wrapper = angular.element(element[0].getElementsByClassName("mac-modal-content-wrapper"));
                wrapper.html(template);
                if (showOptions.overlayClose) {
                  element.bind("click", function($event) {
                    if (angular.element($event.target).hasClass("mac-modal-overlay")) {
                      return viewScope.$apply(function() {
                        return _this.hide();
                      });
                    }
                  });
                }
                if (showOptions.controller) {
                  $controller(showOptions.controller, {
                    $scope: viewScope,
                    $element: element,
                    macModalOptions: showOptions
                  });
                }
                $animate.enter(element, angular.element(document.body));
                $compile(element)(viewScope);
                return showModal(element);
              };
            })(this);
            if ((path = showOptions.templateUrl)) {
              template = $templateCache.get(path);
              if (template) {
                return renderModal(template);
              } else {
                return $http.get(path).then(function(resp) {
                  $templateCache.put(path, resp.data);
                  return renderModal(resp.data);
                }, function() {
                  throw Error("Failed to load template: " + path);
                });
              }
            } else if ((template = showOptions.template)) {
              return renderModal(template);
            }
          } else if (modalObject.element != null) {
            return showModal(modalObject.element);
          }
        } else {
          return this.waiting = {
            id: id,
            options: triggerOptions
          };
        }
      },
      resize: function(modalObject) {
        var css, element, height, modal, options, width;
        if (modalObject == null) {
          modalObject = this.opened;
        }
        if (modalObject == null) {
          return;
        }
        element = modalObject.element;
        options = modalObject.options;
        if (!options.position) {
          return;
        }
        modal = angular.element(element[0].getElementsByClassName("mac-modal")).attr("style", "");
        height = modal.outerHeight();
        width = modal.outerWidth();
        css = angular.element(window).height() > height ? {
          marginTop: -height / 2
        } : {
          top: options.topOffset
        };
        css.marginLeft = -width / 2;
        return angular.forEach(css, function(value, key) {
          if (!isNaN(+value) && angular.isNumber(+value)) {
            value = "" + value + "px";
          }
          return modal.css(key, value);
        });
      },
      hide: function(callback) {
        var element, id, options, _ref;
        if (this.opened == null) {
          return;
        }
        _ref = this.opened, id = _ref.id, options = _ref.options, element = _ref.element;
        options.beforeHide(element.scope());
        return $animate.removeClass(element, "visible", (function(_this) {
          return function() {
            _this.bindingEvents("unbind");
            _this.opened = null;
            if (options.moduleMethod) {
              if (!isScope(options.scope)) {
                element.scope().$destroy();
              }
              $animate.leave(element);
            } else {
              $animate.addClass(element, "hide");
            }
            options.afterHide(element.scope());
            $rootScope.$broadcast("modalWasHidden", id);
            return callback && callback();
          };
        })(this));
      },
      bindingEvents: function(action) {
        var escapeKeyHandler, options, resizeHandler;
        if (action == null) {
          action = "bind";
        }
        if (!((action === "bind" || action === "unbind") && (this.opened != null))) {
          return;
        }
        escapeKeyHandler = (function(_this) {
          return function(event) {
            if (event.which === keys.ESCAPE) {
              return _this.hide();
            }
          };
        })(this);
        resizeHandler = (function(_this) {
          return function(event) {
            return _this.resize();
          };
        })(this);
        options = this.opened.options;
        if (options.keyboard) {
          angular.element(document)[action]("keydown", escapeKeyHandler);
        }
        if (options.resize) {
          return angular.element(window)[action]("resize", resizeHandler);
        }
      },
      register: function(id, element, options) {
        var modalOpts;
        if (this.registered[id] != null) {
          throw new Error("Modal " + id + " already registered");
        }
        modalOpts = {};
        angular.extend(modalOpts, modalViews.defaults, options);
        this.registered[id] = {
          id: id,
          element: element,
          options: modalOpts
        };
        if ((this.waiting != null) && this.waiting.id === id) {
          return this.show(id, this.waiting.options);
        }
      },
      unregister: function(id) {
        var _ref;
        if (this.registered[id] == null) {
          throw new Error("Modal " + id + " is not registered");
        }
        if (((_ref = this.opened) != null ? _ref.id : void 0) === id) {
          this.hide();
        }
        this.clearWaiting(id);
        return delete this.registered[id];
      },
      clearWaiting: function(id) {
        var _ref;
        if ((id != null) && ((_ref = this.waiting) != null ? _ref.id : void 0) !== id) {
          return;
        }
        return this.waiting = null;
      }
    };
  }
]).provider("modalViews", function() {
  this.registered = {};
  this.defaults = {
    keyboard: false,
    overlayClose: false,
    resize: true,
    position: true,
    open: angular.noop,
    topOffset: 20,
    attributes: {},
    beforeShow: angular.noop,
    afterShow: angular.noop,
    beforeHide: angular.noop,
    afterHide: angular.noop
  };
  this.$get = function() {
    return this;
  };
  return this;
}).config([
  "modalViewsProvider", function(modalViews) {
    return angular.module("Mac").modal = function(id, modalOptions) {
      var options;
      if (modalViews.registered[id] == null) {
        options = {};
        angular.extend(options, modalViews.defaults, modalOptions, {
          moduleMethod: true
        });
        return modalViews.registered[id] = {
          id: id,
          options: options
        };
      }
    };
  }
]);


/*
@chalk overview
@name Popover Service

@description
A popover service to keep state of opened popover. Allowing user to hide certain
or all popovers

@param {Array} popoverList The popover that's currently being shown

@param {Array} registered Object storing all the registered popover DOM elements

@param {Function} last Get data of the last popover
- Returns {Object} The last opened popover

@param {Function} register Register a popover with an id and an element
- {String} id Popover id
- {DOM Element} element Popover element
- Returns {Bool} If the id already existed

@param {Function} unregister Remove id and element from registered list of popover
- {String} id Popover id
- Returns {Bool} If the id exist

@param {Function} add Add a new popover to opened list
- {String} id Popover id
- {DOM Element} popover Popover DOM element
- {DOM Element} element Trigger DOM element
- {Object} options Additional options
- Returns {Object} The new popover object

@param {Function} pop Get and remove the last popover from list
- Returns {Object} Last element from popoverList

@param {Function} show Show and position a registered popover
- {String} id Popover id
- {DOM Element} element Element that trigger the popover
- {Object} options Additional options for popover

@param {Function} getById Get opened popover object by id
- {String} id Popover id
- Returns {Object} Opened popover object

@param {Function} resize Update size and position of an opened popover
- {Object|String} popoverObj Support multiple type input:
  - Object: One of the popover objects in popoverList
  - String: Popover ID

@param {Function} hide Hide a certain popover. If no selector is provided, the
last opened popover is hidden
- {DOM Element|String} selector Support multiple type input:
  - DOM Element: Popover trigger element
  - String: Popover ID
- {Function} callback Callback after popover is hidden

@param {Function} hideAll Hide all popovers
 */
angular.module("Mac").provider("popoverViews", function() {
  this.registered = {};
  this.defaults = {
    fixed: false,
    childPopover: false,
    offsetY: 0,
    offsetX: 0,
    trigger: "click"
  };
  this.popoverDefaults = {
    footer: false,
    header: false,
    title: "",
    direction: "above left"
  };

  /*
  @name template
  @description
  Popover template
   */
  this.template = "<div class=\"mac-popover\" ng-class=\"macPopoverClasses\">\n  <div class=\"tip\"></div>\n  <div class=\"popover-header\">\n    <div class=\"title\">{{macPopoverTitle}}</div>\n  </div>\n  <div mac-popover-fill-content></div>\n</div>";
  this.$get = function() {
    return this;
  };
  return this;
}).service("popover", [
  "$animate", "$compile", "$controller", "$http", "$rootScope", "$templateCache", "$timeout", "popoverViews", function($animate, $compile, $controller, $http, $rootScope, $templateCache, $timeout, popoverViews) {
    var service;
    service = {
      popoverList: [],
      registered: popoverViews.registered,
      last: function() {
        return this.popoverList[this.popoverList.length - 1];
      },
      register: function(id, options) {
        var exist;
        if (!(exist = this.registered[id] != null)) {
          this.registered[id] = options;
        }
        return !exist;
      },
      unregister: function(id) {
        var exist;
        if (exist = this.registered[id] != null) {
          delete this.registered[id];
        }
        return exist;
      },
      add: function(id, popover, element, options) {
        var newObject;
        newObject = {
          id: id,
          popover: popover,
          element: element,
          options: options
        };
        this.popoverList.push(newObject);
        return newObject;
      },
      pop: function() {
        return this.popoverList.pop();
      },
      show: function(id, element, options) {
        var addPopover, popoverOptions;
        if (options == null) {
          options = {};
        }
        popoverOptions = this.registered[id];
        if (!popoverOptions) {
          return false;
        }
        addPopover = function() {
          var path, showPopover, template;
          showPopover = function(template) {
            var popover, popoverObj, viewScope;
            if (isScope(options.scope)) {
              viewScope = options.scope.$new();
            } else {
              viewScope = $rootScope.$new(true);
              if (angular.isObject(options.scope)) {
                angular.extend(viewScope, options.scope);
              }
            }
            if (popoverOptions.refreshOn) {
              viewScope.$on(popoverOptions.refreshOn, function() {
                return service.resize(id);
              });
            }
            if (popoverOptions.controller) {
              $controller(popoverOptions.controller, {
                $scope: viewScope
              });
            }
            angular.extend(viewScope, {
              macPopoverClasses: {
                footer: popoverOptions.footer || false,
                header: popoverOptions.header || !!popoverOptions.title || false,
                fixed: popoverOptions.fixed || false
              },
              macPopoverTitle: popoverOptions.title || "",
              macPopoverTemplate: template
            });
            popover = $compile(popoverViews.template)(viewScope);
            popover.attr({
              id: id,
              direction: popoverOptions.direction || "below left"
            });
            popoverObj = service.add(id, popover, element, options);
            $animate.addClass(element, "active");
            $rootScope.$broadcast("popoverWasShown", id);
            return $animate.enter(popover, angular.element(document.body), null, function() {
              return service.resize(popoverObj);
            });
          };
          if ((template = popoverOptions.template)) {
            return showPopover(template);
          } else if ((path = popoverOptions.templateUrl)) {
            template = $templateCache.get(path);
            if (template) {
              return showPopover(template);
            } else {
              return $http.get(path).then(function(resp) {
                $templateCache.put(path, resp.data);
                return showPopover(resp.data);
              }, function() {
                throw new Error('Failed to load template: #{path}');
              });
            }
          }
        };
        if (service.popoverList.length && !!!options.childPopover) {
          service.hide(addPopover);
        } else {
          addPopover();
        }
        return true;
      },
      getById: function(id, element) {
        var item, sameTrigger, _i, _len, _ref;
        _ref = this.popoverList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          sameTrigger = (element == null) || item.element === element;
          if (item.id === id && sameTrigger) {
            return item;
          }
        }
      },
      resize: function(popoverObj) {
        var $window, action, current, currentPopover, diff, left, leftScroll, offset, options, position, relative, relativeElement, setOverflowPosition, top, topScroll, updateOffset;
        if (angular.isString(popoverObj)) {
          popoverObj = service.getById(popoverObj);
        }
        if (popoverObj == null) {
          return;
        }
        currentPopover = popoverObj.popover;
        relativeElement = popoverObj.element;
        options = popoverObj.options;
        $window = angular.element(window);
        offset = relativeElement.offset();
        if (options.fixed) {
          offset.top = relativeElement.position().top;
        }
        relative = {
          height: relativeElement.outerHeight(),
          width: relativeElement.outerWidth()
        };
        current = {
          height: currentPopover.outerHeight(),
          width: currentPopover.outerWidth()
        };
        top = 0;
        left = 0;
        position = (currentPopover.attr("direction") || "top left").trim();
        setOverflowPosition = function(offset) {
          var tip, tipOffset;
          if (offset == null) {
            offset = 0;
          }
          tip = angular.element(currentPopover[0].getElementsByClassName("tip"));
          top -= offset;
          tipOffset = +tip.css("margin-top").replace("px", "");
          return tip.css("margin-top", tipOffset + offset);
        };
        updateOffset = function() {
          switch (position) {
            case "above left":
              top = -(current.height + 10);
              return left = -25 + relative.width / 2;
            case "above right":
              top = -(current.height + 10);
              return left = 25 + relative.width / 2 - current.width;
            case "below left":
              top = relative.height + 10;
              return left = -25 + relative.width / 2;
            case "below right":
              top = relative.height + 10;
              return left = 25 + relative.width / 2 - current.width;
            case "middle right":
              top = relative.height / 2 - current.height / 2;
              return left = relative.width + 10;
            case "middle left":
              top = relative.height / 2 - current.height / 2;
              return left = -(current.width + 10);
          }
        };
        updateOffset();
        topScroll = options.fixed ? 0 : $window.scrollTop();
        leftScroll = options.fixed ? 0 : $window.scrollLeft();
        action = {};
        if (position.indexOf("middle") === -1) {
          if (offset.top + top - topScroll < 0) {
            action = {
              remove: "above",
              add: "below"
            };
          } else if (offset.top + top + current.height - topScroll > $window.height()) {
            action = {
              remove: "below",
              add: "above"
            };
          }
        } else {
          if ((diff = offset.top + top - topScroll) < 0) {
            setOverflowPosition(diff);
          } else if ((diff = offset.top + top + currentPopover.outerHeight() - topScroll - $window.height()) > 0) {
            setOverflowPosition(diff);
          }
        }
        if (action.remove && action.add) {
          position = position.replace(action.remove, action.add);
        }
        action = {};
        if (offset.left + left - leftScroll < 0) {
          action = {
            remove: "right",
            add: "left"
          };
        } else if (offset.left + left + currentPopover.outerWidth() - leftScroll > $window.width()) {
          action = {
            remove: "left",
            add: "right"
          };
        }
        if (action.remove && action.add) {
          position = position.replace(action.remove, action.add);
        }
        updateOffset();
        offset.top += top;
        offset.left += left;
        if (options.offsetX != null) {
          offset.left += options.offsetX;
        }
        if (options.offsetY != null) {
          offset.top += options.offsetY;
        }
        angular.forEach(offset, function(value, key) {
          if (!isNaN(+value)) {
            value = "" + value + "px";
          }
          return currentPopover.css(key, value);
        });
        return currentPopover.addClass("visible " + position);
      },
      hide: function(selector, callback) {
        var comparator, i, index, popoverObj, removeScope, _i, _ref;
        if (!this.popoverList.length) {
          return typeof callback === "function" ? callback() : void 0;
        }
        if (angular.isFunction(selector)) {
          callback = selector;
          selector = null;
        }
        if (selector != null) {
          comparator = angular.isString(selector) ? function(item) {
            return item.id === selector;
          } : angular.isElement(selector) ? function(item) {
            return item.element === selector;
          } : void 0;
          index = -1;
          for (i = _i = _ref = this.popoverList.length - 1; _i >= 0; i = _i += -1) {
            if (!(comparator(this.popoverList[i]))) {
              continue;
            }
            popoverObj = this.popoverList[i];
            index = i;
            break;
          }
          if (index > -1) {
            this.popoverList.splice(index, 1);
          }
        } else {
          popoverObj = this.pop();
        }
        if (popoverObj == null) {
          return;
        }
        $rootScope.$broadcast("popoverBeforeHide", popoverObj.id);
        removeScope = popoverObj.popover.scope();
        return $animate.leave(popoverObj.popover, function() {
          $animate.removeClass(popoverObj.element, "active");
          $rootScope.$broadcast("popoverWasHidden", popoverObj.id);
          removeScope.$destroy();
          return typeof callback === "function" ? callback() : void 0;
        });
      },
      hideAll: function() {
        while (this.popoverList.length) {
          this.hide();
        }
      }
    };
    return service;
  }
]).config([
  "popoverViewsProvider", function(popoverViews) {
    return angular.module("Mac").popover = function(name, options) {
      var opts;
      if (popoverViews.registered[name] == null) {
        opts = {};
        angular.extend(opts, popoverViews.popoverDefaults, options, {
          id: name
        });
        return popoverViews.registered[name] = opts;
      }
    };
  }
]);


/*
@chalk overview
@name mac-modal (element)
@description
Element directive to define the modal dialog. Modal content is transcluded into a
modal template

@param {Boolean} mac-modal-keyboard      Allow closing modal with keyboard (default false)
@param {Boolean} mac-modal-overlay-close Allow closing modal when clicking on overlay (default false)
@param {Boolean} mac-modal-resize        Allow modal to resize on window resize event (default true)
@param {Integer} mac-modal-topOffset     Top offset when the modal is larger than window height (default 20)
@param {Expr}    mac-modal-open          Callback when the modal is opened
@param {Expr}    mac-modal-before-show   Callback before showing the modal
@param {Expr}    mac-modal-after-show    Callback when modal is visible with CSS transitions completed
@param {Expr}    mac-modal-before-hide   Callback before hiding the modal
@param {Expr}    mac-modal-after-hide    Callback when modal is hidden from the user with CSS transitions completed
@param {Boolean} mac-modal-position      Calculate size and position with JS (default true)
 */
angular.module("Mac").directive("macModal", [
  "$parse", "modal", "modalViews", "util", function($parse, modal, modalViews, util) {
    return {
      restrict: "E",
      template: modal.modalTemplate,
      replace: true,
      transclude: true,
      link: function($scope, element, attrs, controller, transclude) {
        var callback, key, opts, regId, registerModal, _i, _len, _ref;
        transclude($scope, function(clone) {
          return angular.element(element[0].getElementsByClassName("mac-modal-content-wrapper")).replaceWith(clone);
        });
        opts = util.extendAttributes("macModal", modalViews.defaults, attrs);
        regId = null;
        if (opts.overlayClose) {
          element.on("click", function($event) {
            if (angular.element($event.target).hasClass("mac-modal-overlay")) {
              return $scope.$apply(function() {
                return modal.hide();
              });
            }
          });
        }
        _ref = ["beforeShow", "afterShow", "beforeHide", "afterHide", "open"];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          callback = _ref[_i];
          key = "macModal" + (util.capitalize(callback));
          opts[callback] = $parse(attrs[key]) || angular.noop;
        }
        registerModal = function(id) {
          if ((id != null) && id) {
            regId = id;
            return modal.register(id, element, opts);
          }
        };
        if (attrs.id) {
          registerModal(attrs.id);
        } else {
          attrs.$observe("macModal", function(id) {
            return registerModal(id);
          });
        }
        return $scope.$on("$destroy", function() {
          if (regId) {
            return modal.unregister(regId);
          }
        });
      }
    };
  }
]).directive("macModal", [
  "$parse", "modal", function($parse, modal) {
    return {
      restrict: "A",
      link: function($scope, element, attrs) {
        if (!attrs.macModal) {
          return;
        }
        element.bind("click", function() {
          return $scope.$apply(function() {
            var data;
            data = $parse(attrs.macModalData)($scope) || {};
            return modal.show(attrs.macModal, {
              data: data,
              scope: $scope
            });
          });
        });
      }
    };
  }
]).directive("macModalClose", [
  "modal", function(modal) {
    return {
      restrict: "A",
      link: function($scope, element, attrs) {
        return element.bind("click", function() {
          return $scope.$apply(function() {
            return modal.hide();
          });
        });
      }
    };
  }
]);


/*
@chalk
@name mac-popover (attribute)
@description
Mac popover trigger directive. Without using mac-popover-child-popover, the last
popover will be closed automatically

@param {String}  mac-popover               ID of the popover to show
@param {Boolean} mac-popover-fixed         Determine if the popover is fixed
@param {Boolean} mac-popover-child-popover If the popover is child of another popover (default false)
@param {Integer} mac-popover-offset-x      Extra x offset (default 0)
@param {Integer} mac-popover-offset-y      Extra y offset (default 0)
@param {String}  mac-popover-trigger       Trigger option, click | hover | focus (default click)
- click: Popover only opens when user click on trigger
- hover: Popover shows when user hover on trigger
- focus: Popover shows when focus on input element
@param {String}  mac-popover-exclude       CSV of popover id that can't be shown at the same time
 */
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module("Mac").directive("macPopover", [
  "$timeout", "popover", "util", "popoverViews", function($timeout, popover, util, popoverViews) {
    return {
      restrict: "A",
      link: function(scope, element, attrs) {
        var clearDelays, closeDelayId, delayId, exclude, excludeList, hide, options, show;
        options = util.extendAttributes("macPopover", popoverViews.defaults, attrs);
        exclude = attrs.macPopoverExclude || "";
        excludeList = exclude ? exclude.split(",") : [];
        delayId = null;
        closeDelayId = null;
        clearDelays = function() {
          if (delayId != null) {
            $timeout.cancel(delayId);
          }
          if (closeDelayId != null) {
            return $timeout.cancel(closeDelayId);
          }
        };
        show = function(id, delay) {
          if (delay == null) {
            delay = 0;
          }
          clearDelays();
          delayId = $timeout(function() {
            var last, _ref;
            last = popover.last();
            if ((last != null) && (!excludeList.length || (_ref = last.id, __indexOf.call(excludeList, _ref) >= 0) || last.id === id)) {
              popover.hide();
              if (element[0] === last.element[0]) {
                return true;
              }
            }
            options.scope = scope;
            return popover.show(id, element, options);
          }, delay);
          return true;
        };
        hide = function(element, delay) {
          if (delay == null) {
            delay = 0;
          }
          clearDelays();
          return closeDelayId = $timeout(function() {
            return popover.hide(element);
          }, delay);
        };
        return attrs.$observe("macPopover", function(id) {
          var hideEvent, showEvent;
          if (!id) {
            return;
          }
          if (options.trigger === "click") {
            return element.bind("click", function() {
              return show(id, 0);
            });
          } else {
            showEvent = options.trigger === "focus" ? "focusin" : "mouseenter";
            hideEvent = options.trigger === "focus" ? "focusout" : "mouseleave";
            element.bind(showEvent, function() {
              return show(id, 400);
            });
            return element.bind(hideEvent, function() {
              return hide(element, 500);
            });
          }
        });
      }
    };
  }
]).directive("macPopover", [
  "popover", "popoverViews", "util", function(popover, popoverViews, util) {
    return {
      restrict: "E",
      compile: function(element, attrs) {
        var opts;
        if (!attrs.id) {
          throw Error("macPopover: Missing id");
        }
        opts = util.extendAttributes("macPopover", popoverViews.popoverDefaults, attrs);
        angular.extend(opts, {
          template: element.html()
        });
        element.replaceWith(document.createComment("macPopover: " + attrs.id));
        return function($scope, element, attrs) {
          return attrs.$observe("id", function(value) {
            return popover.register(value, opts);
          });
        };
      }
    };
  }
]).directive("macPopoverFillContent", [
  "$compile", function($compile) {
    return {
      restrict: "A",
      link: function($scope, element, attrs) {
        element.html($scope.macPopoverTemplate);
        return $compile(element.contents())($scope);
      }
    };
  }
]);


/*
@chalk overview
@name Placeholder

@description
Dynamically fill out the placeholder text of input

@param {String} mac-placeholder Variable that contains the placeholder text
 */
angular.module("Mac").directive("macPlaceholder", function() {
  return {
    restrict: "A",
    link: function($scope, element, attrs) {
      return $scope.$watch(attrs.macPlaceholder, function(value) {
        return attrs.$set("placeholder", value);
      });
    }
  };
});


/*
@chalk overview
@name Scroll Spy Service

@description
There are multiple components used by scrollspy
- Scrollspy service is used to keep track of all and active anchors
- Multiple directives including:
- mac-scroll-spy - Element to spy scroll event
- mac-scroll-spy-anchor - Section in element spying on
- mac-scroll-spy-target - Element to highlight, most likely a nav item

Scrollspy defaults:
offset - 0

@param {Function} register Register an anchor with the service
- {String} id ID of the anchor
- {DOM Element} element Element to spy on

@param {Function} unregister Remove anchor from service
- {String} id ID of the anchor

@param {Function} setActive Set active anchor and fire all listeners
- {Object} anchor Anchor object

@param {Function} addListener Add listener when active is set
- {Function} fn Callback function

@param {Function} removeListener Remove listener
- {Function} fn Callback function
 */
angular.module("Mac").service("scrollSpy", [
  function() {
    return {
      registered: [],
      active: {},
      listeners: [],
      register: function(id, element) {
        var anchor, i, registered, top, _i, _len, _ref;
        registered = false;
        top = element.offset().top;
        _ref = this.registered;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          anchor = _ref[i];
          if (!(anchor.id === id)) {
            continue;
          }
          this.registered[i] = {
            id: id,
            element: element,
            top: top
          };
          registered = true;
          break;
        }
        if (!registered) {
          this.registered.push({
            id: id,
            element: element,
            top: top
          });
        }
        return this.registered.sort(function(a, b) {
          if (a.top > b.top) {
            return 1;
          } else if (a.top < b.top) {
            return -1;
          }
          return 0;
        });
      },
      unregister: function(id) {
        var anchor, i, _i, _len, _ref, _ref1, _results;
        _ref = this.registered;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          anchor = _ref[i];
          if (!(anchor.id === id)) {
            continue;
          }
          [].splice.apply(this.registered, [i, i - i + 1].concat(_ref1 = [])), _ref1;
          break;
        }
        return _results;
      },
      last: function() {
        return this.registered[this.registered.length - 1];
      },
      setActive: function(anchor) {
        var listener, _i, _len, _ref, _results;
        this.active = anchor;
        _ref = this.listeners;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          listener = _ref[_i];
          _results.push(listener(anchor));
        }
        return _results;
      },
      addListener: function(fn) {
        return this.listeners.push(fn);
      },
      removeListener: function(fn) {
        var index, _ref;
        index = this.listeners.indexOf(fn);
        if (index !== -1) {
          return ([].splice.apply(this.listeners, [index, index - index + 1].concat(_ref = [])), _ref);
        }
      }
    };
  }
]).constant("scrollSpyDefaults", {
  offset: 0
});


/*
@chalk overview
@name mac-scroll-spy

@description
Element to spy scroll event on

@param {Integer} mac-scroll-spy-offset Top offset when calculating scroll position
 */
angular.module("Mac").directive("macScrollSpy", [
  "$window", "scrollSpy", "scrollSpyDefaults", "util", function($window, scrollSpy, defaults, util) {
    return {
      link: function($scope, element, attrs) {
        var options, spyElement;
        options = util.extendAttributes("macScrollSpy", defaults, attrs);
        spyElement = element[0].tagName === "BODY" ? angular.element($window) : element;
        return spyElement.bind("scroll", function($event) {
          var anchors, i, maxScroll, scrollHeight, scrollTop, _i, _ref;
          scrollTop = spyElement.scrollTop() + options.offset;
          scrollHeight = this.scrollHeight || element[0].scrollHeight;
          maxScroll = scrollHeight - spyElement.height();
          if (!scrollSpy.registered.length) {
            return true;
          }
          if (scrollTop >= maxScroll) {
            return scrollSpy.setActive(scrollSpy.last());
          }
          for (i = _i = 0, _ref = scrollSpy.registered.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            anchors = scrollSpy.registered;
            if (scrollSpy.active.id !== anchors[i].id && scrollTop >= anchors[i].top && (!anchors[i + 1] || scrollTop <= anchors[i + 1].top)) {
              $scope.$apply(function() {
                return scrollSpy.setActive(anchors[i]);
              });
              return true;
            }
          }
        });
      }
    };
  }
]).directive("macScrollSpyAnchor", [
  "scrollSpy", function(scrollSpy) {
    return {
      link: function($scope, element, attrs) {
        var id, observeKey, registered, registering;
        id = attrs.id || attrs.macScrollSpyAnchor;
        registered = false;
        if (!id) {
          throw new Error("Missing scroll spy anchor id");
        }
        registering = function() {
          scrollSpy.register(id, element);
          if (!registered) {
            $scope.$on("$destroy", function() {
              return scrollSpy.unregister(id);
            });
          }
          return registered = true;
        };
        $scope.$on("refresh-scroll-spy", registering);
        if (/{{(.*)}}/.test(id)) {
          observeKey = attrs.id ? "id" : "macScrollSpyAnchor";
          return attrs.$observe(observeKey, function(value) {
            if ((value != null) && value) {
              id = value;
              return registering();
            }
          });
        } else {
          return registering();
        }
      }
    };
  }
]).directive("macScrollSpyTarget", [
  "scrollSpy", function(scrollSpy) {
    return {
      link: function($scope, element, attrs) {
        var highlightClass, register, registered, target;
        target = attrs.macScrollSpyTarget;
        highlightClass = attrs.macScrollSpyTargetClass || "active";
        registered = false;
        if (!target) {
          throw new Error("Missing scroll spy target name");
        }
        register = function(id) {
          var callback;
          if (!id) {
            return;
          }
          callback = function(active) {
            var action;
            action = id === active.id ? "addClass" : "removeClass";
            return element[action](highlightClass);
          };
          if (scrollSpy.active != null) {
            callback(scrollSpy.active);
          }
          if (!registered) {
            scrollSpy.addListener(callback);
            return $scope.$on("$destroy", function() {
              return scrollSpy.removeListener(callback);
            });
          }
        };
        if (/{{(.*)}}/.test(target)) {
          return attrs.$observe("macScrollSpyTarget", function(value) {
            return register(value);
          });
        } else {
          return register(target);
        }
      }
    };
  }
]);


/*
@chalk overview
@name mac-affix

@description
Fix the component at a certain position

@param {Expr}  mac-affix-disabled To unpin element (default false)
@param {Expr}  mac-affix-top      Top offset (default 0)
@param {Expr}  mac-affix-bottom   Bottom offset (default 0)
@param {Event} refresh-mac-affix  To update the position of affixed element
 */
angular.module("Mac").directive("macAffix", [
  "$document", "$window", function($document, $window) {
    return {
      link: function($scope, element, attrs) {
        var defaults, disabled, getPinnedOffset, lastAffix, offset, pinnedOffset, scrollEvent, setOffset, unpin, windowEl;
        defaults = {
          top: 0,
          bottom: 0,
          disabled: false,
          classes: "affix affix-top affix-bottom"
        };
        offset = {
          top: defaults.top,
          bottom: defaults.bottom
        };
        disabled = defaults.disabled;
        lastAffix = null;
        unpin = null;
        pinnedOffset = null;
        windowEl = angular.element($window);

        /*
        @name setOffset
        @description
        Update top or bottom offset. This function will make sure the value is
        an integer and use default value
        @param {String} key Offset key
        @param {String|Integer} value Update value
        @param {Bool} useDefault
         */
        setOffset = function(key, value, useDefault) {
          if (useDefault == null) {
            useDefault = false;
          }
          if (useDefault && (value == null)) {
            value = defaults[key];
          }
          if ((value != null) && !isNaN(+value)) {
            return offset[key] = +value;
          }
        };
        if (attrs.macAffixTop != null) {
          setOffset("top", $scope.$eval(attrs.macAffixTop), true);
          $scope.$watch(attrs.macAffixTop, function(value) {
            return setOffset("top", value);
          });
        }
        if (attrs.macAffixBottom != null) {
          setOffset("bottom", $scope.$eval(attrs.macAffixBottom), true);
          $scope.$watch(attrs.macAffixBottom, function(value) {
            return setOffset("bottom", value);
          });
        }
        getPinnedOffset = function() {
          var scrollHeight;
          if (pinnedOffset != null) {
            return pinnedOffset;
          }
          element.removeClass(defaults.classes).addClass("affix");
          scrollHeight = $document.height();
          pinnedOffset = scrollHeight - element.outerHeight() - offset.bottom;
          return pinnedOffset;
        };
        scrollEvent = function() {
          var affix, curOffset, elementHeight, position, scrollHeight, scrollTop;
          if (element[0].offsetHeight <= 0 && element[0].offsetWidth <= 0) {
            return;
          }
          position = element.offset();
          scrollTop = windowEl.scrollTop();
          scrollHeight = $document.height();
          elementHeight = element.outerHeight();
          affix = (unpin != null) && scrollTop <= unpin ? false : (offset.bottom != null) && scrollTop > scrollHeight - elementHeight - offset.bottom ? "bottom" : (offset.top != null) && scrollTop <= offset.top ? "top" : false;
          if (affix === lastAffix) {
            return;
          }
          if (unpin) {
            element.css("top", "");
          }
          lastAffix = affix;
          unpin = affix === "bottom" ? getPinnedOffset() : null;
          element.removeClass(defaults.classes).addClass("affix" + (affix ? "-" + affix : ""));
          if (affix === "bottom") {
            curOffset = element.offset();
            element.css("top", unpin - curOffset.top);
          }
          return true;
        };
        if (attrs.macAffixDisabled != null) {
          disabled = $scope.$eval(attrs.macAffixDisabled) || defaults.disabled;
          $scope.$watch(attrs.macAffixDisabled, function(value) {
            var action;
            if ((value == null) || value === disabled) {
              return;
            }
            disabled = value;
            action = value ? "unbind" : "bind";
            windowEl[action]("scroll", scrollEvent);
            if (disabled) {
              lastAffix = null;
              unpin = null;
              return element.css("top", "").removeClass(defaults.classes);
            } else {
              return scrollEvent();
            }
          });
        }
        if (!disabled) {
          windowEl.bind("scroll", scrollEvent);
        }
        $scope.$on("refresh-mac-affix", function() {
          var position;
          return position = element.offset();
        });
        return $scope.$on("$destroy", function() {
          return windowEl.unbind("scroll", scrollEvent);
        });
      }
    };
  }
]);


/*
@chalk overview
@name Spinner

@description
A directive for generating spinner

@param {Integer} mac-spinner-size The size of the spinner (default 16)
@param {Integer} mac-spinner-z-index The z-index (default inherit)
@param {String}  mac-spinner-color Color of all the bars (default #2f3035)
 */
angular.module("Mac").directive("macSpinner", [
  "util", function(util) {
    return {
      restrict: "E",
      replace: true,
      template: "<div class=\"mac-spinner\"></div>",
      compile: function(element, attrs) {
        var animateCss, bar, degree, delay, i, prefixes, styl, transformCss, vendor, _i;
        prefixes = ["webkit", "Moz", "ms", "O"];
        vendor = function(el, name) {
          var prefix, _i, _len;
          name = util.capitalize(name);
          for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
            prefix = prefixes[_i];
            if (el.style[prefix + name] != null) {
              return prefix + name;
            }
          }
          return name;
        };
        animateCss = vendor(element[0], "animation");
        transformCss = vendor(element[0], "transform");
        for (i = _i = 0; _i <= 9; i = ++_i) {
          delay = i * 0.1 - 1 + (!i);
          degree = i * 36;
          styl = {};
          bar = angular.element("<div class=\"bar\"></div>");
          styl[animateCss] = "fade 1s linear infinite " + delay + "s";
          styl[transformCss] = "rotate(" + degree + "deg) translate(0, 130%)";
          bar.css(styl);
          element.append(bar);
        }
        return function($scope, element, attrs) {
          var bars, defaults, setSpinnerSize;
          defaults = {
            size: 16,
            zIndex: "inherit",
            color: "#2f3035"
          };
          bars = angular.element(element[0].getElementsByClassName("bar"));
          setSpinnerSize = function(size) {
            bars.css({
              height: size * 0.32 + "px",
              left: size * 0.445 + "px",
              top: size * 0.37 + "px",
              width: size * 0.13 + "px",
              borderRadius: size * 0.32 * 2 + "px",
              position: "absolute"
            });
            if (!isNaN(+size) && angular.isNumber(+size)) {
              size = "" + size + "px";
            }
            return element.css({
              height: size,
              width: size
            });
          };
          if (attrs.macSpinnerSize != null) {
            attrs.$observe("macSpinnerSize", function(value) {
              if ((value != null) && value) {
                return setSpinnerSize(value);
              }
            });
          } else {
            setSpinnerSize(defaults.size);
          }
          attrs.$observe("macSpinnerZIndex", function(value) {
            if ((value != null) && value) {
              return element.css("z-index", value);
            }
          });
          if (attrs.macSpinnerColor != null) {
            return attrs.$observe("macSpinnerColor", function(value) {
              if ((value != null) && value) {
                return bars.css("background", value);
              }
            });
          } else {
            return bars.css("background", defaults.color);
          }
        };
      }
    };
  }
]);


/*
@chalk overview
@name Tag Autocomplete

@description
A directive for generating tag input with autocomplete support on text input.
Tag autocomplete has priority 800

@dependencies
- mac-autocomplete
- mac-menu

@param {String}  mac-tag-autocomplete-url         Url to fetch autocomplete dropdown list data.
mac-tag-autocomplete-url and mac-tag-autocomplete-source cannot be used together. Url
will always take priority over mac-tag-autocomplete-source.
@param {String}  mac-tag-autocomplete-source      Data to use.
Source support multiple types:
- Array: An array can be used for local data and there are two supported formats:
  - An array of strings: ["Item1", "Item2"]
  - An array of objects with mac-autocomplete-label key: [{name:"Item1"}, {name:"Item2"}]
- String: Using a string as the source is the same as passing the variable into mac-autocomplete-url
- Function: A callback when querying for data. The callback receive two arguments:
  - {String} Value currently in the text input
  - {Function} A response callback which expects a single argument, data to user. The data will be
  populated on the menu and the menu will adjust accordingly
@param {String}  mac-tag-autocomplete-value       The value to be sent back upon selection (default "id")
@param {String}  mac-tag-autocomplete-label       The label to display to the users (default "name")
@param {Expr}    mac-tag-autocomplete-model       Model for autocomplete
@param {Array}   mac-tag-autocomplete-selected    The list of elements selected by the user (required)
@param {String}  mac-tag-autocomplete-query       The query parameter on GET command (defualt "q")
@param {Integer} mac-tag-autocomplete-delay       Time delayed on fetching autocomplete data after keyup  (default 800)
@param {String}  mac-tag-autocomplete-placeholder Placeholder text of the text input (default "")
@param {Boolean} mac-tag-autocomplete-disabled    If autocomplete is enabled or disabled (default false)
@param {Expr}    mac-tag-autocomplete-on-enter    When autocomplete is disabled, this function is called on enter, Should return either string, object or boolean. If false, item is not added
- `item` - {String} User input
@param {String}  mac-tag-autocomplete-events      A CSV list of events to attach functions to
@param {Expr}    mac-tag-autocomplete-on-         Function to be called when specified event is fired
- `event` - {Object} jQuery event
- `value` - {String} Value in the input text

@param {Event} mac-tag-autocomplete-clear-input $broadcast message; clears text input when received
 */
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module("Mac").directive("macTagAutocomplete", [
  "$parse", "$timeout", "keys", "util", function($parse, $timeout, keys, util) {
    return {
      restrict: "E",
      template: "<div ng-click=\"focusTextInput()\" class=\"mac-tag-autocomplete\"><ul class=\"mac-tag-list\"><li ng-repeat=\"tag in selected\" class=\"mac-tag mac-label\"><div ng-click=\"selected.splice($index, 1)\" class=\"mac-tag-close\">&times;</div><span class=\"tag-label\">{{getTagLabel(tag)}}</span></li><li ng-class=\"{'fullwidth': !selected.length}\" class=\"mac-tag mac-input-tag\"><mac-autocomplete ng-model=\"textInput\" mac-autocomplete-disabled=\"disabled\" mac-autocomplete-on-select=\"onSelect(selected)\" mac-autocomplete-on-success=\"onSuccess(data)\" mac-placeholder=\"autocompletePlaceholder\" ng-keydown=\"onKeyDown($event)\" class=\"text-input mac-autocomplete\"></mac-autocomplete></li></ul></div>",
      replace: true,
      priority: 800,
      scope: {
        url: "=macTagAutocompleteUrl",
        placeholder: "=macTagAutocompletePlaceholder",
        selected: "=macTagAutocompleteSelected",
        source: "=macTagAutocompleteSource",
        disabled: "=macTagAutocompleteDisabled",
        model: "=macTagAutocompleteModel",
        onEnter: "&macTagAutocompleteOnEnter",
        onKeydown: "&macTagAutocompleteOnKeydown"
      },
      compile: function(element, attrs) {
        var attrsObject, delay, labelGetter, labelKey, queryKey, textInput, useSource, valueGetter, valueKey;
        valueKey = attrs.macTagAutocompleteValue;
        if (valueKey == null) {
          valueKey = "id";
        }
        valueGetter = $parse(valueKey);
        labelKey = attrs.macTagAutocompleteLabel;
        if (labelKey == null) {
          labelKey = "name";
        }
        labelGetter = $parse(labelKey);
        queryKey = attrs.macTagAutocompleteQuery || "q";
        delay = +attrs.macTagAutocompleteDelay || 800;
        useSource = false;
        textInput = angular.element(element[0].getElementsByClassName("mac-autocomplete"));
        attrsObject = {
          "mac-autocomplete-label": labelKey,
          "mac-autocomplete-query": queryKey,
          "mac-autocomplete-delay": delay
        };
        if (attrs.macTagAutocompleteUrl != null) {
          attrsObject["mac-autocomplete-url"] = "url";
        } else if (useSource = attrs.macTagAutocompleteSource != null) {
          attrsObject["mac-autocomplete-source"] = "autocompleteSource";
        }
        textInput.attr(attrsObject);
        return function($scope, element, attrs) {
          var updateAutocompleteSource, watchFn;
          $scope.textInput = "";
          $scope.autocompleteSource = angular.isArray($scope.source) ? [] : $scope.source;
          if (attrs.macTagAutocompleteModel != null) {
            $scope.$watch("textInput", function(value) {
              return $scope.model = value;
            });
            $scope.$watch("model", function(value) {
              return $scope.textInput = value;
            });
          }
          $scope.focusTextInput = function() {
            var textInputDOM;
            textInputDOM = element[0].getElementsByClassName("mac-autocomplete");
            return textInputDOM[0].focus();
          };
          $scope.getTagLabel = function(tag) {
            if (labelKey) {
              return labelGetter(tag);
            } else {
              return tag;
            }
          };
          $timeout(function() {
            var capitalized, eventFn, events, name, _i, _len, _ref, _results;
            if ((events = attrs.macTagAutocompleteEvents)) {
              textInput = angular.element(element[0].getElementsByClassName("text-input"));
              _ref = events.split(",");
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                name = _ref[_i];
                name = util.trim(name);
                capitalized = util.capitalize(name);
                eventFn = attrs["macTagAutocompleteOn" + capitalized];
                if (!(eventFn && name !== "keydown")) {
                  continue;
                }
                _results.push((function(name, eventFn) {
                  return textInput.bind(name, function($event) {
                    var expression;
                    expression = $parse(eventFn);
                    return $scope.$apply(function() {
                      return expression($scope.$parent, {
                        $event: $event,
                        item: $scope.textInput
                      });
                    });
                  });
                })(name, eventFn));
              }
              return _results;
            }
          }, 0, false);
          updateAutocompleteSource = function() {
            var difference, item, selectedValues, sourceValues, _ref;
            $scope.autocompletePlaceholder = ((_ref = $scope.selected) != null ? _ref.length : void 0) ? "" : $scope.placeholder;
            if (!(useSource && angular.isArray($scope.source))) {
              $scope.autocompleteSource = $scope.source;
              return;
            }
            sourceValues = (function() {
              var _i, _len, _ref1, _results;
              _ref1 = $scope.source || [];
              _results = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                item = _ref1[_i];
                _results.push(valueGetter(item));
              }
              return _results;
            })();
            selectedValues = (function() {
              var _i, _len, _ref1, _results;
              _ref1 = $scope.selected || [];
              _results = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                item = _ref1[_i];
                _results.push(valueGetter(item));
              }
              return _results;
            })();
            difference = (function() {
              var _i, _len, _results;
              _results = [];
              for (_i = 0, _len = sourceValues.length; _i < _len; _i++) {
                item = sourceValues[_i];
                if (__indexOf.call(selectedValues, item) < 0) {
                  _results.push(item);
                }
              }
              return _results;
            })();
            return $scope.autocompleteSource = (function() {
              var _i, _len, _ref1, _ref2, _results;
              _ref1 = $scope.source || [];
              _results = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                item = _ref1[_i];
                if (_ref2 = valueGetter(item), __indexOf.call(difference, _ref2) >= 0) {
                  _results.push(item);
                }
              }
              return _results;
            })();
          };
          if (useSource) {
            watchFn = angular.isArray($scope.source) ? "$watchCollection" : "$watch";
            $scope[watchFn]("source", updateAutocompleteSource);
          }
          $scope.$watchCollection("selected", updateAutocompleteSource);
          $scope.onKeyDown = function($event) {
            var stroke, _base;
            stroke = $event.which || $event.keyCode;
            switch (stroke) {
              case keys.BACKSPACE:
                if (!$scope.textInput) {
                  if (typeof (_base = $scope.selected).pop === "function") {
                    _base.pop();
                  }
                }
                break;
              case keys.ENTER:
                if ($scope.textInput.length > 0 && $scope.disabled) {
                  $scope.onSelect($scope.textInput);
                }
            }
            if (attrs.macTagAutocompleteOnKeydown != null) {
              if (typeof $scope.onKeydown === "function") {
                $scope.onKeydown({
                  $event: $event,
                  value: $scope.textInput
                });
              }
            }
            return true;
          };
          $scope.onSuccess = function(data) {
            var existingValues, item;
            existingValues = (function() {
              var _i, _len, _ref, _results;
              _ref = $scope.selected || [];
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                item = _ref[_i];
                _results.push(valueGetter(item));
              }
              return _results;
            })();
            return (function() {
              var _i, _len, _ref, _ref1, _results;
              _ref = data.data;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                item = _ref[_i];
                if (_ref1 = valueGetter(item) || item, __indexOf.call(existingValues, _ref1) < 0) {
                  _results.push(item);
                }
              }
              return _results;
            })();
          };
          $scope.onSelect = function(item) {
            if (attrs.macTagAutocompleteOnEnter != null) {
              item = $scope.onEnter({
                item: item
              });
            }
            if (item) {
              $scope.selected.push(item);
            }
            return $timeout(function() {
              return $scope.textInput = "";
            }, 0);
          };
          return $scope.$on("mac-tag-autocomplete-clear-input", function() {
            return $scope.textInput = "";
          });
        };
      }
    };
  }
]);


/*
@chalk overview
@name Time
@description
A directive for creating a time input field. Time input can use any `ng-` attributes support by text input type.

@param {String} ng-model         Assignable angular expression to data-bind to
Clearing model by setting it to null or '' will set model back to default value
@param {String} name             Property name of the form under which the control is published
@param {String} required         Adds `required` validation error key if the value is not entered.
@param {String} ng-required      Adds `required` attribute and `required` validation constraint to
 the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
 `required` when you want to data-bind to the `required` attribute.
@param {String} ng-pattern      Sets `pattern` validation error key if the value does not match the
 RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
   patterns defined as scope expressions.
@param {String} ng-change       Angular expression to be executed when input changes due to user interaction with the input element.
@param {String} ng-disabled     Enable or disable time input

@param {String} mac-time-default If model is undefined, use this as the starting value (default 12:00 PM)
 */
angular.module("Mac").directive("macTime", [
  "$filter", "$timeout", "keys", "util", function($filter, $timeout, keys, util) {
    var defaults;
    defaults = {
      "default": "12:00 AM"
    };
    return {
      restrict: "E",
      require: "ngModel",
      replace: true,
      template: "<input type=\"text\" maxlength=\"8\" class=\"mac-date-time\"/>",
      link: function($scope, element, attrs, ngModelCtrl) {
        var getSelection, incrementHour, incrementMinute, initializeTime, opts, selectHours, selectMeridian, selectMinutes, selectNextSection, selectPreviousSection, selectRange, setMeridian, time, timeValidator, toggleMeridian, updateInput, updateTime;
        opts = util.extendAttributes("macTime", defaults, attrs);
        time = null;
        if (!attrs.placeholder) {
          attrs.$set("placeholder", "--:--");
        }
        timeValidator = function(value) {
          if (!value || util.timeRegex.exec(value)) {
            ngModelCtrl.$setValidity("time", true);
            return value;
          } else {
            ngModelCtrl.$setValidity("time", false);
            return void 0;
          }
        };
        ngModelCtrl.$formatters.push(timeValidator);
        ngModelCtrl.$parsers.push(timeValidator);
        (initializeTime = function() {
          var currentDate;
          currentDate = new Date().toDateString();
          time = new Date(currentDate + " " + opts["default"]);
          if (isNaN(time.getTime())) {
            return time = new Date(currentDate + " " + defaults["default"]);
          }
        })();
        getSelection = function() {
          var start;
          start = element[0].selectionStart;
          switch (false) {
            case !((0 <= start && start < 3)):
              return "hour";
            case !((3 <= start && start < 6)):
              return "minute";
            case !((6 <= start && start < 9)):
              return "meridian";
          }
        };
        selectRange = function(start, end) {
          return $timeout(function() {
            return element[0].setSelectionRange(start, end);
          }, 0, false);
        };
        selectHours = function() {
          return selectRange(0, 2);
        };
        selectMinutes = function() {
          return selectRange(3, 5);
        };
        selectMeridian = function() {
          return selectRange(6, 8);
        };
        selectNextSection = function() {
          switch (getSelection()) {
            case "hour":
              return selectMinutes();
            case "minute":
            case "meridian":
              return selectMeridian();
          }
        };
        selectPreviousSection = function() {
          switch (getSelection()) {
            case "hour":
            case "minute":
              return selectHours();
            case "meridian":
              return selectMinutes();
          }
        };
        setMeridian = function(meridian) {
          var hours;
          hours = time.getHours();
          if (hours >= 12 && meridian === "AM") {
            hours -= 12;
          }
          if (hours < 12 && meridian === "PM") {
            hours += 12;
          }
          return time.setHours(hours);
        };
        toggleMeridian = function() {
          var hours;
          hours = time.getHours();
          return time.setHours((hours + 12) % 24);
        };
        incrementHour = function(change) {
          return time.setHours(time.getHours() + change);
        };
        incrementMinute = function(change) {
          return time.setMinutes(time.getMinutes() + change);
        };
        updateInput = function() {
          var displayTime;
          displayTime = $filter("date")(time.getTime(), "hh:mm a");
          if (displayTime !== ngModelCtrl.$viewValue) {
            ngModelCtrl.$setViewValue(displayTime);
            return ngModelCtrl.$render();
          }
        };
        updateTime = function() {
          var hours, meridian, minutes, timeMatch;
          if (timeMatch = util.timeRegex.exec(ngModelCtrl.$modelValue)) {
            hours = +timeMatch[1];
            minutes = +timeMatch[2];
            meridian = timeMatch[3];
            if (meridian === "PM" && hours !== 12) {
              hours += 12;
            }
            if (meridian === "AM" && hours === 12) {
              hours = 0;
            }
            return time.setHours(hours, minutes);
          }
        };
        element.on('blur', function(event) {
          return $scope.$apply(function() {
            return updateInput();
          });
        });
        element.on('click', function(event) {
          return $scope.$apply(function() {
            updateTime();
            updateInput();
            switch (getSelection()) {
              case "hour":
                return selectHours();
              case "minute":
                return selectMinutes();
              case "meridian":
                return selectMeridian();
            }
          });
        });
        element.on('keydown', function(event) {
          var key;
          key = event.which;
          if (key !== keys.UP && key !== keys.DOWN && key !== keys.LEFT && key !== keys.RIGHT && key !== keys.A && key !== keys.P) {
            return true;
          }
          event.preventDefault();
          return $scope.$apply(function() {
            var change, meridianSelected;
            switch (key) {
              case keys.UP:
              case keys.DOWN:
                change = key === keys.UP ? 1 : -1;
                switch (getSelection()) {
                  case "hour":
                    incrementHour(change);
                    selectHours();
                    break;
                  case "minute":
                    incrementMinute(change);
                    selectMinutes();
                    break;
                  case "meridian":
                    toggleMeridian();
                    selectMeridian();
                }
                return updateInput();
              case keys.LEFT:
              case keys.RIGHT:
                switch (key) {
                  case keys.LEFT:
                    selectPreviousSection();
                    break;
                  case keys.RIGHT:
                    selectNextSection();
                }
                return updateInput();
              case keys.A:
              case keys.P:
                meridianSelected = getSelection() === "meridian";
                switch (false) {
                  case !(meridianSelected && key === keys.A):
                    setMeridian("AM");
                    break;
                  case !(meridianSelected && key === keys.P):
                    setMeridian("PM");
                }
                updateInput();
                return selectMeridian();
            }
          });
        });
        return element.on('keyup', function(event) {
          var key;
          key = event.which;
          if (!((keys.NUMPAD0 <= key && key <= keys.NUMPAD9) || (keys.ZERO <= key && key <= keys.NINE))) {
            event.preventDefault();
          }
          return $scope.$apply(function() {
            return updateTime();
          });
        });
      }
    };
  }
]);


/*
@chalk overview
@name Tooltip

@description
Tooltip directive

@param {String}  mac-tooltip           Text to show in tooltip
@param {String}  mac-tooltip-direction Direction of tooltip (default 'top')
@param {String}  mac-tooltip-trigger   How tooltip is triggered (default 'hover')
@param {Boolean} mac-tooltip-inside    Should the tooltip be appended inside element (default false)
@param {Expr}    mac-tooltip-disabled  Disable and enable tooltip
 */

/*
NOTE: This directive does not use $animate to append and remove DOM element or
  add and remove classes in order to optimize showing tooltips by eliminating
  the need for firing a $digest cycle.
 */
angular.module("Mac").directive("macTooltip", [
  "$timeout", "util", function($timeout, util) {
    return {
      restrict: "A",
      link: function(scope, element, attrs) {
        var defaults, disabled, enabled, opts, removeTip, showTip, text, toggle, tooltip;
        tooltip = null;
        text = "";
        enabled = false;
        disabled = false;
        defaults = {
          direction: "top",
          trigger: "hover",
          inside: false
        };
        opts = util.extendAttributes("macTooltip", defaults, attrs);
        showTip = function() {
          var elementSize, offset, tip, tooltipSize;
          if (disabled || !text) {
            return true;
          }
          tip = opts.inside ? element : angular.element(document.body);
          removeTip(0);
          tooltip = angular.element("<div class=\"mac-tooltip " + opts.direction + "\"><div class=\"tooltip-message\">" + text + "</div></div>");
          tip.append(tooltip);
          offset = opts.inside ? {
            top: 0,
            left: 0
          } : element.offset();
          elementSize = {
            width: element.outerWidth(),
            height: element.outerHeight()
          };
          tooltipSize = {
            width: tooltip.outerWidth(),
            height: tooltip.outerHeight()
          };
          switch (opts.direction) {
            case "bottom":
            case "top":
              offset.left += elementSize.width / 2.0 - tooltipSize.width / 2.0;
              break;
            case "left":
            case "right":
              offset.top += elementSize.height / 2.0 - tooltipSize.height / 2.0;
          }
          switch (opts.direction) {
            case "bottom":
              offset.top += elementSize.height;
              break;
            case "top":
              offset.top -= tooltipSize.height;
              break;
            case "left":
              offset.left -= tooltipSize.width;
              break;
            case "right":
              offset.left += elementSize.width;
          }
          offset.top = Math.max(0, offset.top);
          offset.left = Math.max(0, offset.left);
          angular.forEach(offset, function(value, key) {
            if (!isNaN(+value) && angular.isNumber(+value)) {
              value = "" + value + "px";
            }
            return tooltip.css(key, value);
          });
          tooltip.addClass("visible");
          return true;
        };
        removeTip = function(delay) {
          if (delay == null) {
            delay = 100;
          }
          if (tooltip != null) {
            tooltip.removeClass("visible");
            $timeout(function() {
              if (tooltip != null) {
                tooltip.remove();
              }
              return tooltip = null;
            }, delay, false);
          }
          return true;
        };
        toggle = function() {
          if (tooltip != null) {
            return removeTip();
          } else {
            return showTip();
          }
        };
        attrs.$observe("macTooltip", function(value) {
          var _ref;
          if (value != null) {
            text = value;
            if (!enabled) {
              if ((_ref = opts.trigger) !== "hover" && _ref !== "click") {
                throw "Invalid trigger";
              }
              switch (opts.trigger) {
                case "click":
                  element.bind("click", toggle);
                  break;
                case "hover":
                  element.bind("mouseenter", showTip);
                  element.bind("mouseleave click", function() {
                    return removeTip();
                  });
              }
              return enabled = true;
            }
          }
        });
        if (attrs.macTooltipDisabled != null) {
          scope.$watch(attrs.macTooltipDisabled, function(value) {
            return disabled = value;
          });
        }
        return scope.$on("$destroy", function() {
          if (tooltip != null) {
            return removeTip(0);
          }
        });
      }
    };
  }
]);

})(window, window.angular);