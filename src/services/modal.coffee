###
@chalk overview
@name Modal Service

@description
There are multiple components used by modal.
- A modal service is used to keep state of modal opened in the applications.
- A modal element directive to define the modal dialog box
- A modal attribute directive as a modal trigger

@param {Function} show Show a modal based on the modal id
- {String} id The id of the modal to open
- {Object} triggerOptions Additional options to open modal

@param {Function} resize Update the position and also the size of the modal
- {Modal Object} modalObject The modal to reposition and resize (default opened modal)

@param {Function} hide Hide currently opened modal
- {Function} callback Callback after modal has been hidden

@param {Function} bindingEvents Binding escape key or resize event
- {String} action Either to bind or unbind events (default "bind")

@param {Function} register Registering modal with the service
- {String} id ID of the modal
- {DOM element} element The modal element
- {Object} options Additional options for the modal

@param {Function} unregister Remove modal from modal service
- {String} id ID of the modal to unregister

@param {Function} clearWaiting Remove certain modal id from waiting list
- {String} id ID of the modal
###

angular.module("Mac").service("modal", [
  "$rootScope"
  "$timeout"
  "$templateCache"
  "$compile"
  "$http"
  "$controller"
  "modalViews"
  "keys"
  ($rootScope, $timeout, $templateCache, $compile, $http, $controller, modalViews, keys) ->
    # Dictionary of registered modal
    registered: modalViews.registered

    # Modal object that hasn't been shown yet
    waiting: null

    # Current opened modal
    opened: null

    modalTemplate: '<div ng-click="closeOverlay($event)" class="modal-overlay hide"><div class="modal"><a ng-click="modal.hide()" class="close-modal"></a><div class="modal-content-wrapper"></div></div></div>'

    #
    # @name show
    # @description
    # Show a modal based on the modal id
    # @param {String} id The id of the modal to open
    # @param {Object} triggerOptions Additional options to open modal
    #
    show: (id, triggerOptions = {}) ->
      if @registered[id]? and @opened?
        @hide()

      else if @registered[id]?
        modalObject = @registered[id]
        options     = modalObject.options

        # Extend options from trigger with modal options
        angular.extend options, triggerOptions

        showModal = (element) =>
          element.removeClass "hide"
          $timeout ->
            element.addClass "visible"
          , 0

          # Update opened modal object
          @opened = {id, element, options}
          @resize @opened
          @bindingEvents()

          options.callback?()

          $rootScope.$broadcast "modalWasShown", id
          @clearWaiting()

        # if modal is created thru module method "modal"
        if options.moduleMethod?
          renderModal = (template) =>
            viewScope              = $rootScope.$new()
            viewScope.modal        = this
            viewScope.closeOverlay = ($event) =>
              if options.overlayClose and angular.element($event.target).hasClass("modal-overlay")
                @hide()

            if options.controller
              $controller options.controller,
                $scope: viewScope

            element = angular.element(@modalTemplate).attr {id}
            angular.element(".modal-content-wrapper", element).html template
            angular.element("body").append $compile(element) viewScope

            showModal element

          if (path = options.templateUrl)
            template = $templateCache.get path
            if template
              renderModal template
            else
              $http.get(path).then (resp) ->
                $templateCache.put path, resp.data
                renderModal resp.data
              , ->
                throw Error("Failed to load template: #{path}")
          else if (template = options.template)
            renderModal template

        # modal created using modal directive
        else if modalObject.element?
          showModal modalObject.element

      else
        @waiting = {id, options: triggerOptions}

    #
    # @name resize
    # @description
    # Update the position and also the size of the modal
    # @param {Modal Object} modalObject The modal to reposition and resize (default opened modal)
    #
    resize: (modalObject = @opened) ->
      return unless modalObject?

      element = modalObject.element
      options = modalObject.options

      modal  = $(".modal", element).attr "style", ""
      height = modal.outerHeight()
      width  = modal.outerWidth()

      css =
        if $(window).height() > height
          marginTop:  -height / 2
        else
          top: options.topOffset
      css.marginLeft = -width / 2

      modal.css css

    #
    # @name hide
    # @description
    # Hide currently opened modal
    # @param {Function} callback Callback after modal has been hidden
    #
    hide: (callback) ->
      return unless @opened?

      {id, options, element} = @opened

      element.removeClass "visible"
      $timeout ->
        element.addClass "hide"
      , 250
      @bindingEvents "unbind"
      @opened = null

      if options.moduleMethod
        element.scope().$destroy()
        element.remove()

      $rootScope.$broadcast "modalWasHidden", id

      callback?()

    bindingEvents: (action = "bind") ->
      return unless action in ["bind", "unbind"] and @opened?

      escapeKeyHandler = (event) =>
        @hide() if event.which is keys.ESCAPE

      resizeHandler = (event) => @resize()
      options       = @opened.options

      if options.keyboard
        $(document)[action] "keydown", escapeKeyHandler

      if options.resize
        $(window)[action] "resize", resizeHandler

    #
    # @name register
    # @description
    # Registering modal with the service
    # @param {String} id ID of the modal
    # @param {DOM element} element The modal element
    # @param {Object} options Additional options for the modal
    #
    register: (id, element, options) ->
      if @registered[id]?
        throw new Error "Modal #{id} already registered"

      @registered[id] = {id, element, options}

      if @waiting? and @waiting.id is id
        @show id, @waiting.options

    #
    # @name unregister
    # @description
    # Remove modal from modal service
    # @param {String} id ID of the modal to unregister
    #
    unregister: (id) ->
      unless @registered[id]?
        throw new Error "Modal #{id} is not registered"

      @hide() if @opened?.id is id
      @clearWaiting id
      delete @registered[id]

    #
    # @name clearWaiting
    # @description
    # Remove certain modal id from waiting list
    # @param {String} id ID of the modal
    #
    clearWaiting: (id) ->
      # clear modal with the same id if id is provided
      return if id? and @waiting?.id isnt id

      @waiting = null
]).

provider("modalViews", ->
  @registered = {}
  @defaults   =
    keyboard:     false
    overlayClose: false
    resize:       true
    open:         null
    topOffset:    20
  @$get = -> this
  return this
).

#
# @param {Boolean}  keyboard          Allow closing modal with keyboard (default false)
# @param {Boolean}  overlayClose      Allow closing modal when clicking on overlay (default false)
# @param {Boolean}  resize            Allow modal to resize on window resize event (default true)
# @param {Function} open              Callback when the modal is opened
# @param {Integer}  topOffset         Top offset when the modal is larger than window height (default 20)
# @param {String}   template          Modal HTML content
# @param {String}   templateUrl       URL to load modal template
# @param {String|Function} controller Controller for the modal
#
# angular.module("Mac").modal("myModal", {
#   controller: "myController"
#   template:   "<div></div>"
# })
#
# Add modal shortcut to Mac module
config ["modalViewsProvider", (modalViews) ->
  angular.module("Mac").modal = (id, options) ->
    unless modalViews.registered[id]?
      angular.extend options, modalViews.defaults, {moduleMethod: true}
      modalViews.registered[id] = {id, options}
]
