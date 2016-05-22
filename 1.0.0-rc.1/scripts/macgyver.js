/**
 * MacGyver v1.0.0-rc.1
 * @link http://angular-macgyver.github.io/MacGyver
 * @license 
 */
(function(window, angular, undefined) {
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

/* jshint multistr: true */

angular.module('Mac').
/**
 * @ngdoc constant
 * @name macTooltipDefaults
 * @description
 * Default values for mac-tooltip
 */
constant('macTooltipDefaults', {
  direction: 'top',
  trigger: 'hover',
  inside: false,
  class: 'visible'
}).

/**
 * @ngdoc constant
 * @name macTimeDefaults
 * @description
 * Default values for mac-time
 */
constant('macTimeDefaults', {
  default: '12:00 AM',
  placeholder: '--:--'
}).

/**
 * @ngdoc constant
 * @name scrollSpyDefaults
 * @description
 * Default values for mac-scroll-spy
 */
constant('scrollSpyDefaults', {
  offset: 0,
  highlightClass: 'active'
}).

/**
 * @ngdoc constant
 * @name macPopoverDefaults
 * @description
 * Default values for mac-popover
 */
constant('macPopoverDefaults', {
  trigger: {
    offsetY: 0,
    offsetX: 0,
    trigger: 'click',
    container: null
  },
  element: {
    footer: false,
    header: false,
    title: '',
    direction: 'above left'
  },
  template: "<div class='mac-popover' ng-class='macPopoverClasses'>\
    <div class='tip'></div>\
    <div class='popover-header'>\
      <div class='title'>{{macPopoverTitle}}</div>\
    </div>\
    <div mac-popover-fill-content></div>\
  </div>"
}).

/**
 * @ngdoc constant
 * @name macModalDefaults
 * @description
 * Default values for mac-modal
 */
constant('macModalDefaults', {
  keyboard: false,
  overlayClose: false,
  resize: false,
  position: true,
  open: angular.noop,
  topOffset: 20,
  attributes: {},
  beforeShow: angular.noop,
  afterShow: angular.noop,
  beforeHide: angular.noop,
  afterHide: angular.noop,
  template: "<div class='mac-modal-overlay'>\
    <div class='mac-modal'>\
      <a mac-modal-close class='mac-close-modal'></a>\
      <div class='mac-modal-content-wrapper'></div>\
    </div>\
  </div>"
}).

/**
 * @ngdoc constant
 * @name macAffixDefaults
 * @description
 * Default values for mac-affix
 */
constant('macAffixDefaults', {
  top: 0,
  bottom: 0,
  disabled: false,
  classes: "affix affix-top affix-bottom"
});

/**
 * Controller for affix directive
 */

/**
 * @param {Element} $element Affix directive element
 * @param {$document} $document
 * @param {$window} $window
 * @param {Object} defaults Affix default values
 * @constructor
 */
function MacAffixController ($element, $document, $window, defaults) {
  this.$document = $document;
  this.defaults = defaults;

  this.$element = $element;

  this.offset = {
    top: defaults.top,
    bottom: defaults.bottom
  };

  this.windowEl = angular.element($window);

  this.disabled = defaults.disabled;

  this.lastAffix = null;
  this.unpin = null;
  this.pinnedOffset = null;
}

/**
 * Update to or bottom offset. This function make sure the value is an integer
 * or use default values
 * @param {String} key Offset key
 * @param {String|Integer} value Update value
 * @param {Boolean} useDefault
 */
MacAffixController.prototype.updateOffset = function (key, value, useDefault) {
  // Don't do anything if changing invalid key
  if (key !== 'top' && key !== 'bottom') {
    return;
  }

  if (!!useDefault && value ===  null) {
    value = this.defaults[key];
  }

  if (value !== null && !isNaN(+value)) {
    this.offset[key] = +value;
  }
}

MacAffixController.prototype.scrollEvent = function () {
  // Check if element is visible
  if (this.$element[0].offsetHeight <= 0 && this.$element[0].offsetWidth <= 0) {
    return;
  }

  var scrollTop = this.windowEl.scrollTop();
  var scrollHeight = this.$document.height();
  var elementHeight = this.$element.outerHeight();
  var affix;

  if (this.unpin !== null && scrollTop <= this.unpin) {
    affix = false;
  } else if (this.offset.bottom !==  null && scrollTop > scrollHeight - elementHeight - this.offset.bottom) {
    affix = 'bottom';
  } else if (this.offset.top !== null && scrollTop <= this.offset.top) {
    affix = 'top';
  } else {
    affix = false;
  }

  if (affix === this.lastAffix) return;
  if (this.unpin) {
    this.$element.css('top', '');
  }

  this.lastAffix = affix;

  if (affix === 'bottom') {
    if (this.pinnedOffset !== null) {
      this.unpin = this.pinnedOffset;
    }

    this.$element
      .removeClass(this.defaults.classes)
      .addClass('affix');
    this.pinnedOffset = this.$document.height() - this.$element.outerHeight() - this.offset.bottom;
    this.unpin = this.pinnedOffset;

  } else {
    this.unpin =  null;
  }

  this.$element
    .removeClass(this.defaults.classes)
    .addClass('affix' + (affix ? '-' + affix : ''));

  // Look into merging this with the move if block
  if (affix === 'bottom') {
    var curOffset = this.$element.offset();
    this.$element.css('top', this.unpin - curOffset.top);
  }

  return true;
}

MacAffixController.prototype.setDisabled = function (newValue) {
  this.disabled = newValue || this.defaults.disabled;

  if (this.disabled) {
    this.reset();
  } else {
    this.scrollEvent();
  }

  return this.disabled;
}

MacAffixController.prototype.reset = function () {
  // clear all styles and reset affix element
  this.lastAffix = null;
  this.unpin = null;

  this.$element
    .css('top', '')
    .removeClass(this.defaults.classes);
}

angular.module('Mac')
.controller('MacAffixController', [
  '$element',
  '$document',
  '$window',
  'macAffixDefaults',
  MacAffixController
]);

/**
 * Controller for autocomplete directive
 */

/**
 * @param {$scope} $scope Autocomplete directive scope
 * @param {Element} $element Autocomplete directive element
 * @param {$compile.directive.Attributes} $attrs Directive attributes
 * @param {$animate} $animate
 * @param {$timeout} $timeout
 * @param {$q} $q
 * @param {$filter} $filter
 * @param {$parse} $parse
 * @param {Object} keys
 * @param {$compile} $compile
 * @param {$http} $http
 * @constructor
 */
function MacAutocompleteController ($scope, $element, $attrs, $animate, $timeout, $q, $filter, $parse, keys, $compile, $http) {
  this.$scope = $scope;
  this.$element = $element;
  this.$attrs = $attrs;
  this.$animate = $animate;
  this.$timeout = $timeout;
  this.$q = $q;
  this.$filter = $filter;
  this.$parse = $parse;
  this.keys = keys;
  this.$compile = $compile;
  this.$http = $http;

  this.currentAutocompleteData = [];

  // NOTE: preventParser is used to prevent parser from firing when an item
  // is selected in the menu
  this.preventParser = false;

  this.isMenuAppended = false;

  this.inside = !!this.$attrs.macAutocompleteInside;

  /**
   * Timeout promise for delaying query request
   * @type {Promise}
   */
  this.timeoutPromise = null;

  /**
   * Promise passed to $http options as timeout for canceling the request
   * when necessary
   * @type {Promise}
   */
  this.previousPromise = null;

  /** @type {$scope} */
  this.$menuScope = null;

  /**
   * Element reference to autocomplete menu
   * @type {Element}
   */
  this.menuEl = null;

  this.$scope.$on("reset-mac-autocomplete", function (scope) {
    scope.macAutocomplete.reset();
  });
}

/**
 * Initialize menu component
 * @param {Controller} ngModelCtrl Controller of ngModel directive
 * @param {Function} transcludeFn Transclude function of autocomplete directive
 */
MacAutocompleteController.prototype.initializeMenu = function (ngModelCtrl, transcludeFn) {
  this._createMenuScope(ngModelCtrl);
  this._createMenuElement(transcludeFn);
}

/**
 */
MacAutocompleteController.prototype.blurHandler = function () {
  this.$scope.$apply(function (scope) {
    scope.macAutocomplete.reset();
  });
};

/**
 * Create a keydown handler function
 * @param {Event} event Keydown event
 * @return {boolean}
 */
MacAutocompleteController.prototype.keydownHandler = function (event) {
  // No action when menu is not showing
  if (this.$menuScope.items.length === 0) {
    return true;
  }

  switch (event.which) {
    case this.keys.DOWN:
      this.$scope.$apply(function (scope) {
        var menuScope = scope.macAutocomplete.$menuScope;
        menuScope.index = (menuScope.index + 1) % menuScope.items.length;
        event.preventDefault();
      });
      break;
    case this.keys.UP:
      this.$scope.$apply(function (scope) {
        var menuScope = scope.macAutocomplete.$menuScope;
        menuScope.index = (menuScope.index ? menuScope.index : menuScope.items.length) - 1
        event.preventDefault();
      });
      break;
    case this.keys.ENTER:
      this.$scope.$apply(function (scope) {
        scope.macAutocomplete.$menuScope.select();

        // Prevent event from propagating up and possibly causing a form
        // submission.
        event.preventDefault();
      });
      break;
    case this.keys.ESCAPE:
      this.$scope.$apply(function (scope) {
        scope.macAutocomplete.reset();
        event.preventDefault();
      });
      break;
  }
  return true;
}

MacAutocompleteController.prototype.reset = function () {
  var self = this;
  this.$animate.leave(this.menuEl).then(function () {
    self.$menuScope.index = 0;
    self.$menuScope.items.length = 0;

    self.currentAutocompleteData.length = 0;

    // Clear menu element inline system
    self.menuEl[0].style.top = "";
    self.menuEl[0].style.left = "";

    self.isMenuAppended = false;

    self.$element.unbind('blur');
  });
};

/**
 * Generate a new scope for the menu element
 * @param {Controller} ngModelCtrl
 * @returns {Scope}
 * @private
 */
MacAutocompleteController.prototype._createMenuScope = function (ngModelCtrl) {
  this.$menuScope = this.$scope.$new();
  this.$menuScope.items = [];
  this.$menuScope.index = 0;
  this.$menuScope.class = this.class;
  this.$menuScope.$macAutocompleteCtrl = this;

  this.$menuScope.select = function (index) {
    if (typeof index == 'undefined') {
      index = this.index;
    }

    var selected = this.$macAutocompleteCtrl.currentAutocompleteData[index];
    if (selected) {
      this.$macAutocompleteCtrl.onSelect({selected: selected});
    }

    if (ngModelCtrl) {
      var label = this.items[index].label || '';
      this.$macAutocompleteCtrl.preventParser = true;

      ngModelCtrl.$setViewValue(label);
      ngModelCtrl.$render();
    }

    this.$macAutocompleteCtrl.reset();
  }

  this.$scope.$on("$destroy", function (scope) {
    scope.macAutocomplete.$menuScope.$destroy();
  });

  return this.$menuScope;
}

/**
 * Create a menu element and transclude content
 * @param {Function} transclude
 * @return {Element}
 * @private
 */
MacAutocompleteController.prototype._createMenuElement = function (transclude) {
  var self = this;
  this.menuEl = angular.element(document.createElement('mac-menu'));
  this.menuEl.attr({
    'ng-class': 'class',
    'mac-menu-items': 'items',
    'mac-menu-select': 'select(index)',
    'mac-menu-index': 'index'
  });

  // Transclude the inner content with menuScope and append it into menu
  transclude(this.$menuScope, function (clone) {
    self.menuEl.append(clone);
  });

  // Precompile menu elemnt
  return this.$compile(this.menuEl)(this.$menuScope);
}

/**
 * Parser function to pass into ngModel controller
 * @param {string} value
 * @return {string} Updated value. In this case, it's the same value as the parameter
 */
MacAutocompleteController.prototype.parser = function (value) {
  // NOTE: If value is more than an empty string,
  // autocomplete is enabled and not 'onSelect' cycle
  if (value && !this.disabled && !this.preventParser) {
    if (this.timeoutPromise) {
      this.$timeout.cancel(this.timeoutPromise);
      this.$timeoutPromise = null;
    }

    var delay = this._getDelay();

    if (delay > 0) {
      var self = this;
      this.timeoutPromise = this.$timeout(function () {
        self.queryData(value);
      }, delay);
    } else {
      this.queryData(value);
    }
  } else {
    this.reset();
  }

  this.preventParser = false;

  return value;
}

/**
 * Update list of items getting passed to menu
 * @param {Array} data Array of data
 */
MacAutocompleteController.prototype.updateItem = function (data) {
  var labelKey = this.$attrs.macAutocompleteLabel || 'name';
  var labelGetter = this.$parse(labelKey);
  var self = this;

  if (data && data.length > 0) {
    this.currentAutocompleteData = data;

    this.$menuScope.items = data.map(function (item) {
      if (angular.isObject(item)) {
        if (!item.value) {
          item.value = labelGetter(item) || '';
        }
        if (!item.label) {
          item.label = labelGetter(item) || '';
        }
        return item;
      } else {
        return {
          label: item,
          value: item
        };
      }
    }, this)

    this.appendMenu().then(function () {
      return self.positionMenu();
    });
  } else {
    this.reset();
  }
}

/**
 * Append menu to DOM and bind handlers
 */
MacAutocompleteController.prototype.appendMenu = function () {
  var self = this;
  if (!this.isMenuAppended) {
    this.$element.bind('blur', function () {
      return self.blurHandler();
    });

    // Bind mousedown even to prevent blurwhen clicking in menu
    this.menuEl.on('mousedown', function (event) {
      event.preventDefault();
    });
  }

  this.isMenuAppended = true;

  // Hide the element from view when calculating offset
  this.menuEl[0].style.visibility = 'hidden';

  if (this.inside) {
    return this.$animate.enter(this.menuEl, undefined, this.$element);
  } else {
    return this.$animate.enter(this.menuEl, angular.element(document.body));
  }
}

/**
 * Calculate the style include position and width for menu
 */
MacAutocompleteController.prototype.positionMenu = function () {
  var offset = this.$element.offset();
  offset.top += this.$element.outerHeight();
  offset.minWidth = this.$element.outerWidth();

  // Add 'px' to left and top
  angular.forEach(offset, function (value, key) {
    if (!isNaN(+value) && angular.isNumber(+value)) {
      value = value + "px";
    }

    this.menuEl[0].style[key] = value;
  }, this);

  // Show dropdown when positioned correctly
  this.menuEl[0].style.visibility = 'visible';
}

/**
 * GET request to fetch data from server, update menu items and position menu
 * @param {String} url URL to fetch data from
 * @param {String} query Search query
 * @returns {Promise}
 */
MacAutocompleteController.prototype.getData = function (url, query) {
  var options = {
    method: "GET",
    url: url,
    params: {}
  };
  var self = this;
  var queryKey = this.queryKey || 'q';

  if (query) {
    options.params[queryKey] = query;

    if (this.previousPromise) {
      this.previousPromise.resolve();
    }

    this.previousPromise = this.$q.defer();
    options.timeout = this.previousPromise.promise;

    return this.$http(options)
      .success(function (data, status, headers) {
        var dataList = self.onSuccess({
          data: data,
          status: status,
          headers: headers
        });

        if (!dataList) {
          dataList = data.data;
        }

        self.updateItem(dataList);
      })
      .error(function (data, status, headers) {
        self.onError({
          data: data,
          status: status,
          headers: headers
        });
      });
  }

  return this.$q.when();
}

/**
 * Used for querying data
 * @param {String} query Search query
 * @returns {Promise|*}
 */
MacAutocompleteController.prototype.queryData = function (query) {
  var self = this;
  if (angular.isArray(this.source)) {
    return this.updateItem(this.$filter('filter')(this.source, query));
  } else if (angular.isString(this.source)) {
    return this.getData(this.source, query);
  } else if (angular.isFunction(this.source)) {
    return this.source(query, function (data) {
      self.updateItem(data);
    });
  }
}

MacAutocompleteController.prototype._getDelay = function () {
  return isNaN(+this.delay) ? 800 : +this.delay;
}

angular.module('Mac')
.controller('MacAutocompleteController', [
  '$scope',
  '$element',
  '$attrs',
  '$animate',
  '$timeout',
  '$q',
  '$filter',
  '$parse',
  'keys',
  '$compile',
  '$http',
  MacAutocompleteController]);

/**
 * Controller for tag autocomplete directive
 */

/**
 * @param {$scope} $scope
 * @constructor
 */
function MacTagAutocompleteController ($scope, $element, $attrs, $parse, $timeout, keys) {
  this.$scope = $scope;
  this.$element = $element;
  this.$attrs = $attrs;

  this.$parse = $parse;
  this.$timeout = $timeout;
  this.keys = keys;

  this.textInput = '';

  this.labelKey = this.labelKey != undefined ? this.labelKey : 'name';
  this.labelGetter = $parse(this.labelKey);
}

/**
 * Callback function on autocomplete keydown. The function especially
 * handles 2 cases,
 * - pressing BACKSPACE: Remove the last selected item
 * - pressing ENTER: If autocomplete is disabled, take the current input
 *                   and tokenify the value
 * Invoke macAutocompleteOnKeydown afterwards
 *
 * @param {Event} $event
 * @return {boolean} true
 */
MacTagAutocompleteController.prototype.onKeyDown = function ($event) {
  var stroke = $event.which || $event.keyCode;
  switch(stroke) {
    case this.keys.BACKSPACE:
      if (!this.$scope.textInput && angular.isArray(this.selected)) {
        this.selected.pop();
      }
      break;
    case this.keys.ENTER:
      // Used when autocomplete is not needed
      if (this.textInput && this.disabled) {
        this.onSelect(this.textInput);
      }
      break;
  }

  this.onKeydownFn({
    $event: $event,
    value: this.textInput
  });

  return true;
}

/**
 * Callback function when macAutocomplete made a successful xhr request
 * Default to `data.data` if function doesn't exist
 *
 * @param {Object} data
 * @return {Object}
 */
MacTagAutocompleteController.prototype.onSuccess = function (data, status, headers) {
  var result = data.data;

  if (this.$attrs['macTagAutocompleteOnSuccess']) {
    result = this.onSuccessFn({
      data: data,
      status: status,
      headers: headers
    });
  }
  return result;
}

/**
 * Callback function when user select an item from menu or pressed enter
 * User can specify macTagAutocompleteOnEnter function to modify item before
 * pushing into `selected` array
 * This function will also clear the text in autocomplete
 *
 * @param {Object} item
 */
MacTagAutocompleteController.prototype.onSelect = function (item) {
  if (this.$attrs['macTagAutocompleteOnEnter']) {
    item = this.onEnterFn({item: item});
  }

  if (item && angular.isArray(this.selected)) {
    this.selected.push(item);
  }

  // NOTE: $timeout is added to allow user to access the model before
  // clearing value in autocomplete
  var ctrl = this;
  this.$timeout(function () {
    ctrl.textInput = '';
  }, 0);
}

/**
 * If a label attr is specified, convert the tag object into string
 * for display
 *
 * @param {Object} tag
 * @return {string}
 */
MacTagAutocompleteController.prototype.getTagLabel = function (tag) {
  return this.labelKey ? this.labelGetter(tag) : tag;
};

angular.module('Mac')
.controller('MacTagAutocompleteController', [
  '$scope',
  '$element',
  '$attrs',
  '$parse',
  '$timeout',
  'keys',
  MacTagAutocompleteController]);

/**
 * @ngdoc directive
 * @name macAffix
 *
 * @restrict EAC
 *
 * @description
 * Fix the component at a certain position
 *
 * @param {Expr} mac-affix-disabled To unpin element (default false)
 * @param {Expr} mac-affix-top      Top offset (default 0)
 * @param {Expr} mac-affix-bottom   Bottom offset (default 0)
 * @param {Event} refresh-mac-affix To update the position of affixed element
 *
 * @example
<div mac-affix>Nav content</div>
 */

angular.module('Mac').directive('macAffix', ['$window', function($window) {
  return {
    require: 'macAffix',
    bindToController: true,
    controllerAs: 'macAffix',
    controller: 'MacAffixController',
    link: function($scope, element, attrs, macAffixCtrl) {
      var scrollEventWrapper = function () {
        macAffixCtrl.scrollEvent();
      }
      var windowEl = angular.element($window);

      if (attrs.macAffixTop !== null) {
        macAffixCtrl.updateOffset('top', $scope.$eval(attrs.macAffixTop), true);
        $scope.$watch(attrs.macAffixTop, function(value) {
          macAffixCtrl.updateOffset('top', value);
        });
      }

      if (attrs.macAffixBottom !== null) {
        macAffixCtrl.updateOffset('bottom', $scope.$eval(attrs.macAffixBottom), true);
        $scope.$watch(attrs.macAffixBottom, function(value) {
          macAffixCtrl.updateOffset('bottom', value);
        });
      }

      if (attrs.macAffixDisabled) {
        macAffixCtrl.setDisabled($scope.$eval(attrs.macAffixDisabled));

        $scope.$watch(attrs.macAffixDisabled, function (value) {
          if (value === null || value === macAffixCtrl.disabled) return;

          macAffixCtrl.setDisabled(value);

          var action = value ? 'unbind' : 'bind';
          windowEl[action]('scroll', scrollEventWrapper);
        });
      }

      if (!macAffixCtrl.disabled) {
        windowEl.bind('scroll', scrollEventWrapper);
      }

      $scope.$on('refresh-mac-affix', function () {
        macAffixCtrl.scrollEvent();
      });

      $scope.$on('$destroy', function () {
        windowEl.unbind('scroll', scrollEventWrapper);
      });
    }
  };
}]);

/**
 * @ngdoc directive
 * @name macAutocomplete
 * @description
 * A directive for providing suggestions while typing into the field
 *
 * Autocomplete allows for custom html templating in the dropdown and some properties are exposed on the local scope on each template instance, including:
 *
 * | Variable  | Type    | Details                                                                     |
 * |-----------|---------|-----------------------------------------------------------------------------|
 * | `$index`  | Number  | iterator offset of the repeated element (0..length-1)                       |
 * | `$first`  | Boolean | true if the repeated element is first in the iterator.                      |
 * | `$middle` | Boolean | true if the repeated element is between the first and last in the iterator. |
 * | `$last`   | Boolean | true if the repeated element is last in the iterator.                       |
 * | `$even`   | Boolean | true if the iterator position `$index` is even (otherwise false).           |
 * | `$odd`    | Boolean | true if the iterator position `$index` is odd (otherwise false).            |
 * | `item`    | Object  | item object with `value` and `label` if label-key is set                    |
 *
 * To use custom templating
 *
 * ```
 * <mac-autocomplete mac-autocomplete-url="someUrl" ng-model="model">
 *   <span> {{item.label}} </span>
 * </mac-autocomplete>
 * ```
 *
 * Template default to `{{item.label}}` if not defined
 *
 * @param {String} ng-model Assignable angular expression to data-bind to (required)
 * @param {String} mac-placeholder Placeholder text
 * @param {Expression} mac-autocomplete-source Data to use.
 * Source support multiple types:
 * - Array: An array can be used for local data and there are two supported formats:
 *   - An array of strings: ["Item1", "Item2"]
 *   - An array of objects with mac-autocomplete-label key: [{name:"Item1"}, {name:"Item2"}]
 * - String: Using a string as the source is the same as passing the variable into mac-autocomplete-url
 * - Function: A callback when querying for data. The callback receive two arguments:
 *   - {String} Value currently in the text input
 *   - {Function} A response callback which expects a single argument, data to user. The data will be
 *   populated on the menu and the menu will adjust accordingly
 * @param {Boolean} mac-autocomplete-disabled Boolean value if autocomplete should be disabled
 * @param {Function} mac-autocomplete-on-select Function called when user select on an item
 * - `selected` - {Object} The item selected
 * @param {Function} mac-autocomplete-on-success function called on success ajax request
 * - `data` - {Object} Data returned from the request
 * - `status` - {Number} The status code of the response
 * - `header` - {Object} Header of the response
 * @param {Function} mac-autocomplete-on-error Function called on ajax request error
 * - `data` - {Object} Data returned from the request
 * - `status` - {Number} The status code of the response
 * - `header` - {Object} Header of the response
 * @param {String}  mac-autocomplete-label The label to display to the users (default "name")
 * @param {String}  mac-autocomplete-query The query parameter on GET command (default "q")
 * @param {Integer} mac-autocomplete-delay Delay on fetching autocomplete data after keyup (default 800)
 *
 * @param {Expr} mac-menu-class Classes for mac-menu used by mac-autocomplete. For more info, check [ngClass](http://docs.angularjs.org/api/ng/directive/ngClass)
 *
 * @example
<caption>Basic setup</caption>
<example>
  <mac-autocomplete
    mac-autocomplete-source = "autocompleteUrl"
    mac-autocomplete-query = "q"
    mac-autocomplete-on-success = "onSuccess(data)"
    mac-placeholder = "'Autocomplete'"
    ng-model = "autocompleteQuery"
  ></mac-autocomplete>
</example>
<mac-autocomplete
  mac-autocomplete-source = "autocompleteUrl"
  mac-autocomplete-query = "q"
  mac-autocomplete-on-success = "onSuccess(data)"
  mac-placeholder = "'Autocomplete'"
  ng-model = "autocompleteQuery"
></mac-autocomplete>
 *
 * @example
<caption>Example with autocomplete using source</caption>
<example>
  <mac-autocomplete
    mac-autocomplete-source = "['hello', 'world']"
    mac-placeholder = "'Type something...'"
    ng-model = "autocompleteSourceQuery"
  ></mac-autocomplete>
</example>
<mac-autocomplete
  mac-autocomplete-source = "['hello', 'world']"
  mac-placeholder = "'Type something...'"
  ng-model = "autocompleteSourceQuery"
></mac-autocomplete>
 *
 */

angular.module('Mac')
.directive('macAutocomplete', [
  function () {
    return {
      restrict: 'EA',
      template: '<input type="text">',
      transclude: true,
      replace: true,
      require: ['ngModel', 'macAutocomplete'],
      bindToController: true,
      controllerAs: 'macAutocomplete',
      controller: 'MacAutocompleteController',
      scope: {
        onSelect: '&macAutocompleteOnSelect',
        onSuccess: '&macAutocompleteOnSuccess',
        onError: '&macAutocompleteOnError',
        source: '=macAutocompleteSource',
        disabled: '=?macAutocompleteDisabled',
        queryKey: '@macAutocompleteQuery',
        delay: '@macAutocompleteDelay',
        class: '=macMenuClass'
      },
      link: function ($scope, element, attrs, ctrls, transclude) {
        var ngModelCtrl = ctrls[0],
            macAutocompleteCtrl = ctrls[1];

        macAutocompleteCtrl.initializeMenu(ngModelCtrl, transclude);
        ngModelCtrl.$parsers.push(function(value) {
          return macAutocompleteCtrl.parser(value);
        });
        element.bind('keydown', function (event) {
          return macAutocompleteCtrl.keydownHandler(event);
        });
      }
    };
  }
]);

/**
 * @ngdoc directive
 * @name macKeydownEnter
 *
 * @description
 * macKeydownEnter allows you to specify custom behavior when pressing
 * enter in an input
 *
 * @param {expression} macKeydownEnter To evaluate on hitting enter
 *
 * @example
<example>
  <input type="text" mac-keydown-enter = "eventKeydown = 'enter'" />
  <div>Key pressed: {{eventKeydown}}</div>
</example>
<input type="text" mac-keydown-enter = "eventKeydown = 'enter'" />
 */

/**
 * @ngdoc directive
 * @name macKeydownEscape
 *
 * @description
 * macKeydownEscape allows you to specify custom behavior when pressing
 * escape in an input
 *
 * @param {expression} macKeydownEscape To evaluate on hitting escape
 *
 * @example
<example>
  <input type="text" mac-keydown-escape = "eventKeydown = 'escape'" />
  <div>Key pressed: {{eventKeydown}}</div>
</example>
<input type="text" mac-keydown-escape = "eventKeydown = 'escape'" />
 */

/**
 * @ngdoc directive
 * @name macKeydownSpace
 *
 * @description
 * macKeydownSpace allows you to specify custom behavior when pressing
 * space in an input
 *
 * @param {expression} macKeydownSpace To evaluate on hitting space
 *
 * @example
<example>
  <input type="text" mac-keydown-space = "eventKeydown = 'space'" />
  <div>Key pressed: {{eventKeydown}}</div>
</example>
<input type="text" mac-keydown-space = "eventKeydown = 'space'" />
 */

/**
 * @ngdoc directive
 * @name macKeydownLeft
 *
 * @description
 * macKeydownLeft allows you to specify custom behavior when pressing
 * left in an input
 *
 * @param {expression} macKeydownLeft To evaluate on hitting left
 *
 * @example
<example>
  <input type="text" mac-keydown-left = "eventKeydown = 'left'" />
  <div>Key pressed: {{eventKeydown}}</div>
</example>
<input type="text" mac-keydown-left = "eventKeydown = 'left'" />
 */

/**
 * @ngdoc directive
 * @name macKeydownUp
 *
 * @description
 * macKeydownUp allows you to specify custom behavior when pressing
 * up in an input
 *
 * @param {expression} macKeydownUp To evaluate on hitting up
 *
 * @example
<example>
  <input type="text" mac-keydown-up = "eventKeydown = 'up'" />
  <div>Key pressed: {{eventKeydown}}</div>
</example>
<input type="text" mac-keydown-up = "eventKeydown = 'up'" />
 */

/**
 * @ngdoc directive
 * @name macKeydownRight
 *
 * @description
 * macKeydownRight allows you to specify custom behavior when pressing
 * right in an input
 *
 * @param {expression} macKeydownRight To evaluate on hitting right
 *
 * @example
<example>
  <input type="text" mac-keydown-right = "eventKeydown = 'right'" />
  <div>Key pressed: {{eventKeydown}}</div>
</example>
<input type="text" mac-keydown-right = "eventKeydown = 'right'" />
 */

/**
 * @ngdoc directive
 * @name macKeydownDown
 *
 * @description
 * macKeydownDown allows you to specify custom behavior when pressing
 * down in an input
 *
 * @param {expression} macKeydownDown To evaluate on hitting down
 *
 * @example
<example>
  <input type="text" mac-keydown-down = "eventKeydown = 'down'" />
  <div>Key pressed: {{eventKeydown}}</div>
</example>
<input type="text" mac-keydown-down = "eventKeydown = 'down'" />
 */

/**
 *
 * A directive for handling certain keys on keydown event
 * Currently MacGyver supports enter, escape, space, left, up, right and down
 *
 * @param {Expression} mac-keydown-enter  Expression
 * @param {Expression} mac-keydown-escape Expression to evaluate on hitting escape
 * @param {Expression} mac-keydown-space  Expression to evaluate on hitting space
 * @param {Expression} mac-keydown-left   Expression to evaluate on hitting left
 * @param {Expression} mac-keydown-up     Expression to evaluate on hitting up
 * @param {Expression} mac-keydown-right  Expression to evaluate on hitting right
 * @param {Expression} mac-keydown-down   Expression to evaluate on hitting down
 * @private
 */
function keydownFactory (key) {
  var name = 'macKeydown' + key;
  angular.module('Mac').directive(name, ['$parse', 'keys', function($parse, keys) {
    return {
      restrict: 'A',
      link: function($scope, element, attributes) {
        var expr = $parse(attributes[name]);
        element.bind('keydown', function($event) {
          if ($event.which === keys[key.toUpperCase()]) {
            $event.preventDefault();
            $scope.$apply(function() {
              expr($scope, {$event: $event});
            });
          }
        });
      }
    }
  }]);
}

var keydownKeys = ['Enter', 'Escape', 'Space', 'Left', 'Up', 'Right', 'Down'];
keydownKeys.forEach(keydownFactory);

/**
 * @ngdoc directive
 * @name macPauseTyping
 *
 * @description
 * macPauseTyping directive allow user to specify custom behavior after user stops typing for more than (delay) milliseconds
 *
 * @param {expression} mac-pause-typing       Expression to evaluate after delay
 * @param {expression} mac-pause-typing-delay Delay value to evaluate expression (default 800)
 *
 * @example
<example>
  <input type="text" mac-pause-typing="afterPausing($event)" />
  <div>value: {{pauseTypingModel}}</div>
</example>
<input type="text" mac-pause-typing="afterPausing($event)" />
 */

angular.module('Mac').directive('macPauseTyping', ['$parse', '$timeout', function($parse, $timeout) {
  return {
    restrict: 'A',
    link: function($scope, element, attrs) {
      var expr = $parse(attrs.macPauseTyping),
         delay = $scope.$eval(attrs.macPauseTypingDelay) || 800,
         keyupTimer;

      element.bind('keyup', function($event) {
        if(keyupTimer) {
          $timeout.cancel(keyupTimer);
        }

        keyupTimer = $timeout(function() {
          expr($scope, {$event: $event});
        }, delay);
      });
    }
  };
}]);

/**
 * @ngdoc directive
 * @name macWindowResize
 *
 * @description
 * Binding custom behavior on window resize event
 *
 * @param {expression} mac-window-resize Expression to evaluate on window resize
 *
 * @example`
<example>
  <div mac-window-resize="windowResizing($event)">
    Current width: {{windowWidth}}
  </div>
</example>
<div mac-window-resize="windowResizing($event)">
  Current width: {{windowWidth}}
</div>
 */

angular.module('Mac').directive('macWindowResize', ['$parse', '$window', function($parse, $window) {
  return {
    restrict: 'A',
    link: function ($scope, element, attrs) {
      var callbackFn = $parse(attrs.macWindowResize),
          windowEl = angular.element($window);

      var handler = function($event) {
        $scope.$apply(function() {
          callbackFn($scope, {$event: $event});
        });
        return true;
      };

      windowEl.bind('resize', handler);

      $scope.$on('$destroy', function() {
        windowEl.unbind('resize', handler);
      });
    }
  };
}]);

/**
 * @ngdoc constant
 * @name keys
 * @description
 * MacGyver comes with character code enum for easy reference and better
 * readability.
 *
 * |  |  |  |  |
 * | --- | --- | --- | --- |
 * | **CANCEL** - 3 |	**FOUR** - 52 | **U** - 85 | **F7** - 118 |
 * | **HELP** - 6 |	**FIVE** - 53 | **V** - 86 | **F8** - 119 |
 * | **BACKSPACE** - 8 |	**SIX** - 54 | **W** - 87 | **F9** - 120 |
 * | **TAB** - 9 |	**SEVEN** - 55 | **X** - 88 | **F10** - 121 |
 * | **CLEAR** - 12 |	**EIGHT** - 56 | **Y** - 89 | **F11** - 122 |
 * | **ENTER** - 13 |	**NINE** - 57 | **Z** - 90 | **F12** - 123 |
 * | **RETURN** - 13 |	**SEMICOLON** - 59 | **CONTEXT_MENU** - 93 | **F13** - 124 |
 * | **SHIFT** - 16 |	**EQUALS** - 61 | **NUMPAD0** - 96 | **F14** - 125 |
 * | **CONTROL** - 17 |	**COMMAND** - 91 | **NUMPAD1** - 97 | **F15** - 126 |
 * | **ALT** - 18 |	**A** - 65 | **NUMPAD2** - 98 | **F16** - 127 |
 * | **PAUSE** - 19 |	**B** - 66 | **NUMPAD3** - 99 | **F17** - 128 |
 * | **CAPS_LOCK** - 20 |	**C** - 67 | **NUMPAD4** - 100 | **F18** - 129 |
 * | **ESCAPE** - 27 |	**D** - 68 | **NUMPAD5** - 101 | **F19** - 130 |
 * | **SPACE** - 32 |	**E** - 69 | **NUMPAD6** - 102 | **F20** - 131 |
 * | **PAGE_UP** - 33 |	**F** - 70 | **NUMPAD7** - 103 | **F21** - 132 |
 * | **PAGE_DOWN** - 34 |	**G** - 71 | **NUMPAD8** - 104 | **F22** - 133 |
 * | **END** - 35 |	**H** - 72 | **NUMPAD9** - 105 | **F23** - 134 |
 * | **HOME** - 36 |	**I** - 73 | **MULTIPLY** - 106 | **F24** - 135 |
 * | **LEFT** - 37 |	**J** - 74 | **ADD** - 107 | **NUM_LOCK** - 144 |
 * | **UP** - 38 |	**K** - 75 | **SEPARATOR** - 108 | **SCROLL_LOCK** - 145 |
 * | **RIGHT** - 39 |	**L** - 76 | **SUBTRACT** - 109 | **COMMA** - 188 |
 * | **DOWN** - 40 |	**M** - 77 | **DECIMAL** - 110 | **PERIOD** - 190 |
 * | **PRINT_SCREEN** - 44 |	**N** - 78 | **DIVIDE** - 111 | **SLASH** - 191 |
 * | **INSERT** - 45 |	**O** - 79 | **F1** - 112 | **BACK_QUOTE** - 192 |
 * | **DELETE** - 46 |	**P** - 80 | **F2** - 113 | **OPEN_BRACKET** - 219 |
 * | **ZERO** - 48 |	**Q** - 81 | **F3** - 114 | **BACK_SLASH** - 220 |
 * | **ONE** - 49 |	**R** - 82 | **F4** - 115 | **CLOSE_BRACKET** - 221 |
 * | **TWO** - 50 |	**S** - 83 | **F5** - 116 | **QUOTE** - 222 |
 * | **THREE** - 51 |	**T** - 84 | **F6** - 117 | **META** - 224 |
 */
angular.module('Mac').constant('keys', {
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
});

/**
 * @ngdoc directive
 * @name macMenu
 * @description
 * A directive for creating a menu with multiple items
 *
 * Menu allows for custom html templating for each item.
 *
 * Since macMenu is using ngRepeat, some ngRepeat properties along with `item` are exposed on the local scope of each template instance, including:
 *
 * | Variable  | Type    | Details                                                                     |
 * |-----------|---------|-----------------------------------------------------------------------------|
 * | `$index`  | Number  | iterator offset of the repeated element (0..length-1)                       |
 * | `$first`  | Boolean | true if the repeated element is first in the iterator.                      |
 * | `$middle` | Boolean | true if the repeated element is between the first and last in the iterator. |
 * | `$last`   | Boolean | true if the repeated element is last in the iterator.                       |
 * | `$even`   | Boolean | true if the iterator position `$index` is even (otherwise false).           |
 * | `$odd`    | Boolean | true if the iterator position `$index` is odd (otherwise false).            |
 * | `item`    | Object  | item object                                                                 |
 *
 * To use custom templating
 * ```html
 * <mac-menu>
 *   <span> {{item.label}} </span>
 * </mac-menu>
 * ```
 *
 * Template default to `{{item.label}}` if not defined
 *
 * @param {Expression} mac-menu-items List of items to display in the menu
 *         Each item should have a `label` key as display text
 * @param {Function} mac-menu-select Callback on select
 * - `index` - {Integer} Item index
 * @param {Object} mac-menu-style Styles apply to the menu
 * @param {Expression} mac-menu-index Index of selected item
 *
 * @example
<example>
  <mac-menu mac-menu-items="menuItems" mac-menu-select="selectingMenuItem(index)"></mac-menu>
  <div>Current selected item: {{selectedItem}}</div>
</example>
<mac-menu mac-menu-items="menuItems" mac-menu-select="selectingMenuItem(index)"></mac-menu>
 */

angular.module('Mac').directive('macMenu', function () {
  return {
    restrict: 'EA',
    replace: true,
    template: "<div ng-style=\"style\" class=\"mac-menu\">  <ul>    <li class=\"mac-menu-item\"        ng-class=\"{'active': $index == index}\"        ng-click=\"selectItem($index)\"        ng-mouseenter=\"setIndex($index)\"        ng-repeat=\"item in items\"        mac-menu-transclude=\"mac-menu-transclude\">    </li>  </ul></div>",
    transclude: true,
    scope: {
      items: '=macMenuItems',
      style: '=macMenuStyle',
      select: '&macMenuSelect',
      pIndex: '=macMenuIndex'
    },
    link: function ($scope, element, attrs) {
      $scope.selectItem = function (index) {
        $scope.select({index: index});
      };

      $scope.setIndex = function (index) {
        $scope.index = index;

        if (attrs.macMenuIndex) {
          $scope.pIndex = parseInt(index);
        }
      };

      // NOTE: sync local index with user index
      if (attrs.macMenuIndex) {
        $scope.$watch('pIndex', function (value) {
          $scope.index = parseInt(value);
        });
      }

      $scope.$watchCollection('items', function (items) {
        if (items.length) {
          attrs.$addClass('visible');
        } else {
          attrs.$removeClass('visible');
        }
      });
    }
  };
}).

// INFO: Used internally by mac-menu
// TODO(adrian): Look into removing this
directive('macMenuTransclude', ['$compile', function ($compile) {
  return {
    link: function ($scope, element, attrs, ctrls, transclude) {
      transclude($scope, function (clone) {
        element.empty();
        if (!clone.length) {
          // default item template
          clone = $compile('<span>{{item.label}}<span>')($scope);
        }
        element.append(clone);
      });
    }
  };
}]);

/**
 * @ngdoc directive
 * @name macModal
 * @description
 * Element directive to define the modal dialog. Modal content is transcluded into a
 * modal template
 *
 * @param {Boolean} mac-modal-keyboard      Allow closing modal with keyboard (default false)
 * @param {Boolean} mac-modal-overlay-close Allow closing modal when clicking on overlay (default false)
 * @param {Boolean} mac-modal-resize        Allow modal to resize on window resize event (default false)
 * @param {Integer} mac-modal-topOffset     Top offset when the modal is larger than window height (default 20)
 * @param {Expr}    mac-modal-open          Callback when the modal is opened
 * @param {Expr}    mac-modal-before-show   Callback before showing the modal
 * @param {Expr}    mac-modal-after-show    Callback when modal is visible with CSS transitions completed
 * @param {Expr}    mac-modal-before-hide   Callback before hiding the modal
 * @param {Expr}    mac-modal-after-hide    Callback when modal is hidden from the user with CSS transitions completed
 * @param {Boolean} mac-modal-position      Calculate size and position with JS (default true)
 *
 * @example
<example>
  <mac-modal id="test-modal" mac-modal-keyboard ng-cloak>
   <div class="mac-modal-content" ng-controller="modalController">
     <h1>Just another modal</h1>
   </div>
  </mac-modal>
  <button mac-modal="test-modal">Show Modal</button>
</example>
<mac-modal id="test-modal" mac-modal-keyboard ng-cloak>
  <div class="mac-modal-content" ng-controller="modalController">
    <h1>Just another modal</h1>
  </div>
</mac-modal>
<button mac-modal="test-modal">Show Modal</button>
 */
angular.module('Mac').directive('macModal', [
  '$parse',
  'modal',
  'util',
  function($parse, modal, util) {
    return {
      restrict: 'E',
      template: modal.defaults.template,
      replace: true,
      transclude: true,
      link: function($scope, element, attrs, controller, transclude) {
        transclude($scope, function (clone) {
          angular.element(element[0].querySelector('.mac-modal-content-wrapper')).replaceWith(clone);
        });

        var opts = util.extendAttributes('macModal', modal.defaults, attrs);

        if (opts.overlayClose) {
          element.on('click', function ($event) {
            if (angular.element($event.target).hasClass('mac-modal-overlay')) {
              $scope.$apply(function () {
                modal.hide();
              });
            }
          });
        }

        var callbacks = ['beforeShow', 'afterShow', 'beforeHide', 'afterHide', 'open'];
        callbacks.forEach(function (callback) {
          var key = 'macModal' + util.capitalize(callback);
          opts[callback] = $parse(attrs[key]) || angular.noop;
        });

        var registerModal = function (id) {
          if (!id) return;

          modal.register(id, element, opts);
          // NOTE: Remove from modal service when mac-modal directive is removed
          // from DOM
          $scope.$on('$destroy', function () {
            if (modal.opened && modal.opened.id == id) {
              modal.hide();
            }

            modal.unregister(id);
          });
        }

        if (attrs.id) {
          registerModal(attrs.id);
        } else {
          attrs.$observe('macModal', function (id) {
            registerModal(id);
          });
        }
      }
    };
  }
])
.directive('macModal', [
  '$parse',
  'modal',
  function ($parse, modal) {
    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {
        if (!attrs.macModal) {
          return;
        }

        element.bind('click', function () {
          $scope.$apply(function () {
            var data = $parse(attrs.macModalData)($scope) || {};
            modal.show(attrs.macModal, {
              data: data,
              scope: $scope
            });
          });

          return true;
        });
      }
    };
  }
])
.directive('macModalClose', [
  'modal',
  function (modal) {
    return {
      restrict: 'A',
      link: function($scope, element) {
        element.bind('click', function () {
          $scope.$apply(function () {
            modal.hide();
          });
        });
      }
    };
  }
]);

/**
 * @ngdoc directive
 * @name macPlaceholder
 * @description
 * Dynamically fill out the placeholder text of input
 *
 * @param {String} mac-placeholder Variable that contains the placeholder text
 *
 * @example
<example>
  <input type="text" mac-placeholder="tagAutocompletePlaceholder" />
</example>
<input type="text" mac-placeholder="tagAutocompletePlaceholder" />
 */

 angular.module('Mac').directive('macPlaceholder', function() {
   return {
     restrict: 'A',
     link: function($scope, element, attrs) {
       $scope.$watch(attrs.macPlaceholder, function(value) {
         attrs.$set('placeholder', value);
       });
     }
   };
 });

/**
 * @ngdoc directive
 * @name macPopover Trigger
 * @description
 * Mac popover trigger directive
 *
 * @param {String}  mac-popover            ID of the popover to show
 * @param {Integer} mac-popover-offset-x   Extra x offset (default 0)
 * @param {Integer} mac-popover-offset-y   Extra y offset (default 0)
 * @param {String}  mac-popover-container  Container for popover
 * - Attribute does not exist: document body
 * - Attribute without value: Parent element of the popover
 * - Attribute with scope variable: Use as container if it is an DOM element
 * @param {String}  mac-popover-trigger    Trigger option, click | hover | focus (default click)
 * - click: Popover only opens when user click on trigger
 * - hover: Popover shows when user hover on trigger
 * - focus: Popover shows when focus on input element
 *
 * @example
<example>
  <ul class="nav nav-pills">
    <li><a mac-popover="testPopover">Above left</a></li>
    <li><a mac-popover="testPopover2">Above right</a></li>
    <li><a mac-popover="testPopover3">Below left</a></li>
    <li><a mac-popover="testPopover4">Below right</a></li>
    <li><a mac-popover="testPopover5">Middle left</a></li>
    <li><a mac-popover="testPopover6">Middle right</a></li>
  </ul>
  <mac-popover id="testPopover" mac-popover-title="Test Popover Title" mac-popover-header ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover2" mac-popover-direction="above right" ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover3" mac-popover-direction="below left" ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover4" mac-popover-direction="below right" ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover5" mac-popover-direction="middle left" ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover6" mac-popover-direction="middle right" ng-cloak>Open a popover</mac-popover>
</example>
<a mac-popover="testPopover">Above left</a>
 */

angular.module('Mac').directive('macPopover', [
  '$timeout',
  'macPopoverDefaults',
  'popover',
  'util',
  function ($timeout, defaults, popover, util) {
    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {
        var options, delayId, closeDelayId, unobserve;

        options = util.extendAttributes('macPopover', defaults.trigger, attrs);

        /**
         * Clearing show and/or hide delays
         */
        function clearDelays () {
          if (delayId) {
            $timeout.cancel(delayId);
            delayId = null;
          }
          if (closeDelayId) {
            $timeout.cancel(closeDelayId);
            closeDelayId = null;
          }
        }

        /**
         * Check if popover should be shown, and show popover with service
         * @param {string} id
         * @param {Number} delay (default 0)
         */
        function show (id, delay) {
          delay = delay || 0;

          clearDelays();
          delayId = $timeout(function () {
            var last = popover.last();

            // Close the last popover
            // If the trigger is the same, `show` acts as a toggle
            if (last) {
              popover.hide();
              if (element[0] === last.element[0]) {
                return true;
              }
            }

            // Add current scope to option for compiling popover later
            options.scope = $scope;
            popover.show(id, element, options);
          }, delay);
        }

        /**
         * Hide popover
         * @param {Element} element
         * @param {Number} delay (default 0)
         */
        function hide (element, delay) {
          delay = delay || 0;

          clearDelays();
          closeDelayId = $timeout(function () {
            popover.hide(element);
          }, delay);
        }

        // NOTE: Only bind once
        unobserve = attrs.$observe('macPopover', function (id) {
          var showEvent, hideEvent;

          if (!id) return;

          if (options.trigger === 'click') {
            element.bind('click', function () {
              show(id, 0);
            });
          } else {
            showEvent = options.trigger === 'focus' ? 'focusin' : 'mouseenter';
            hideEvent = options.trigger === 'focus' ? 'focusout' : 'mouseleave';

            element.bind(showEvent, function () {
              show(id, 400);
            });
            element.bind(hideEvent, function () {
              hide(element, 500);
            });

            unobserve();
          }
        });

        // Hide popover before trigger gets destroyed
        $scope.$on('$destroy', function () {
          hide(element, 0);
        });
      }
    };
  }
]).

