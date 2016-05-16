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
 * @param {Function} mac-tag-autocomplete-on-success Function called on successful ajax request (Proxy attribute for macAutocomplete)
 * - `data` - {Object} Data returned from the request
 * - `status` - {Number} The status code of the response
 * - `header` - {Object} Header of the response
 * @param {Expr}    mac-tag-autocomplete-on-enter    When autocomplete is disabled, this function is called on enter, Should return either string, object or boolean. If false, item is not added
 * - `item` - {String} User input
 * @param {Event} mac-tag-autocomplete-clear-input $broadcast message; clears text input when received
 *
 * @param {expression} mac-tag-autocomplete-blur Callback function on blur
 * - `$event` - {Event} Event object
 * - `ctrl` - {MacTagAutocompleteController} Tag autocomplete element controller
 * - `value` - {String} Text input
 * @param {expression} mac-tag-autocomplete-focus Callback function on focus
 * - `$event` - {Event} Event object
 * - `ctrl` - {MacTagAutocompleteController} Tag autocomplete element controller
 * - `value` - {String} Text input
 * @param {expression} mac-tag-autocomplete-keyup Callback function on keyup
 * - `$event` - {Event} Event object
 * - `ctrl` - {MacTagAutocompleteController} Tag autocomplete element controller
 * - `value` - {String} Text input
 * @param {expression} mac-tag-autocomplete-keydown Callback function on keydown
 * - `$event` - {Event} Event object
 * - `ctrl` - {MacTagAutocompleteController} Tag autocomplete element controller
 * - `value` - {String} Text input
 * @param {expression} mac-tag-autocomplete-keypress Callback function on keypress
 * - `$event` - {Event} Event object
 * - `ctrl` - {MacTagAutocompleteController} Tag autocomplete element controller
 * - `value` - {String} Text input
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
  function () {
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
        onSuccessFn: '=macTagAutocompleteOnSuccess',
        onEnterFn: '&macTagAutocompleteOnEnter',
        onKeydownFn: '&macTagAutocompleteOnKeydown',
        labelKey: '@macTagAutocompleteLabel'
      },
      controller: 'MacTagAutocompleteController',
      controllerAs: 'macTagAutocomplete',
      bindToController: true,

      compile: function (element, attrs) {
        var labelKey = attrs.macTagAutocompleteLabel != undefined ?
          attrs.macTagAutocompleteLabel : 'name';

        var delay = +attrs.macTagAutocompleteDelay;
        delay = isNaN(delay) ? 800 : delay;

        var textInput = angular.element(element[0].querySelector('.mac-autocomplete'));
        textInput.attr({
          'mac-autocomplete-label': labelKey,
          'mac-autocomplete-query': attrs.macTagAutocompleteQuery || 'q',
          'mac-autocomplete-delay': delay
        });

        return function ($scope, element, attrs, ctrl) {
          // NOTE: Proxy is created to prevent tag autocomplete from breaking
          // when user did not specify model
          if (attrs.macTagAutocompleteModel) {
            $scope.$watch('macTagAutocomplete.textInput', function (value) { $scope.model = value;});
            $scope.$watch('macTagAutocomplete.model', function (value) { ctrl.textInput = value;});
          }

          element.bind('click', function () {
            var textInputDOM = element[0].querySelector('.mac-autocomplete');
            textInputDOM.focus();
          });

          $scope.$on('mac-tag-autocomplete-clear-input', function () {
            ctrl.textInput = '';
          });
        };
      }
    }
  }
]);

function macAutocompleteEventFactory (key) {
  var name = 'macTagAutocomplete' + key;
  var eventName = key.toLowerCase();

  angular.module('Mac').directive(name, [
    '$parse',
    function ($parse) {
      return {
        restrict: 'A',
        priority: 700,
        require: 'macTagAutocomplete',
        link: function ($scope, element, attrs, ctrl) {
          var input = angular.element(element[0].querySelector('.mac-autocomplete'));
          var expr = $parse(attrs[name]);

          if (!input) return;

          input.bind(eventName, function($event) {
            $scope.$apply(function() {
              expr($scope, {
                $event: $event,
                ctrl: ctrl,
                value: ctrl.textInput
              });
            });
          });
        }
      }
    }
  ]);
}

var macAutocompleteEvents = ['blur', 'focus', 'keyup', 'keydown', 'keypress'];
macAutocompleteEvents.forEach(macAutocompleteEventFactory);
