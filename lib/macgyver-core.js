/**
 * MacGyver v0.1.25
 * @link http://starttheshift.github.io/MacGyver
 * @license MIT
 */
(function(window, angular, undefined) {
var augmentWidthOrHeight, core_pnum, cssExpand, extendjQuery, getStyles, getWidthOrHeight, getWindow, isWindow, jqLiteExtend, rnumnonpx;

angular.module("Mac", ["Mac.Util"]);

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
      return win.scrollTo(window.pageXOffset, value);
    } else {
      return element["scrollTop"] = value;
    }
  }
};

extendjQuery = function() {
  var jqLite;
  if (window.jQuery != null) {
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
        if (!angular.isString(string) || string.trim().length === 0) {
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
        return string.trim().replace(/[-_\s]+(.)?/g, function(match, c) {
          return c.toUpperCase();
        });
      },
      toSnakeCase: function(string) {
        if (string == null) {
          string = "";
        }
        return string.trim().replace(/([a-z\d])([A-Z]+)/g, "$1_$2").replace(/[-\s]+/g, "_").toLowerCase();
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
@name Events

@description
A directive for handling basic html events (e.g., blur, keyup, focus, etc.)
Currently MacGyver has blur, focus, keydown, keyup, mouseenter and mouseleave

@param {Expression} mac-blur       Expression to evaluate on blur
@param {Expression} mac-focus      Expression to evaluate on focus
@param {Expression} mac-keydown    Expression to evaluate on keydown
@param {Expression} mac-keyup      Expression to evaluate on keyup
@param {Expression} mac-mouseenter Expression to evaluate on mouseenter
@param {Expression} mac-mouseleave Expression to evaluate on mouseleave
*/

var event, _fn, _i, _len, _ref;

_ref = ["Blur", "Focus", "Keydown", "Keyup", "Mouseenter", "Mouseleave"];
_fn = function(event) {
  return angular.module("Mac").directive("mac" + event, [
    "$parse", function($parse) {
      return {
        restrict: "A",
        link: function(scope, element, attributes) {
          var expression;
          expression = $parse(attributes["mac" + event]);
          return element.bind(event.toLowerCase(), function($event) {
            scope.$apply(function() {
              return expression(scope, {
                $event: $event
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

@dependencies
- mac-menu

@param {String} ng-model Assignable angular expression to data-bind to
@param {String} mac-placeholder Placeholder text
@param {String} mac-autocomplete-url Url to fetch autocomplete dropdown list data. URL may include GET params e.g. "/users?nocache=1"
@param {Expression} mac-autocomplete-source Local data source
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
*/

angular.module("Mac").directive("macAutocomplete", [
  "$http", "$filter", "$compile", "$timeout", "$parse", "$rootScope", "keys", function($http, $filter, $compile, $timeout, $parse, $rootScope, keys) {
    return {
      restrict: "E",
      template: "<input type=\"text\"/>",
      replace: true,
      require: "ngModel",
      link: function($scope, element, attrs, ctrl) {
        var $menuScope, appendMenu, autocompleteUrl, currentAutocomplete, delay, disabled, inside, labelKey, menuEl, onError, onSelect, onSelectBool, onSuccess, positionMenu, queryData, queryKey, reset, source, timeoutId, updateItem;
        labelKey = attrs.macAutocompleteLabel || "name";
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
        onSelectBool = false;
        $menuScope = $rootScope.$new();
        $menuScope.items = [];
        $menuScope.index = 0;
        menuEl = angular.element("<mac-menu></mac-menu>");
        menuEl.attr({
          "mac-menu-items": "items",
          "mac-menu-style": "style",
          "mac-menu-select": "select(index)",
          "mac-menu-index": "index"
        });
        $compile(menuEl)($menuScope);
        ctrl.$parsers.push(function(value) {
          if (value && !disabled($scope) && !onSelectBool) {
            if (delay > 0) {
              if (timeoutId != null) {
                $timeout.cancel(timeoutId);
              }
              timeoutId = $timeout(function() {
                return queryData(value);
              }, delay);
            } else {
              queryData(value);
            }
          } else {
            reset();
          }
          onSelectBool = false;
          return value;
        });
        appendMenu = function() {
          if (inside) {
            return element.after(menuEl);
          } else {
            return angular.element(document.body).append(menuEl);
          }
        };
        reset = function() {
          $menuScope.items = [];
          $menuScope.index = 0;
          return menuEl.remove();
        };
        positionMenu = function() {
          if ($menuScope.items.length > 0) {
            $menuScope.style = element.offset();
            $menuScope.style.top += element.outerHeight();
            $menuScope.style.minWidth = element.outerWidth();
            angular.forEach($menuScope.style, function(value, key) {
              if (!isNaN(+value) && angular.isNumber(+value)) {
                value = "" + value + "px";
              }
              return $menuScope.style[key] = value;
            });
            return appendMenu();
          }
        };
        updateItem = function(data) {
          var item, label, value, _i, _len, _results;
          if (data == null) {
            data = [];
          }
          if (data.length > 0) {
            currentAutocomplete = data;
            $menuScope.items = [];
            _results = [];
            for (_i = 0, _len = data.length; _i < _len; _i++) {
              item = data[_i];
              label = value = item[labelKey] || item;
              _results.push($menuScope.items.push({
                label: label,
                value: value
              }));
            }
            return _results;
          }
        };
        queryData = function(query) {
          var options, url;
          url = autocompleteUrl($scope);
          if (url) {
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
              updateItem(dataList);
              return positionMenu();
            }).error(function(data, status, headers, config) {
              return onError($scope, {
                data: data,
                status: status,
                headers: headers
              });
            });
          } else {
            updateItem($filter("filter")(source($scope), query));
            return positionMenu();
          }
        };
        $menuScope.select = function(index) {
          var label, selected;
          selected = currentAutocomplete[index];
          onSelect($scope, {
            selected: selected
          });
          label = $menuScope.items[index].label || "";
          onSelectBool = true;
          if (attrs.ngModel != null) {
            ctrl.$setViewValue(label);
            ctrl.$render();
          }
          return reset();
        };
        element.bind("keydown", function(event) {
          switch (event.which) {
            case keys.DOWN:
              $scope.$apply(function() {
                return $menuScope.index = ($menuScope.index + 1) % $menuScope.items.length;
              });
              break;
            case keys.UP:
              $scope.$apply(function() {
                return $menuScope.index = ($menuScope.index ? $menuScope.index : $menuScope.items.length) - 1;
              });
              break;
            case keys.ENTER:
              $scope.$apply(function() {
                if ($menuScope.items.length > 0) {
                  return $menuScope.select($menuScope.index);
                }
              });
              break;
            case keys.ESCAPE:
              $scope.$apply(function() {
                return reset();
              });
          }
          return true;
        });
        angular.element(document).bind("click", function(event) {
          if ($menuScope.items.length > 0) {
            return $scope.$apply(function() {
              return reset();
            });
          }
        });
        $scope.$on("$destroy", function() {
          return menuEl.remove();
        });
        return $scope.$on("resetAutocomplete", function() {
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

@param {Expression} mac-menu-items List of items to display in the menu
        Each item should have a `label` key as display text
@param {Function} mac-menu-select Callback on select
        - `index` - {Integer} Item index
@param {Object} mac-menu-style Styles apply to the menu
@param {Expression} mac-menu-index Index of selected item
*/

angular.module("Mac").directive("macMenu", [
  "$parse", function($parse) {
    return {
      restrict: "EA",
      replace: true,
      template: "<div ng-class=\"{'visible': items.length}\" ng-style=\"style\" class=\"mac-menu\"><ul><li ng-repeat=\"item in items\" ng-click=\"selectItem($index)\" ng-class=\"{'active': $index == index}\" mac-mouseenter=\"setIndex($index)\" class=\"mac-menu-item\">{{item.label}}</li></ul></div>",
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
          return $scope.$watch("pIndex", function(value) {
            return $scope.index = parseInt(value);
          });
        }
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
  "$rootScope", "$timeout", "$templateCache", "$compile", "$http", "$controller", "modalViews", "keys", function($rootScope, $timeout, $templateCache, $compile, $http, $controller, modalViews, keys) {
    return {
      registered: modalViews.registered,
      waiting: null,
      opened: null,
      modalTemplate: '<div ng-click="closeOverlay($event)" class="modal-overlay hide"><div class="modal"><a ng-click="modal.hide()" class="close-modal"></a><div class="modal-content-wrapper"></div></div></div>',
      show: function(id, triggerOptions) {
        var modalObject, options, path, renderModal, showModal, template,
          _this = this;
        if (triggerOptions == null) {
          triggerOptions = {};
        }
        if ((this.registered[id] != null) && (this.opened != null)) {
          return this.hide();
        } else if (this.registered[id] != null) {
          modalObject = this.registered[id];
          options = modalObject.options;
          angular.extend(options, triggerOptions);
          showModal = function(element) {
            element.removeClass("hide");
            $timeout(function() {
              return element.addClass("visible");
            }, 0, false);
            _this.opened = {
              id: id,
              element: element,
              options: options
            };
            _this.resize(_this.opened);
            _this.bindingEvents();
            if (typeof options.callback === "function") {
              options.callback();
            }
            $rootScope.$broadcast("modalWasShown", id);
            return _this.clearWaiting();
          };
          if (options.moduleMethod != null) {
            renderModal = function(template, invokeApply) {
              var element, viewScope, wrapper;
              if (invokeApply == null) {
                invokeApply = true;
              }
              viewScope = options.scope ? options.scope.$new() : $rootScope.$new(true);
              viewScope.modal = _this;
              viewScope.closeOverlay = function($event) {
                if (options.overlayClose && angular.element($event.target).hasClass("modal-overlay")) {
                  return _this.hide();
                }
              };
              if (options.controller) {
                $controller(options.controller, {
                  $scope: viewScope
                });
              }
              angular.extend(options.attributes, {
                id: id
              });
              element = angular.element(_this.modalTemplate).attr(options.attributes);
              wrapper = angular.element(element[0].getElementsByClassName("modal-content-wrapper"));
              wrapper.html(template);
              angular.element(document.body).append($compile(element)(viewScope));
              showModal(element);
              if (invokeApply) {
                return $rootScope.$apply();
              }
            };
            if ((path = options.templateUrl)) {
              template = $templateCache.get(path);
              if (template) {
                return renderModal(template);
              } else {
                return $http.get(path).then(function(resp) {
                  $templateCache.put(path, resp.data);
                  return renderModal(resp.data, false);
                }, function() {
                  throw Error("Failed to load template: " + path);
                });
              }
            } else if ((template = options.template)) {
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
        modal = angular.element(element[0].getElementsByClassName("modal")).attr("style", "");
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
        element.removeClass("visible");
        $timeout(function() {
          return element.addClass("hide");
        }, 250, false);
        this.bindingEvents("unbind");
        this.opened = null;
        if (options.moduleMethod) {
          element.scope().$destroy();
          element.remove();
        }
        $rootScope.$broadcast("modalWasHidden", id);
        return typeof callback === "function" ? callback() : void 0;
      },
      bindingEvents: function(action) {
        var escapeKeyHandler, options, resizeHandler,
          _this = this;
        if (action == null) {
          action = "bind";
        }
        if (!((action === "bind" || action === "unbind") && (this.opened != null))) {
          return;
        }
        escapeKeyHandler = function(event) {
          if (event.which === keys.ESCAPE) {
            return _this.hide();
          }
        };
        resizeHandler = function(event) {
          return _this.resize();
        };
        options = this.opened.options;
        if (options.keyboard) {
          angular.element(document)[action]("keydown", escapeKeyHandler);
        }
        if (options.resize) {
          return angular.element(window)[action]("resize", resizeHandler);
        }
      },
      register: function(id, element, options) {
        if (this.registered[id] != null) {
          throw new Error("Modal " + id + " already registered");
        }
        this.registered[id] = {
          id: id,
          element: element,
          options: options
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
    open: null,
    topOffset: 20,
    attributes: {}
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

angular.module("Mac").directive("macModal", [
  "$rootScope", "$parse", "modal", "modalViews", "util", function($rootScope, $parse, modal, modalViews, util) {
    return {
      restrict: "E",
      template: "<div ng-click=\"closeOverlay($event)\" class=\"modal-overlay hide\"><div class=\"modal\"><a ng-click=\"modal.hide()\" class=\"close-modal\"></a><div ng-transclude=\"ng-transclude\" class=\"modal-content-wrapper\"></div></div></div>",
      replace: true,
      transclude: true,
      compile: function(element, attrs, transclude) {
        return function($scope, element, attrs) {
          var opts, registerModal;
          opts = util.extendAttributes("macModal", modalViews.defaults, attrs);
          registerModal = function(id) {
            if ((id != null) && id) {
              opts.callback = function() {
                if (opts.open != null) {
                  return $parse(opts.open)($scope);
                }
              };
              return modal.register(id, element, opts);
            }
          };
          $scope.modal = modal;
          $scope.closeOverlay = function($event) {
            if (opts.overlayClose && angular.element($event.target).hasClass("modal-overlay")) {
              return modal.hide();
            }
          };
          if (attrs.id) {
            return registerModal(attrs.id);
          } else {
            return attrs.$observe("macModal", function(id) {
              return registerModal(id);
            });
          }
        };
      }
    };
  }
]).directive("macModal", [
  "$parse", "modal", function($parse, modal) {
    return {
      restrict: "A",
      link: function($scope, element, attrs) {
        if (attrs.macModal) {
          element.bind("click", function() {
            var dataVar, modalScope;
            modalScope = false;
            if ((attrs.macModalScope != null) && attrs.macModalScope) {
              modalScope = $parse(attrs.macModalScope)($scope);
            }
            if (!((modalScope != null) && (modalScope.$new != null))) {
              modalScope = $scope;
            }
            dataVar = attrs.macModalContent || attrs.macModalData;
            return modal.show(attrs.macModal, {
              data: $parse(dataVar)($scope),
              scope: modalScope
            });
          });
        }
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
  "scrollSpy", "scrollSpyDefaults", "util", function(scrollSpy, defaults, util) {
    return {
      link: function($scope, element, attrs) {
        var options, spyElement;
        options = util.extendAttributes("macScrollSpy", defaults, attrs);
        spyElement = element[0].tagName === "BODY" ? angular.element(window) : element;
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
      compile: function(element, attrs) {
        var id, interpolate, observeKey;
        id = attrs.id || attrs.macScrollSpyAnchor;
        observeKey = attrs.id ? "id" : "macScrollSpyAnchor";
        if (!id) {
          throw new Error("Missing scroll spy anchor id");
        }
        interpolate = id.match(/{{(.*)}}/);
        return function($scope, element, attrs) {
          var registering;
          registering = function() {
            if (!id) {
              return;
            }
            scrollSpy.register(id, element);
            return $scope.$on("$destroy", function() {
              return scrollSpy.unregister(id);
            });
          };
          $scope.$on("refresh-scroll-spy", registering);
          if (interpolate) {
            return attrs.$observe(observeKey, function(value) {
              id = value;
              return registering();
            });
          } else {
            return registering();
          }
        };
      }
    };
  }
]).directive("macScrollSpyTarget", [
  "scrollSpy", function(scrollSpy) {
    return {
      compile: function(element, attrs) {
        var highlightClass, interpolate, target;
        target = attrs.macScrollSpyTarget;
        highlightClass = attrs.macScrollSpyTargetClass || "active";
        if (!target) {
          throw new Error("Missing scroll spy target name");
        }
        interpolate = target.match(/{{(.*)}}/);
        return function($scope, element, attrs) {
          var register;
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
            scrollSpy.addListener(callback);
            return $scope.$on("$destroy", function() {
              return scrollSpy.removeListener(callback);
            });
          };
          if (interpolate) {
            return attrs.$observe("macScrollSpyTarget", function(value) {
              return register(value);
            });
          } else {
            return register(target);
          }
        };
      }
    };
  }
]);

/*
@chalk overview
@name mac-affix

@description
Fix the component at a certain position

@param {Expr} mac-affix-disabled To unpin element
@param {Expr} mac-affix-top      Top offset (default 0)
@param {Expr} mac-affix-bottom   Bottom offset (default 0)
*/

angular.module("Mac").directive("macAffix", function() {
  return {
    link: function($scope, element, attrs) {
      var defaults, disabled, getPosition, lastAffix, offset, position, scrollEvent, unpin, windowEl;
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
      position = {
        top: 0,
        left: 0
      };
      disabled = defaults.disabled;
      lastAffix = null;
      unpin = null;
      windowEl = angular.element(window);
      if (attrs.macAffixTop != null) {
        offset.top = $scope.$eval(attrs.macAffixTop) || defaults.top;
        $scope.$watch(attrs.macAffixTop, function(value) {
          if (value != null) {
            return offset.top = value;
          }
        });
      }
      if (attrs.macAffixBottom != null) {
        offset.bottom = $scope.$eval(attrs.macAffixBottom) || defaults.bottom;
        $scope.$watch(attrs.macAffixBottom, function(value) {
          if (value != null) {
            return offset.bottom = value;
          }
        });
      }
      (getPosition = function() {
        return position = element.offset();
      })();
      scrollEvent = function() {
        var affix, scrollHeight, scrollTop;
        if (element[0].offsetHeight <= 0 && element[0].offsetWidth <= 0) {
          return;
        }
        scrollTop = windowEl.scrollTop();
        scrollHeight = angular.element(document).height();
        affix = (unpin != null) && scrollTop + unpin <= position.top ? false : position.top + element.height() >= scrollHeight - offset.bottom ? "bottom" : scrollTop <= offset.top ? "top" : false;
        if (affix === lastAffix) {
          return;
        }
        lastAffix = affix;
        if (unpin) {
          element.css("top", "");
        }
        element.removeClass(defaults.classes).addClass("affix" + (affix ? "-" + affix : ""));
        if (affix === "bottom") {
          unpin = position.top - scrollTop;
          element.css("top", document.body.offsetHeight - offset.bottom - element.height());
        } else {
          unpin = null;
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
      $scope.$on("refresh-mac-affix", getPosition);
      return $scope.$on("$destroy", function() {
        return windowEl.unbind("scroll", scrollEvent);
      });
    }
  };
});

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
        var bar, degree, delay, i, prefixes, styl, vendor, _i;
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
        for (i = _i = 0; _i <= 9; i = ++_i) {
          delay = i * 0.1 - 1 + (!i);
          degree = i * 36;
          styl = {};
          bar = angular.element("<div class=\"bar\"></div>");
          styl[vendor(bar[0], "animation")] = "fade 1s linear infinite " + delay + "s";
          styl[vendor(bar[0], "transform")] = "rotate(" + degree + "deg) translate(0, 130%)";
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
A directive for generating tag input with autocomplete support on text input

@dependencies
- mac-autocomplete
- mac-menu

@param {String}  mac-tag-autocomplete-url         Url to fetch autocomplete dropdown list data
@param {String}  mac-tag-autocomplete-source      List of elements to populate autocomplete
@param {String}  mac-tag-autocomplete-value       The value to be sent back upon selection (default "id")
@param {String}  mac-tag-autocomplete-label       The label to display to the users (default "name")
@param {Expr}    mac-tag-autocomplete-model       Model for autocomplete
@param {Array}   mac-tag-autocomplete-selected    The list of elements selected by the user
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
      template: "<div ng-click=\"focusTextInput()\" class=\"mac-tag-autocomplete\"><ul class=\"tag-list\"><li ng-repeat=\"tag in selected\" class=\"tag label\"><div ng-click=\"selected.splice($index, 1)\" class=\"tag-close\">&times;</div><span class=\"tag-label\">{{getTagLabel(tag)}}</span></li><li ng-class=\"{'fullwidth': !selected.length}\" class=\"tag input-tag\"><mac-autocomplete ng-model=\"textInput\" mac-autocomplete-disabled=\"disabled\" mac-autocomplete-on-select=\"onSelect(selected)\" mac-autocomplete-on-success=\"onSuccess(data)\" mac-placeholder=\"autocompletePlaceholder\" mac-keydown=\"onKeyDown($event)\" class=\"text-input mac-autocomplete\"></mac-autocomplete></li></ul></div>",
      replace: true,
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
        var attrsObject, delay, labelKey, queryKey, textInput, useSource, valueKey;
        valueKey = attrs.macTagAutocompleteValue;
        if (valueKey == null) {
          valueKey = "id";
        }
        labelKey = attrs.macTagAutocompleteLabel;
        if (labelKey == null) {
          labelKey = "name";
        }
        queryKey = attrs.macTagAutocompleteQuery || "q";
        delay = +attrs.macTagAutocompleteDelay || 800;
        useSource = false;
        textInput = angular.element(element[0].getElementsByClassName("mac-autocomplete"));
        attrsObject = {
          "mac-autocomplete-value": valueKey,
          "mac-autocomplete-label": labelKey,
          "mac-autocomplete-query": queryKey,
          "mac-autocomplete-delay": delay
        };
        if (attrs.macTagAutocompleteUrl != null) {
          attrsObject["mac-autocomplete-url"] = "url";
        } else if (attrs.macTagAutocompleteSource != null) {
          useSource = true;
          attrsObject["mac-autocomplete-source"] = "autocompleteSource";
        }
        textInput.attr(attrsObject);
        return function($scope, element, attrs) {
          var updateAutocompleteSource;
          $scope.textInput = "";
          $scope.autocompleteSource = [];
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
              return tag[labelKey];
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
                      var item;
                      item = $scope.textInput;
                      return expression($scope.$parent, {
                        $event: $event,
                        item: item
                      });
                    });
                  });
                })(name, eventFn));
              }
              return _results;
            }
          }, 0);
          updateAutocompleteSource = function() {
            var difference, item, selectedValues, sourceValues, _ref;
            $scope.autocompletePlaceholder = ((_ref = $scope.selected) != null ? _ref.length : void 0) ? "" : $scope.placeholder;
            if (!useSource) {
              return;
            }
            sourceValues = (function() {
              var _i, _len, _ref1, _results;
              _ref1 = $scope.source || [];
              _results = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                item = _ref1[_i];
                _results.push(item[valueKey]);
              }
              return _results;
            })();
            selectedValues = (function() {
              var _i, _len, _ref1, _results;
              _ref1 = $scope.selected || [];
              _results = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                item = _ref1[_i];
                _results.push(item[valueKey]);
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
                if (_ref2 = item[valueKey], __indexOf.call(difference, _ref2) >= 0) {
                  _results.push(item);
                }
              }
              return _results;
            })();
          };
          if (useSource) {
            $scope.$watch("source", updateAutocompleteSource, true);
          }
          $scope.$watch("selected", updateAutocompleteSource, true);
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
                _results.push(item[valueKey]);
              }
              return _results;
            })();
            return (function() {
              var _i, _len, _ref, _ref1, _results;
              _ref = data.data;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                item = _ref[_i];
                if (_ref1 = item[valueKey] || item, __indexOf.call(existingValues, _ref1) < 0) {
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
@name Tag Input
@description
A directive for generating tag input.

@param {String} mac-tag-input-tags         The list of elements to populate the select input
@param {String} mac-tag-input-selected     The list of elements selected by the user
@param {String} mac-tag-input-placeholder  Placeholder text for tag input                    (default "")
@param {String} mac-tag-input-value        The value to be sent back upon selection          (default "id")
@param {String} mac-tag-input-label        The label to display to the users                 (default "name")
*/

angular.module("Mac").directive("macTagInput", [
  function() {
    return {
      restrict: "E",
      template: "<div class=\"mac-tag-input\"><mac-tag-autocomplete mac-tag-autocomplete-source=\"items\" mac-tag-autocomplete-selected=\"selected\" mac-tag-autocomplete-placeholder=\"placeholder\" mac-tag-autocomplete-full-object=\"mac-tag-autocomplete-full-object\" class=\"tag-autocomplete\"></mac-tag-autocomplete></div>",
      transclude: true,
      replace: true,
      scope: {
        selected: "=macTagInputSelected",
        items: "=macTagInputTags"
      },
      compile: function(element, attrs) {
        var textKey, valueKey;
        valueKey = attrs.macTagInputValue || "id";
        textKey = attrs.macTagInputLabel || "name";
        angular.element(element[0].getElementsByClassName("mac-autocomplete")).attr({
          "mac-tag-autocomplete-value": valueKey,
          "mac-tag-autocomplete-label": textKey
        });
        return function($scope, element, attrs) {
          return $scope.placeholder = attrs.macTagInputPlaceholder || "";
        };
      }
    };
  }
]);

/*
@chalk overview
@name Time
@description
A directive for creating a time input field

@param {String} mac-time-model        Assignable angular expression to data-bind to
Clearing model by setting it to null or '' will set model back to default value
@param {String} mac-time-placeholder  Placeholder text of the text input (default --:--)
@param {String} mac-time-disabled     Enable or disable time input
@param {String} mac-time-default      If model is undefined, use this as the starting value (default 12:00 PM)
*/

angular.module("Mac").directive("macTime", [
  "$filter", "$timeout", "util", "keys", function($filter, $timeout, util, keys) {
    return {
      restrict: "E",
      scope: {
        model: "=macTimeModel",
        disabled: "=macTimeDisabled"
      },
      replace: true,
      template: "<div class=\"date-time\"><i class=\"mac-icons mac-icon-time\"></i><input type=\"text\" mac-placeholder=\"placeholder\" maxlength=\"8\" ng-model=\"model\" ng-disabled=\"disabled\" ng-click=\"clickEvent($event)\" mac-blur=\"blurEvent($event)\" mac-keydown=\"keydownEvent($event)\" mac-keyup=\"keyupEvent($event)\" mac-time-input=\"mac-time-input\"/></div>",
      compile: function(element, attrs) {
        var defaults, opts;
        defaults = {
          placeholder: "--:--",
          "default": "12:00 AM"
        };
        opts = util.extendAttributes("macTime", defaults, attrs);
        return function($scope, element, attrs) {
          var getSelection, incrementHour, incrementMinute, initializeTime, inputDOM, selectHours, selectMeridian, selectMinutes, selectNextSection, selectPreviousSection, selectRange, setMeridian, toggleMeridian, updateInput, updateTime;
          $scope.placeholder = opts.placeholder;
          inputDOM = element[0].getElementsByTagName("input")[0];
          (initializeTime = function() {
            var currentDate, time;
            currentDate = new Date().toDateString();
            time = new Date(currentDate + " " + opts["default"]);
            if (isNaN(time.getTime())) {
              time = new Date(currentDate + " " + defaults["default"]);
            }
            return $scope.time = time;
          })();
          getSelection = function() {
            var start;
            start = inputDOM.selectionStart;
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
              return inputDOM.setSelectionRange(start, end);
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
            hours = $scope.time.getHours();
            if (hours >= 12 && meridian === "AM") {
              hours -= 12;
            }
            if (hours < 12 && meridian === "PM") {
              hours += 12;
            }
            return $scope.time.setHours(hours);
          };
          toggleMeridian = function() {
            var hours;
            hours = $scope.time.getHours();
            return $scope.time.setHours((hours + 12) % 24);
          };
          incrementHour = function(change) {
            return $scope.time.setHours($scope.time.getHours() + change);
          };
          incrementMinute = function(change) {
            return $scope.time.setMinutes($scope.time.getMinutes() + change);
          };
          updateInput = function() {
            return $scope.model = $filter("date")($scope.time.getTime(), "hh:mm a");
          };
          updateTime = function() {
            var hours, meridian, minutes, timeMatch;
            if (timeMatch = util.timeRegex.exec($scope.model)) {
              hours = +timeMatch[1];
              minutes = +timeMatch[2];
              meridian = timeMatch[3];
              if (meridian === "PM" && hours !== 12) {
                hours += 12;
              }
              if (meridian === "AM" && hours === 12) {
                hours = 0;
              }
              return $scope.time.setHours(hours, minutes);
            }
          };
          $scope.blurEvent = function(event) {
            return updateInput();
          };
          $scope.clickEvent = function(event) {
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
          };
          $scope.keydownEvent = function(event) {
            var change, key, meridianSelected;
            key = event.which;
            if (key === keys.UP || key === keys.DOWN || key === keys.LEFT || key === keys.RIGHT || key === keys.A || key === keys.P) {
              event.preventDefault();
            }
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
                selectMeridian();
                return updateInput();
            }
          };
          return $scope.keyupEvent = function(event) {
            var key;
            key = event.which;
            if (!((keys.NUMPAD0 <= key && key <= keys.NUMPAD9) || (keys.ZERO <= key && key <= keys.NINE))) {
              event.preventDefault();
            }
            return updateTime();
          };
        };
      }
    };
  }
]);

/*
@name Time Input
@description
An internal directive for mac-time input element to add validator
*/


angular.module("Mac").directive("macTimeInput", [
  "util", function(util) {
    return {
      restrict: "A",
      require: "?ngModel",
      link: function($scope, element, attrs, ctrl) {
        var timeValidator;
        timeValidator = function(value) {
          if (!value || util.timeRegex.exec(value)) {
            ctrl.$setValidity("time", true);
            return value;
          } else {
            ctrl.$setValidity("time", false);
            return void 0;
          }
        };
        ctrl.$formatters.push(timeValidator);
        return ctrl.$parsers.push(timeValidator);
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
        showTip = function(event) {
          var elementSize, offset, tip, tooltipSize;
          if (disabled || !text) {
            return true;
          }
          tip = opts.inside ? element : angular.element(document.body);
          tooltip = angular.element("<div class=\"tooltip " + opts.direction + "\"><div class=\"tooltip-message\">" + text + "</div></div>");
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
        removeTip = function(event) {
          if (tooltip != null) {
            tooltip.removeClass("visible");
            $timeout(function() {
              return tooltip.remove();
            }, 100, false);
          }
          return true;
        };
        toggle = function(event) {
          if (tooltip != null) {
            return removeTip(event);
          } else {
            return showTip(event);
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
                  element.bind("mouseleave click", removeTip);
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
            return removeTip();
          }
        });
      }
    };
  }
]);

})(window, window.angular);