###
@chalk overview
@name mac-modal (element)
@description
Element directive to define the modal dialog. Modal content is transcluded into a
modal template

@param {Boolean} mac-modal-keyboard      Allow closing modal with keyboard (default false)
@param {Boolean} mac-modal-overlay-close Allow closing modal when clicking on overlay (default false)
@param {Boolean} mac-modal-resize        Allow modal to resize on window resize event (default true)
@param {Expr}    mac-modal-open          Callback when the modal is opened
@param {Integer} mac-modal-topOffset     Top offset when the modal is larger than window height (default 20)
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

    # NOTE: Isolated scope to prevent adding `close` function to parent
    # scope. Transcluded content is currently using parent scope.
    scope:
      open: "&macModalOpen"

    # NOTE: As of AngularJS 1.2.2, transclude function is on the link
    # function instead of compile
    link: ($scope, element, attrs, controller, transclude) ->
      # NOTE: Similiar to ngTransclude directive but the scope is
      # parent scope
      transclude $scope.$parent, (clone) ->
        wrapper = angular.element(
          element[0].getElementsByClassName "modal-content-wrapper"
        )
        wrapper.html ""
        wrapper.append clone

      opts = util.extendAttributes "macModal", modalViews.defaults, attrs

      registerModal = (id) ->
        if id? and id
          opts.callback = $scope.open
          modal.register id, element, opts

      $scope.close = ($event, force = false) ->
        if force or (opts.overlayClose and
            angular.element($event.target).hasClass("modal-overlay"))
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
# @param {String} mac-modal    Modal ID to trigger
# @param {Expr} mac-modal-data Extra data to pass along
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

          data = $parse(attrs.macModalData)($scope) or {}
          modal.show attrs.macModal,
            data:  data
            scope: modalScope
          modalScope.$apply()
      return
]
