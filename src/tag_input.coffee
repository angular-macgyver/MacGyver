##
## Tag Input
##
## A directive for generating tag input.
##
## Attributes:
## - mac-tag-input:             the list of elements to populate the select input
## - mac-tag-input-selected:    the list of elements selected by the user
## - mac-tag-input-placeholder: placeholder text for tag input
## - mac-tag-input-no-result:   custom text when there is no search result
##
##

angular.module("Mac").directive "macTagInput", [
  "$rootScope",
  "$parse",
  ($rootScope, $parse) ->
    restrict:   "A"
    scope:      {}

    compile: (element, attr) ->
      tagsList    = attr.macTagInput            or []
      selectedExp = attr.macTagInputSelected
      placeholder = attr.macTagInputPlaceholder or ""
      noResult    = attr.macTagInputNoResult
      options     = {}
      getSelected = $parse selectedExp

      element.attr "data-placeholder", placeholder

      for tag in tagsList
        element.append $("<option>").attr("value", tag).text tag

      options.no_results_text = noResult if noResult?

      chosenElement = element.chosen(options)

      ($scope, element, attr) ->
        Object.defineProperty $scope, "selected",
          get:        -> getSelected $scope.$parent
          set: (list) -> getSelected.assign $scope.$parent, list

        chosenElement.change (event, object)->
          $scope.$apply ->
            list = $scope.selected
            if object.selected?
              list.push object.selected
            else if object.deselected?
              # Find the element that need to be removed
              index = list.indexOf object.deselected
              return if index is -1

              list[index..index] = []
              $scope.selected    = list

]
