###
@chalk overview
@name Scroll Spy Service

@description
There are multiple components used by scrollspy
- Scrollspy service is used to keep track of all and active anchors
- Multiple directives including:
- mac-scroll-spy - Element to spy scroll event
- mac-scroll-spy-anchor - Section in element spying on
- mac-scroll-spy-target - Element to highlight, most likely a nav item

Scrollspy defaults:
offset - 0

@param {Function} register Register an anchor with the service
- {String} id ID of the anchor
- {DOM Element} element Element to spy on

@param {Function} unregister Remove anchor from service
- {String} id ID of the anchor

@param {Function} setActive Set active anchor and fire all listeners
- {Object} anchor Anchor object

@param {Function} addListener Add listener when active is set
- {Function} fn Callback function

@param {Function} removeListener Remove listener
- {Function} fn Callback function
###

angular.module("Mac").service("scrollSpy", [
  ->
    # List of anchors and their top offset
    registered: []

    # Active anchor
    active: {}

    # Callbacks to fire when active is set
    listeners: []

    register: (id, element) ->
      registered = false
      top        = element.offset().top

      # Update existing anchor and its top offset
      for anchor, i in @registered when anchor.id is id
        @registered[i] = {id, element, top}
        registered     = true
        break

      unless registered
        @registered.push {id, element, top}

      # Sort registered anchors by top offset
      @registered.sort (a, b) ->
        if a.top > b.top
          return 1
        else if a.top < b.top
          return -1
        return 0

    unregister: (id) ->
      for anchor, i in @registered when anchor.id is id
        @registered[i..i] = []
        break

    last: ->
      @registered[@registered.length - 1]

    setActive: (anchor) ->
      @active = anchor
      listener(anchor) for listener in @listeners

    addListener:    (fn) -> @listeners.push fn
    removeListener: (fn) ->
      index = @listeners.indexOf fn
      @listeners[index..index] = [] unless index is -1
]).

constant "scrollSpyDefaults",
  offset: 0
