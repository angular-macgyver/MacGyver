
Modal Service
===
There are multiple components used by modal.  
- A modal service is used to keep state of modal opened in the applications.  
- A modal element directive to define the modal dialog box  
- A modal attribute directive as a modal trigger  
  
### Parameters
**show**  
Type: `Function`  
Show a modal based on the modal id  
- {String} id The id of the modal to open  
- {Object} triggerOptions Additional options to open modal  
  
**resize**  
Type: `Function`  
Update the position and also the size of the modal  
- {Modal Object} modalObject The modal to reposition and resize (default opened modal)  
  
**hide**  
Type: `Function`  
Hide currently opened modal  
- {Function} callback Callback after modal has been hidden  
  
**register**  
Type: `Function`  
Registering modal with the service  
- {String} id ID of the modal  
- {DOM element} element The modal element  
- {Object} options Additional options for the modal  
  
**unregister**  
Type: `Function`  
Remove modal from modal service  
- {String} id ID of the modal to unregister  
  
**clearWaiting**  
Type: `Function`  
Remove certain modal id from waiting list  
- {String} id ID of the modal  
  


mac-modal (element)
---

Element directive to define the modal dialog. Modal content is transcluded into a  
modal template  
  
### Parameters
**keyboard**  
Type: `Boolean`  
Allow closing modal with keyboard (default false)  
  
**overlay-close**  
Type: `Boolean`  
Allow closing modal when clicking on overlay (default false)  
  
**resize**  
Type: `Boolean`  
Allow modal to resize on window resize event (default true)  
  
**open**  
Type: `Function`  
Callback when the modal is opened  
  
**topOffset**  
Type: `Integer`  
Top offset when the modal is larger than window height (default 20)  
  


mac-modal (attribute)
---

Modal attribute directive to trigger modal dialog  
  
### Parameters
**mac-modal**  
Type: `String`  
Modal ID to trigger  
  
**mac-modal-content**  
Type: `Object`  
Extra content/data to pass along  
  

