##
## Tag Autocomplete
##
## A directive for generating tag input with autocomplete support on text input
##
## Dependencies
## - jQuery UI autocomplete
##
## Attributes
## - mac-tag-autocomplete-url:      url to fetch autocomplete dropdown list data
## - mac-tag-autocomplete-value:    the value to be sent back upon selection
## - mac-tag-autocomplete-label:    the label to display to the users
## - mac-tag-autocomplete-selected: the list of elements selected by the user
## - mac-tag-autocomplete-query:    the query parameter on GET command
## - mac-tag-autocomplete-delay:    time delayed on fetching autocomplete data after keyup
##

angular.module("Mac").directive "macTagAutocomplete", [
  "$parse",
  "$http",
  "keys",
  ($parse, $http, key) ->
    restrict:    "E"
    scope:       {}
    templateUrl: "template/tag_autocomplete.html"
    replace:     true

    compile: (element, attr) ->
      urlExp      = attr.macTagAutocompleteUrl
      valueKey    = attr.macTagAutocompleteValue      or "id"
      labelKey    = attr.macTagAutocompleteLabel      or "name"
      selectedExp = attr.macTagAutocompleteSelected
      queryKey    = attr.macTagAutocompleteQuery      or "q"
      delay       = attr.macTagAutocompleteDelay      or 800

      getUrl      = $parse urlExp
      getSelected = $parse selectedExp

      textInput = $(".text-input", element)

      # Update template on label variable name
      tagLabelKey = if labelKey? then ".#{labelKey}" else ""
      $(".tag-label", element).text "{{tag#{tagLabelKey}}}"

      ($scope, element, attrs) ->
        # Getting autocomplete url from parent scope
        Object.defineProperty $scope, "autocompleteUrl",
          get:       -> getUrl $scope.$parent
          set: (url) -> getUrl.assign $scope.$parent, url

        Object.defineProperty $scope, "tags",
          get:         -> getSelected $scope.$parent
          set: (_tags) ->
            outputTags = _(_tags).map (item, i) ->
              output           = {}
              output[labelKey] = item[labelKey]
              output[valueKey] = item[valueKey]
              return output
            getSelected.assign $scope.$parent, outputTags

        $scope.$on "resetTagAutocomplete", -> $scope.reset()

        $scope.removeTag = (tag) ->
          index = $scope.tags.indexOf tag
          return if index is -1

          $scope.tags[index..index] = []

        textInput.bind "keydown", (event) ->
          stroke = event.which or event.keyCode
          switch stroke
            when key.BACKSPACE
              if $(this).val().length is 0
                $scope.$apply -> $scope.tags.pop()
          return true

        textInput.autocomplete
          delay:     delay
          autoFocus: true
          source: (req, resp) ->
            options =
              method: "GET"
              url:    $scope.autocompleteUrl
              params: {}
            options.params[queryKey] = req.term

            $http(options)
              .success (data, status, headers, config) ->
                # get all selected values
                existingValues = _($scope.tags).pluck valueKey
                # remove selected tags on autocomplete dropdown
                list           = _(data.data).reject (item) -> (item[valueKey] or item) in existingValues
                # convert tags to jquery ui autocomplete format
                resp _(list).map (item) ->
                  label = value = if labelKey? then item[labelKey] else item
                  return {label, value}
                # store the current data for revert lookup
                $scope.currentAutocomplete = data.data

          select: (event, ui) ->
            $scope.$apply ->
              item = _($scope.currentAutocomplete).find (item) -> item[labelKey] is ui.item.label
              $scope.tags.push item

            setTimeout (->
              textInput.val ""
            ), 0

        $scope.reset = ->
          $scope.currentAutocomplete = []

        $scope.reset()
]
