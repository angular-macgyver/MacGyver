##
## scripts/directives/tag_input.coffee
## 
## A directive for generating tag input.
##

angular.module("Util").directive "utilTagInput", [
  "$rootScope", 
  ($rootScope) ->
    restrict:   "A"
    scope:      false

    compile: (element, attr) ->
      tagsList    = attr.tagsList    or []
      tags        = attr.tags        or []
      placeholder = attr.placeholder or ""
      noResult    = attr.noResult    or ""
      options     = {}

      element.attr "placeholder", placeholder

      for tag in tagsList
        element.append $("<option>").attr(tag).text tag

      ($scope, element, attr) ->
        element.chosen()
]
