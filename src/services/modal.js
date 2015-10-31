/**
 * @chalk overview
 * @name Modal
 */

/**
 * @chalk provider
 * @name Modal Provider
 *
 * @description
 * Configure modal options in config block
 *
 * @param {Object} defaults Modal default
 * ```js
 * {
 *   keyboard: false,
 *   overlayClose: false,
 *   resize: false,
 *   position: true,
 *   open: angular.noop,
 *   topOffset: 20,
 *   attributes: {},
 *   beforeShow: angular.noop,
 *   afterShow: angular.noop,
 *   beforeHide: angular.noop,
 *   afterHide: angular.noop
 * }
 * ```
 */

/**
 * @chalk service
 * @name Modal Service
 *
 * @description
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
 * - {Modal Object} modalObject The modal to reposition and resize (default opened modal)
 *
 * @param {Function} hide Hide currently opened modal
 * - {Function} callback Callback after modal has been hidden
 *
 * @param {Function} bindingEvents Binding escape key or resize event
 * - {String} action Either to bind or unbind events (default 'bind')
 *
 * @param {Function} register Registering modal with the service
 * - {String} id ID of the modal
 * - {DOM element} element The modal element
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
            showOptions = {};

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
         * @name resize
         * @description
         * Update the position and also the size of the modal
         * @param {Modal Object} modalObject The modal to reposition and resize (default opened modal)
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
         * @name hide
         * @description
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
         * @description
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
         * @name register
         * @description
         * Registering modal with the service
         * @param {String} id ID of the modal
         * @param {DOM element} element The modal element
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
         * @name unregister
         * @description
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
         * @name clearWaiting
         * @description
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
          if (event.keyCode == keys.ESCAPE && this.opened) {
            var scope = this.opened.element.scope();

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
