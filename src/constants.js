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
  trigger: {
    offsetY: 0,
    offsetX: 0,
    trigger: 'click',
    container: null
  },
  element: {
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
}).

constant('macModalDefaults', {
  keyboard: false,
  overlayClose: false,
  resize: false,
  position: true,
  open: angular.noop,
  topOffset: 20,
  attributes: {},
  beforeShow: angular.noop,
  afterShow: angular.noop,
  beforeHide: angular.noop,
  afterHide: angular.noop,
  template: "<div class='mac-modal-overlay'>\
    <div class='mac-modal'>\
      <a mac-modal-close class='mac-close-modal'></a>\
      <div class='mac-modal-content-wrapper'></div>\
    </div>\
  </div>"
}).

constant('macAffixDefaults', {
  top: 0,
  bottom: 0,
  disabled: false,
  classes: "affix affix-top affix-bottom"
});
