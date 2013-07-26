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

@param {Function} register Registering modal with the service
- {String} id ID of the modal
- {DOM element} element The modal element
- {Object} options Additional options for the modal

@param {Function} unregister Remove modal from modal service
- {String} id ID of the modal to unregister

@param {Function} clearWaiting Remove certain modal id from waiting list
- {String} id ID of the modal
###

angular.module("Mac").factory("modal", [
  "$rootScope"
  ($rootScope) ->
    # Dictionary of registered modal
    registered: {}

    # Modal object that hasn't been shown yet
    waiting: null

    # Current opened modal
    opened: null

    #
    # @name show
    # @description
    # Show a modal based on the modal id
    # @param {String} id The id of the modal to open
    # @param {Object} triggerOptions Additional options to open modal
    #
    show: (id, triggerOptions = {}) ->
      if @registered[id]?
        {element, options} = @registered[id]

        element.removeClass "hide"
        setTimeout ->
          element.addClass "visible"
        , 0

        # Extend options from trigger with modal options
        angular.extend options, triggerOptions

        # Update opened modal object
        @opened = {id, element, options}
        @resize @opened

        options.callback?()

        $rootScope.$broadcast "modalWasShown", id
        @clearWaiting()

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

      id = @opened.id

      opened = @opened.element
      opened.removeClass "visible"
      setTimeout ->
        opened.addClass "hide"
      , 250
      @opened = null
      callback?()

      $rootScope.$broadcast "modalWasHidden", id

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
        throw new Error "Modal #{modalId} already registered"

      @registered[id] = {element, options}

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
])
