###
@chalk overview
@name mac-modal (element)
@description
Element directive to define the modal dialog. Modal content is transcluded into a
modal template

@param {Boolean} mac-modal-keyboard      Allow closing modal with keyboard (default false)
@param {Boolean} mac-modal-overlay-close Allow closing modal when clicking on overlay (default false)
@param {Boolean} mac-modal-resize        Allow modal to resize on window resize event (default true)
@param {Integer} mac-modal-topOffset     Top offset when the modal is larger than window height (default 20)
@param {Expr}    mac-modal-open          Callback when the modal is opened
@param {Expr}    mac-modal-before-show   Callback before showing the modal
@param {Expr}    mac-modal-after-show    Callback when modal is visible with CSS transitions completed
@param {Expr}    mac-modal-before-hide   Callback before hiding the modal
@param {Expr}    mac-modal-after-hide    Callback when modal is hidden from the user with CSS transitions completed
@param {Boolean} mac-modal-position      Calculate size and position with JS (default true)
###
angular.module("Mac").directive("macModal", [
  "$parse"
  "modal"
  "modalViews"
  "util"
  ($parse, modal, modalViews, util) ->
    restrict:   "E"
    template:   modal.modalTemplate
    replace:    true
    transclude: true

    # NOTE: As of AngularJS 1.2.2, transclude function is on the link
    # function instead of compile
    link: ($scope, element, attrs, controller, transclude) ->
      transclude $scope, (clone) ->
        angular.element(
          element[0].getElementsByClassName "mac-modal-content-wrapper"
        ).replaceWith clone

      opts  = util.extendAttributes "macModal", modalViews.defaults, attrs
      regId = null

      if opts.overlayClose
        element.on "click", ($event) ->
          if angular.element($event.target).hasClass("mac-modal-overlay")
            $scope.$apply -> modal.hide()

      for callback in ["beforeShow", "afterShow", "beforeHide", "afterHide", "open"]
        key            = "macModal#{util.capitalize(callback)}"
        opts[callback] = $parse(attrs[key]) or angular.noop

      registerModal = (id) ->
        if id? and id
          regId = id
          modal.register id, element, opts

      if attrs.id
        registerModal attrs.id
      else
        attrs.$observe "macModal", (id) -> registerModal id

      # NOTE: Remove from modal service when mac-modal directive is removed
      # from DOM
      $scope.$on "$destroy", -> modal.unregister regId if regId
]).

#
# @chalk overview
# @name mac-modal (attribute)
# @description
# Modal attribute directive to trigger modal dialog
# @param {String} mac-modal    Modal ID to trigger
# @param {Expr} mac-modal-data Extra data to pass along
#
directive("macModal", [
  "$parse"
  "modal"
  ($parse, modal) ->
    restrict: "A"
    link: ($scope, element, attrs) ->
      return unless attrs.macModal

      element.bind "click", ->
        $scope.$apply ->
          data = $parse(attrs.macModalData)($scope) or {}
          modal.show attrs.macModal,
            data:  data
            scope: $scope
      return
]).

directive "macModalClose", [
  "modal"
  (modal) ->
    restrict: "A"
    link:     ($scope, element, attrs) ->
      element.bind "click", ->
        $scope.$apply -> modal.hide()
]
