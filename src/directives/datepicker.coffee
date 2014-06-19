###
@chalk overview
@name Datepicker
@description
A directive for creating a datepicker on text input using jquery ui. Time input can use any `ng-` attributes support by text input type.

@dependencies
- jQuery
- jQuery datepicker

@param {String}     ng-model The model to store the selected date
Clearing model by setting it to null or '' will clear the input field
@param {Function}   mac-datepicker-on-select Function called before setting the value to the model
  - `date` - {String} Selected date from the datepicker
  - `instance` - {Object} Datepicker instance
@param {String}     mac-datepicker-on-close Function called before closing datepicker
  - `date` - {String} Selected date from the datepicker
  - `instance` - {Object} Datepicker instance
@param {String}     mac-datepicker-append-text          The text to display after each date field
@param {Boolean}    mac-datepicker-auto-size            Automatically resize the input to accommodate dates in the current dateFormat
@param {Boolean}    mac-datepicker-change-month         Whether the month should be rendered as a dropdown instead of text
@param {Boolean}    mac-datepicker-change-year          Whether the year should be rendered as a dropdown instead of text
@param {Boolean}    mac-datepicker-constrain-input-type Constrain characters allowed by the current dateFormat
@param {String}     mac-datepicker-current-text         Text to display for the current day link
@param {String}     mac-datepicker-date-format          The format for parse and displayed dates
@param {Expression} mac-datepicker-default-date         Date to highligh on first opening if the field is blank {Date|Number|String}
@param {String}     mac-datepicker-duration             Control the speed at which the datepicker appears
@param {Integer}    mac-datepicker-first-day            Set the first day of the week. Sunday is 0, Monday is 1
@param {Expression} mac-datepicker-max-date             The maximum selectable date {Date|Number|String}
@param {Expression} mac-datepicker-min-date             The minimum selectable date {Date|Number|String}
@param {Integer}    mac-datepicker-number-of-months     The number of months to show at once
@param {String}     mac-datepicker-show-on              When the datepicker should appear
@param {Integer}    mac-datepicker-year-range           The range of years displayed in the year drop-down
@param {Boolean}    ng-disabled                         Enable or disable datepicker
###

angular.module("Mac").directive "macDatepicker", [
  "$parse"
  "$timeout"
  "util"
  (
    $parse
    $timeout
    util
  ) ->
    defaults =
      appendText:         ""
      autoSize:           false
      changeMonth:        false
      changeYear:         false
      constrainInputType: true
      currentText:        "Today"
      dateFormat:         "mm/dd/yy"
      defaultDate:        null
      duration:           "normal"
      firstDay:           0
      maxDate:            null
      minDate:            null
      numberOfMonths:     1
      showOn:             "focus"
      yearRange:          "c-10:c+10"

    restrict:    "E"
    require:     "ngModel"
    replace:     true
    templateUrl: "template/datepicker.html"

    link: ($scope, element, attrs, ngModelCtrl) ->
      opts = util.extendAttributes "macDatepicker", defaults, attrs

      onSelect = $parse attrs.macDatepickerOnSelect
      onClose  = $parse attrs.macDatepickerOnClose

      # Validation
      datepickerValidator = (value) ->
        # Do not validate if the value is empty string
        unless value
          ngModelCtrl.$setValidity "date", true
          return value

        try
          $.datepicker.parseDate opts.dateFormat, value
          ngModelCtrl.$setValidity "date", true
          return value

        catch e
          ngModelCtrl.$setValidity "date", false
          return undefined

      ngModelCtrl.$formatters.push datepickerValidator
      ngModelCtrl.$parsers.push datepickerValidator

      # jQuery UI Datepicker initialization
      opts.onSelect = (date, instance) ->
        $scope.$apply ->
          onSelect? $scope, {date, instance}

          ngModelCtrl.$setViewValue date
          ngModelCtrl.$render()

      opts.onClose = (date, instance) ->
        $scope.$apply ->
          onClose? $scope, {date, instance}

      element.datepicker opts

      # Watchers on local variables
      setOptions = (name, value) ->
        if value?
          element.datepicker "option", name, value

      if attrs.macDatepickerDefaultDate?
        $scope.$watch attrs.macDatepickerDefaultDate, (value) ->
          setOptions "defaultDate", value

      if attrs.macDatepickerMaxDate?
        $scope.$watch attrs.macDatepickerMaxDate, (value) ->
          setOptions "maxDate", value

      if attrs.macDatepickerMinDate?
        $scope.$watch attrs.macDatepickerMinDate, (value) ->
          setOptions "minDate", value
]
