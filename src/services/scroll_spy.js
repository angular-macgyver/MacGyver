/**
 * @chalk overview
 * @name Scroll Spy Service
 *
 * @description
 * There are multiple components used by scrollspy
 * - Scrollspy service is used to keep track of all and active anchors
 * - Multiple directives including:
 * - mac-scroll-spy - Element to spy scroll event
 * - mac-scroll-spy-anchor - Section in element spying on
 * - mac-scroll-spy-target - Element to highlight, most likely a nav item
 *
 * Scrollspy defaults:
 * offset - 0
 *
 * @param {Function} register Register an anchor with the service
 * - {String} id ID of the anchor
 * - {DOM Element} element Element to spy on
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