/**
 * @ngdoc directive
 * @name macPopover Element
 * @description
 * Element directive to define popover
 *
 * @param {String} id Modal id
 * @param {Bool}   mac-popover-footer     Show footer or not
 * @param {Bool}   mac-popover-header     Show header or not
 * @param {String} mac-popover-title      Popover title
 * @param {String} mac-popover-direction  Popover direction (default "above left")
 * @param {String} mac-popover-refresh-on Event to update popover size and position
 * - above, below or middle - Place the popover above, below or center align the trigger element
 * - left or right  - Place tip on the left or right of the popover
 *
 * @example
<example>
  <ul class="nav nav-pills">
    <li><a mac-popover="testPopover">Above left</a></li>
    <li><a mac-popover="testPopover2">Above right</a></li>
    <li><a mac-popover="testPopover3">Below left</a></li>
    <li><a mac-popover="testPopover4">Below right</a></li>
    <li><a mac-popover="testPopover5">Middle left</a></li>
    <li><a mac-popover="testPopover6">Middle right</a></li>
  </ul>
  <mac-popover id="testPopover" mac-popover-title="Test Popover Title" mac-popover-header ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover2" mac-popover-direction="above right" ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover3" mac-popover-direction="below left" ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover4" mac-popover-direction="below right" ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover5" mac-popover-direction="middle left" ng-cloak>Open a popover</mac-popover>
  <mac-popover id="testPopover6" mac-popover-direction="middle right" ng-cloak>Open a popover</mac-popover>
</example>
<mac-popover id="testPopover">Open a popover</mac-popover>
 */
