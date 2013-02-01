##
## @name
## Datepicker
##
## @description
## A directive for creating a datepicker on text input using jquery ui
##
## @dependencies
## - jQuery
## - jQuery datepicker
##
## @attributes
## - mac-datepicker-id:                   The id of the text input field
## - mac-datepicker-model:                The model to store the selected date
## - mac-datepicker-on-before-select:     Function called before setting the value to the model
##                                          @params {String} date Selected date from the datepicker
## - mac-datepicker-on-before-close:      Function called before closing datepicker
##                                          @params {String} date Selected date from the datepicker
##                                          @params {Object} instance Datepicker instance
## - mac-datepicker-append-text:          The text to display after each date field
## - mac-datepicker-auto-size:            automatically resize the input to accommodate dates in the current dateFormat
## - mac-datepicker-change-month:         Whether the month should be rendered as a dropdown instead of text
## - mac-datepicker-change-year:          Whether the year should be rendered as a dropdown instead of text
## - mac-datepicker-constrain-input-type: Constrain characters allowed by the current dateFormat
## - mac-datepicker-current-text:         Text to display for the current day link
## - mac-datepicker-date-format:          The format for parse and displayed dates
## - mac-datepicker-default-date:         Date to highligh on first opening if the field is blank
## - mac-datepicker-duration:             Control the speed at which the datepicker appears
## - mac-datepicker-first-day:            Set the first day of the week. Sunday is 0, Monday is 1
## - mac-datepicker-max-date:             The maximum selectable date
## - mac-datepicker-min-date:             The minimum selectable date
## - mac-datepicker-number-of-months:     The number of months to show at once
## - mac-datepicker-show-on:              When the datepicker should appear
## - mac-datepicker-year-range:           The range of years displayed in the year drop-down

angular.module("Mac").directive "macDatepicker", [
  "util"
  (util) ->
    restrict: "E"
    scope:
      model:          "=macDatepickerModel"
      onBeforeSelect: "&macDatepickerOnBeforeSelect"
      onBeforeClose:  "&macDatepickerOnBeforeClose"

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

      inputElement = $("input", element).attr "id", opts.id

      ($scope, element, attrs) ->

        opts.onSelect = (date, instance) ->
          $scope.$apply ->
            date         = $scope.onBeforeSelect {data} if attrs.macDatepickerOnBeforeSelect?
            $scope.model = date

        opts.onClose = (date, instance) ->
          $scope.$apply ->
            $scope.onBeforeClose {date, instance} if attrs.macDatepickerOnBeforeClose?

        inputElement.datepicker opts
]
