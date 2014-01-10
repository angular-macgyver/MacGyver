
Scroll Spy Service
===
There are multiple components used by scrollspy  
- Scrollspy service is used to keep track of all and active anchors  
- Multiple directives including:  
- mac-scroll-spy - Element to spy scroll event  
- mac-scroll-spy-anchor - Section in element spying on  
- mac-scroll-spy-target - Element to highlight, most likely a nav item  
  
Scrollspy defaults:  
offset - 0  
  
  
### Parameters
**register**  
Type: `Function`  
Register an anchor with the service  
- {String} id ID of the anchor  
- {DOM Element} element Element to spy on  
  
  
**unregister**  
Type: `Function`  
Remove anchor from service  
- {String} id ID of the anchor  
  
  
**setActive**  
Type: `Function`  
Set active anchor and fire all listeners  
- {Object} anchor Anchor object  
  
  
**addListener**  
Type: `Function`  
Add listener when active is set  
- {Function} fn Callback function  
  
  
**removeListener**  
Type: `Function`  
Remove listener  
- {Function} fn Callback function  
  

