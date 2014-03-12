
mac-modal (element)
===
Element directive to define the modal dialog. Modal content is transcluded into a  
modal template  
  
  
### Parameters
**mac-modal-keyboard**  
Type: `Boolean`  
Allow closing modal with keyboard (default false)  
  
**mac-modal-overlay-close**  
Type: `Boolean`  
Allow closing modal when clicking on overlay (default false)  
  
**mac-modal-resize**  
Type: `Boolean`  
Allow modal to resize on window resize event (default true)  
  
**mac-modal-topOffset**  
Type: `Integer`  
Top offset when the modal is larger than window height (default 20)  
  
**mac-modal-open**  
Type: `Expr`  
Callback when the modal is opened  
  
**mac-modal-before-show**  
Type: `Expr`  
Callback before showing the modal  
  
**mac-modal-after-show**  
Type: `Expr`  
Callback when modal is visible with CSS transitions completed  
  
**mac-modal-before-hide**  
Type: `Expr`  
Callback before hiding the modal  
  
**mac-modal-after-hide**  
Type: `Expr`  
Callback when modal is hidden from the user with CSS transitions completed  
  
**mac-modal-position**  
Type: `Boolean`  
Calculate size and position with JS (default true)  
  


mac-modal (attribute)
---

Modal attribute directive to trigger modal dialog  
  
### Parameters
**mac-modal**  
Type: `String`  
Modal ID to trigger  
  
**mac-modal-data**  
Type: `Expr`  
Extra data to pass along  
  

