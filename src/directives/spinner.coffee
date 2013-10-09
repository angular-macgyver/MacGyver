###
@chalk overview
@name Spinner

@description
A directive for generating spinner

@param {Integer} mac-spinner-size The size of the spinner (default 16)
@param {Integer} mac-spinner-z-index The z-index (default inherit)
@param {String}  mac-spinner-color Color of all the bars (default #2f3035)
###

angular.module("Mac").directive "macSpinner", ["$animate", "util", ($animate, util) ->
  restrict: "E"
  replace:  true
  template: """<div class="mac-spinner"></div>"""

  compile: (element, attrs) ->
    prefixes = ["webkit", "Moz", "ms", "O"]
    vendor = (el, name) ->
      name = util.capitalize name
      return prefix+name for prefix in prefixes when el.style[prefix+name]?
      return name

    for i in [0..9]
      delay  = i * 0.1 - 1 + (not i)
      degree = i * 36
      styl   = {}
      bar    = angular.element """<div class="bar"></div>"""

      styl[vendor(bar[0], "animation")] = "fade 1s linear infinite #{delay}s"
      styl[vendor(bar[0], "transform")] = "rotate(#{degree}deg) translate(0, 130%)"
      bar.css styl

      $animate.enter bar, element

    ($scope, element, attrs) ->
      defaults =
        size:   16
        zIndex: "inherit"
        color:  "#2f3035"

      bars = angular.element element[0].getElementsByClassName("bar")

      setSpinnerSize = (size) ->
        bars.css
          height:       size * 0.32 + "px"
          left:         size * 0.445 + "px"
          top:          size * 0.37 + "px"
          width:        size * 0.13 + "px"
          borderRadius: size * 0.32 * 2 + "px"
          position:     "absolute"

        if not isNaN(+size) and angular.isNumber +size
          size = "#{size}px"

        element.css
          height: size
          width:  size

      if attrs.macSpinnerSize?
        attrs.$observe "macSpinnerSize", (value) ->
          setSpinnerSize value if value? and value
      else
        setSpinnerSize defaults.size

      attrs.$observe "macSpinnerZIndex", (value) ->
        if value? and value
          element.css "z-index", value

      if attrs.macSpinnerColor?
        attrs.$observe "macSpinnerColor", (value) ->
          bars.css "background", value if value? and value
      else
        bars.css "background", defaults.color

]
