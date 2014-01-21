
Tag Autocomplete
===
A directive for generating tag input with autocomplete support on text input.  
Tag autocomplete has priority 800  
  
  
### Dependencies
- mac-autocomplete  
- mac-menu  
  

### Parameters
**mac-tag-autocomplete-url**  
Type: `String`  
Url to fetch autocomplete dropdown list data.  
mac-tag-autocomplete-url and mac-tag-autocomplete-source cannot be used together. Url  
will always take priority over mac-tag-autocomplete-source.  
  
**mac-tag-autocomplete-source**  
Type: `String`  
Data to use.  
Source support multiple types:  
- Array: An array can be used for local data and there are two supported formats:  
  - An array of strings: ["Item1", "Item2"]  
  - An array of objects with mac-autocomplete-label key: [{name:"Item1"}, {name:"Item2"}]  
- String: Using a string as the source is the same as passing the variable into mac-autocomplete-url  
- Function: A callback when querying for data. The callback receive two arguments:  
  - {String} Value currently in the text input  
  - {Function} A response callback which expects a single argument, data to user. The data will be  
  populated on the menu and the menu will adjust accordingly  
  
**mac-tag-autocomplete-value**  
Type: `String`  
The value to be sent back upon selection (default "id")  
  
**mac-tag-autocomplete-label**  
Type: `String`  
The label to display to the users (default "name")  
  
**mac-tag-autocomplete-model**  
Type: `Expr`  
Model for autocomplete  
  
**mac-tag-autocomplete-selected**  
Type: `Array`  
The list of elements selected by the user (required)  
  
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
Type: `Expr`  
When autocomplete is disabled, this function is called on enter, Should return either string, object or boolean. If false, item is not added  
- `item` - {String} User input  
  
**mac-tag-autocomplete-events**  
Type: `String`  
A CSV list of events to attach functions to  
  
**mac-tag-autocomplete-on-**  
Type: `Expr`  
Function to be called when specified event is fired  
- `event` - {Object} jQuery event  
- `value` - {String} Value in the input text  
  
  
**mac-tag-autocomplete-clear-input**  
Type: `Event`  
$broadcast message; clears text input when received  
  

