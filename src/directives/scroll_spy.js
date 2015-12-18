/**
 * @chalk overview
 * @name mac-scroll-spy
 *
 * @description
 * Element to spy scroll event on
 *
 * @param {Integer} mac-scroll-spy-offset Top offset when calculating scroll position
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
 * @chalk overview
 * @name mac-scroll-spy-anchor
 * @description
 * Section in the spied element
 * @param {String} id Id to identify anchor
 * @param {String} mac-scroll-spy-anchor ID to identify anchor (use either element or this attribute)
 * @param {Event} refresh-scroll-spy To refresh the top offset of all scroll anchors
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
 * @chalk overview
 * @name mac-scroll-spy-target
 * @description
 * Element to highlight when anchor scroll into view
 * @param {String} mac-scroll-spy-target Name of the anchor
 * @param {String} mac-scroll-spy-target-class Class to apply for highlighting (default active)
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
