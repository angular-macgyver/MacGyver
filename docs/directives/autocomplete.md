
Autocomplete
===
A directive for providing suggestions while typing into the field  
  
Autocomplete allows for custom html templating in the dropdown and some properties are exposed on the local scope on each template instance, including:  
  
| Variable  | Type    | Details                                                                     |  
|-----------|---------|-----------------------------------------------------------------------------|  
| `$index`  | Number  | iterator offset of the repeated element (0..length-1)                       |  
| `$first`  | Boolean | true if the repeated element is first in the iterator.                      |  
| `$middle` | Boolean | true if the repeated element is between the first and last in the iterator. |  
| `$last`   | Boolean | true if the repeated element is last in the iterator.                       |  
| `$even`   | Boolean | true if the iterator position `$index` is even (otherwise false).           |  
| `$odd`    | Boolean | true if the iterator position `$index` is odd (otherwise false).            |  
| `item`    | Object  | item object with `value` and `label` if label-key is set                    |  
  
To use custom templating  
  
```  
<mac-autocomplete mac-autocomplete-url="someUrl" ng-model="model">  
  <span> {{item.label}} </span>  
</mac-autocomplete>  
```  
  
Template default to `{{item.label}}` if not defined  
  
  
### Dependencies
- mac-menu  
  

### Parameters
**ng-model**  
Type: `String`  
Assignable angular expression to data-bind to (required)  
  
**mac-placeholder**  
Type: `String`  
Placeholder text  
  
**mac-autocomplete-url**  
Type: `String`  
Url to fetch autocomplete dropdown list data. URL may include GET params e.g. "/users?nocache=1"  
  
**mac-autocomplete-source**  
Type: `Expression`  
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
The label to display to the users (default "name")  
  
**mac-autocomplete-query**  
Type: `String`  
The query parameter on GET command (default "q")  
  
**mac-autocomplete-delay**  
Type: `Integer`  
Delay on fetching autocomplete data after keyup (default 800)  
  
  
**mac-menu-class**  
Type: `Expr`  
Classes for mac-menu used by mac-autocomplete. For more info, check [ngClass](http://docs.angularjs.org/api/ng/directive/ngClass)  
  

