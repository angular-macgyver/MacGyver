
mac-popover (attribute)
===
Mac popover trigger directive. Without using mac-popover-child-popover, the last  
popover will be closed automatically  
  
  
### Parameters
**mac-popover**  
Type: `String`  
ID of the popover to show  
  
**mac-popover-fixed**  
Type: `Boolean`  
Determine if the popover is fixed  
  
**mac-popover-child-popover**  
Type: `Boolean`  
If the popover is child of another popover (default false)  
  
**mac-popover-offset-x**  
Type: `Integer`  
Extra x offset (default 0)  
  
**mac-popover-offset-y**  
Type: `Integer`  
Extra y offset (default 0)  
  
**mac-popover-trigger**  
Type: `String`  
Trigger option, click | hover | manual (default click)  
- click: Popover only opens when user click on trigger  
- hover: Popover shows when user hover on trigger  
- focus: Popover shows when focus on input element  
  
**mac-popover-exclude**  
Type: `String`  
CSV of popover id that can't be shown at the same time  
  


mac-popover(element)
---

Element directive to define popover  
  
### Parameters
**id**  
Type: `String`  
Modal id  
  
**mac-popover-refresh-on**  
Type: `String`  
Event to update popover size and position  
  
**mac-popover-footer**  
Type: `Bool`  
Show footer or not  
  
**mac-popover-header**  
Type: `Bool`  
Show header or not  
  
**mac-popover-title**  
Type: `String`  
Popover title  
  
**direction**  
Type: `String`  
Popover direction (default "above left")  
- above, below or middle - Place the popover above, below or center align the trigger element  
- left or right  - Place tip on the left or right of the popover  
  

