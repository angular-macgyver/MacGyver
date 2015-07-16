/* jshint multistr: true */

angular.module('Mac').
constant('macTooltipDefaults', {
  direction: 'top',
  trigger: 'hover',
  inside: false,
  class: 'visible'
}).

constant('macTimeDefaults', {
  default: '12:00 AM',
  placeholder: '--:--'
}).

constant('scrollSpyDefaults', {
  offset: 0,
  highlightClass: 'active'
}).

constant('macPopoverDefaults', {
  element: {
    fixed: false,
    offsetY: 0,
    offsetX: 0,
    trigger: 'click'
  },
  trigger: {
    footer: false,
    header: false,
    title: '',
    direction: 'above left'
  },
  template: "<div class='mac-popover' ng-class='macPopoverClasses'>\
    <div class='tip'></div>\
    <div class='popover-header'>\
      <div class='title'>{{macPopoverTitle}}</div>\
    </div>\
    <div mac-popover-fill-content></div>\
  </div>"
});
