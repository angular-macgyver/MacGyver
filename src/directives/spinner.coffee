###
@chalk overview
@name Spinner

@description
A directive for generating spinner

@param {Integer} mac-spinner-size The size of the spinner (default 16)
@param {Integer} mac-spinner-z-index The z-index (default inherit)
@param {String}  mac-spinner-color Color of all the bars (default #2f3035)
###

angular.module("Mac").directive "macSpinner", ->
  restrict: "E"
  replace:  true
  template: """<div class="mac-spinner"></div>"""

  compile: (element, attributes) ->
    for i in [0..9]
      element.append """<div class="bar"></div>"""

    ($scope, element, attributes) ->
      attributes.$observe "macSpinnerSize", (value) ->
        if value? and value
          element.css
            height: value
            width:  value

      attributes.$observe "macSpinnerZIndex", (value) ->
        if value? and value
          element.css "z-index", value

      attributes.$observe "macSpinnerColor", (value) ->
        if value? and value
          $(".bar", element).css "background", value
