##
## Tag Input
##
## A directive for generating tag input.
##
## Attributes:
## - mac-tag-input-tags:        the list of elements to populate the select input
## - mac-tag-input-selected:    the list of elements selected by the user
## - mac-tag-input-placeholder: placeholder text for tag input
## - mac-tag-input-no-result:   custom text when there is no search result
## - mac-tag-input-value:       the value to be sent back upon selection
## - mac-tag-input-label:       the label to display to the users
##

angular.module("Mac").directive "macTagInput", [
  "$rootScope",
  "$parse",
  ($rootScope, $parse) ->
    restrict:    "E"
    scope:       {}
    templateUrl: "template/tag_input.html"
    transclude:  true
    replace:     true

    compile: (element, attr) ->
      tagsListExp = attr.macTagInputTags
      selectedExp = attr.macTagInputSelected
      placeholder = attr.macTagInputPlaceholder or ""
      noResult    = attr.macTagInputNoResult
      valueKey    = attr.macTagInputValue       or "id"
      textKey     = attr.macTagInputLabel
      options     = {}
      getSelected = $parse selectedExp
      getTagsList = $parse tagsListExp

      element.attr "data-placeholder", placeholder

      itemValueKey = if valueKey? then ".#{valueKey}" else ""
      itemTextKey  = if textKey?  then ".#{textKey}" else ""
      $("option", element).attr("value", "{{item#{itemValueKey}}}")
                          .text("{{item#{itemTextKey}}}")

      options.no_results_text = noResult if noResult?

      # initialize the element in compile
      # as initializing in link will break other directives
      chosenElement = element.chosen(options)

      ($scope, element, attr) ->
        Object.defineProperty $scope, "selected",
          get:        -> getSelected $scope.$parent
          set: (list) -> getSelected.assign $scope.$parent, list

        Object.defineProperty $scope, "items",
          get: ->
            getTagsList $scope.$parent

        updateTagInput = ->
          chosenElement.trigger "liszt:updated"

        $scope.$on "update-tag-input", -> updateTagInput()

        # Update tag input after adding new option DOM element
        setTimeout (->
          updateTagInput()
        ), 0

        chosenElement.change (event, object)->
          $scope.$apply ->
            if object.selected?
              $scope.selected.push object.selected
            else if object.deselected?
              # Find the element that need to be removed
              index = list.indexOf object.deselected
              return if index is -1

              $scope.selected[index..index] = []
]
