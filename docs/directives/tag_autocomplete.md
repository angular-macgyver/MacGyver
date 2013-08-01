
Tag Autocomplete
===
A directive for generating tag input with autocomplete support on text input  
  
### Dependencies
- mac-autocomplete  
- mac-menu  

### Parameters
**mac-tag-autocomplete-url**  
Type: `String`  
Url to fetch autocomplete dropdown list data  
  
**mac-tag-autocomplete-value**  
Type: `String`  
The value to be sent back upon selection (default "id")  
  
**mac-tag-autocomplete-label**  
Type: `String`  
The label to display to the users (default "name")  
  
**mac-tag-autocomplete-model**  
Type: `Expression`  
Model for autocomplete  
  
**mac-tag-autocomplete-selected**  
Type: `Array`  
The list of elements selected by the user  
  
**mac-tag-autocomplete-query**  
Type: `String`  
The query parameter on GET command (defualt "q")  
  
**mac-tag-autocomplete-delay**  
Type: `Integer`  
Time delayed on fetching autocomplete data after keyup  (default 800)  
  
**mac-tag-autocomplete-placeholder**  
Type: `String`  
Placeholder text of the text input (default "")  
  
**mac-tag-autocomplete-disabled**  
Type: `Boolean`  
If autocomplete is enabled or disabled (default false)  
  
**mac-tag-autocomplete-on-enter**  
Type: `Expression`  
When autocomplete is disabled, this function is called on enter, Should return either string, object or boolean. If false, item is not added  
- `item` - {String} User input  
  
**mac-tag-autocomplete-events**  
Type: `String`  
a CSV list of events to attach functions to  
  
**mac-tag-autocomplete-on-**  
Type: `Expression`  
The function to be called when specified event is fired  
- `event` - {Object} jQuery event  
- `value` - {String} Value in the input text  
  
**mac-tag-autocomplete-clear-input**  
Type: `Event`  
$broadcast message; clears text input when received  
  

