
Menu
===
A directive for creating a menu with multiple items  
  
Menu allows for custom html templating for each item.  
  
Since macMenu is using ngRepeat, some ngRepeat properties along with `item` are exposed on the local scope of each template instance, including:  
  
| Variable  | Type    | Details                                                                     |  
|-----------|---------|-----------------------------------------------------------------------------|  
| `$index`  | Number  | iterator offset of the repeated element (0..length-1)                       |  
| `$first`  | Boolean | true if the repeated element is first in the iterator.                      |  
| `$middle` | Boolean | true if the repeated element is between the first and last in the iterator. |  
| `$last`   | Boolean | true if the repeated element is last in the iterator.                       |  
| `$even`   | Boolean | true if the iterator position `$index` is even (otherwise false).           |  
| `$odd`    | Boolean | true if the iterator position `$index` is odd (otherwise false).            |  
| `item`    | Object  | item object                                                                 |  
  
To use custom templating  
```  
<mac-menu>  
  <span> {{item.label}} </span>  
</mac-menu>  
```  
  
Template default to `{{item.label}}` if not defined  
  
  
### Parameters
**mac-menu-items**  
Type: `Expression`  
List of items to display in the menu  
        Each item should have a `label` key as display text  
  
**mac-menu-select**  
Type: `Function`  
Callback on select  
- `index` - {Integer} Item index  
  
**mac-menu-style**  
Type: `Object`  
Styles apply to the menu  
  
**mac-menu-index**  
Type: `Expression`  
Index of selected item  
  

