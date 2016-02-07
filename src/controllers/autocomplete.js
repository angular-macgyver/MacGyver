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
