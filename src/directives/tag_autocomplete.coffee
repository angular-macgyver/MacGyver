##
## @name
## Tag Autocomplete
##
## @description
## A directive for generating tag input with autocomplete support on text input
##
## @dependencies
## - jQuery UI autocomplete
##
## @attributes
## - mac-tag-autocomplete-url:         url to fetch autocomplete dropdown list data
## - mac-tag-autocomplete-value:       the value to be sent back upon selection                (default "id")
## - mac-tag-autocomplete-label:       the label to display to the users                       (default "name")
## - mac-tag-autocomplete-selected:    the list of elements selected by the user
## - mac-tag-autocomplete-query:       the query parameter on GET command                      (defualt "q")
## - mac-tag-autocomplete-delay:       time delayed on fetching autocomplete data after keyup  (default 800)
## - mac-tag-autocomplete-placeholder: Placeholder text of the text input                      (default "")
## - mac-tag-autocomplete-disabled:    If autocomplete is enabled or disabled                  (default false)
## - mac-tag-autocomplete-on-enter:    When autocomplete is disabled, this function is called on enter
##                                     Should return either string, object or boolean. If false, item is not added
##                                       @params {String} item User input
##
##

angular.module("Mac").directive "macTagAutocomplete", [
  "$parse",
  "$http",
  "keys",
  ($parse, $http, key) ->
    restrict:    "E"
    scope:
      autocompleteUrl:      "=macTagAutocompleteUrl"
      autocompleteValue:    "=macTagAutocompleteValue"
      autocompleteLabel:    "=macTagAutocompleteLabel"
      autocompleteQuery:    "=macTagAutocompleteQuery"
      autocompleteDelay:    "=macTagAutocompleteDelay"
      placeholder:          "=macTagAutocompletePlaceholder"
      autocompleteOnEnter:  "&macTagAutocompleteOnEnter"

    templateUrl: "template/tag_autocomplete.html"
    replace:     true

    compile: (element, attr) ->
      valueKey    = attr.macTagAutocompleteValue
      valueKey   ?= "id"
      labelKey    = attr.macTagAutocompleteLabel
      labelKey   ?= "name"
      queryKey    = attr.macTagAutocompleteQuery    or "q"
      delay       = +attr.macTagAutocompleteDelay   or 800
      selectedExp = attr.macTagAutocompleteSelected
      disabled    = attr.macTagAutocompleteDisabled?

      getSelected = $parse selectedExp

      # Update template on label variable name
      tagLabelKey = if labelKey is "" then labelKey else ".#{labelKey}"
      $(".tag-label", element).text "{{tag#{tagLabelKey}}}"

      $(".text-input", element).attr
        "mac-autocomplete-value":       valueKey
        "mac-autocomplete-label":       labelKey
        "mac-autocomplete-query":       queryKey
        "mac-autocomplete-delay":       delay
        "mac-autocomplete-placeholder": "placeholder"

      ($scope, element, attrs) ->
        # Put disabled inside template scope:
        $scope.disabled = disabled

        if $scope.disabled
          $(".no-complete", element)
            .on "keydown", (event) ->
              $scope.onKeyDown event, $scope.textInput
            .attr
              "placeholder": $scope.placeholder

        # Clicking on the element will focus on input
        element.click ->
          $(".text-input", element).focus()

        # Getting autocomplete url from parent scope
        Object.defineProperty $scope, "tags",
          get:         -> getSelected $scope.$parent
          set: (_tags) ->
            outputTags = _(_tags).map (item, i) ->
              output           = {}
              output[labelKey] = item[labelKey]
              output[valueKey] = item[valueKey]
              return output
            getSelected.assign $scope.$parent, outputTags

        $scope.removeTag = (tag) ->
          index = $scope.tags.indexOf tag
          return if index is -1

          $scope.tags[index..index] = []

        $scope.onKeyDown = (event, value) ->
          stroke = event.which or event.keyCode
          switch stroke
            when key.BACKSPACE
              if value.length is 0
                $scope.$apply -> $scope.tags.pop()
            when key.ENTER
              # Used when autocomplete is not needed
              if value.length > 0 and $scope.disabled
                $scope.$apply ->
                  $scope.textInput = ""
                  $scope.onSelect value
          return true

        $scope.onSuccess = (data) ->
          # get all selected values
          existingValues = _($scope.tags).pluck valueKey
          # remove selected tags on autocomplete dropdown
          return _(data.data).reject (item) -> (item[valueKey] or item) in existingValues

        $scope.onSelect = (item) ->
          item = $scope.autocompleteOnEnter {item} if attrs.macTagAutocompleteOnEnter?
          $scope.tags.push item if item

        $scope.reset = ->
          $scope.textInput = ""
]