directive('macPopover', [
  'macPopoverDefaults',
  'popover',
  'util',
  function (defaults, popover, util) {
    return {
      restrict: 'E',
      compile: function (element, attrs) {
        var opts;
        if (!attrs.id) {
          throw Error('macPopover: Missing id');
        }

        opts = util.extendAttributes('macPopover', defaults.element, attrs);
        angular.extend(opts, {template: element.html()});

        // link function
        return function ($scope, element, attrs) {
          var unobserve = attrs.$observe('id', function (value) {
            var commentEl;

            // Register the popover with popover service
            popover.register(value, opts);

            // Replace original element with comment once element is cached
            commentEl = document.createComment('macPopover: ' + value);
            element.replaceWith(commentEl);

            unobserve();
          });
        };
      }
    };
  }
]).

/**
 * An internal directive to compile popover template
 * @private
 */
directive('macPopoverFillContent', ['$compile', function ($compile) {
  return {
    restrict: 'A',
    link: function ($scope, element) {
      element.html($scope.macPopoverTemplate);
      $compile(element.contents())($scope);
    }
  };
}]);

/**
 * @ngdoc directive
 * @name macScrollSpy
 * @description
 * Element to spy scroll event on
 *
 * @param {Integer} mac-scroll-spy-offset Top offset when calculating scroll position
 * @example
<body mac-scroll-spy mac-scroll-spy-offset="10"></body>
 */
