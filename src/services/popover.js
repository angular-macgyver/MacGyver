/**
 * @chalk overview
 * @name Popover
 */

/**
 * @chalk provider
 * @name Popover Provider
 *
 * @description
 * Configurate popover options in config block.
 * @param {Object} defaults Popover defaults
 *
 * ```js
 * {
 *   offsetY: 0,
 *   offsetX: 0,
 *   trigger: "click"
 * }
 * ```
 *
 * @param {Object} popoverDefaults Popover trigger defaults
 * ```js
 * {
 *   footer: false,
 *   header: false,
 *   title: "",
 *   direction: "above left"
 * }
 * ```
 *
 * @param {String} template Popover template
 * ```js
 * "<div class=\"mac-popover\" ng-class=\"macPopoverClasses\">
 *   <div class=\"tip\"></div>
 *     <div class=\"popover-header\">
 *       <div class=\"title\">{{macPopoverTitle}}</div>
 *     </div>
 *   <div mac-popover-fill-content></div>
 * </div>";
 * ```
 */

/**
 * @chalk service
 * @name Popover Service
 *
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
 * - {DOM Element} element Popover element
 * - Returns {Bool} If the id already existed
 *
 * @param {Function} unregister Remove id and element from registered list of popover
 * - {String} id Popover id
 * - Returns {Bool} If the id exist
 *
 * @param {Function} add Add a new popover to opened list
 * - {String} id Popover id
 * - {DOM Element} popover Popover DOM element
 * - {DOM Element} element Trigger DOM element
 * - {Object} options Additional options
 * - Returns {Object} The new popover object
 *
 * @param {Function} pop Get and remove the last popover from list
 * - Returns {Object} Last element from popoverList
 *
 * @param {Function} show Show and position a registered popover
 * - {String} id Popover id
 * - {DOM Element} element Element that trigger the popover
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
    '$rootScope',
    '$templateCache',
    '$timeout',
    '$q',
    'macPopoverDefaults',
    function ($animate, $compile, $controller, $http, $rootScope, $templateCache, $timeout, $q, defaults) {
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

          return !!!exist;
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
         * @name _compilePopover
         * @private
         * @description
         * Compile template with proper settings
         * @param {string} id
         * @param {string} template
         * @param {object} options
         * @returns {Promise}
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
         * @name _getTemplate
         * @private
         * @description
         * Return template from either options, template cache or fetch from url
         * @param {Object} options
         * @returns {Promise}
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

        show: function (id, element, options) {
          options = options || {};

          var popoverOptions = this.registered[id];
          if (!popoverOptions) {
            return $q.reject(false);
          }

          var self = this;
          var combinedObject = angular.extend({}, popoverOptions, options);

          return this._getTemplate(combinedObject)
            .then(function (template) {
              return self._compilePopover.call(self, id, template, combinedObject);
            })
            .then(function (popover) {
              var popoverObj = self.add.call(self, id, popover, element, options);
              $animate.addClass(element, 'active');

              $rootScope.$broadcast('popoverWasShown', id);

              return $animate.enter(popover, angular.element(document.body))
                .then(function () {
                  return popoverObj;
                });
            })
            .then(function (popoverObj) {
              return self.reposition.call(self, popoverObj);
            });
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
          $window = angular.element(window);

          var offset = relativeElement.offset();

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
          } else if (offset.left + calculatedOffset.left + currentPopover.outerWidth() - leftScroll) {
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
