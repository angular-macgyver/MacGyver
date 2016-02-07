/**
 * @ngdoc directive
 * @name macTagAutocomplete
 * @description
 * A directive for generating tag input with autocomplete support on text input.
 * Tag autocomplete has priority 800
 *
 * @param {String}  mac-tag-autocomplete-source      Data to use.
 * Source support multiple types:
 * - Array: An array can be used for local data and there are two supported formats:
 *   - An array of strings: ["Item1", "Item2"]
 *   - An array of objects with mac-autocomplete-label key: [{name:"Item1"}, {name:"Item2"}]
 * - String: Using a string as the source is the same as passing the variable into mac-autocomplete-url
 * - Function: A callback when querying for data. The callback receive two arguments:
 *   - {String} Value currently in the text input
 *   - {Function} A response callback which expects a single argument, data to user. The data will be
 *   populated on the menu and the menu will adjust accordingly
 * @param {String}  mac-tag-autocomplete-value       The value to be sent back upon selection (default "id")
 * @param {String}  mac-tag-autocomplete-label       The label to display to the users (default "name")
 * @param {Expr}    mac-tag-autocomplete-model       Model for autocomplete
 * @param {Array}   mac-tag-autocomplete-selected    The list of elements selected by the user (required)
 * @param {String}  mac-tag-autocomplete-query       The query parameter on GET command (defualt "q")
 * @param {Integer} mac-tag-autocomplete-delay       Time delayed on fetching autocomplete data after keyup  (default 800)
 * @param {String}  mac-tag-autocomplete-placeholder Placeholder text of the text input (default "")
 * @param {Boolean} mac-tag-autocomplete-disabled    If autocomplete is enabled or disabled (default false)
 * @param {Expr}    mac-tag-autocomplete-on-enter    When autocomplete is disabled, this function is called on enter, Should return either string, object or boolean. If false, item is not added
 * - `item` - {String} User input
 * @param {Event} mac-tag-autocomplete-clear-input $broadcast message; clears text input when received
 *
 * @example
<caption>Basic example</caption>
<example>
  <mac-tag-autocomplete
    mac-tag-autocomplete-source = "autocompleteUrl"
    mac-tag-autocomplete-query = "q"
    mac-tag-autocomplete-selected = "tagAutocompleteSelected"
    mac-tag-autocomplete-value = "id"
    mac-tag-autocomplete-label = "name"
    mac-tag-autocomplete-placeholder = "tagAutocompletePlaceholder"
    mac-tag-autocomplete-model = "tagAutocompleteModel"
  />
</example>
<mac-tag-autocomplete
  mac-tag-autocomplete-source = "autocompleteUrl"
  mac-tag-autocomplete-query = "q"
  mac-tag-autocomplete-selected = "tagAutocompleteSelected"
  mac-tag-autocomplete-value = "id"
  mac-tag-autocomplete-label = "name"
  mac-tag-autocomplete-placeholder = "tagAutocompletePlaceholder"
  mac-tag-autocomplete-model = "tagAutocompleteModel"
/>
 *
 * @example
<caption>Example with autocomplete disabled</caption>
<example>
  <mac-tag-autocomplete
    mac-tag-autocomplete-selected = "tagAutocompleteDisabledSelected"
    mac-tag-autocomplete-placeholder = "tagAutocompletePlaceholder"
    mac-tag-autocomplete-value = ""
    mac-tag-autocomplete-label = ""
    mac-tag-autocomplete-disabled = "true"
  />
</example>
<mac-tag-autocomplete
  mac-tag-autocomplete-selected = "tagAutocompleteDisabledSelected"
  mac-tag-autocomplete-placeholder = "tagAutocompletePlaceholder"
  mac-tag-autocomplete-value = ""
  mac-tag-autocomplete-label = ""
  mac-tag-autocomplete-disabled = "true"
/>
 */

