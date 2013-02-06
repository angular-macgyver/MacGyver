##
## @name
## Tag Input
##
## @description
## A directive for generating tag input.
##
## @dependencies
## - Chosen
##
## @attributes
## - mac-tag-input-tags:        the list of elements to populate the select input
## - mac-tag-input-selected:    the list of elements selected by the user
## - mac-tag-input-placeholder: placeholder text for tag input                    (default "")
## - mac-tag-input-no-result:   custom text when there is no search result
## - mac-tag-input-value:       the value to be sent back upon selection          (default "id")
## - mac-tag-input-label:       the label to display to the users                 (default "name")
##

angular.module("Mac").directive "macTagInput", [
  "$rootScope",
  "$parse",
  ($rootScope, $parse) ->
    restrict:    "E"
    scope:
      selected: "=macTagInputSelected"
      items:    "=macTagInputTags"
    templateUrl: "template/tag_input.html"
    transclude:  true
    replace:     true

    compile: (element, attr) ->
      placeholder = attr.macTagInputPlaceholder or ""
      noResult    = attr.macTagInputNoResult
      valueKey    = attr.macTagInputValue       or "id"
      textKey     = attr.macTagInputLabel       or "name"
      options     = {}

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
        updateTagInput = ->
          chosenElement.trigger "liszt:updated"

        $scope.$on "update-tag-input", -> updateTagInput()

        $scope.$watch "items", -> updateTagInput()

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
