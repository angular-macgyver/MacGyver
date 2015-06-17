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
});
