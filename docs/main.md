
angular.element
===
Angular comes with jqLite, a tiny, API-compatible subset of jQuery. However, its  
functionality is very limited and MacGyver extends jqLite to make sure MacGyver  
components work properly.  
  
Real jQuery will continue to take precedence over jqLite and all functions MacGyver extends.  
  
MacGyver adds the following methods:  
- [height()](http://api.jquery.com/height/) - Does not support set  
- [width()](http://api.jquery.com/width/) - Does not support set  
- [outerHeight()](http://api.jquery.com/outerHeight/) - Does not support set  
- [outerWidth()](http://api.jquery.com/outerWidth/) - Does not support set  
- [offset()](http://api.jquery.com/offset/)  
- [scrollTop()](http://api.jquery.com/scrollTop/)  
  
