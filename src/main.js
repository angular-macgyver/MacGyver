angular.module("Mac", ["Mac.Util"]);

/**
 * @ngdoc function
 * @name angular.element
 * @module ng
 * @kind function
 *
 * @description
 * Angular comes with jqLite, a tiny, API-compatible subset of jQuery. However, its
 * functionality is very limited and MacGyver extends jqLite to make sure MacGyver
 * components work properly.
 *
 * Most of the code in this file are based on jQuery and modified a little bit to work
 * with MacGyver.
 *
 * Real jQuery will continue to take precedence over jqLite and all functions MacGyver extends.
 *
 * MacGyver adds the following methods:
 * - [height()](http://api.jquery.com/height/) - Does not support set
 * - [width()](http://api.jquery.com/width/) - Does not support set
 * - [outerHeight()](http://api.jquery.com/outerHeight/) - Does not support set
 * - [outerWidth()](http://api.jquery.com/outerWidth/) - Does not support set
 * - [offset()](http://api.jquery.com/offset/)
 * - [position()](http://api.jquery.com/position/)
 * - [scrollTop()](http://api.jquery.com/scrollTop/)
 */

var cssExpand = ["Top", "Right", "Bottom", "Left"],
    core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
    rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i");

function getStyles(element) {
  return window.getComputedStyle(element, null);
}

function isWindow(obj) {
  return obj && obj.document && obj.location && obj.alert && obj.setInterval;
}

function isScope(obj) {
  return obj && (obj.$evalAsync != null) && (obj.$watch != null);
}

// HACK: Add isScope to AngularJS global scope
angular.isScope = isScope;

function getWindow(element) {
  if (isWindow(element)) {
    return element;
  } else {
    return element.nodeType === 9 && element.defaultView;
  }
}

function augmentWidthOrHeight(element, name, extra, isBorderBox, styles) {
  var i, start, val;
  if (extra === (isBorderBox ? "border" : "content")) {
    return 0;
  }
  val = 0;
  start = name === "Width" ? 1 : 0;
  for (i = start; i <= 3; i += 2) {
    if (extra === "margin") {
      val += parseFloat(styles["" + extra + cssExpand[i]] || 0);
    }
    if (isBorderBox) {
      if (extra === "content") {
        val -= parseFloat(styles["padding" + cssExpand[i]] || 0);
      }
      if (extra !== "margin") {
        val -= parseFloat(styles["border" + cssExpand[i]] || 0);
      }
    } else {
      val += parseFloat(styles["padding" + cssExpand[i]] || 0);
      if (extra !== "padding") {
        val += parseFloat(styles["border" + cssExpand + "Width"] || 0);
      }
    }
  }
  return val;
}

function getWidthOrHeight(type, prefix, element) {
  return function(margin) {
    var defaultExtra, doc, extra, isBorderBox, name, styles, value, valueIsBorderBox;

    switch (prefix) {
      case 'inner':
        defaultExtra = 'padding';
        break;
      case 'outer':
        defaultExtra = '';
        break;
      default:
        defaultExtra = 'content';
    }
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
}

function getOffsetParent(element) {
  var parent = element.parentNode;
  while (parent && parent.style['position'] === 'static') {
    parent = parent.parentNode;
  }

  return parent || document.documentElement;
}

var jqLiteExtend = {
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
    var rect, doc, win, docElem;

    // Support: IE<=11+
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if (!element.getClientRects().length) {
			return { top: 0, left: 0 };
		}

    rect = element.getBoundingClientRect();

    if (rect.width || rect.height) {
      doc = element.ownerDocument;
      win = getWindow(doc);
      docElem = doc.documentElement;

      return {
        top: rect.top + win.pageYOffset - docElem.clientTop,
        left: rect.left + win.pageXOffset - docElem.clientLeft
      };
    }

    return rect;
  },
  position: function (element) {
    var offsetParent, offset, parentOffset = {
      top: 0,
      left: 0
    };

    if (element.style['position'] === 'fixed') {
      offset = element.getBoundingClientRect();
    } else {
      offsetParent = getOffsetParent(element);

      offset = jqLiteExtend.offset(element);
      if (offsetParent.nodeName !== 'HTML') {
        parentOffset = jqLiteExtend.offset(offsetParent);
      }

      parentOffset.top += offsetParent['scrollTop'];
      parentOffset.left += offsetParent['scrollLeft'];
    }

    return {
      top: offset.top - parentOffset.top - element.style['marginTop'],
      left: offset.left - parentOffset.left - element.style['marginLeft']
    }
  },
  scrollTop: function(element, value) {
    var win = getWindow(element);
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
    var win = getWindow(element);
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

(function () {
  var jqLite = angular.element;
  if ((window.jQuery != null) && (angular.element.prototype.offset != null)) {
    return;
  }
  return angular.forEach(jqLiteExtend, function(fn, name) {
    return jqLite.prototype[name] = function(arg1, arg2) {
      if (this.length) {
        return fn(this[0], arg1, arg2);
      }
    };
  });
})();
