###
@chalk overview
@name Tag Input
@description
A directive for generating tag input.

@param {String} mac-tag-input-tags         The list of elements to populate the select input
@param {String} mac-tag-input-selected     The list of elements selected by the user
@param {String} mac-tag-input-placeholder  Placeholder text for tag input                    (default "")
@param {String} mac-tag-input-value        The value to be sent back upon selection          (default "id")
@param {String} mac-tag-input-label        The label to display to the users                 (default "name")
###

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
