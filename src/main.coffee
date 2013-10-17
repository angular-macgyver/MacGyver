modules = ["Mac.Util"]
try
  angular.module("ngAnimate")
  modules.push "ngAnimate"
angular.module "Mac", modules

###
@chalk overview
@name angular.element

@description
Angular comes with jqLite, a tiny, API-compatible subset of jQuery. However, its
functionality is very limited and MacGyver extends jqLite to make sure MacGyver
components work properly.

Real jQuery will continue to take precedence over jqLite and all functions MacGyver extends.

MacGyver adds the following methods:
- [height()](http://api.jquery.com/height/) - Does not support set
- [width()](http://api.jquery.com/width/) - Does not support set
- [outerHeight()](http://api.jquery.com/outerHeight/) - Does not support set
- [outerWidth()](http://api.jquery.com/outerWidth/) - Does not support set
- [offset()](http://api.jquery.com/offset/)
- [scrollTop()](http://api.jquery.com/scrollTop/)
###

cssExpand = [ "Top", "Right", "Bottom", "Left" ]
core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" )

getStyles = (element) ->
  window.getComputedStyle element, null

isWindow = (obj) ->
  return obj and obj.document and obj.location and obj.alert and obj.setInterval

getWindow = (element) ->
  if isWindow(element) then element else element.nodeType is 9 and element.defaultView

augmentWidthOrHeight = (element, name, extra, isBorderBox, styles) ->
  return 0 if extra is (if isBorderBox then "border" else "content")

  start = if name is "Width" then 1 else 0

  for i in [start..3] by 2
    if extra is "margin"
      val += parseFloat styles["#{extra}#{cssExpand[i]}"]

    if isBorderBox
      if extra is "content"
        val -= parseFloat styles["padding#{cssExpand[i]}"]

      if extra isnt "margin"
        val -= parseFloat styles["border#{cssExpand[i]}"]
    else
      val += parseFloat styles["padding#{cssExpand[i]}"]

      if extra isnt "padding"
        val += parseFloat styles["border#{cssExpand}Width"]

  return val

getWidthOrHeight = (type, prefix, element) ->

  return (margin) ->
    defaultExtra =
      switch prefix
        when "inner" then "padding"
        when "outer" then ""
        else              "content"
    extra = defaultExtra or (if margin is true then "margin" else "border")

    if isWindow element
      return element.document.documentElement["client#{type}"]

    if element.nodeType is 9
      doc = element.documentElement

      return Math.max(
        element.body["scroll#{type}"], doc["scroll#{type}"],
        element.body["offset#{type}"], doc["offset#{type}"],
        doc["client#{type}"]
      )

    valueIsBorderBox = true
    styles           = getStyles element
    name             = type.toLowerCase()
    value            =
      if type is "Height" then element.offsetHeight else element.offsetWidth
    isBorderBox = element.style.boxSizing is "border-box"

    if value <= 0 or value is null
      value = styles[name]
      if value < 0 or value is null
        value = element.style[name]

      return value if rnumnonpx.test value

      valueIsBorderBox = isBorderBox

      value = parseFloat(value) or 0

    value + augmentWidthOrHeight(
      element
      type
      extra or (if isBorderBox then "border" else "content")
      valueIsBorderBox
      styles
    )

jqLiteExtend =
  height: (element) ->
    getWidthOrHeight("Height", "", element)()

  width: (element) ->
    getWidthOrHeight("Width", "", element)()

  outerHeight: (element, margin) ->
    getWidthOrHeight("Height", "outer", element) margin

  outerWidth: (element, margin) ->
    getWidthOrHeight("Width", "outer", element) margin

  offset: (element) ->
    box = {top: 0, left: 0}
    doc = element && element.ownerDocument

    return unless doc

    docElem = doc.documentElement
    if element.getBoundingClientRect?
      box = element.getBoundingClientRect()

    win = getWindow doc
    return {
      top: box.top + win.pageYOffset - docElem.clientTop,
      left: box.left + win.pageXOffset - docElem.clientLeft
    }

  scrollTop: (element, value) ->
    win = getWindow element

    unless value?
      return if win then win["pageYOffset"] else element["scrollTop"]

    if win
      win.scrollTo(window.pageXOffset, value)
    else
      element["scrollTop"] = value

extendjQuery = ->
  return if window.jQuery?

  jqLite = angular.element

  angular.forEach jqLiteExtend, (fn, name) ->
    jqLite.prototype[name] = (arg1, arg2) ->
      return fn(this[0], arg1, arg2) if this.length

extendjQuery()
