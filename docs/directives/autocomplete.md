
Autocomplete
===
A directive for providing suggestions while typing into the field  
  
### Dependencies
- mac-menu  

### Parameters
**ng-model**  
Type: `String`  
Assignable angular expression to data-bind to  
  
**mac-placeholder**  
Type: `String`  
Placeholder text  
  
**mac-autocomplete-url**  
Type: `String`  
Url to fetch autocomplete dropdown list data  
  
**mac-autocomplete-source**  
Type: `Expression`  
Local data source  
  
**mac-autocomplete-disabled**  
Type: `Boolean`  
Boolean value if autocomplete should be disabled  
  
**mac-autocomplete-on-select**  
Type: `Function`  
Function called when user select on an item  
- `selected` - {Object} The item selected  
  
**mac-autocomplete-on-success**  
Type: `Function`  
function called on success ajax request  
- `data` - {Object} Data returned from the request  
- `status` - {Number} The status code of the response  
- `header` - {Object} Header of the response  
  
**mac-autocomplete-on-error**  
Type: `Function`  
Function called on ajax request error  
- `data` - {Object} Data returned from the request  
- `status` - {Number} The status code of the response  
- `header` - {Object} Header of the response  
  
**mac-autocomplete-label**  
Type: `String`  
The label to display to the users               (default "name")  
  
**mac-autocomplete-query**  
Type: `String`  
The query parameter on GET command              (default "q")  
  
**mac-autocomplete-delay**  
Type: `Integer`  
Delay on fetching autocomplete data after keyup (default 800)  
  

