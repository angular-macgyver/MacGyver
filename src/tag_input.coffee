##
## Tag Input
## 
## A directive for generating tag input.
##
## Attributes:
## - tags-list:   the list of elements to populate the select input
## - tags:        the list of elements selected by the user
## - placeholder: placeholder text for tag input
## - no-result:   custom text when there is no search result
##
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
      noResult    = attr.noResult
      options     = {}

      element.attr "data-placeholder", placeholder

      for tag in tagsList
        element.append $("<option>").attr("value", tag).text tag

      options.no_results_text = noResult if noResult?

      element.chosen options
]
