/**
 * Controller for tag autocomplete directive
 */

/**
 * @param {$scope} $scope
 * @constructor
 */
function MacTagAutocompleteController ($scope, $element, $attrs, $parse, $timeout, keys) {
  this.$scope = $scope;
  this.$element = $element;
  this.$attrs = $attrs;

  this.$parse = $parse;
  this.$timeout = $timeout;
  this.keys = keys;

  this.textInput = '';

  this.labelKey = this.labelKey != undefined ? this.labelKey : 'name';
  this.labelGetter = $parse(this.labelKey);
}

/**
 * Callback function on autocomplete keydown. The function especially
 * handles 2 cases,
 * - pressing BACKSPACE: Remove the last selected item
 * - pressing ENTER: If autocomplete is disabled, take the current input
 *                   and tokenify the value
 * Invoke macAutocompleteOnKeydown afterwards
 *
 * @param {Event} $event
 * @return {boolean} true
 */
MacTagAutocompleteController.prototype.onKeyDown = function ($event) {
  var stroke = $event.which || $event.keyCode;
  switch(stroke) {
    case this.keys.BACKSPACE:
      if (!this.$scope.textInput && angular.isArray(this.selected)) {
        this.selected.pop();
      }
      break;
    case this.keys.ENTER:
      // Used when autocomplete is not needed
      if (this.textInput && this.disabled) {
        this.onSelect(this.textInput);
      }
      break;
  }

  this.onKeydownFn({
    $event: $event,
    value: this.textInput
  });

  return true;
}

/**
 * Callback function when macAutocomplete made a successful xhr request
 * Default to `data.data` if function doesn't exist
 *
 * @param {Object} data
 * @return {Object}
 */
MacTagAutocompleteController.prototype.onSuccess = function (data, status, headers) {
  var result = data.data;

  if (this.$attrs['macTagAutocompleteOnSuccess']) {
    result = this.onSuccessFn({
      data: data,
      status: status,
      headers: headers
    });
  }
  return result;
}

/**
 * Callback function when user select an item from menu or pressed enter
 * User can specify macTagAutocompleteOnEnter function to modify item before
 * pushing into `selected` array
 * This function will also clear the text in autocomplete
 *
 * @param {Object} item
 */
MacTagAutocompleteController.prototype.onSelect = function (item) {
  if (this.$attrs['macTagAutocompleteOnEnter']) {
    item = this.onEnterFn({item: item});
  }

  if (item && angular.isArray(this.selected)) {
    this.selected.push(item);
  }

  // NOTE: $timeout is added to allow user to access the model before
  // clearing value in autocomplete
  var ctrl = this;
  this.$timeout(function () {
    ctrl.textInput = '';
  }, 0);
}

/**
 * If a label attr is specified, convert the tag object into string
 * for display
 *
 * @param {Object} tag
 * @return {string}
 */
MacTagAutocompleteController.prototype.getTagLabel = function (tag) {
  return this.labelKey ? this.labelGetter(tag) : tag;
};

angular.module('Mac')
.controller('MacTagAutocompleteController', [
  '$scope',
  '$element',
  '$attrs',
  '$parse',
  '$timeout',
  'keys',
  MacTagAutocompleteController]);