angular.module('Mac').directive('macScrollSpy', [
  '$window',
  'scrollSpy',
  'scrollSpyDefaults',
  'util',
  function ($window, scrollSpy, defaults, util) {
    return {
      link: function ($scope, element, attrs) {
        var options, spyElement;

        options = util.extendAttributes('macScrollSpy', defaults, attrs);

        // NOTE: Look into using something other than $window
        spyElement = element[0].tagName == 'BODY' ? angular.element($window) : element;

        spyElement.bind('scroll', function () {
          var scrollTop, scrollHeight, maxScroll, i, anchor;

          // NOTE: exit immediately if no items are registered
          if (scrollSpy.registered.length == 0) {
            return true;
          }

          scrollTop = spyElement.scrollTop() + options.offset;
          scrollHeight = spyElement[0].scrollHeight || element[0].scrollHeight;
          maxScroll = scrollHeight - spyElement.height();

          // Select the last anchor when scrollTop is over maxScroll
          if (scrollTop >= maxScroll) {
            return scrollSpy.setActive(scrollSpy.last());
          }

          for (i = 0; i < scrollSpy.registered.length; i++) {
            anchor = scrollSpy.registered[i];
            if (scrollTop >= anchor.top &&
                (!scrollSpy.registered[i + 1] || scrollTop <= scrollSpy.registered[i + 1].top)) {
              $scope.$apply(function () {
                scrollSpy.setActive(anchor);
              });
              return true;
            }
          }
        });
      }
    }
}]).

/**
 * @ngdoc directive
 * @name macScrollSpyAnchor
 * @description
 * Section in the spied element
 * @param {String} id Id to identify anchor
 * @param {String} mac-scroll-spy-anchor ID to identify anchor (use either element or this attribute)
 * @param {Event} refresh-scroll-spy To refresh the top offset of all scroll anchors
 * @example
<section id="modal" mac-scroll-spy-anchor></section>
 */
directive('macScrollSpyAnchor', ['scrollSpy', function (scrollSpy) {
  return {
    link: function ($scope, element, attrs) {
      var id = attrs.id || attrs.macScrollSpyAnchor;

      if (!id) {
        throw new Error('Missing scroll spy anchor id');
      }

      var anchor = scrollSpy.register(id, element);

      $scope.$on('$destroy', function () {
        scrollSpy.unregister(id);
      });

      // Re-register anchor to update position/offset
      $scope.$on('refresh-scroll-spy', function () {
        if (anchor) {
          scrollSpy.updateOffset(anchor);
        }
      });
    }
  }
}]).

/**
 * @ngdoc directive
 * @name macScrollSpyTarget
 * @description
 * Element to highlight when anchor scroll into view
 * @param {String} mac-scroll-spy-target Name of the anchor
 * @param {String} mac-scroll-spy-target-class Class to apply for highlighting (default active)
 *
 * @example
<ul class="nav nav-list">
  <li mac-scroll-spy-target="modal"><a href="#modal">Modal</a></li>
  <li mac-scroll-spy-target="scrollspy"><a href="#scrollspy">Scroll Spy</a></li>
</ul>
 */
directive('macScrollSpyTarget', ['scrollSpy', 'scrollSpyDefaults', function (scrollSpy, defaults) {
  return {
    link: function ($scope, element, attrs) {
      var target = attrs.macScrollSpyTarget;
      var highlightClass = attrs.macScrollSpyTargetClass || defaults.highlightClass;

      if (!target) {
        throw new Error('Missing scroll spy target name');
      }

      var callback = function (active) {
        element.toggleClass(highlightClass, target == active.id);
      }

      // update target class if target is re-rendered
      if (scrollSpy.active) {
        callback(scrollSpy.active);
      }

      scrollSpy.addListener(callback);
      $scope.$on('$destroy', function () {
        scrollSpy.removeListener(callback);
      });
    }
  };
}]);

/**
 * @ngdoc directive
 * @name macSpinner
 * @description
 * A directive for generating spinner
 *
 * @param {Integer} mac-spinner-size The size of the spinner (default 16)
 * @param {Integer} mac-spinner-z-index The z-index (default inherit)
 * @param {String}  mac-spinner-color Color of all the bars (default #2f3035)
 *
 * @example
<caption>Basic setup</caption>
<example>
   <mac-spinner />
 </example>
 <mac-spinner />
 */

angular.module('Mac').directive('macSpinner', ['util', function (util) {
  var updateBars = function (bars, propertyName, value) {
    var i, property;
    if (angular.isObject(propertyName)) {
      for (property in propertyName) {
        updateBars(bars, property, propertyName[property]);
      }
      return;
    }

    for (i = 0; i < bars.length; i++) {
      bars[i].style[propertyName] = value;
    }
  },
  setSpinnerSize = function (element, bars, size) {
    if (!size) {
      return;
    }

    updateBars(bars, {
      height: size * 0.32 + 'px',
      left: size * 0.445 + 'px',
      top: size * 0.37 + 'px',
      width: size * 0.13 + 'px',
      borderRadius: size * 0.32 * 2 + 'px',
      position: 'absolute'
    });

    if (!isNaN(+size) && angular.isNumber(+size)) {
      size = size + 'px';
    }

    element.css({
      height: size,
      width: size
    });
  },
  defaults = {
    size: 16,
    zIndex: 'inherit',
    color: '#2f3035'
  };

  return {
    restrict: 'E',
    replace: true,
    template: '<div class="mac-spinner"></div>',

    compile: function (element) {
      var i, bars = [],
          animateCss = util.getCssVendorName(element[0], 'animation'),
          transformCss = util.getCssVendorName(element[0], 'transform'),
          delay, degree, styl, bar;

      for (i = 0; i < 10; i++) {
        delay = i * 0.1 - 1 + !i;
        degree = i * 36;
        styl = {};
        bar = angular.element('<div class="bar"></div>');
        // Cache each bar for css updates
        bars.push(bar[0]);

        styl[animateCss] = 'fade 1s linear infinite ' + delay + 's';
        styl[transformCss] = 'rotate(' + degree + 'deg) translate(0, 130%)';
        bar.css(styl);

        element.append(bar);
      }

      return function ($scope, element, attrs) {
        if (attrs.macSpinnerSize) {
          attrs.$observe('macSpinnerSize', function (value) {
            setSpinnerSize(element, bars, value);
          });
        } else {
          setSpinnerSize(element, bars, defaults.size);
        }

        attrs.$observe('macSpinnerZIndex', function (value) {
          if (value) {
            element.css('z-index', value);
          }
        });

        if (attrs.macSpinnerColor) {
          attrs.$observe('macSpinnerColor', function (value) {
            if (value) {
              updateBars(bars, 'background', value);
            }
          });
        } else {
          updateBars(bars, 'background', defaults.color)
        }
      };
    }
  };
}]);

/**
 * @ngdoc directive
 * @name macTagAutocomplete
 * @description
 * A directive for generating tag input with autocomplete support on text input.
 * Tag autocomplete has priority 800
 *
 * @param {String}  mac-tag-autocomplete-source      Data to use.
 * Source support multiple types:
 * - Array: An array can be used for local data and there are two supported formats:
 *   - An array of strings: ["Item1", "Item2"]
 *   - An array of objects with mac-autocomplete-label key: [{name:"Item1"}, {name:"Item2"}]
 * - String: Using a string as the source is the same as passing the variable into mac-autocomplete-url
 * - Function: A callback when querying for data. The callback receive two arguments:
 *   - {String} Value currently in the text input
 *   - {Function} A response callback which expects a single argument, data to user. The data will be
 *   populated on the menu and the menu will adjust accordingly
 * @param {String}  mac-tag-autocomplete-value       The value to be sent back upon selection (default "id")
 * @param {String}  mac-tag-autocomplete-label       The label to display to the users (default "name")
 * @param {Expr}    mac-tag-autocomplete-model       Model for autocomplete
 * @param {Array}   mac-tag-autocomplete-selected    The list of elements selected by the user (required)
 * @param {String}  mac-tag-autocomplete-query       The query parameter on GET command (defualt "q")
 * @param {Integer} mac-tag-autocomplete-delay       Time delayed on fetching autocomplete data after keyup  (default 800)
 * @param {String}  mac-tag-autocomplete-placeholder Placeholder text of the text input (default "")
 * @param {Boolean} mac-tag-autocomplete-disabled    If autocomplete is enabled or disabled (default false)
 * @param {Function} mac-tag-autocomplete-on-success Function called on successful ajax request (Proxy attribute for macAutocomplete)
 * - `data` - {Object} Data returned from the request
 * - `status` - {Number} The status code of the response
 * - `header` - {Object} Header of the response
 * @param {Expr}    mac-tag-autocomplete-on-enter    When autocomplete is disabled, this function is called on enter, Should return either string, object or boolean. If false, item is not added
 * - `item` - {String} User input
 * @param {Event} mac-tag-autocomplete-clear-input $broadcast message; clears text input when received
 *
 * @param {expression} mac-tag-autocomplete-blur Callback function on blur
 * - `$event` - {Event} Event object
 * - `ctrl` - {MacTagAutocompleteController} Tag autocomplete element controller
 * - `value` - {String} Text input
 * @param {expression} mac-tag-autocomplete-focus Callback function on focus
 * - `$event` - {Event} Event object
 * - `ctrl` - {MacTagAutocompleteController} Tag autocomplete element controller
 * - `value` - {String} Text input
 * @param {expression} mac-tag-autocomplete-keyup Callback function on keyup
 * - `$event` - {Event} Event object
 * - `ctrl` - {MacTagAutocompleteController} Tag autocomplete element controller
 * - `value` - {String} Text input
 * @param {expression} mac-tag-autocomplete-keydown Callback function on keydown
 * - `$event` - {Event} Event object
 * - `ctrl` - {MacTagAutocompleteController} Tag autocomplete element controller
 * - `value` - {String} Text input
 * @param {expression} mac-tag-autocomplete-keypress Callback function on keypress
 * - `$event` - {Event} Event object
 * - `ctrl` - {MacTagAutocompleteController} Tag autocomplete element controller
 * - `value` - {String} Text input
 *
 * @example
<caption>Basic example</caption>
<example>
  <mac-tag-autocomplete
    mac-tag-autocomplete-source = "autocompleteUrl"
    mac-tag-autocomplete-query = "q"
    mac-tag-autocomplete-selected = "tagAutocompleteSelected"
    mac-tag-autocomplete-value = "id"
    mac-tag-autocomplete-label = "name"
    mac-tag-autocomplete-placeholder = "tagAutocompletePlaceholder"
    mac-tag-autocomplete-model = "tagAutocompleteModel"
  />
</example>
<mac-tag-autocomplete
  mac-tag-autocomplete-source = "autocompleteUrl"
  mac-tag-autocomplete-query = "q"
  mac-tag-autocomplete-selected = "tagAutocompleteSelected"
  mac-tag-autocomplete-value = "id"
  mac-tag-autocomplete-label = "name"
  mac-tag-autocomplete-placeholder = "tagAutocompletePlaceholder"
  mac-tag-autocomplete-model = "tagAutocompleteModel"
/>
 *
 * @example
<caption>Example with autocomplete disabled</caption>
<example>
  <mac-tag-autocomplete
    mac-tag-autocomplete-selected = "tagAutocompleteDisabledSelected"
    mac-tag-autocomplete-placeholder = "tagAutocompletePlaceholder"
    mac-tag-autocomplete-value = ""
    mac-tag-autocomplete-label = ""
    mac-tag-autocomplete-disabled = "true"
  />
</example>
<mac-tag-autocomplete
  mac-tag-autocomplete-selected = "tagAutocompleteDisabledSelected"
  mac-tag-autocomplete-placeholder = "tagAutocompletePlaceholder"
  mac-tag-autocomplete-value = ""
  mac-tag-autocomplete-label = ""
  mac-tag-autocomplete-disabled = "true"
/>
 */

