##
## Spinner
##
## A directive for generating spinner using spin.js
##
## Attributes:
## mac-spinner-lines: 13              The number of lines to draw
## mac-spinner-length: 7              The length of each line
## mac-spinner-width: 4               The line thickness
## mac-spinner-radius: 10             The radius of the inner circle
## mac-spinner-corners: 1             Corner roundness (0..1)
## mac-spinner-rotate: 0              The rotation offset
## mac-spinner-color: '#000'          #rgb or #rrggbb
## mac-spinner-speed: 1               Rounds per second
## mac-spinner-trail: 60              Afterglow percentage
## mac-spinner-shadow: false          Whether to render a shadow
## mac-spinner-hwaccel: false         Whether to use hardware acceleration
## mac-spinner-className: 'spinner'   The CSS class to assign to the spinner
## mac-spinner-zIndex: 2e9            The z-index (defaults to 2000000000)
## mac-spinner-top: 'auto'            Top position relative to parent in px
## mac-spinner-left: 'auto'           Left position relative to parent in px
##

angular.module("Mac").directive "macSpinner", ->
  restrict: "EA"

  compile: (element, attributes) ->
    element.addClass "mac-spinner"

    options       = {}
    options.lines = 10
    options.width = 2

    for own key,value of attributes
      if key.indexOf("mac-spinner") is 0 and key isnt "mac-spinner"
        k = key.slice("mac-spinner".length + 1)
        if k is "Size"
          options.radius = value / 5
          options.length = value / 5
        else
          options[k.toLowerCase()] = value
    spinner = new Spinner(options).spin(element[0])
