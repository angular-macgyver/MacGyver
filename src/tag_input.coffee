##
## Tag Input
##
## A directive for generating tag input.
##
## Attributes:
## - util-tag-input:             the list of elements to populate the select input
## - util-tag-input-selected:    the list of elements selected by the user
## - util-tag-input-placeholder: placeholder text for tag input
## - util-tag-input-no-result:   custom text when there is no search result
##
##

angular.module("Util").directive "utilTagInput", [
  "$rootScope",
  "$parse",
  ($rootScope, $parse) ->
    restrict:   "A"
    scope:      {}

    compile: (element, attr) ->
      tagsList    = attr.utilTagInput            or []
      selectedExp = attr.utilTagInputSelected
      placeholder = attr.utilTagInputPlaceholder or ""
      noResult    = attr.utilTagInputNoResult
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