angular.module('Mac').directive('macTagAutocomplete', [
  function () {
    return {
      restrict: 'E',
      template: "<div class=\"mac-tag-autocomplete\">  <ul class=\"mac-tag-list\">    <li ng-repeat=\"tag in macTagAutocomplete.selected\" class=\"mac-tag\">      <div ng-click=\"macTagAutocomplete.selected.splice($index, 1)\" class=\"mac-tag-close\">&times;</div>      <div class=\"tag-label\">{{macTagAutocomplete.getTagLabel(tag)}}</div>    </li>    <li class=\"mac-tag\">      <mac-autocomplete class=\"mac-tag-input mac-autocomplete\"        ng-keydown=\"macTagAutocomplete.onKeyDown($event)\"        ng-model=\"macTagAutocomplete.textInput\"        mac-autocomplete-disabled=\"disabled\"        mac-autocomplete-on-select=\"macTagAutocomplete.onSelect(selected)\"        mac-autocomplete-on-success=\"macTagAutocomplete.onSuccess(data, status, headers)\"        mac-autocomplete-source=\"macTagAutocomplete.source\"        mac-placeholder=\"macTagAutocomplete.placeholder\"></mac-autocomplete>    </li>  </ul></div>",
      replace: true,
      priority: 800,
      scope: {
        source: '=macTagAutocompleteSource',
        placeholder: '=macTagAutocompletePlaceholder',
        selected: '=macTagAutocompleteSelected',
        disabled: '=macTagAutocompleteDisabled',
        model: '=macTagAutocompleteModel',
        onSuccessFn: '&macTagAutocompleteOnSuccess',
        onEnterFn: '&macTagAutocompleteOnEnter',
        onKeydownFn: '&macTagAutocompleteOnKeydown',
        labelKey: '@macTagAutocompleteLabel'
      },
      controller: 'MacTagAutocompleteController',
      controllerAs: 'macTagAutocomplete',
      bindToController: true,

      compile: function (element, attrs) {
        var labelKey = attrs.macTagAutocompleteLabel != undefined ?
          attrs.macTagAutocompleteLabel : 'name';

        var delay = +attrs.macTagAutocompleteDelay;
        delay = isNaN(delay) ? 800 : delay;

        var textInput = angular.element(element[0].querySelector('.mac-autocomplete'));
        textInput.attr({
          'mac-autocomplete-label': labelKey,
          'mac-autocomplete-query': attrs.macTagAutocompleteQuery || 'q',
          'mac-autocomplete-delay': delay
        });

        return function ($scope, element, attrs, ctrl) {
          // NOTE: Proxy is created to prevent tag autocomplete from breaking
          // when user did not specify model
          if (attrs.macTagAutocompleteModel) {
            $scope.$watch('macTagAutocomplete.textInput', function (value) { $scope.model = value;});
            $scope.$watch('macTagAutocomplete.model', function (value) { ctrl.textInput = value;});
          }

          element.bind('click', function () {
            var textInputDOM = element[0].querySelector('.mac-autocomplete');
            textInputDOM.focus();
          });

          $scope.$on('mac-tag-autocomplete-clear-input', function () {
            ctrl.textInput = '';
          });
        };
      }
    }
  }
]);

function macAutocompleteEventFactory (key) {
  var name = 'macTagAutocomplete' + key;
  var eventName = key.toLowerCase();

  angular.module('Mac').directive(name, [
    '$parse',
    function ($parse) {
      return {
        restrict: 'A',
        priority: 700,
        require: 'macTagAutocomplete',
        link: function ($scope, element, attrs, ctrl) {
          var input = angular.element(element[0].querySelector('.mac-autocomplete'));
          var expr = $parse(attrs[name]);

          if (!input) return;

          input.bind(eventName, function($event) {
            $scope.$apply(function() {
              expr($scope, {
                $event: $event,
                ctrl: ctrl,
                value: ctrl.textInput
              });
            });
          });
        }
      }
    }
  ]);
}

var macAutocompleteEvents = ['Blur', 'Focus', 'Keyup', 'Keydown', 'Keypress'];
macAutocompleteEvents.forEach(macAutocompleteEventFactory);

/**
 * @ngdoc directive
 * @name macTime
 * @description
 * A directive for creating a time input field. Time input can use any `ng-` attributes support by text input type.
 *
 * @param {String} ng-model         Assignable angular expression to data-bind to
 * Clearing model by setting it to null or '' will set model back to default value
 * @param {String} name             Property name of the form under which the control is published
 * @param {String} required         Adds `required` validation error key if the value is not entered.
 * @param {String} ng-required      Adds `required` attribute and `required` validation constraint to
 *  the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
 *  `required` when you want to data-bind to the `required` attribute.
 * @param {String} ng-pattern      Sets `pattern` validation error key if the value does not match the
 *  RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
 *    patterns defined as scope expressions.
 * @param {String} ng-change       Angular expression to be executed when input changes due to user interaction with the input element.
 * @param {String} ng-disabled     Enable or disable time input
 *
 * @param {String} mac-time-default If model is undefined, use this as the starting value (default 12:00 PM)
 *
 * @example
<caption>Basic setup</caption>
<example>
  <mac-time id="input-start-time" ng-model="startTime" mac-time-default="11:59 PM" />
</example>
<mac-time id="input-start-time" ng-model="startTime" mac-time-default="11:59 PM" />
 */

angular.module('Mac').directive('macTime', [
  'keys',
  'util',
  'macTimeDefaults',
  'macTimeUtil',
  function (keys, util, defaults, timeUtil) {
    return {
      restrict: 'E',
      require: 'ngModel',
      replace: true,
      template: '<input class="mac-date-time" type="text" maxlength="8">',
      link: function ($scope, element, attrs, ngModelCtrl) {
        var opts, time, timeValidator, whitelistKeys;

        opts = util.extendAttributes('macTime', defaults, attrs);

        whitelistKeys = [keys.UP,
          keys.DOWN,
          keys.LEFT,
          keys.RIGHT,
          keys.A,
          keys.P
        ];

        // Set default placeholder
        if (!attrs.placeholder) {
          attrs.$set('placeholder', opts.placeholder);
        }

        // Validation
        timeValidator = function (value) {
          if (!value || util.validateTime(value)) {
            ngModelCtrl.$setValidity('time', true);
            return value;
          } else {
            ngModelCtrl.$setValidity('time', false);
            return undefined;
          }
        };

        ngModelCtrl.$formatters.push(timeValidator);
        ngModelCtrl.$parsers.push(timeValidator);

        time = timeUtil.initializeTime(opts);

        element.on('blur', function () {
          $scope.$apply(function () {
            timeUtil.updateInput(time, ngModelCtrl);
          });
        });

        /**
         * Note: The initial click into the input will not update the time because the
         * model is empty. The selection by default should be hour
         */
        element.on('click', function () {
          $scope.$apply(function() {
            var isModelSet = !!ngModelCtrl.$modelValue;

            timeUtil.updateTime(time, ngModelCtrl);
            timeUtil.updateInput(time, ngModelCtrl);

            // After the initial view update, selectionStart is set to the end.
            // This is not the desired behavior as it should select hour by default
            if (!isModelSet) {
              timeUtil.selectHours(element);
              return;
            }

            switch (timeUtil.getSelection(element)) {
              case 'hour':
                timeUtil.selectHours(element);
                break;
              case 'minute':
                timeUtil.selectMinutes(element);
                break;
              case 'meridian':
                timeUtil.selectMeridian(element);
                break;
            }
          });

          return true;
        });

        element.on('keydown', function (event) {
          var key = event.which;

          if (whitelistKeys.indexOf(key) === -1) {
            return true;
          }

          event.preventDefault();

          $scope.$apply(function () {
            var change, selection = timeUtil.getSelection(element), meridian;

            if (key === keys.UP || key === keys.DOWN) {
              change = key === keys.UP ? 1 : -1;

              switch (selection) {
                case 'hour':
                  timeUtil.incrementHour(time, change);
                  timeUtil.selectHours(element);
                  break;
                case 'minute':
                  timeUtil.incrementMinute(time, change);
                  timeUtil.selectMinutes(element);
                  break;
                case 'meridian':
                  timeUtil.toggleMeridian(time);
                  timeUtil.selectMeridian(element);
                  break;
              }

              timeUtil.updateInput(time, ngModelCtrl);

            } else if (key === keys.LEFT) {
              timeUtil.selectPreviousSection(element);
              timeUtil.updateInput(time, ngModelCtrl);

            } else if (key === keys.RIGHT) {
              timeUtil.selectNextSection(element);
              timeUtil.updateInput(time, ngModelCtrl);

            } else if ((key === keys.A || key === keys.P) && selection === 'meridian') {
              meridian = key === keys.A ? 'AM' : 'PM';
              timeUtil.setMeridian(time, meridian);

              timeUtil.updateInput(time, ngModelCtrl);
              timeUtil.selectMeridian(element);
            }
          });
        });

        element.on('keyup', function (event) {
          var key = event.which;

          if (!((keys.NUMPAD0 <= key && key <= keys.NUMPAD9) || (keys.ZERO <= key && key <= keys.NINE))) {
            event.preventDefault();
          }

          $scope.$apply(function () {
            timeUtil.updateTime(time, ngModelCtrl);
          });
        });
      }
    };
  }
]);

/**
 * @ngdoc directive
 * @name macTooltip
 * @description
 * Tooltip directive
 *
 * @param {String}  mac-tooltip           Text to show in tooltip
 * @param {String}  mac-tooltip-direction Direction of tooltip (default 'top')
 * @param {String}  mac-tooltip-trigger   How tooltip is triggered (default 'hover')
 * @param {Boolean} mac-tooltip-inside    Should the tooltip be appended inside element (default false)
 * @param {Expr}    mac-tooltip-disabled  Disable and enable tooltip
 *
 * @example
<example>
  <ul class="nav nav-pills">
    <li><a mac-tooltip="Tooltip on top">Tooltip on top</a></li>
    <li><a mac-tooltip="Tooltip on bottom" mac-tooltip-direction="bottom">Tooltip on bottom</a></li>
    <li><a mac-tooltip="Tooltip on left" mac-tooltip-direction="left">Tooltip on left</a></li>
    <li><a mac-tooltip="Tooltip on right" mac-tooltip-direction="right">Tooltip on right</a></li>
  </ul>
</example>
<a href="#" mac-tooltip="Tooltip on bottom" mac-tooltip-direction="bottom">Tooltip on bottom</a>
 */

/**
 * NOTE: This directive does not use $animate to append and remove DOM element or
 * add and remove classes in order to optimize showing tooltips by eliminating
 * the need for firing a $digest cycle.
 */

angular.module('Mac').directive('macTooltip', [
  '$timeout',
  'macTooltipDefaults',
  'util',
  function ($timeout, defaults, util) {
    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {
        var tooltip, text, disabled, unobserve, closeDelay, opts;

        opts = util.extendAttributes('macTooltip', defaults, attrs);

        function showTip () {
          var container, offset, elementSize, tooltipSize, messageEl;

          if (disabled || !text || tooltip) {
            return true;
          }

          container = opts.inside ? element : angular.element(document.body);

          // Check if the tooltip still exists, remove if it does
          removeTip(0);

          messageEl = angular.element('<div class="tooltip-message"></div>');
          messageEl.text(text);

          tooltip = angular.element('<div />').addClass('mac-tooltip ' + opts.direction);
          tooltip.append(messageEl);

          container.append(tooltip);

          // Only get element offset when not adding tooltip within the element
          offset = opts.inside ? {top: 0, left: 0} : element.offset();

          // Get element height and width
          elementSize = {
            width: element.outerWidth(),
            height: element.outerHeight()
          };

          // Get tooltip width and height
          tooltipSize = {
            width: tooltip.outerWidth(),
            height: tooltip.outerHeight()
          };

          // Adjust offset based on direction
          switch (opts.direction) {
            case 'bottom':
            case 'top':
              offset.left += elementSize.width / 2 - tooltipSize.width / 2;
              break;
            case 'left':
            case 'right':
              offset.top += elementSize.height / 2 - tooltipSize.height / 2;
              break;
          }

          if (opts.direction == 'bottom') {
            offset.top += elementSize.height;
          } else if (opts.direction == 'top') {
            offset.top -= tooltipSize.height;
          } else if (opts.direction == 'left') {
            offset.left -= tooltipSize.width;
          } else if (opts.direction == 'right') {
            offset.left += elementSize.width;
          }

          // Set the offset
          angular.forEach(offset, function (value, key) {
            if (!isNaN(+value) && angular.isNumber(+value)) {
              value = value + "px";
            }

            tooltip.css(key, value);
          });

          tooltip.addClass(opts.class);
          return true;
        }

        function removeTip (delay) {
          delay = delay === undefined ? 100 : delay;

          if (tooltip && !closeDelay) {
            tooltip.removeClass(opts.class);

            closeDelay = $timeout(function () {
              if (tooltip) {
                tooltip.remove();
              }
              tooltip = null;
              closeDelay = null;
            }, delay, false);
          }

          return true;
        }

        function toggle () { return tooltip ? removeTip() : showTip(); }

        // Calling unobserve in the callback to simulate observeOnce
        unobserve = attrs.$observe('macTooltip', function (value) {
          if (value === undefined) {
            return;
          }

          text = value;

          if (opts.trigger !== 'hover' && opts.trigger !== 'click') {
            throw new Error('macTooltip: Invalid trigger');
          }

          if (opts.trigger === 'click') {
            element.bind('click', toggle);
          } else if (opts.trigger === 'hover') {
            element.bind('mouseenter', showTip);
            element.bind('mouseleave click', function () {
              removeTip();
            });
          }

          unobserve();
        });

        if (attrs.macTooltipDisabled) {
          $scope.$watch(attrs.macTooltipDisabled, function (value) {
            disabled = !!value;
          });
        }

        $scope.$on('$destroy', function () {
          removeTip(0);
        });
      }
    };
  }
]);

/**
 * @name booleanFactory
 * @description
 * A boolean factory that creates a function that returns certain strings
 * based on the `boolean` variable
 * @param {string} trueDefault Default string for true
 * @param {string} falseDefault Default string for false
 * @returns {Function}
 * @private
 */
function booleanFactory(trueDefault, falseDefault) {
  return function() {
    return function(boolean, trueString, falseString) {
      trueString = trueString || trueDefault;
      falseString = falseString || falseDefault;
      return boolean ? trueString : falseString;
    };
  };
}

/**
 * @ngdoc filter
 * @name boolean
 * @description
 * Print out string based on passed in value
 *
 * @param {*} boolean Value to check
 * @param {string} trueString String to print when boolean is truthy
 * @param {string} falseString String to print when boolean is falsy
 * @returns {string} Either trueString or falseString based on boolean
 *
 * @example
   <span class="{{isHidden | boolean:'is-hidden':'is-shown'}}"></span>
 */
var booleanFilter = booleanFactory('true', 'false');

/**
 * @ngdoc filter
 * @name true
 * @description
 * Print out string when boolean is truthy
 *
 * @param {*} boolean Value to check
 * @param {string} trueString String to print when boolean is truthy
 * @returns {string}
 *
 * @example
   <span class="{{isHidden | true:'is-hidden'}}"></span>
 */
