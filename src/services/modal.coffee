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

angular.module("Mac").provider("modal", ->
  this.registered = registered = {}
  this.defaults   = defaults =
    keyboard:     false
    overlayClose: false
    resize:       true
    position:     true
    open:         angular.noop
    topOffset:    20
    attributes:   {}
    beforeShow:   angular.noop
    afterShow:    angular.noop
    beforeHide:   angular.noop
    afterHide:    angular.noop

  this.$get = [
    "$animate"
    "$compile"
    "$controller"
    "$http"
    "$rootScope"
    "$templateCache"
    "keys"
    (
      $animate,
      $compile,
      $controller,
      $http,
      $rootScope,
      $templateCache,
      keys
    ) ->
      # Dictionary of registered modal
      registered: registered

      defaults: defaults

      # Modal object that hasn't been shown yet
      waiting: null

      # Current opened modal
      opened: null

      modalTemplate: """
        <div class="mac-modal-overlay">
          <div class="mac-modal">
            <a mac-modal-close class="mac-close-modal"></a>
            <div class="mac-modal-content-wrapper"></div>
          </div>
        </div>
      """

      escapeKeyHandler: (event) ->
        @hide() if event.which is keys.ESCAPE

      resizeHandler: -> @resize()

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
          showOptions = {}

          # Extend options from trigger with modal options
          angular.extend showOptions, options, triggerOptions

          showModal = (element) =>
            showOptions.beforeShow element.scope()

            $animate.addClass(element, "visible").then =>

              # Update opened modal object
              @opened = {id, element, options: showOptions}
              @resize @opened
              @bindingEvents()

              showOptions.open element.scope()
              showOptions.afterShow element.scope()

              $rootScope.$broadcast "modalWasShown", id
              @clearWaiting()

          # if modal is created thru module method "modal"
          if showOptions.moduleMethod?
            renderModal = (template) =>
              # Scope allows either a scope or an object:
              # - Scope - Use the scope to compile modal
              # - Object - Creates a new "isolate" scope and extend the isolate
              # scope with data being passed in
              #
              # Use the scope passed in
              if isScope(showOptions.scope)
                viewScope = showOptions.scope

              # Create an isolated scope and extend scope with value pass in
              else
                viewScope = $rootScope.$new(true)
                if angular.isObject showOptions.scope
                  angular.extend viewScope, showOptions.scope

              angular.extend showOptions.attributes, {id}
              element = angular.element(@modalTemplate).attr showOptions.attributes
              wrapper = angular.element(
                element[0].getElementsByClassName("mac-modal-content-wrapper")
              )
              wrapper.html template

              if showOptions.overlayClose
                element.bind "click", ($event) =>
                  if angular.element($event.target).hasClass("mac-modal-overlay")
                    viewScope.$apply => @hide()

              if showOptions.controller
                # Modal controller has the following locals:
                # - $scope - Current scope associated with the element
                # - $element - Current modal element
                # - macModalOptions - Modal options
                #
                # macModalOptions is added to give user more information in the
                # controller when compiling modal
                $controller showOptions.controller,
                  $scope:          viewScope
                  $element:        element
                  macModalOptions: showOptions

              $animate.enter element, angular.element(document.body)
              $compile(element) viewScope

              showModal element

            if (path = showOptions.templateUrl)
              template = $templateCache.get path
              if template
                renderModal template
              else
                $http.get(path).then (resp) ->
                  $templateCache.put path, resp.data
                  renderModal resp.data
                , ->
                  throw Error("Failed to load template: #{path}")
            else if (template = showOptions.template)
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

        return unless options.position

        modal  = angular.element(element[0].querySelector(".mac-modal"))
        height = modal.outerHeight()
        width  = modal.outerWidth()

        css =
          if angular.element(window).height() > height
            marginTop:  -height / 2
          else
            top: options.topOffset
        css.marginLeft = -width / 2

        angular.forEach css, (value, key) ->
          if not isNaN(+value) and angular.isNumber +value
            value = "#{value}px"
          modal.css key, value

      #
      # @name hide
      # @description
      # Hide currently opened modal
      # @returns {Promise} Remove visible class promise
      #
      hide: ->
        return unless @opened?

        {id, options, element} = @opened
        options.beforeHide element.scope()

        self = this
        $animate.removeClass(element, "visible").then ->
          self.bindingEvents "unbind"
          self.opened = null

          if options.moduleMethod
            # Only destroy new isolated scope
            unless isScope options.scope
              element.scope().$destroy()

            $animate.leave element

          else
            modal = element[0].querySelector ".mac-modal"
            modal.removeAttribute("style")

          options.afterHide element.scope()

          $rootScope.$broadcast "modalWasHidden", id

      bindingEvents: (action = "bind") ->
        return unless action in ["bind", "unbind"] and @opened?

        options = @opened.options

        if options.keyboard
          angular.element(document)[action] "keydown", @escapeKeyHandler

        if options.resize
          angular.element(window)[action] "resize", @resizeHandler

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

        modalOpts = {}
        angular.extend modalOpts, defaults, options

        @registered[id] = {id, element, options: modalOpts}

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
  ]

  return
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
# @param {Object}   attributes        Extra attributes to add to modal
# @param {Function} beforeShow        Callback before showing the modal
# @param {Function} afterShow         Callback when modal is visible with CSS transitions completed
# @param {Function} beforeHide        Callback before hiding the modal
# @param {Function} afterHide         Callback when modal is hidden from the user with CSS transitions completed
# @param {Boolean}  position          Calculate size and position with JS (default true)
#
# angular.module("Mac").modal("myModal", {
#   controller: "myController"
#   template:   "<div></div>"
# })
#
# Add modal shortcut to Mac module
#
config ["modalProvider", (modal) ->
  angular.module("Mac").modal = (id, modalOptions) ->
    unless modal.registered[id]?
      options = {}
      angular.extend options, modal.defaults, modalOptions, {moduleMethod: true}
      modal.registered[id] = {id, options}
]