angular.module('Mac').directive('macTagAutocomplete', [
  '$parse',
  '$timeout',
  'keys',
  function ($parse, $timeout, keys) {
    return {
      restrict: 'E',
      templateUrl: 'template/tag_autocomplete.html',
      replace: true,
      priority: 800,
      scope: {
        source: '=macTagAutocompleteSource',
        placeholder: '=macTagAutocompletePlaceholder',
        selected: '=macTagAutocompleteSelected',
        disabled: '=macTagAutocompleteDisabled',
        model: '=macTagAutocompleteModel',
        onEnter: '&macTagAutocompleteOnEnter',
        onKeydown: '&macTagAutocompleteOnKeydown'
      },

      compile: function (element, attrs) {
        var labelKey = attrs.macTagAutocompleteLabel != undefined ?
          attrs.macTagAutocompleteLabel : 'name';
        var labelGetter = $parse(labelKey);

        var queryKey = attrs.macTagAutocompleteQuery || 'q';

        var delay = +attrs.macTagAutocompleteDelay
        delay = isNaN(delay) ? 800 : delay;

        var textInput = angular.element(element[0].getElementsByClassName('mac-autocomplete'));
        textInput.attr({
          'mac-autocomplete-label': labelKey,
          'mac-autocomplete-query': queryKey,
          'mac-autocomplete-delay': delay,
          'mac-autocomplete-source': 'autocompleteSource'
        });

        return function ($scope, element, attrs) {
          // Variable for input element
          $scope.textInput = '';

          // NOTE: Proxy is created to prevent tag autocomplete from breaking
          // when user did not specify model
          if (attrs.macTagAutocompleteModel) {
            $scope.$watch('textInput', function (value) { $scope.model = value;});
            $scope.$watch('model', function (value) { $scope.textInput = value;});
          }

          element.bind('click', function () {
            var textInputDOM = element[0].querySelector('.mac-autocomplete');
            textInputDOM.focus();
          });

          $scope.getTagLabel = function (tag) {
            return labelKey ? labelGetter(tag) : tag;
          };

          // TODO (adrian): Look into removing this
          var updateAutocompleteSource = function () {
            $scope.autocompletePlaceholder = $scope.selected && $scope.selected.length ? '' : $scope.placeholder;

            if (!angular.isArray($scope.source) || !$scope.selected) {
              $scope.autocompleteSource = $scope.source;
              return;
            }

            $scope.autocompleteSource = $scope.source.filter(function (item) {
              return $scope.selected.indexOf(item) < 0;
            })
          }

          // NOTE: Watcher on source is added for string and function type to make sure
          // scope value is copied correctly into this scope
          if (angular.isArray($scope.source)) {
            $scope.$watchCollection('source', updateAutocompleteSource);
          } else {
            $scope.$watch('source', updateAutocompleteSource);
          }

          $scope.onKeyDown = function ($event) {
            var stroke = $event.which || $event.keyCode;
            switch(stroke) {
              case keys.BACKSPACE:
                if (!$scope.textInput && angular.isArray($scope.selected)) {
                  $scope.selected.pop();
                }
                break;
              case keys.ENTER:
                // Used when autocomplete is not needed
                if ($scope.textInput && $scope.disabled) {
                  $scope.onSelect($scope.textInput);
                }
                break;
            }

            $scope.onKeydown({
              $event: $event,
              value: $scope.textInput
            });

            return true;
          };

          $scope.onSuccess = function (data) {
            // TODO (adrian): Filter out selected items
            return data.data;
          };

          $scope.onSelect = function (item) {
            if (attrs.macTagAutocompleteOnEnter) {
              item = $scope.onEnter({item: item});
            }

            if (item && angular.isArray($scope.selected)) {
              $scope.selected.push(item);
            }

            // NOTE: $timeout is added to allow user to access the model before
            // clearing value in autocomplete
            $timeout(function () {
              $scope.textInput = ''
            }, 0);
          };

          $scope.$on('mac-tag-autocomplete-clear-input', function () {
            $scope.textInput = '';
          });
        };
      }
    }
  }
])
