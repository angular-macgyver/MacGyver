
Popover Service
===
A popover service to keep state of opened popover. Allowing user to hide certain  
or all popovers  
  
  
### Parameters
**popoverList**  
Type: `Array`  
The popover that's currently being shown  
  
  
**registered**  
Type: `Array`  
Object storing all the registered popover DOM elements  
  
  
**last**  
Type: `Function`  
Get data of the last popover  
- Returns {Object} The last opened popover  
  
  
**register**  
Type: `Function`  
Register a popover with an id and an element  
- {String} id Popover id  
- {DOM Element} element Popover element  
- Returns {Bool} If the id already existed  
  
  
**unregister**  
Type: `Function`  
Remove id and element from registered list of popover  
- {String} id Popover id  
- Returns {Bool} If the id exist  
  
  
**add**  
Type: `Function`  
Add a new popover to opened list  
- {String} id Popover id  
- {DOM Element} popover Popover DOM element  
- {DOM Element} element Trigger DOM element  
- {Object} options Additional options  
- Returns {Object} The new popover object  
  
  
**pop**  
Type: `Function`  
Get and remove the last popover from list  
- Returns {Object} Last element from popoverList  
  
  
**show**  
Type: `Function`  
Show and position a registered popover  
- {String} id Popover id  
- {DOM Element} element Element that trigger the popover  
- {Object} options Additional options for popover  
  
  
**getById**  
Type: `Function`  
Get opened popover object by id  
- {String} id Popover id  
- Returns {Object} Opened popover object  
  
  
**resize**  
Type: `Function`  
Update size and position of an opened popover  
- {Object|String} popoverObj Support multiple type input:  
  - Object: One of the popover objects in popoverList  
  - String: Popover ID  
  
  
**hide**  
Type: `Function`  
Hide a certain popover. If no selector is provided, the  
last opened popover is hidden  
- {DOM Element|String} selector Support multiple type input:  
  - DOM Element: Popover trigger element  
  - String: Popover ID  
- {Function} callback Callback after popover is hidden  
  
  
**hideAll**  
Type: `Function`  
Hide all popovers  
  
  

