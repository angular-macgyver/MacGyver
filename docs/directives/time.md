
Time
===
A directive for creating a time input field. Time input can use any `ng-` attributes support by text input type.  
  
  
### Parameters
**ng-model**  
Type: `String`  
Assignable angular expression to data-bind to  
Clearing model by setting it to null or '' will set model back to default value  
  
**name**  
Type: `String`  
Property name of the form under which the control is published  
  
**required**  
Type: `String`  
Adds `required` validation error key if the value is not entered.  
  
**ng-required**  
Type: `String`  
Adds `required` attribute and `required` validation constraint to  
 the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of  
 `required` when you want to data-bind to the `required` attribute.  
  
**ng-pattern**  
Type: `String`  
Sets `pattern` validation error key if the value does not match the  
 RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for  
   patterns defined as scope expressions.  
  
**ng-change**  
Type: `String`  
Angular expression to be executed when input changes due to user interaction with the input element.  
  
**ng-disabled**  
Type: `String`  
Enable or disable time input  
  
  
**mac-time-default**  
Type: `String`  
If model is undefined, use this as the starting value (default 12:00 PM)  
  
  

