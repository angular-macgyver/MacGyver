###
@chalk overview
@name Datepicker
@description
A directive for creating a datepicker on text input using jquery ui

@dependencies
- jQuery
- jQuery datepicker

@param {String}     mac-datepicker-id        The id of the text input field
@param {String}     mac-datepicker-model     The model to store the selected date
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
@param {Boolean}    mac-datepicker-disabled             Enable or disable datepicker
###

angular.module("Mac").directive "macDatepicker", [
  "$parse"
  "$timeout"
  "util"
  ($parse, $timeout, util) ->
    restrict:    "E"
    replace:     true
    templateUrl: "template/datepicker.html"

    compile: (element, attrs) ->
      defaults =
        id:                 "input-date"
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

      opts = util.extendAttributes "macDatepicker", defaults, attrs

      inputAttrs = "mac-id": opts.id
      if attrs.macDatepickerDisabled?
        inputAttrs["ng-disabled"] = attrs.macDatepickerDisabled

      inputElement = $("input", element).attr inputAttrs

      ($scope, element, attrs) ->
        onSelect    = $parse attrs.macDatepickerOnSelect
        onClose     = $parse attrs.macDatepickerOnClose
        model       = $parse attrs.macDatepickerModel
        initialized = false

        setOptions = (name, value) ->
          return unless initialized and value?
          inputElement.datepicker "option", name, value

        $scope.$watch attrs.macDatepickerModel, (value) ->
          if initialized and value?
            $timeout ->
              inputElement.datepicker "setDate", value
            , 0

        $scope.$watch attrs.macDatepickerDefaultDate, (value) ->
          setOptions "defaultDate", value

        $scope.$watch attrs.macDatepickerMaxDate, (value) ->
          setOptions "maxDate", value

        $scope.$watch attrs.macDatepickerMinDate, (value) ->
          setOptions "minDate", value

        opts.onSelect = (date, instance) ->
          $scope.$apply ->
            onSelect? $scope, {date, instance}
            model.assign? $scope, date

        opts.onClose = (date, instance) ->
          $scope.$apply ->
            onClose? $scope, {date, instance}

        inputElement.datepicker opts
        initialized = true
]
