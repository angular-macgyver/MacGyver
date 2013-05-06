
Autocomplete
===
A directive for providing suggestions while typing into the field  
  
### Dependencies
- jQuery UI autocomplete  

### Parameters
**mac-autocomplete-url**  
Type: `String`  
Url to fetch autocomplete dropdown list data  
  
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
  
**mac-autocomplete-on-key-down**  
Type: `Function`  
function called on key down  
- `event` - {Object} jQuery event  
- `value` - {String} Value in the input text  
  
**mac-autocomplete-value**  
Type: `String`  
The value to be sent back upon selection        (default "id")  
  
**mac-autocomplete-label**  
Type: `String`  
The label to display to the users               (default "name")  
  
**mac-autocomplete-query**  
Type: `String`  
The query parameter on GET command              (default "q")  
  
**mac-autocomplete-delay**  
Type: `Integer`  
Delay on fetching autocomplete data after keyup (default 800)  
  
**mac-autocomplete-clear-on-select**  
Type: `Boolean`  
Clear text input on select                      (default false)  
  
**mac-autocomplete-placeholder**  
Type: `String`  
Placeholder text of the text input              (default "")  
  