var trueFilter = booleanFactory('true', '');

/**
 * @ngdoc filter
 * @name false
 * @description
 * Print out string when boolean is falsy
 *
 * @param {*} boolean Value to check
 * @param {string} falseString String to print when boolean is falsy
 * @returns {string}
 *
 * @example
   <span class="{{isHidden | false:'is-shown'}}"></span>
 */
var falseFilter = booleanFactory('', 'false');

angular.module('Mac')
  .filter('boolean', booleanFilter)
  .filter('true', trueFilter)
  .filter('false', falseFilter);

/**
 * @ngdoc filter
 * @name list
 * @description
 * List filter. Use for converting arrays into a string
 *
 * @param {Array} list Array of items
 * @param {String} separator String to separate each element of the array (default ,)
 * @returns {String} Formatted string
 *
 * @example
   <span>{{['item1', 'item2', 'item3'] | list}}</span>
 */

angular.module('Mac').filter('list', function() {
  return function(list, separator) {
    if (!separator) {
      separator = ', ';
    }

    if (!angular.isArray(list)) return list;

    return list.join(separator);
  };
});

/**
 * @ngdoc filter
 * @name pluralize
 * @description
 * Pluralizes the given string. It's a simple proxy to the pluralize function on util.
 *
 * @param {String} string Noun to pluralize
 * @param {Integer} count The numer of objects
 * @param {Boolean} includeCount To include the number in formatted string
 * @returns {String} Formatted plural
 *
 * @example
<example>
  <dl class="dl-horizontal">
    <dt>Single</dt>
    <dd>{{"person" | pluralize: 1}}</dd>
    <dt>Multiple</dt>
    <dd>{{"person" | pluralize: 20}}</dd>
  </dl>
</example>
<span>{{dog | pluralize:10:true}}</span>
 */

 angular.module('Mac').filter('pluralize', ['util', function(util) {
   return function(string, count, includeCount) {
     // Default includeCount to true
     if (includeCount === undefined) {
       includeCount = true;
     }

     return util.pluralize(string, count, includeCount);
   };
 }]);

/**
 * @ngdoc filter
 * @name timestamp
 * @description
 * Takes in a unix timestamp and turns it into a human-readable relative time string, like "5
 * minutes ago" or "just now".
 *
 * @param {integer} time The time to format
 * @returns {String} Formatted string
 *
 * @example
<example>
  <dl class="dl-horizontal">
    <dt>Now - 5 minutes</dt>
    <dd>{{ fiveMinAgo | timestamp}}</dd>
    <dt>Now - 1 day</dt>
    <dd>{{ oneDayAgo | timestamp}}</dd>
    <dt>Now - 3 days</dt>
    <dd>{{ threeDaysAgo | timestamp}}</dd>
  </dl>
</example>
<span>{{yesterday | timestamp}}</span>
 */

angular.module('Mac').filter('timestamp', ['util', function(util) {
  function _createTimestamp(count, noun) {
    noun = util.pluralize(noun, count);
    return count + ' ' + noun + ' ' + 'ago';
  }

  return function(time) {
    var parsedTime = parseInt(time),
        currentTime = Math.round(Date.now() / 1000),
        timeDiff;

    if (isNaN(parsedTime)) return time;

    timeDiff = currentTime - parsedTime;

    if (timeDiff < 45) {
      return 'just now';
    } else if (timeDiff < 120) {
      return 'about a minute ago';
    } else {
      if (timeDiff < 60) return timeDiff + ' seconds ago';

      timeDiff /= 60;
      if (timeDiff < 60)
        return _createTimestamp(Math.floor(timeDiff), 'min');

      timeDiff /= 60;
      if (timeDiff < 24)
        return _createTimestamp(Math.floor(timeDiff), 'hour');

      timeDiff /= 24;
      if (timeDiff < 7)
        return _createTimestamp(Math.floor(timeDiff), 'day');

      if (timeDiff < 31)
        return _createTimestamp(Math.floor(timeDiff/7), 'week');

      if (timeDiff < 365)
        return _createTimestamp(Math.floor(timeDiff/31), 'month');

      return _createTimestamp(Math.floor(timeDiff/365), 'year');
    }
  };
}]);

/**
 * @ngdoc service
 * @name modal
 * @description
 *
 * There are multiple components used by modal.
 * - A modal service is used to keep state of modal opened in the applications.
 * - A modal element directive to define the modal dialog box
 * - A modal attribute directive as a modal trigger
 *
 * @param {Function} show Show a modal based on the modal id
 * - {String} id The id of the modal to open
 * - {Object} triggerOptions Additional options to open modal
 *
 * @param {Function} resize Update the position and also the size of the modal
 * - {Object} modalObject The modal to reposition and resize (default opened modal)
 *
 * @param {Function} hide Hide currently opened modal
 * - {Function} callback Callback after modal has been hidden
 *
 * @param {Function} bindingEvents Binding escape key or resize event
 * - {String} action Either to bind or unbind events (default 'bind')
 *
 * @param {Function} register Registering modal with the service
 * - {String} id ID of the modal
 * - {Element} element The modal element
 * - {Object} options Additional options for the modal
 *
 * @param {Function} unregister Remove modal from modal service
 * - {String} id ID of the modal to unregister
 *
 * @param {Function} clearWaiting Remove certain modal id from waiting list
 * - {String} id ID of the modal
 */
angular.module('Mac').provider('modal', function () {
  var registered = {};
  this.registered = registered;

  this.$get = [
    '$animate',
    '$compile',
    '$controller',
    '$document',
    '$http',
    '$q',
    '$rootScope',
    '$templateCache',
    'keys',
    'macModalDefaults',
    function ($animate, $compile, $controller, $document, $http, $q, $rootScope, $templateCache, keys, macModalDefaults) {
      var service = {
        // Dictionary of registered modal
        registered: registered,

        defaults: macModalDefaults,

        // Modal object that hasn't been shown yet
        waiting: null,

        // Current opened modal
        opened: null,

        show: function (id, triggerOptions) {
          triggerOptions = triggerOptions || {};

          if (this.registered[id] && this.opened) {
            return this.hide();

          } else if (this.registered[id]) {
            var modalObject = this.registered[id];
            var options = modalObject.options;
            var showOptions = {};

            // Extend options from trigger with modal options
            angular.extend(showOptions, options, triggerOptions);

            // modal created using modal directive
            if (modalObject.element) {
              return this._showModal(id, modalObject.element, showOptions);

            // if modal is created thru module method 'modal'
            } else {
              return this._getTemplate(showOptions)
              .then(function (template) {
                return this._renderModal(id, template, showOptions);
              }.bind(this))
              .then(function (element) {
                return this._showModal(id, element, showOptions);
              }.bind(this));
            }
          }

          this.waiting = {
            id: id,
            options: triggerOptions
          };
        },

        /**
         * Update the position and also the size of the modal
         * @param {Object} modalObject The modal to reposition and resize (default opened modal)
         */
        resize: function (modalObject) {
          modalObject = modalObject || this.opened;

          if (!modalObject) return;

          var element = modalObject.element;
          var options = modalObject.options;

          // If position is not set on options
          if (!options.position) return

          var modal = angular.element(element[0].querySelector('.mac-modal'));
          var height = modal.outerHeight();
          var width = modal.outerWidth();

          var css;
          if (angular.element(window).height() > height) {
            css = {marginTop: -height / 2};
          } else {
            css = {top: options.topOffset};
          }
          css.marginLeft = -width / 2;

          angular.forEach(css, function (value, key) {
            if (!isNaN(+value) && angular.isNumber(+value)) {
              value = value + 'px';
            }
            modal.css(key, value);
          });
        },

        /**
         * Hide currently opened modal
         * @returns {Promise} Remove visible class promise
         */
        hide: function () {
          if (!this.opened) return $q.when();

          var id = this.opened.id;
          var options = this.opened.options;
          var element = this.opened.element;

          options.beforeHide(element.scope());

          return $animate.removeClass(element, 'visible')
          .then(function () {
            options.afterHide(element.scope());

            if (this.registered[id] && this.registered[id].element) {
              var modal = element[0].querySelector('.mac-modal');
              modal.removeAttribute('style');
            } else {
              // Only destroy new isolated scope
              if (!angular.isScope(options.scope)) {
                element.scope().$destroy();
              }
              $animate.leave(element);
            }

            this.bindingEvents('off');
            this.opened = null;

            $rootScope.$broadcast('modalWasHidden', id);
          }.bind(this));
        },

        /**
         * Bind events to document and window
         *
         * @param {String} action (on|off)
         * @returns {boolean}
         */
        bindingEvents: function (action) {
          action = action || 'on';

          if ((action != 'on' && action != 'off') || !this.opened) {
            return false
          }

          if (this.opened.options.keyboard) {
            $document[action]('keydown', this._escapeHandler);
          }

          if (this.opened.options.resize) {
            angular.element(window)[action]('resize', this._resizeHandler);
          }

          return true
        },

        /**
         * Registering modal with the service
         * @param {String} id ID of the modal
         * @param {Element} element The modal element
         * @param {Object} options Additional options for the modal
         */
        register: function (id, element, options) {
          if (this.registered[id]) {
            throw new Error('Modal ' + id + ' already registered');
          }

          var modalOpts = {};
          angular.extend(modalOpts, this.defaults, options);

          this.registered[id] = {
            id: id,
            element: element,
            options: modalOpts
          };

          if (this.waiting && this.waiting.id === id) {
            this.show(id, this.waiting.options);
          }
        },

        /**
         * Remove modal from modal service
         * @param {String} id ID of the modal to unregister
         */
        unregister: function (id) {
          if (!this.registered[id]) {
            throw new Error('Modal ' + id + ' is not registered');
          }

          if (this.opened && this.opened.id == id) {
            this.hide();
          }

          this.clearWaiting(id);

          delete this.registered[id];
        },

        /**
         * Remove certain modal id from waiting list
         * @param {String} id ID of the modal
         */
        clearWaiting: function (id) {
          // clear modal with the same id if id is provided
          if (id && this.waiting && this.waiting.id != id) {
            return;
          }

          this.waiting = null;
        },

        _showModal: function (id, element, options) {
          options.beforeShow(element.scope());

          return $animate.addClass(element, 'visible')
          .then(function () {
            // Update opened modal object
            this.opened = {
              id: id,
              element: element,
              options: options
            };
            this.resize(this.opened);
            this.bindingEvents();

            options.open(element.scope());
            options.afterShow(element.scope());

            $rootScope.$broadcast('modalWasShown', id);
            this.clearWaiting();
          }.bind(this));
        },

        _renderModal: function (id, template, options) {
          var self = this;
          // Scope allows either a scope or an object:
          // - Scope - Use the scope to compile modal
          // - Object - Creates a new "isolate" scope and extend the isolate
          // scope with data being passed in
          //
          // Use the scope passed in
          var viewScope;
          if (angular.isScope(options.scope)) {
            viewScope = options.scope;

          } else {
            // Create an isolated scope and extend scope with value pass in
            viewScope = $rootScope.$new(true);

            if (angular.isObject(options.scope)) {
              angular.extend(viewScope, options.scope);
            }
          }

          angular.extend(options.attributes, {id: id});
          var element = angular.element(this.defaults.template).attr(options.attributes);
          var wrapper = angular.element(
            element[0].querySelector('.mac-modal-content-wrapper')
          );
          wrapper.html(template);

          if (options.overlayClose) {
            element.bind('click', function ($event) {
              if ($event.target && $event.target.className.indexOf('mac-modal-overlay') > -1) {
                viewScope.$apply(function () {
                  self.hide();
                });
              }
            });
          }

          if (options.controller) {
            // Modal controller has the following locals:
            // - $scope - Current scope associated with the element
            // - $element - Current modal element
            // - macModalOptions - Modal options
            //
            // macModalOptions is added to give user more information in the
            // controller when compiling modal
            $controller(options.controller, {
              $scope: viewScope,
              $element: element,
              macModalOptions: options
            });
          }

          $compile(element)(viewScope);
          return $animate.enter(element, angular.element(document.body))
          .then(function () {
            return element;
          });
        },

        _escapeHandler: function (event) {
          if (event.keyCode == keys.ESCAPE && service.opened) {
            var scope = service.opened.element.scope();

            scope.$apply(function () {
              service.hide();
            });
          }
        },

        _resizeHandler: function () {
          service.resize();
        },

        /**
         * Get modal template when created using module method
         *
         * @param {Object} options
         * @returns {Promise.<string>}
         */
        _getTemplate: function (options) {
          var path = options.templateUrl;

          if (path) {
            var template = $templateCache.get(path);

            if (template) {
              return $q.when(template);
            } else {
              return $http.get(path)
              .then(function (resp) {
                $templateCache.put(path, resp.data);
                return resp.data;
              }, function () {
                throw new Error('Failed to load template: ' + path);
              });
            }
          } else if (options.template) {
            return $q.when(options.template);
          }

          throw new Error('Missing template for modal');
        }
      }

      return service;
    }
  ];
})

/**
 * @param {Boolean}  keyboard          Allow closing modal with keyboard (default false)
 * @param {Boolean}  overlayClose      Allow closing modal when clicking on overlay (default false)
 * @param {Boolean}  resize            Allow modal to resize on window resize event (default true)
 * @param {Function} open              Callback when the modal is opened
 * @param {Integer}  topOffset         Top offset when the modal is larger than window height (default 20)
 * @param {String}   template          Modal HTML content
 * @param {String}   templateUrl       URL to load modal template
 * @param {String|Function} controller Controller for the modal
 * @param {Object}   attributes        Extra attributes to add to modal
 * @param {Function} beforeShow        Callback before showing the modal
 * @param {Function} afterShow         Callback when modal is visible with CSS transitions completed
 * @param {Function} beforeHide        Callback before hiding the modal
 * @param {Function} afterHide         Callback when modal is hidden from the user with CSS transitions completed
 * @param {Boolean}  position          Calculate size and position with JS (default true)
 *
 * angular.module("Mac").modal("myModal", {
 *   controller: "myController"
 *   template:   "<div></div>"
 * })
 *
 * Add modal shortcut to Mac module
 */
.config(['modalProvider', 'macModalDefaults', function (modal, macModalDefaults) {
  angular.module('Mac').modal = function (id, modalOptions) {
    if (!modal.registered[id]) {
      var options = {};
      angular.extend(options, macModalDefaults, modalOptions)

      modal.registered[id] = {
        id: id,
        options: options
      };
    }
  }
}]);

/**
 * @ngdoc service
 * @name popover
 * @description
 * Popover service to keep state of opened popover. Allowing user to hide certain
 * or all popovers
 *
 * @param {Array} popoverList The popover that's currently being shown
 *
 * @param {Array} registered Object storing all the registered popover DOM elements
 *
 * @param {Function} last Get data of the last popover
 * - Returns {Object} The last opened popover
 *
 * @param {Function} register Register a popover with an id and an element
 * - {String} id Popover id
 * - {Element} element Popover element
 * - Returns {Bool} If the id already existed
 *
 * @param {Function} unregister Remove id and element from registered list of popover
 * - {String} id Popover id
 * - Returns {Bool} If the id exist
 *
 * @param {Function} add Add a new popover to opened list
 * - {String} id Popover id
 * - {Element} popover Popover DOM element
 * - {Element} element Trigger DOM element
 * - {Object} options Additional options
 * - Returns {Object} The new popover object
 *
 * @param {Function} pop Get and remove the last popover from list
 * - Returns {Object} Last element from popoverList
 *
 * @param {Function} show Show and position a registered popover
 * - {String} id Popover id
 * - {Element} element Element that trigger the popover
 * - {Object} options Additional options for popover
 * - Returns {Promise.<Boolean>}
 *
 * @param {Function} getById Get opened popover object by id
 * - {String} id Popover id
 * - Returns {Object} Opened popover object
 *
 * @param {Function} reposition Update size and position of an opened popover
 * - {Object|String} popoverObj Support multiple type input:
 *   - Object: One of the popover objects in popoverList
 *   - String: Popover ID
 * - Returns {Promise.<Boolean>}
 *
 * @param {Function} hide Hide a certain popover. If no selector is provided, the
 * last opened popover is hidden
 * - {DOM Element|String} selector Support multiple type input:
 *   - DOM Element: Popover trigger element
 *   - String: Popover ID
 * - Returns {Promise.<Boolean>}
 *
 * @param {Function} hideAll Hide all popovers
 */

