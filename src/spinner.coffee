##
## Spinner
## 
## A directive for generating spinner using spin.js
##
## Attributes:
## spinner-lines: 13              The number of lines to draw
## spinner-length: 7              The length of each line
## spinner-width: 4               The line thickness
## spinner-radius: 10             The radius of the inner circle
## spinner-corners: 1             Corner roundness (0..1)
## spinner-rotate: 0              The rotation offset
## spinner-color: '#000'          #rgb or #rrggbb
## spinner-speed: 1               Rounds per second
## spinner-trail: 60              Afterglow percentage
## spinner-shadow: false          Whether to render a shadow
## spinner-hwaccel: false         Whether to use hardware acceleration
## spinner-className: 'spinner'   The CSS class to assign to the spinner
## spinner-zIndex: 2e9            The z-index (defaults to 2000000000)
## spinner-top: 'auto'            Top position relative to parent in px
## spinner-left: 'auto'           Left position relative to parent in px
##

angular.module("Util").directive "utilSpinner", ->
  restrict: "EA"

  compile: (element, attributes) ->
    element.addClass "ge-spinner"
    
    options       = {}
    options.lines = 10
    options.width = 2

    for own key,value of attributes
      if key.indexOf("spinner") is 0 and key isnt "spinner"
        k = key.slice("spinner".length + 1)
        if k is "Size"
          options.radius = value / 5
          options.length = value / 5
        else 
          options[k.toLowerCase()] = value
    spinner = new Spinner(options).spin(element[0])
