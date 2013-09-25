###
@chalk overview
@name Canvas Spinner

@description
A directive for generating a canvas spinner
This spinner requires much less CPU/GPU resources than CSS spinner

@param {Integer} mac-cspinner-width   Width of each bar (default 2)
@param {Integer} mac-cspinner-height  Height of each bar (default 5)
@param {Integer} mac-cpsinner-border  Border radius (default 1)
@param {Integer} mac-cspinner-size    Dimension of the whole spinner excluding padding (default 20)
@param {Integer} mac-cspinner-radius  Center radius (default 4)
@param {Integer} mac-cspinner-bars    Number of bars (default 10)
@param {Integer} mac-cspinner-padding Padding around the spinner (default 3)
@param {Integer} mac-cspinner-speed   ms delay between each animation
@param {String}  mac-cspinner-color   Color of each bar
@param {Expr}    mac-cspinner-spin    Start or stop spinner
###

angular.module("Mac").directive "macCspinner",["util", (util) ->
  restrict: "E"
  replace:  "true"
  template: """<div class="mac-cspinner"></div>"""

  compile: (element, attrs) ->
    # Fail semi-silently when browser does not support canvas
    unless !!window.HTMLCanvasElement
      return console.log "Browser does not support canvas"

    defaults =
      width:   2
      height:  5
      border:  1
      radius:  4
      bars:    10
      padding: 3
      speed:   100
      color:   "#2f3035"
      size:    20
    opts = util.extendAttributes "macCspinner", defaults, attrs

    # Setting size override custom height, width, radius and border settings
    if attrs.macCspinnerSize?
      size = not isNaN(+attrs.macCspinnerSize) and +attrs.macCspinnerSize

      if size
        ratio = size / defaults.size
        for prop in ["width", "height", "border", "radius"]
          opts[prop] = defaults[prop] * ratio

    width  = opts.width
    height = opts.height
    radius = opts.border

    maxRadius       = opts.radius + height
    maxCanvasRadius = Math.max(width, maxRadius)
    canvasRadius    = Math.ceil(
      Math.max(
        maxCanvasRadius,
        util.pyth(maxRadius, width/2)
      )
    )
    canvasRadius += opts.padding

    # Canvas for creating template spinner
    templateCanvas = angular.element "<canvas></canvas>"
    ctx            = templateCanvas[0].getContext "2d"
    rotation       = util.radian 360 / opts.bars
    ctx.translate canvasRadius, canvasRadius

    top  = -maxRadius
    left = -width / 2

    rgb = util.hex2rgb opts.color
    for i in [0..opts.bars-1]
      opacity       = 1 - (0.8/opts.bars) * i
      ctx.fillStyle = "rgba(#{rgb.r}, #{rgb.g}, #{rgb.b}, #{opacity})"

      # Drawing each bar
      ctx.beginPath()
      ctx.moveTo(left + radius, top)
      ctx.arc(left + width - radius, top + radius, radius, util.radian(-90), util.radian(0), false)
      ctx.arc(left + width - radius, top + height - radius, radius, util.radian(0), util.radian(90), false)
      ctx.arc(left + radius, top + height - radius, radius, util.radian(90), util.radian(180), false)
      ctx.arc(left + radius, top + radius, radius, util.radian(-180), util.radian(-90), false)
      ctx.closePath()

      ctx.fill()

      # Rotate the canvas for next bar
      ctx.rotate rotation

    # Canvas for displaying spinner
    canvas = angular.element "<canvas></canvas>"
    canvas.attr
      width:  canvasRadius * 2
      height: canvasRadius * 2
    showCtx = canvas[0].getContext "2d"
    showCtx.translate canvasRadius, canvasRadius

    element.append canvas

    ($scope, element, attrs) ->
      intervalID = null
      spinning   = false

      stop = ->
        spinning = false
        clearTimeout intervalID

      start = ->
        # Prevent another setTimeout
        return if spinning

        # Animate spinner
        spinning   = true
        rotate     = util.radian(360 / opts.bars)
        (drawFn = (startCycle = false) ->
          # Clear the canvas before painting a new image
          showCtx.clearRect -canvasRadius, -canvasRadius, canvasRadius * 2, canvasRadius * 2

          showCtx.rotate rotate
          showCtx.drawImage templateCanvas[0], -canvasRadius, -canvasRadius

          # Only create a new timeout when the spinner is spinning
          if spinning
            # Check if element is visible
            if not startCycle and element[0].offsetHeight <= 0 and
                element[0].offsetWidth <= 0
              return stop()

            intervalID = setTimeout drawFn, opts.speed
        )(true)

      if attrs.macCspinnerSpin?
        $scope.$watch attrs.macCspinnerSpin, (value) ->
          if value and not spinning
            start()
          else if not value and spinning
            stop()
      else
        start()

      # Add support for ngShow and ngHide
      if attrs.ngShow
        $scope.$watch attrs.ngShow, (value) -> if value then start() else stop()

      else if attrs.ngHide
        $scope.$watch attrs.ngHide, (value) -> if value then stop() else start()

      $scope.$on "$destroy", -> stop()
]