angular.module('Mac').provider('popover', function () {
  var registered = {};
  this.registered = registered;

  this.$get = [
    '$animate',
    '$compile',
    '$controller',
    '$http',
    '$parse',
    '$rootScope',
    '$templateCache',
    '$timeout',
    '$q',
    'macPopoverDefaults',
    function ($animate, $compile, $controller, $http, $parse, $rootScope, $templateCache, $timeout, $q, defaults) {
      return {
        popoverList: [],
        registered: registered,
        defaults: defaults.element,
        popoverDefaults: defaults.trigger,
        template: defaults.template,

        last: function () {
          if (this.popoverList.length === 0) return null

          return this.popoverList[this.popoverList.length - 1];
        },

        register: function (id, options) {
          var exist = this.registered[id];
          if (!exist) {
            this.registered[id] = options;
          }

          return !exist;
        },

        unregister: function (id) {
          var exist = this.registered[id];
          if (exist) {
            delete this.registered[id];
          }

          return !!exist;
        },

        add: function (id, popover, element, options) {
          var obj = {
            id: id,
            popover: popover,
            element: element,
            options: options
          };

          this.popoverList.push(obj);
          return obj;
        },

        pop: function () {
          return this.popoverList.pop();
        },

        /**
         * Compile template with proper settings
         * @param {string} id
         * @param {string} template
         * @param {object} options
         * @returns {Promise}
         * @private
         */
        _compilePopover: function (id, template, options) {
          var viewScope, popover, self = this;
          options = options || {};

          /**
           * Scope allows either a scope or an object:
           * - Scope - Use the scope to compile popover
           * - Object - Creates a new "isolated" scope and extend the isolated
           * scope with data being passed in
           */

          // Use the scope passed in
          if (options.scope && angular.isScope(options.scope)) {
            viewScope = options.scope.$new();

          // Create an isolated scope and extend scope with value passed in
          } else {
            viewScope = $rootScope.$new(true);

            if (options.scope && angular.isObject(options.scope)) {
              angular.extend(viewScope, options.scope);
            }
          }

          // Bind refresh on listener to popover
          if (options.refreshOn) {
            viewScope.$on(options.refreshOn, function () {
              self.reposition(id);
            });
          }

          // Bind controller to popover scope
          if (options.controller) {
            $controller(options.controller, {
              $scope: viewScope
            });
          }

          angular.extend(viewScope, {
            macPopoverClasses: {
              footer: options.footer || false,
              header: options.header || !!options.title || false
            },
            macPopoverTitle: options.title || '',
            macPopoverTemplate: template
          });

          popover = $compile(defaults.template)(viewScope);
          popover.attr({
            id: id,
            direction: options.direction || defaults.trigger.direction
          });

          return $q.when(popover);
        },

        /**
         * Return template from either options, template cache or fetch from url
         * @param {Object} options
         * @returns {Promise}
         * @private
         */
        _getTemplate: function (options) {
          if (options.template) {
            return $q.when(options.template);
          } else if (options.templateUrl) {
            var path = options.templateUrl;
            // Check if template cache has the template
            var template = $templateCache.get(path);

            if (template) {
              return $q.when(template);
            } else {
              return $http.get(path).then(function (resp) {
                $templateCache.put(path, resp.data);
                return resp.data;
              }, function () {
                return $q.reject('Failed to load template: ' + path);
              });
            }
          }

          return $q.reject();
        },

        /**
         * Get popover container based on options
         * - null: Use document.body
         * - true: Use parent of element
         * - string: Check scope for the variable
         * - DOM Element: Use the element
         * @param {Element} element Trigger DOM element
         * @param {Object} options
         * @returns {Element}
         * @private
         */
        _getContainer: function (element, options) {
          if (options.container === true) {
            return element.parent();

          } else if (angular.isString(options.container)) {
            var container = $parse(options.container)(element.scope());
            if (angular.isElement(container)) return container;

          } else if (angular.isElement(options.container)) {
            return options.container
          }

          return angular.element(document.body);
        },

        show: function (id, element, options) {
          options = options || {};

          var popoverOptions = this.registered[id];
          if (!popoverOptions) {
            return $q.reject(false);
          }

          var combinedObject = angular.extend({}, popoverOptions, options);

          return this._getTemplate(combinedObject)
            .then(function (template) {
              return this._compilePopover(id, template, combinedObject);
            }.bind(this))
            .then(function (popover) {
              var container = this._getContainer(element, combinedObject);

              var popoverObj = this.add(id, popover, element, options);
              $animate.addClass(element, 'active');

              $rootScope.$broadcast('popoverWasShown', id);

              return $animate.enter(popover, container)
                .then(function () {
                  return popoverObj;
                });
            }.bind(this))
            .then(function (popoverObj) {
              return this.reposition(popoverObj);
            }.bind(this));
        },

        getById: function (id, element) {
          var i, item;
          for (i = 0; i < this.popoverList.length; i++) {
            item = this.popoverList[i];
            if (item.id === id && (!element || item.element === element)) {
              return item;
            }
          }
          return null;
        },

        reposition: function (popoverObj) {
          if (angular.isString(popoverObj)) {
            popoverObj = this.getById(popoverObj);
          }

          if (!popoverObj) return $q.reject();

          var currentPopover = popoverObj.popover;
          var relativeElement = popoverObj.element;
          var options = popoverObj.options;
          var $window = angular.element(window);

          var offset = relativeElement.offset();

          // Calculate relative offset to the container
          var container = this._getContainer(relativeElement, options);
          var containerOffset = {top: 0, left: 0};
          if (container[0] !== document.body) {
            if (container[0].nodeName !== 'HTML') {
              containerOffset = container.offset();
            }

            offset.top -= containerOffset.top;
            offset.left -= containerOffset.left;
          }

          var relative = {
            height: relativeElement.outerHeight(),
            width: relativeElement.outerWidth()
          };

          var current = {
            height: currentPopover.outerHeight(),
            width: currentPopover.outerWidth()
          };

          var position = (currentPopover.attr('direction') || 'above left').trim();

          var calculatedOffset = this.calculateOffset(position, current, relative);

          // Calculate if popover is clipped by window, swap direction otherwise
          var topScroll = $window.scrollTop();
          var leftScroll = $window.scrollLeft();
          var action = {};

          // if position is either above or below
          if (position.indexOf('middle') === -1) {
            if (offset.top + calculatedOffset.top - topScroll < 0) {
              action = {remove: 'above', add: 'below'};
            } else if (offset.top + calculatedOffset.top + current.height - topScroll > $window.height()) {
              action = {remove: 'below', add: 'above'};
            }

          // if position is middle
          } else {
            var diff = offset.top + calculatedOffset.top - topScroll;
            if (diff >= 0) {
              diff += currentPopover.outerHeight() - $window.height();
              if (diff < 0) {
                diff = null;
              }
            }

            if (diff) {
              var tip = angular.element(currentPopover[0].getElementsByClassName('tip'));
              // calculatedOffset.top -= diff;
              var tipOffset = +tip.css('margin-tip').replace('px', '');
              tip.css('margin-top', tipOffset + diff);
            }
          }

          // Update offset for above or below
          if (action.remove && action.add) {
            position = position.replace(action.remove, action.add);
          }

          // Clear action for left and right
          action = {};

          // Right align originally, switching to left
          if (offset.left + calculatedOffset.left - leftScroll < 0) {
            action = {remove: 'right', add: 'left'};

          // Left align originally, switch to right
          } else if (offset.left + calculatedOffset.left + currentPopover.outerWidth() - leftScroll > $window.width()) {
            action = {remove: 'left', add: 'right'};
          }

          if (action.remove && action.add) {
            position = position.replace(action.remove, action.add);
          }

          calculatedOffset = this.calculateOffset(position, current, relative);

          offset.top += calculatedOffset.top;
          offset.left += calculatedOffset.left;

          // Add any configured offset on the popover trigger
          if (options.offsetX !== undefined) {
            offset.left += options.offsetX;
          }

          if (options.offsetY !== undefined) {
            offset.top += options.offsetY;
          }

          angular.forEach(offset, function (value, key) {
            if (!isNaN(+value)) {
              value = value + 'px';
            }
            currentPopover.css(key, value);
          });

          currentPopover.addClass('visible ' + position);

          return $q.when(true);
        },

        calculateOffset: function (position, current, relative) {
          var offset = {top: 0, left: 0};

          switch (position) {
            case "above left":
              offset.top = -(current.height + 10);
              offset.left = -25 + relative.width / 2;
              break;
            case "above right":
              offset.top = -(current.height + 10);
              offset.left = 25 + relative.width / 2 - current.width;
              break;
            case "below left":
              offset.top = relative.height + 10;
              offset.left = -25 + relative.width / 2;
              break;
            case "below right":
              offset.top = relative.height + 10;
              offset.left = 25 + relative.width / 2 - current.width;
              break;
            case "middle right":
              offset.top = relative.height / 2 - current.height / 2;
              offset.left = relative.width + 10;
              break;
            case "middle left":
              offset.top = relative.height / 2 - current.height / 2;
              offset.left = -(current.width + 10);
              break;
          }

          return offset;
        },

        // Hides the currently shown popover
        hide: function (selector) {
          var comparator, i, index = -1, popoverObj;

          // Don't need to hide when no popover is opened
          if (this.popoverList.length === 0) {
            return $q.when();
          }

          if (selector) {
            if (angular.isString(selector)) {
              comparator = function (item) {
                return item.id === selector;
              };
            } else if (angular.isElement(selector)) {
              comparator = function (item) {
                return item.element === selector;
              };
            }

            for (i = this.popoverList.length - 1; i >= 0; i--) {
              if (comparator(this.popoverList[i])) {
                popoverObj = this.popoverList[i];
                index = i;
                break;
              }
            }

            if (index > -1) {
              this.popoverList.splice(index, 1);
            }

          } else {
            // Get the last popover element
            popoverObj = this.popoverList.pop();
          }

          if (!popoverObj) return;

          $rootScope.$broadcast('popoverBeforeHide', popoverObj.id);

          // Remove active class on popover trigger
          $animate.removeClass(popoverObj.element, 'active');

          var removeScope = popoverObj.popover.scope();
          return $animate.leave(popoverObj.popover).then(function () {
            $rootScope.$broadcast('popoverWasHidden', popoverObj.id);

            removeScope.$destroy();
            return true;
          });
        },

        // Hides all the currently shown popover
        hideAll: function () {
          while (this.popoverList.length) {
            this.hide();
          }
        }
      };
    }
  ];
}).

config(['popoverProvider', 'macPopoverDefaults', function (popoverProvider, defaults) {
  angular.module('Mac').popover = function (name, options) {
    if (!popoverProvider.registered[name]) {
      var opts = {};
      angular.extend(opts, defaults.trigger, options, {id: name});
      popoverProvider.registered[name] = opts;
    }
  };
}]);

/**
 * @ngdoc service
 * @name scrollSpy
 * @description
 * There are multiple components used by scrollspy
 * - Scrollspy service is used to keep track of all and active anchors
 * - Multiple directives including:
 * - mac-scroll-spy - Element to spy scroll event
 * - mac-scroll-spy-anchor - Section in element spying on
 * - mac-scroll-spy-target - Element to highlight, most likely a nav item
 *
 * @param {Function} register Register an anchor with the service
 * - {String} id ID of the anchor
 * - {Element} element Element to spy on
 *
 * @param {Function} unregister Remove anchor from service
 * - {String} id ID of the anchor
 *
 * @param {Function} setActive Set active anchor and fire all listeners
 * - {Object} anchor Anchor object
 *
 * @param {Function} addListener Add listener when active is set
 * - {Function} fn Callback function
 *
 * @param {Function} removeListener Remove listener
 * - {Function} fn Callback function
 */
angular.module('Mac').service('scrollSpy', [
  function() {
    return {
      registered: [],
      active: {},
      listeners: [],

      register: function(id, element) {
        var anchor = {
          id: id,
          element: element,
          top: element.offset().top
        };
        this.registered.push(anchor);
        this.sort();
        return anchor;
      },

      updateOffset: function(anchor) {
        anchor.top = anchor.element.offset().top;
        this.sort();
      },

      sort: function() {
        this.registered.sort(function(a, b) {
          if (a.top > b.top) {
            return 1;
          } else if (a.top < b.top) {
            return -1;
          }
          return 0;
        });
      },

      unregister: function(id) {
        var index = -1, i;
        for (i = 0; i < this.registered.length; i++) {
          if (this.registered[i].id === id) {
            index = i;
            break;
          }
        }

        if (index !== -1) {
          this.registered.splice(index, 1);
        }
      },

      last: function() {
        return this.registered[this.registered.length - 1];
      },

      setActive: function(anchor) {
        var i;
        if (this.active.id === anchor.id) {
          return;
        }
        this.active = anchor;
        for (i = 0; i < this.listeners.length; i++) {
          this.listeners[i](anchor);
        }
      },

      addListener: function(fn) {
        return this.listeners.push(fn);
      },

      removeListener: function(fn) {
        var index = this.listeners.indexOf(fn);
        if (index !== -1) {
          this.listeners.splice(index, 1);
        }
      }
    };
  }
]);

/**
 * @ngdoc service
 * @name timeUtil
 * @description
 * All utility functions for MacTime
 */
