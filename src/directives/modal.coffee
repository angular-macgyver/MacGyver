#
# @chalk overview
# @name mac-modal (element)
# @description
# Element directive to define the modal dialog. Modal content is transcluded into a
# modal template
#
# @param {Boolean}  keyboard      Allow closing modal with keyboard (default false)
# @param {Boolean}  overlay-close Allow closing modal when clicking on overlay (default false)
# @param {Boolean}  resize        Allow modal to resize on window resize event (default true)
# @param {Function} open          Callback when the modal is opened
# @param {Integer}  topOffset     Top offset when the modal is larger than window height (default 20)
#
angular.module("Mac").directive("macModal", [
  "$rootScope"
  "$parse"
  "modal"
  "util"
  "keys"
  ($rootScope, $parse, modal, util, keys) ->
    restrict:    "E"
    templateUrl: "template/modal.html"
    replace:     true
    transclude:  true

    link: ($scope, element, attrs) ->
      defaults =
        keyboard:     false
        overlayClose: false
        resize:       true
        open:         null
        topOffset:    20

      opts = util.extendAttributes "", defaults, attrs

      elementId = element.prop("id")

      $scope.closeModal = ($event)->
        modal.hide ->
          $scope.bindingEvents "unbind"

      $scope.escapeKeyHandler = (event) ->
        modal.hide() if event.which is keys.ESCAPE

      $scope.resizeHandler =  (event) -> modal.resize()
      $scope.overlayHandler = (event) -> $scope.closeModal()

      $scope.bindingEvents = (action = "bind") ->
        return unless action in ["bind", "unbind"]

        if opts.keyboard
          $(document)[action] "keydown", $scope.escapeKeyHandler

        if opts.overlayClose
          element[action] "click", overlayHandler

        if opts.resize
          $(window)[action] "resize", $scope.resizeHandler

      registerModal = (id) ->
        if id? and id
          opts.callback = ->
            $scope.bindingEvents()
            $parse(opts.open) $scope if opts.open?

          modal.register id, element, opts

      if elementId
        registerModal elementId
      else
        attrs.$observe "macModal", (id) -> registerModal id
]).

#
# @chalk overview
# @name mac-modal (attribute)
# @description
# Modal attribute directive to trigger modal dialog
# @param {String} mac-modal Modal ID to trigger
# @param {Object} mac-modal-content Extra content/data to pass along
#
directive "macModal", [
  "$parse"
  "modal"
  ($parse, modal) ->
    restrict: "A"
    link: ($scope, element, attrs) ->
      attrs.$observe "macModal", (value) ->
        if value? and value
          element.bind "click", ->
            modal.show value,
              data: $parse(attrs.macModalContent) $scope
      return
]

