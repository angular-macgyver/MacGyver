##
## @name
## Tag Input
##
## @description
## A directive for generating tag input.
##
## @attributes
## - mac-tag-input-tags:        the list of elements to populate the select input
## - mac-tag-input-selected:    the list of elements selected by the user
## - mac-tag-input-placeholder: placeholder text for tag input                    (default "")
## - mac-tag-input-value:       the value to be sent back upon selection          (default "id")
## - mac-tag-input-label:       the label to display to the users                 (default "name")
##

angular.module("Mac").directive "macTagInput", [ ->
  restrict:    "E"
  templateUrl: "template/tag_input.html"
  transclude:  true
  replace:     true
  scope:
    selected: "=macTagInputSelected"
    items:    "=macTagInputTags"

  compile: (element, attrs) ->
    valueKey = attrs.macTagInputValue or "id"
    textKey  = attrs.macTagInputLabel or "name"

    $(".tag-autocomplete", element).attr
      "mac-tag-autocomplete-value": valueKey
      "mac-tag-autocomplete-label": textKey

    ($scope, element, attrs) ->
      $scope.placeholder = attrs.macTagInputPlaceholder or ""
]
