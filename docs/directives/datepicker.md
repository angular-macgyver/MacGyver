
Datepicker
===
A directive for creating a datepicker on text input using jquery ui. Time input can use any `ng-` attributes support by text input type.  
  
  
### Dependencies
- jQuery  
- jQuery datepicker  
  

### Parameters
**ng-model**  
Type: `String`  
The model to store the selected date  
Clearing model by setting it to null or '' will clear the input field  
  
**mac-datepicker-on-select**  
Type: `Function`  
Function called before setting the value to the model  
  - `date` - {String} Selected date from the datepicker  
  - `instance` - {Object} Datepicker instance  
  
**mac-datepicker-on-close**  
Type: `String`  
Function called before closing datepicker  
  - `date` - {String} Selected date from the datepicker  
  - `instance` - {Object} Datepicker instance  
  
**mac-datepicker-append-text**  
Type: `String`  
The text to display after each date field  
  
**mac-datepicker-auto-size**  
Type: `Boolean`  
Automatically resize the input to accommodate dates in the current dateFormat  
  
**mac-datepicker-change-month**  
Type: `Boolean`  
Whether the month should be rendered as a dropdown instead of text  
  
**mac-datepicker-change-year**  
Type: `Boolean`  
Whether the year should be rendered as a dropdown instead of text  
  
**mac-datepicker-constrain-input-type**  
Type: `Boolean`  
Constrain characters allowed by the current dateFormat  
  
**mac-datepicker-current-text**  
Type: `String`  
Text to display for the current day link  
  
**mac-datepicker-date-format**  
Type: `String`  
The format for parse and displayed dates  
  
**mac-datepicker-default-date**  
Type: `Expression`  
Date to highligh on first opening if the field is blank {Date|Number|String}  
  
**mac-datepicker-duration**  
Type: `String`  
Control the speed at which the datepicker appears  
  
**mac-datepicker-first-day**  
Type: `Integer`  
Set the first day of the week. Sunday is 0, Monday is 1  
  
**mac-datepicker-max-date**  
Type: `Expression`  
The maximum selectable date {Date|Number|String}  
  
**mac-datepicker-min-date**  
Type: `Expression`  
The minimum selectable date {Date|Number|String}  
  
**mac-datepicker-number-of-months**  
Type: `Integer`  
The number of months to show at once  
  
**mac-datepicker-show-on**  
Type: `String`  
When the datepicker should appear  
  
**mac-datepicker-year-range**  
Type: `Integer`  
The range of years displayed in the year drop-down  
  
**ng-disabled**  
Type: `Boolean`  
Enable or disable datepicker  
  

