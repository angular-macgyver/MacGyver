##
## @name
## Spinner
##
## @description
## A directive for generating spinner using spin.js
##
## @dependencies
## - spin.js
##
## @attributes
## - mac-spinner-lines:     The number of lines to draw             (default 10)
## - mac-spinner-length:    The length of each line                 (default 7)
## - mac-spinner-width:     The line thickness                      (defualt 2)
## - mac-spinner-radius:    The radius of the inner circle          (default 10)
## - mac-spinner-corners:   Corner roundness (0..1)                 (default 1)
## - mac-spinner-rotate:    The rotation offset                     (default 0)
## - mac-spinner-color:     #rgb or #rrggbb                         (default "#000")
## - mac-spinner-speed:     Rounds per second                       (default 1)
## - mac-spinner-trail:     Afterglow percentage                    (default 60)
## - mac-spinner-shadow:    Whether to render a shadow              (default false)
## - mac-spinner-hwaccel:   Whether to use hardware acceleration    (default false)
## - mac-spinner-className: The CSS class to assign to the spinner  (default "spinner")
## - mac-spinner-z-index:   The z-index (defaults to 2000000000)    (default 2e9)
## - mac-spinner-top:       Top position relative to parent in px   (default "auto")
## - mac-spinner-left:      Left position relative to parent in px  (default "auto")
##

angular.module("Mac").directive "macSpinner", ->
  restrict: "EA"

  compile: (element, attributes) ->
    element.addClass "mac-spinner"

    options       = {}
    options.lines = 10
    options.width = 2

    for own key,value of attributes
      if key.indexOf("macSpinner") is 0 and key isnt "macSpinner"
        k = key.slice "macSpinner".length
        k = k[0].toLowerCase() + k[1..]
        if k is "Size"
          options.radius = value / 5
          options.length = value / 5
        else
          if _(+value).isNaN()
            options[k] = value
          else
            options[k] = +value
    spinner = new Spinner(options).spin(element[0])
