###
@chalk overview
@name Spinner

@description
A directive for generating spinner using spin.js

@dependencies
- spin.js

@param {Integer} mac-spinner-lines The number of lines to draw (default 10)
@param {Integer} mac-spinner-width The lines thickness (default 2)
@param {Integer} mac-spinner-radius The radius of the inner circle (default 10)
@param {Integer} mac-spinner-corners Corner roundness (0..1) (default 1)
@param {Integer} mac-spinner-rotate The rotation offset (default 0)
@param {String} mac-spinner-color rgb or #rrggbb (default "#000")
@param {Integer} mac-spinner-speed Rounds per second (default 1)
@param {Integer} mac-spinner-trail Afterglow percentage (default 60)
@param {Boolean} mac-spinner-shadow Whether to render a shadow (default false)
@param {Boolean} mac-spinner-hwaccel Whether to use hardware acceleration (default false)
@param {String} mac-spinner-className The CSS class to assign to the spinner (default "spinner")
@param {Integer} mac-spinner-z-index The z-index (default 2e9)
@param {String} mac-spinner-top Top position relative to parent in px (default "auto")
@param {String} mac-spinner-left Left position relative to parent in px (default "auto")
###

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
        if k is "size"
          options.radius = value / 5
          options.length = value / 5
        else
          if _(+value).isNaN()
            options[k] = value
          else
            options[k] = +value
    spinner = new Spinner(options).spin(element[0])
