#
# @chalk overview
# @name mac-modal (element)
# @description
# Element directive to define the modal dialog. Modal content is transcluded into a
# modal template
#
# @param {Boolean}  mac-modal-keyboard      Allow closing modal with keyboard (default false)
# @param {Boolean}  mac-modal-overlay-close Allow closing modal when clicking on overlay (default false)
# @param {Boolean}  mac-modal-resize        Allow modal to resize on window resize event (default true)
# @param {Function} mac-modal-open          Callback when the modal is opened
# @param {Integer}  mac-modal-topOffset     Top offset when the modal is larger than window height (default 20)
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

      opts = util.extendAttributes "macModal", defaults, attrs

      elementId = attrs.id

      escapeKeyHandler = (event) ->
        modal.hide() if event.which is keys.ESCAPE

      resizeHandler = (event) -> modal.resize()

      bindingEvents = (action = "bind") ->
        return unless action in ["bind", "unbind"]

        if opts.keyboard
          $(document)[action] "keydown", escapeKeyHandler

        if opts.resize
          $(window)[action] "resize", resizeHandler

      registerModal = (id) ->
        if id? and id
          opts.callback = ->
            bindingEvents()
            $parse(opts.open) $scope if opts.open?

          modal.register id, element, opts

      $scope.closeOverlay = ($event) ->
        if opts.overlayClose and $($event.target).is(".modal-overlay")
          $scope.closeModal()

      $scope.closeModal = ($event) ->
        modal.hide -> bindingEvents "unbind"

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
      if attrs.macModal
        element.bind "click", ->
          modal.show attrs.macModal,
            data: $parse(attrs.macModalContent) $scope
      return
]

