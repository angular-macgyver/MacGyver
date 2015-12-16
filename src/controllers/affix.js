/**
 * @name MacAffixController
 *
 * @description
 * Controller for affix directive
 */

function MacAffixController ($element, $document, $window, defaults) {
  this.$document = $document;
  this.defaults = defaults;

  this.$element = $element;

  this.offset = {
    top: defaults.top,
    bottom: defaults.bottom
  };

  this.windowEl = angular.element($window);

  this.disabled = defaults.disabled;

  this.lastAffix = null;
  this.unpin = null;
  this.pinnedOffset = null;
}

/**
 * @name updateOffset
 * @description
 * Update to or bottom offset. This function make sure the value is an integer
 * or use default values
 * @param {String} key Offset key
 * @param {String|Integer} value Update value
 * @param {Boolean} useDefault
 */
MacAffixController.prototype.updateOffset = function (key, value, useDefault) {
  // Don't do anything if changing invalid key
  if (key !== 'top' && key !== 'bottom') {
    return;
  }

  if (!!useDefault && value ===  null) {
    value = this.defaults[key];
  }

  if (value !== null && !isNaN(+value)) {
    this.offset[key] = +value;
  }
}

MacAffixController.prototype.scrollEvent = function () {
  // Check if element is visible
  if (this.$element[0].offsetHeight <= 0 && this.$element[0].offsetWidth <= 0) {
    return;
  }

  var position = this.$element.offset();
  var scrollTop = this.windowEl.scrollTop();
  var scrollHeight = this.$document.height();
  var elementHeight = this.$element.outerHeight();
  var affix;

  if (this.unpin !== null && scrollTop <= this.unpin) {
    affix = false;
  } else if (this.offset.bottom !==  null && scrollTop > scrollHeight - elementHeight - this.offset.bottom) {
    affix = 'bottom';
  } else if (this.offset.top !== null && scrollTop <= this.offset.top) {
    affix = 'top';
  } else {
    affix = false;
  }

  if (affix === this.lastAffix) return;
  if (this.unpin) {
    this.$element.css('top', '');
  }

  this.lastAffix = affix;

  if (affix === 'bottom') {
    if (this.pinnedOffset !== null) {
      this.unpin = this.pinnedOffset;
    }

    this.$element
      .removeClass(this.defaults.classes)
      .addClass('affix');
    this.pinnedOffset = this.$document.height() - this.$element.outerHeight() - this.offset.bottom;
    this.unpin = this.pinnedOffset;

  } else {
    this.unpin =  null;
  }

  this.$element
    .removeClass(this.defaults.classes)
    .addClass('affix' + (affix ? '-' + affix : ''));

  // Look into merging this with the move if block
  if (affix === 'bottom') {
    curOffset = this.$element.offset();
    this.$element.css('top', this.unpin - curOffset.top);
  }

  return true;
}

MacAffixController.prototype.setDisabled = function (newValue) {
  this.disabled = newValue || this.defaults.disabled;

  if (this.disabled) {
    this.reset();
  } else {
    this.scrollEvent();
  }

  return this.disabled;
}

MacAffixController.prototype.reset = function () {
  // clear all styles and reset affix element
  this.lastAffix = null;
  this.unpin = null;

  this.$element
    .css('top', '')
    .removeClass(this.defaults.classes);
}

angular.module('Mac')
.controller('MacAffixController', [
  '$element',
  '$document',
  '$window',
  'macAffixDefaults',
  MacAffixController
]);