angular.module('Mac').factory('macTimeUtil', [
  '$filter',
  '$timeout',
  'macTimeDefaults',
  'util',
  function($filter, $timeout, defaults, util) {
    /**
     * @ngdoc method
     * @name timeUtil#initializeTime
     * @description
     * Generate Date object based on options
     * @param {Object} options
     * @returns {Date}
     */
    function initializeTime (options) {
      var currentDate = new Date().toDateString(), time;

      time = new Date(currentDate + ' ' + options.default);

      if (isNaN(time.getTime())) {
        time = new Date(currentDate + ' ' + defaults.default);
      }

      return time;
    }

    /**
     * @ngdoc method
     * @name timeUtil#getSelection
     * @description
     * Get element cursor section
     * @param {Element} element
     * @returns {String}
     */
    function getSelection (element) {
      var start = element[0].selectionStart;

      if (0 <= start && start < 3){
        return 'hour';
      } else if (3 <= start && start < 6) {
        return 'minute';
      } else if (6 <= start  && start < 9) {
        return 'meridian';
      }
    }

    /**
     * A wrapper for setSelectionRange with a timeout 0
     * @param {Element} element
     * @param {Number} start
     * @param {Number} end
     */
    function selectRange (element, start, end) {
      $timeout(function () {
        element[0].setSelectionRange(start, end);
      }, 0, false);
    }

    /**
     * Select hour block
     * @param {Element} element
     */
    function selectHours (element) {
      selectRange(element, 0, 2);
    }

    /**
     * Select minute block
     * @param {Element} element
     */
    function selectMinutes (element) {
      selectRange(element, 3, 5);
    }

    /**
     * Select meridian block (AM/PM)
     * @param {Element} element
     */
    function selectMeridian (element) {
      selectRange(element, 6, 8);
    }

    /**
     * Select/highlight next block
     * hour -> minute
     * minute -> meridian
     * meridian -> meridian (no next block)
     * @param {Element} element
     */
    function selectNextSection (element) {
      switch (getSelection(element)) {
        case 'hour':
          selectMinutes(element);
          break;
        case 'minute':
        case 'meridian':
          selectMeridian(element);
          break;
      }
    }

    /**
     * Select/highlight previous block
     * hour -> hour (no previous block)
     * minute -> hour
     * meridian -> minute
     * @param {Element} element
     */
    function selectPreviousSection (element) {
      switch (getSelection(element)) {
        case 'hour':
        case 'minute':
          selectHours(element);
          break;
        case 'meridian':
          selectMinutes(element);
          break;
      }
    }

    /**
     * Toggle time hour based on meridian value
     * @param {Date} time
     * @param {String} meridian
     */
    function setMeridian (time, meridian) {
      var hours = time.getHours();

      if (hours >= 12 && meridian === 'AM') {
        hours -= 12;
      } else if (hours < 12 && meridian === 'PM') {
        hours += 12;
      }

      time.setHours(hours);
    }

    /**
     * Toggle time hour
     * @param {Date} time
     */
    function toggleMeridian (time) {
      var hours = time.getHours();
      time.setHours((hours + 12) % 24);
    }

    /**
     * Change hour, wrapper for setHours
     * @param {Date} time
     * @param {Number} change
     */
    function incrementHour (time, change) {
      time.setHours(time.getHours() + change);
    }

    /**
     * Change minute, wrapper for setMinutes
     * @param {Date} time
     * @param {Number} change
     */
    function incrementMinute (time, change) {
      time.setMinutes(time.getMinutes() + change);
    }

    /**
     * Update input view value with ngModelController
     * @param {Date} time
     * @param {ngController} controller
     */
    function updateInput (time, controller) {
      var displayTime = $filter('date')(time.getTime(), 'hh:mm a');

      if (displayTime !== controller.$viewValue) {
        controller.$setViewValue(displayTime);
        controller.$render();
      }
    }

    /**
     * Update time with ngModelController model value
     * @param {Date} time
     * @param {ngController} controller
     */
    function updateTime (time, controller) {
      var timeMatch = util.validateTime(controller.$modelValue),
          hours, minutes, meridian;

      if (timeMatch) {
        hours = +timeMatch[1];
        minutes = +timeMatch[2];
        meridian = timeMatch[3];

        if (meridian == 'PM' && hours != 12) hours += 12;
        if (meridian == 'AM' && hours == 12) hours = 0;

        time.setHours(hours, minutes);
      }
    }

    return {
      getSelection: getSelection,
      incrementHour: incrementHour,
      incrementMinute: incrementMinute,
      initializeTime: initializeTime,
      selectHours: selectHours,
      selectMeridian: selectMeridian,
      selectMinutes: selectMinutes,
      selectNextSection: selectNextSection,
      selectPreviousSection: selectPreviousSection,
      selectRange: selectRange,
      setMeridian: setMeridian,
      toggleMeridian: toggleMeridian,
      updateInput: updateInput,
      updateTime: updateTime
    };
  }
]);

/**
 * @ngdoc service
 * @name util
 * @description
 * A bunch of utility functions
 */
angular.module('Mac.Util', []).factory('util', ['$filter', function($filter) {
  var inflectionConstants = {
    "uncountables": ["sheep", "fish", "moose", "series", "species", "money", "rice", "information", "info", "equipment", "min"],
    "irregulars": {
      "child": "children",
      "man": "men",
      "woman": "women",
      "person": "people",
      "ox": "oxen",
      "goose": "geese"
    },
    "pluralizers": [
      [/(quiz)$/i, "$1zes"],
      [/([m|l])ouse$/i, "$1ice"],
      [/(matr|vert|ind)(ix|ex)$/i, "$1ices"],
      [/(x|ch|ss|sh)$/i, "$1es"],
      [/([^aeiouy]|qu)y$/i, "$1ies"],
      [/(?:([^f])fe|([lr])f)$/i, "$1$2ves"],
      [/sis$/i, "ses"],
      [/([ti])um$/i, "$1a"],
      [/(buffal|tomat)o$/i, "$1oes"],
      [/(bu)s$/i, "$1ses"],
      [/(alias|status)$/i, "$1es"],
      [/(octop|vir)us$/i, "$1i"],
      [/(ax|test)is$/i, "$1es"],
      [/x$/i, "xes"],
      [/s$/i, "s"],
      [/$/, "s"]
    ]
  };

  var cssPrefixes = ['webkit', 'Moz', 'ms', 'O'];

  /**
   * @constant {string} timeRegexStr
   * @example
   * 01:30 PM or 9:45 AM
   * @private
   */
  var timeRegexStr = '^' +
    '(0?[1-9]|1[0-2])' +  // hours (starting zero optional)
    ':' +                 // colon
    '([0-5][0-9])' +      // minute
    '[\\s]' +             // space
    '([AP]M)' +           // meridian
    '$';
  var timeRegex = new RegExp(timeRegexStr);

  /**
    * @constant {string} urlRegexStr
    * @see {@link http://tools.ietf.org/html/rfc3986#section-2.2}
    * @private
    */
  var urlRegexStr = '(?:' +
      '(http[s]?):\\/\\/' +     // protocol (optional)
    ')?' +
    '(?:' +
      '(www|[\\d\\w\\-]+)\\.' + // subdomain (optional)
    ')?' +
    '([\\d\\w\\-]+)\\.' +       // domain
    '([A-Za-z]{2,6})' +         // tld
    '(:[\\d]*)?'  +             // port (optional)
    '([' +                      // path (optional)
      ':\\/?#\\[\\]@' +         // rfc3986 gen-delims
      '!$&\'()*+,;=' +          // rfc3986 sub-delims
      '\\w\\d-._~' +            // rfc3986 unreserved characters
      '%\\\\' +                 // additional characters
    ']*)?';
  var urlRegex = new RegExp(urlRegexStr, 'i');

  var emailRegex =  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  return {
    /**
     * @ngdoc method
     * @name util#pluralize
     * @description
     * Pluralize string based on the count
     *
     * @param {String} string String to pluralize (default '')
     * @param {Integer} count Object counts
     * @param {Boolean} includeCount Include the number or not (default false)
     *
     * @returns {String} Pluralized string based on the count
     *
     * @example
util.pluralize("apple", 5)
=> "apples"
util.pluralize("apple", 10, true)
=> "10 apples"
     */
    pluralize: function(string, count, includeCount) {
      var irregulars, isUppercase, lowercaseWord, pluralizedString, pluralizedWord, pluralizer, pluralizers, uncountables, word, i;
      string = string || '';
      includeCount = includeCount || false;
      if (!angular.isString(string) || this.trim(string).length === 0) {
        return string;
      }
      if (includeCount && isNaN(+count)) {
        return "";
      }
      if (count === undefined) {
        count = 2;
      }

      pluralizers = inflectionConstants.pluralizers;
      uncountables = inflectionConstants.uncountables;
      irregulars = inflectionConstants.irregulars;

      word = string.split(/\s/).pop();
      isUppercase = word.toUpperCase() === word;
      lowercaseWord = word.toLowerCase();

      pluralizedWord = count === 1 || uncountables.indexOf(lowercaseWord) >= 0 ? word : null;

      if (pluralizedWord === null && irregulars[lowercaseWord]) {
        pluralizedWord = irregulars[lowercaseWord];
      }

      if (!pluralizedWord) {
        for (i = 0; i < pluralizers.length; i++) {
          pluralizer = pluralizers[i];
          if (!(pluralizer[0].test(lowercaseWord))) {
            continue;
          }
          pluralizedWord = word.replace(pluralizer[0], pluralizer[1]);
          break;
        }
      }
      pluralizedWord = pluralizedWord || word;
      if (isUppercase) {
        pluralizedWord = pluralizedWord.toUpperCase();
      }
      pluralizedString = string.slice(0, -word.length) + pluralizedWord;
      if (includeCount) {
        return ($filter("number")(count)) + " " + pluralizedString;
      } else {
        return pluralizedString;
      }
    },

    /**
     * @ngdoc method
     * @name util#trim
     * @description
     * Trimming whitespaces on strings
     * @param {String} string input
     * @returns {String} Trimmed string
     */
    trim: function(string) {
      var str;
      str = String(string) || "";
      if (String.prototype.trim !== null) {
        return str.trim();
      } else {
        return str.replace(/^\s+|\s+$/gm, "");
      }
    },

    /**
     * @ngdoc method
     * @name util#capitalize
     * @description
     * Capitalize string
     * @param {String} string
     * @returns {String}
     *
     * @example
util.capitalize('lowercase')
=> "Lowercase"
     */
    capitalize: function(string) {
      var str;
      str = String(string) || "";
      return str.charAt(0).toUpperCase() + str.substring(1);
    },

    /**
     * @ngdoc method
     * @name util#uncapitalize
     * @description
     * Convert the first character to lowercase
     * @param {String} string
     * @returns {String}
     *
     * @example
util.uncapitalize('UPPERCASE')
=> "uPPERCASE"
     */
    uncapitalize: function(string) {
      var str;
      str = String(string) || "";
      return str.charAt(0).toLowerCase() + str.substring(1);
    },

    /**
     * @ngdoc method
     * @name util#toCamelCase
     * @description
     * Convert string with dashes, underscores and spaces to camel case
     * @param {String} string
     * @returns {String}
     *
     * @example
this-is-a-test => thisIsATest
another_test => anotherTest
hello world again => helloWorldAgain
a mix_of-everything => aMixOfEverything
     */
    toCamelCase: function(string) {
      string = string || '';
      return this.trim(string).replace(/[-_\s]+(.)?/g, function(match, c) {
        return c.toUpperCase();
      });
    },

    /**
     * @ngdoc method
     * @name util#toSnakeCase
     * @description
     * Convert other cases into snake case (separated by underscores)
     * @param {String} string
     * @returns {String}
     *
     * @example
util.toSnakeCase("just another string")
=> "just_another_string"
     */
    toSnakeCase: function(string) {
      string = string || '';
      return this.trim(string).replace(/([a-z\d])([A-Z]+)/g, "$1_$2").replace(/[-\s]+/g, "_").toLowerCase();
    },

    /**
     * @ngdoc method
     * @name util#convertKeysToCamelCase
     * @description
     * Convert object keys to camel case
     * @param {Object} object
     * @returns {Object}
     *
     * @example
util.toSnakeCase({'hello-world': 'test'})
=> {'helloWorld': 'test'}
     */
    convertKeysToCamelCase: function(object) {
      var key, result = {}, value;
      for (key in object) {
        value = object[key];
        key = this.toCamelCase(key);

        if (value && typeof value === 'object' && value.constructor !== Array) {
          value = this.convertKeysToCamelCase(value);
        }

        result[key] = value;
      }
      return result;
    },

    /**
     * @ngdoc method
     * @name util#convertKeysToSnakeCase
     * @description
     * Convert object keys to snake case
     * @param {Object} object
     * @returns {Object}
     *
     * @example
util.toSnakeCase({'helloWorld': 'test'})
=> {'hello_world': 'test'}
     */
    convertKeysToSnakeCase: function(object) {
      var key, result = {}, value;
      for (key in object) {
        value = object[key];
        key = this.toSnakeCase(key);

        if (value && typeof value === 'object' && value.constructor !== Array) {
          value = this.convertKeysToSnakeCase(value);
        }

        result[key] = value;
      }
      return result;
    },

    /**
     * @ngdoc method
     * @name util#pyth
     * @description
     * pythagoras theorem
     * @param {Integer} a
     * @param {Integer} b
     * @returns {Integer}
     */
    pyth: function(a, b) {
      return Math.sqrt(a * a + b * b);
    },

    /**
     * @ngdoc method
     * @name util#degrees
     * @description
     * Convert from radian to degrees
     * @param {Number} radian
     * @returns {Number}
     */
    degrees: function(radian) {
      return (radian * 180) / Math.PI;
    },

    /**
     * @ngdoc method
     * @name util#radian
     * @description
     * Convert degree to radian
     * @param {Number} degrees
     * @returns {Number}
     */
    radian: function(degrees) {
      return (degrees * Math.PI) / 180;
    },

    /**
     * @ngdoc method
     * @name util#hex2rgb
     * @description
     * Convert hex color value to rgb
     * @param {String} hex
     * @returns {Object} Object with r, g, and b values
     */
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

    /**
     * @ngdoc method
     * @name util#validateUrl
     * @description
     * Parse url
     * @param {String} url
     * @returns {Object} Object with url sections parsed out
     *
     * @example
 input: www.example.com:9000/testing
 output: {
   url: 'www.example.com:9000/testing',
   protocol: 'http',
   subdomain: 'www',
   name: 'example',
   domain: 'com',
   port: '9000',
   path: '/testing'
 }
     */
    validateUrl: function(url) {
      var match = urlRegex.exec(url);
      if (match !== null) {
        match = {
          url: match[0],
          protocol: match[1] || "http",
          subdomain: match[2],
          name: match[3],
          domain: match[4],
          port: match[5],
          path: match[6] || "/"
        };
      }
      return match;
    },

    /**
     * @ngdoc method
     * @name util#validateEmail
     * @description
     * Check if input string is a valid email address
     * @param {String} email
     * @returns {Boolean}
     */
    validateEmail: function(email) {
      return emailRegex.test(email);
    },

    /**
     * @ngdoc method
     * @name util#validateTime
     * @description
     * Check if time input match time regex
     * @param {String} time
     * @returns {Object}
     */
    validateTime: function(time) {
      return timeRegex.exec(time);
    },

    /**
     * @ngdoc method
     * @name util#getQueryString
     * @description
     * Return param value in querystring
     * @see {@link http://www.netlobo.com/url_query_string_javascript.html}
     * @param {String} url
     * @param {String} name
     * @returns {String}
     *
     * @example
util.getQueryString('http://www.example.com/macgyver?season=1&episode=3&time=12:23', 'episode')
=> 3
     */
    getQueryString: function(url, name) {
      var regex, regexS, results;
      name = name || '';
      name = name.replace(/\[/, "\[").replace(/\]/, "\]");
      regexS = "[\?&]" + name + "=([^&#]*)";
      regex = new RegExp(regexS);
      results = regex.exec(url);

      return results ? results[1] : '';
    },

    /**
     * @ngdoc method
     * @name util#parseUrlPath
     * @param {String} fullPath
     * @returns {Object}
     *
     * @example
util.parseUrlPath('http://www.example.com/macgyver?season=1&episode=3&time=12:23')
=> {
  fullPath: 'http://www.example.com/macgyver?season=1&episode=3&time=12:23',
  path: 'http://www.example.com',
  pathComponents: [
    'http:', '', 'www.example.com', 'macgyver'
  ],
  verb: 'macgyver',
  queryies: {
    season: '1',
    episode: '3',
    time: '12:23'
  }
}
     */
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

    /**
     * @ngdoc method
     * @name util#extendAttributes
     * @description
     * Extend default values with attribute
     * @param {String} prefix Prefix of all attributes
     * @param {Object} defaults Default set of attributes
     * @param {Object} attributes User set attributes
     * @returns {Object}
     */
    extendAttributes: function(prefix, defaults, attributes) {
      var altKey, key, macKey, output, value, outputValue;
      prefix = prefix || '';
      output = {};
      for (key in defaults) {
        if (!defaults.hasOwnProperty(key)) continue;

        value = defaults[key];
        altKey = prefix ? this.capitalize(key) : key;
        macKey = "" + prefix + altKey;
        outputValue = attributes[macKey] != null ? attributes[macKey] || true : value;

        // Convert to true boolean if passing in boolean string
        if (outputValue === "true" || outputValue === "false") {
          outputValue = outputValue === "true";

        // Convert to integer or numbers from strings
        } else if (outputValue != null && outputValue.length > 0 && !isNaN(+outputValue)) {
          outputValue = +outputValue;
        }

        output[key] = outputValue;
      }
      return output;
    },

    getCssVendorName: function (el, name) {
      var i, prefix;
      var capitalizedName = this.capitalize(name);
      for (i = 0; i < cssPrefixes.length; i++) {
        prefix = cssPrefixes[i];

        if (el.style.hasOwnProperty(prefix + capitalizedName)) {
          return prefix + capitalizedName;
        }
      }
      return name;
    }
  };
}]);

})(window, window.angular);