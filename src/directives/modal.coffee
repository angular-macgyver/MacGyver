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
  "modalViews"
  "util"
  ($rootScope, $parse, modal, modalViews, util) ->
    restrict:    "E"
    templateUrl: "template/modal.html"
    replace:     true
    transclude:  true

    compile: (element, attrs, transclude) ->
      ($scope, element, attrs) ->
        opts = util.extendAttributes "macModal", modalViews.defaults, attrs

        registerModal = (id) ->
          if id? and id
            opts.callback = ->
              $parse(opts.open) $scope if opts.open?

            modal.register id, element, opts

        $scope.modal        = modal
        $scope.closeOverlay = ($event) ->
          if opts.overlayClose and
              angular.element($event.target).hasClass("modal-overlay")
            modal.hide()

        if attrs.id
          registerModal attrs.id
        else
          attrs.$observe "macModal", (id) -> registerModal id
]).

#
# @chalk overview
# @name mac-modal (attribute)
# @description
# Modal attribute directive to trigger modal dialog
# @param {String} mac-modal Modal ID to trigger
# @param {Object} mac-modal-data    Extra data to pass along
#
directive "macModal", [
  "$parse"
  "modal"
  ($parse, modal) ->
    restrict: "A"
    link: ($scope, element, attrs) ->
      if attrs.macModal
        element.bind "click", ->
          modalScope = false
          if attrs.macModalScope? and attrs.macModalScope
            modalScope = $parse(attrs.macModalScope)($scope)
          modalScope = $scope unless modalScope? and modalScope.$new?

          # Deprecating mac-modal-content. Use mac-modal-data instead
          dataVar = attrs.macModalContent or attrs.macModalData
          modal.show attrs.macModal,
            data:  $parse(dataVar) $scope
            scope: modalScope
          modalScope.$apply()
      return
]
