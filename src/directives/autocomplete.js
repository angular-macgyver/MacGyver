/**
 * @ngdoc directive
 * @name macAutocomplete
 * @description
 * A directive for providing suggestions while typing into the field
 *
 * Autocomplete allows for custom html templating in the dropdown and some properties are exposed on the local scope on each template instance, including:
 *
 * | Variable  | Type    | Details                                                                     |
 * |-----------|---------|-----------------------------------------------------------------------------|
 * | `$index`  | Number  | iterator offset of the repeated element (0..length-1)                       |
 * | `$first`  | Boolean | true if the repeated element is first in the iterator.                      |
 * | `$middle` | Boolean | true if the repeated element is between the first and last in the iterator. |
 * | `$last`   | Boolean | true if the repeated element is last in the iterator.                       |
 * | `$even`   | Boolean | true if the iterator position `$index` is even (otherwise false).           |
 * | `$odd`    | Boolean | true if the iterator position `$index` is odd (otherwise false).            |
 * | `item`    | Object  | item object with `value` and `label` if label-key is set                    |
 *
 * To use custom templating
 *
 * ```
 * <mac-autocomplete mac-autocomplete-url="someUrl" ng-model="model">
 *   <span> {{item.label}} </span>
 * </mac-autocomplete>
 * ```
 *
 * Template default to `{{item.label}}` if not defined
 *
 * @param {String} ng-model Assignable angular expression to data-bind to (required)
 * @param {String} mac-placeholder Placeholder text
 * @param {Expression} mac-autocomplete-source Data to use.
 * Source support multiple types:
 * - Array: An array can be used for local data and there are two supported formats:
 *   - An array of strings: ["Item1", "Item2"]
 *   - An array of objects with mac-autocomplete-label key: [{name:"Item1"}, {name:"Item2"}]
 * - String: Using a string as the source is the same as passing the variable into mac-autocomplete-url
 * - Function: A callback when querying for data. The callback receive two arguments:
 *   - {String} Value currently in the text input
 *   - {Function} A response callback which expects a single argument, data to user. The data will be
 *   populated on the menu and the menu will adjust accordingly
 * @param {Boolean} mac-autocomplete-disabled Boolean value if autocomplete should be disabled
 * @param {Function} mac-autocomplete-on-select Function called when user select on an item
 * - `selected` - {Object} The item selected
 * @param {Function} mac-autocomplete-on-success function called on success ajax request
 * - `data` - {Object} Data returned from the request
 * - `status` - {Number} The status code of the response
 * - `header` - {Object} Header of the response
 * @param {Function} mac-autocomplete-on-error Function called on ajax request error
 * - `data` - {Object} Data returned from the request
 * - `status` - {Number} The status code of the response
 * - `header` - {Object} Header of the response
 * @param {String}  mac-autocomplete-label The label to display to the users (default "name")
 * @param {String}  mac-autocomplete-query The query parameter on GET command (default "q")
 * @param {Integer} mac-autocomplete-delay Delay on fetching autocomplete data after keyup (default 800)
 *
 * @param {Expr} mac-menu-class Classes for mac-menu used by mac-autocomplete. For more info, check [ngClass](http://docs.angularjs.org/api/ng/directive/ngClass)
 *
 * @example
<caption>Basic setup</caption>
<example>
  <mac-autocomplete
    mac-autocomplete-source = "autocompleteUrl"
    mac-autocomplete-query = "q"
    mac-autocomplete-on-success = "onSuccess(data)"
    mac-placeholder = "'Autocomplete'"
    ng-model = "autocompleteQuery"
  ></mac-autocomplete>
</example>
<mac-autocomplete
  mac-autocomplete-source = "autocompleteUrl"
  mac-autocomplete-query = "q"
  mac-autocomplete-on-success = "onSuccess(data)"
  mac-placeholder = "'Autocomplete'"
  ng-model = "autocompleteQuery"
></mac-autocomplete>
 *
 * @example
<caption>Example with autocomplete using source</caption>
<example>
  <mac-autocomplete
    mac-autocomplete-source = "['hello', 'world']"
    mac-placeholder = "'Type something...'"
    ng-model = "autocompleteSourceQuery"
  ></mac-autocomplete>
</example>
<mac-autocomplete
  mac-autocomplete-source = "['hello', 'world']"
  mac-placeholder = "'Type something...'"
  ng-model = "autocompleteSourceQuery"
></mac-autocomplete>
 *
 */

angular.module('Mac')
.directive('macAutocomplete', [
  function () {
    return {
      restrict: 'EA',
      template: '<input type="text">',
      transclude: true,
      replace: true,
      require: ['ngModel', 'macAutocomplete'],
      bindToController: true,
      controllerAs: 'macAutocomplete',
      controller: 'MacAutocompleteController',
      scope: {
        onSelect: '&macAutocompleteOnSelect',
        onSuccess: '&macAutocompleteOnSuccess',
        onError: '&macAutocompleteOnError',
        source: '=macAutocompleteSource',
        disabled: '=?macAutocompleteDisabled',
        queryKey: '@macAutocompleteQuery',
        delay: '@macAutocompleteDelay',
        class: '=macMenuClass'
      },
      link: function ($scope, element, attrs, ctrls, transclude) {
        var ngModelCtrl = ctrls[0],
            macAutocompleteCtrl = ctrls[1];

        macAutocompleteCtrl.initializeMenu(ngModelCtrl, transclude);
        ngModelCtrl.$parsers.push(function(value) {
          return macAutocompleteCtrl.parser(value);
        });
        element.bind('keydown', function (event) {
          return macAutocompleteCtrl.keydownHandler(event);
        });
      }
    };
  }
]);
