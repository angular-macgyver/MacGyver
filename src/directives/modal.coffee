###
@chalk overview
@name Modal

@description
Modal directives and service to keep state
###

angular.module("Mac").factory("$modal", [
  "$rootScope"
  ($rootScope) ->
    # Dictionary of registered modal
    registered: {}

    # Modal object that hasn't been shown yet
    waiting: null

    # Current opened modal
    opened: null

    show: (id, triggerOptions = {}) ->
      if @registered[id]?
        {element, options} = @registered[id]

        element.addClass "visible"

        # Extend options from trigger with modal options
        angular.extend options, triggerOptions

        # Update opened modal object
        @opened = {id, element, options}
        @resize element

        options.callback?()

        $rootScope.$broadcast "modalWasShown", id
        @clearWaiting()

      else
        @waiting = {id, options}

    resize: (element) ->
      return unless element?

      modal  = $(".modal", element).attr "style", ""
      height = modal.outerHeight()
      modal.css(
        if $(window).height() > height
          marginTop: -height / 2
        else
          top: 20
      )

    hide: (callback) ->
      return unless @opened?

      id = @opened.id

      @opened.element.removeClass "visible"
      @opened = null
      callback?()

      $rootScope.$broadcast "modalWasHidden", id

    register: (id, element, options) ->
      if @registered[id]?
        throw new Error "Modal #{modalId} already registered"

      @registered[id] = {element, options}

      if @waiting? and @waiting.id is id
        @show id, @waiting.options

    unregister: (id) ->
      unless @registered[id]?
        throw new Error "Modal #{id} is not registered"

      @hide() if @opened?.id is id
      @clearWaiting id
      delete @registered[id]

    clearWaiting: (id) ->
      # clear modal with the same id if id is provided
      return if id? and @waiting.id isnt id

      @waiting = null
]).

#
# @param {Boolean} keyboard Allow closing modal with keyboard (default false)
# @param {Boolean} overlay-close Allow closing modal when clicking on overlay (default false)
# @param {Boolean} resize Allow modal to resize on window resize event (default true)
# @param {Function} open Callback when the modal is opened
#
directive("macModal", [
  "$rootScope"
  "$modal"
  "$parse"
  "util"
  "keys"
  ($rootScope, $modal, $parse, util, keys) ->
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

      opts = util.extendAttributes "", defaults, attrs

      elementId = element.prop("id")

      $scope.closeModal = ($event)->
        $modal.hide ->
          $scope.bindingEvents "unbind"

      $scope.escapeKeyHandler = (event) ->
        $modal.hide() if event.which is keys.ESCAPE

      $scope.resizeHandler =  (event) -> $modal.resize element
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
          $modal.register id, element,
            callback: ->
              $scope.bindingEvents()

              $parse(opts.open) $scope if opts.open?

      if elementId
        registerModal elementId
      else
        attrs.$observe "macModal", (id) -> registerModal id
]).

# mac-modal: Modal ID to trigger
directive "macModal", [
  "$modal"
  ($modal) ->
    restrict: "A"
    link: ($scope, element, attrs) ->
      attrs.$observe "macModal", (value) ->
        if value? and value
          element.bind "click", ->
            $modal.show value
      return
]

