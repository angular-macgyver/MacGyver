###
@chalk overview
@name mac-scroll-spy

@description
Element to spy scroll event on

@param {Integer} mac-scroll-spy-offset Top offset when calculating scroll position
###
angular.module("Mac").directive("macScrollSpy", [
  "scrollSpy"
  "scrollSpyDefaults"
  "util"
  (scrollSpy, defaults, util) ->
    link: ($scope, element, attrs) ->
      options = util.extendAttributes "macScrollSpy", defaults, attrs

      spyElement =
        if element.is("body")
          angular.element window
        else
          element

      spyElement.on "scroll.scroll-spy", ($event) ->
        scrollTop    = spyElement.scrollTop() + options.offset
        scrollHeight = this.scrollHeight or element[0].scrollHeight
        maxScroll    = scrollHeight - spyElement.height()

        return true if scrollTop >= maxScroll or not scrollSpy.registered.length

        for i in [0..scrollSpy.registered.length - 1]
          anchors = scrollSpy.registered
          if scrollSpy.active.id isnt anchors[i].id and
              scrollTop >= anchors[i].top and
              (not anchors[i + 1] or scrollTop <= anchors[i + 1].top)
            $scope.$apply ->
              scrollSpy.setActive anchors[i]
            return true

]).

#
# @chalk overview
# @name mac-scroll-spy-anchor
# @description
# Section in the spied element
# @param {Event} refresh-scroll-spy To refresh the top offset of all scroll spy anchors
#

directive("macScrollSpyAnchor", [
  "scrollSpy"
  (scrollSpy) ->
    compile: (element, attrs) ->
      id = attrs.id or attrs.macScrollSpyAnchor

      unless id
        throw new Error("Missing scroll spy anchor id")

      interpolate = id.match /{{(.*)}}/

      ($scope, element, attrs) ->
        registering  = ->
          return unless id
          scrollSpy.register id, element
          $scope.$on "$destroy", -> scrollSpy.unregister id

        $scope.$on "refresh-scroll-spy", registering

        if interpolate
          attrs.$observe "macScrollSpyAnchor", (value) ->
            id = value
            registering()
        else
          registering()
]).

#
# @chalk overview
# @name mac-scroll-spy-target
# @description
# Element to highlight when anchor scroll into view
# @param {String} mac-scroll-spy-target Name of the anchor
#
directive("macScrollSpyTarget", [
  "scrollSpy"
  (scrollSpy) ->
    compile: (element, attrs) ->
      target = attrs.macScrollSpyTarget
      unless target
        throw new Error("Missing scroll spy target name")

      interpolate = target.match /{{(.*)}}/

      ($scope, element, attrs) ->
        register = (id) ->
          return unless id
          callback = (active) ->
            action = if id is active.id then "addClass" else "removeClass"
            element[action] "active"

          # Update target class if target is re-rendered
          callback scrollSpy.active if scrollSpy.active?
          scrollSpy.addListener callback

          $scope.$on "$destroy", ->
            scrollSpy.removeListener callback

        if interpolate
          attrs.$observe "macScrollSpyTarget", (value) -> register value
        else
          register target

])
