/* jshint multistr: true */

angular.module('Mac').
/**
 * @ngdoc constant
 * @name macTooltipDefaults
 * @description
 * Default values for mac-tooltip
 */
constant('macTooltipDefaults', {
  direction: 'top',
  trigger: 'hover',
  inside: false,
  class: 'visible'
}).

/**
 * @ngdoc constant
 * @name macTimeDefaults
 * @description
 * Default values for mac-time
 */
constant('macTimeDefaults', {
  default: '12:00 AM',
  placeholder: '--:--'
}).

/**
 * @ngdoc constant
 * @name scrollSpyDefaults
 * @description
 * Default values for mac-scroll-spy
 */
constant('scrollSpyDefaults', {
  offset: 0,
  highlightClass: 'active'
}).

/**
 * @ngdoc constant
 * @name macPopoverDefaults
 * @description
 * Default values for mac-popover
 */
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
    direction: 'above left',
    refreshOn: ''
  },
  template: "<div class='mac-popover' ng-class='macPopoverClasses'>\
    <div class='tip'></div>\
    <div class='popover-header'>\
      <div class='title'>{{macPopoverTitle}}</div>\
    </div>\
    <div mac-popover-fill-content></div>\
  </div>"
}).

/**
 * @ngdoc constant
 * @name macModalDefaults
 * @description
 * Default values for mac-modal
 */
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

/**
 * @ngdoc constant
 * @name macAffixDefaults
 * @description
 * Default values for mac-affix
 */
constant('macAffixDefaults', {
  top: 0,
  bottom: 0,
  disabled: false,
  classes: "affix affix-top affix-bottom"
});
