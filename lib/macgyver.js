/**
 * MacGyver v0.4.0
 * @link http://angular-macgyver.github.io/MacGyver
 * @license MIT
 */
(function(window, angular, undefined) {
var augmentWidthOrHeight, core_pnum, cssExpand, extendjQuery, getStyles, getWidthOrHeight, getWindow, isScope, isWindow, jqLiteExtend, modules, rnumnonpx;

modules = ["Mac.Util"];

try {
  angular.module("ngAnimate");
  modules.push("ngAnimate");
} catch (_error) {}

angular.module("Mac", modules);


/*
@chalk overview
@name angular.element

@description
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
 */

cssExpand = ["Top", "Right", "Bottom", "Left"];

core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;

rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i");

getStyles = function(element) {
  return window.getComputedStyle(element, null);
};

isWindow = function(obj) {
  return obj && obj.document && obj.location && obj.alert && obj.setInterval;
};

isScope = function(obj) {
  return obj && (obj.$evalAsync != null) && (obj.$watch != null);
};

getWindow = function(element) {
  if (isWindow(element)) {
    return element;
  } else {
    return element.nodeType === 9 && element.defaultView;
  }
};

augmentWidthOrHeight = function(element, name, extra, isBorderBox, styles) {
  var i, start, _i;
  if (extra === (isBorderBox ? "border" : "content")) {
    return 0;
  }
  start = name === "Width" ? 1 : 0;
  for (i = _i = start; _i <= 3; i = _i += 2) {
    if (extra === "margin") {
      val += parseFloat(styles["" + extra + cssExpand[i]]);
    }
    if (isBorderBox) {
      if (extra === "content") {
        val -= parseFloat(styles["padding" + cssExpand[i]]);
      }
      if (extra !== "margin") {
        val -= parseFloat(styles["border" + cssExpand[i]]);
      }
    } else {
      val += parseFloat(styles["padding" + cssExpand[i]]);
      if (extra !== "padding") {
        val += parseFloat(styles["border" + cssExpand + "Width"]);
      }
    }
  }
  return val;
};

getWidthOrHeight = function(type, prefix, element) {
  return function(margin) {
    var defaultExtra, doc, extra, isBorderBox, name, styles, value, valueIsBorderBox;
    defaultExtra = (function() {
      switch (prefix) {
        case "inner":
          return "padding";
        case "outer":
          return "";
        default:
          return "content";
      }
    })();
    extra = defaultExtra || (margin === true ? "margin" : "border");
    if (isWindow(element)) {
      return element.document.documentElement["client" + type];
    }
    if (element.nodeType === 9) {
      doc = element.documentElement;
      return Math.max(element.body["scroll" + type], doc["scroll" + type], element.body["offset" + type], doc["offset" + type], doc["client" + type]);
    }
    valueIsBorderBox = true;
    styles = getStyles(element);
    name = type.toLowerCase();
    value = type === "Height" ? element.offsetHeight : element.offsetWidth;
    isBorderBox = element.style.boxSizing === "border-box";
    if (value <= 0 || value === null) {
      value = styles[name];
      if (value < 0 || value === null) {
        value = element.style[name];
      }
      if (rnumnonpx.test(value)) {
        return value;
      }
      valueIsBorderBox = isBorderBox;
      value = parseFloat(value) || 0;
    }
    return value + augmentWidthOrHeight(element, type, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles);
  };
};

jqLiteExtend = {
  height: function(element) {
    return getWidthOrHeight("Height", "", element)();
  },
  width: function(element) {
    return getWidthOrHeight("Width", "", element)();
  },
  outerHeight: function(element, margin) {
    return getWidthOrHeight("Height", "outer", element)(margin);
  },
  outerWidth: function(element, margin) {
    return getWidthOrHeight("Width", "outer", element)(margin);
  },
  offset: function(element) {
    var box, doc, docElem, win;
    box = {
      top: 0,
      left: 0
    };
    doc = element && element.ownerDocument;
    if (!doc) {
      return;
    }
    docElem = doc.documentElement;
    if (element.getBoundingClientRect != null) {
      box = element.getBoundingClientRect();
    }
    win = getWindow(doc);
    return {
      top: box.top + win.pageYOffset - docElem.clientTop,
      left: box.left + win.pageXOffset - docElem.clientLeft
    };
  },
  scrollTop: function(element, value) {
    var win;
    win = getWindow(element);
    if (value == null) {
      if (win) {
        return win["pageYOffset"];
      } else {
        return element["scrollTop"];
      }
    }
    if (win) {
      return win.scrollTo(window.pageYOffset, value);
    } else {
      return element["scrollTop"] = value;
    }
  },
  scrollLeft: function(element, value) {
    var win;
    win = getWindow(element);
    if (value == null) {
      if (win) {
        return win["pageXOffset"];
      } else {
        return element["scrollLeft"];
      }
    }
    if (win) {
      return win.scrollTo(window.pageXOffset, value);
    } else {
      return element["scrollLeft"] = value;
    }
  }
};

extendjQuery = function() {
  var jqLite;
  if ((window.jQuery != null) && (angular.element.prototype.offset != null)) {
    return;
  }
  jqLite = angular.element;
  return angular.forEach(jqLiteExtend, function(fn, name) {
    return jqLite.prototype[name] = function(arg1, arg2) {
      if (this.length) {
        return fn(this[0], arg1, arg2);
      }
    };
  });
};

extendjQuery();

/*!
 * jQuery UI Core 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */
(function( $, undefined ) {

var uuid = 0,
	runiqueId = /^ui-id-\d+$/;

// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "1.10.4",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				this.each(function() {
					var elem = this;
					setTimeout(function() {
						$( elem ).focus();
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),

	scrollParent: function() {
		var scrollParent;
		if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.css(this,"position")) && (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		}

		return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	uniqueId: function() {
		return this.each(function() {
			if ( !this.id ) {
				this.id = "ui-id-" + (++uuid);
			}
		});
	},

	removeUniqueId: function() {
		return this.each(function() {
			if ( runiqueId.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}





// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.support.selectstart = "onselectstart" in document.createElement( "div" );
$.fn.extend({
	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.extend( $.ui, {
	// $.ui.plugin is deprecated. Use $.widget() extensions instead.
	plugin: {
		add: function( module, option, set ) {
			var i,
				proto = $.ui[ module ].prototype;
			for ( i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var i,
				set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
				return;
			}

			for ( i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},

	// only used by resizable
	hasScroll: function( el, a ) {

		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	}
});

})( jQuery );

/*!
 * jQuery UI Datepicker 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/datepicker/
 *
 * Depends:
 *	jquery.ui.core.js
 */
(function( $, undefined ) {

$.extend($.ui, { datepicker: { version: "1.10.4" } });

var PROP_NAME = "datepicker",
	instActive;

/* Date picker manager.
   Use the singleton instance of this class, $.datepicker, to interact with the date picker.
   Settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */

function Datepicker() {
	this._curInst = null; // The current instance in use
	this._keyEvent = false; // If the last event was a key event
	this._disabledInputs = []; // List of date picker inputs that have been disabled
	this._datepickerShowing = false; // True if the popup picker is showing , false if not
	this._inDialog = false; // True if showing within a "dialog", false if not
	this._mainDivId = "ui-datepicker-div"; // The ID of the main datepicker division
	this._inlineClass = "ui-datepicker-inline"; // The name of the inline marker class
	this._appendClass = "ui-datepicker-append"; // The name of the append marker class
	this._triggerClass = "ui-datepicker-trigger"; // The name of the trigger marker class
	this._dialogClass = "ui-datepicker-dialog"; // The name of the dialog marker class
	this._disableClass = "ui-datepicker-disabled"; // The name of the disabled covering marker class
	this._unselectableClass = "ui-datepicker-unselectable"; // The name of the unselectable cell marker class
	this._currentClass = "ui-datepicker-current-day"; // The name of the current day marker class
	this._dayOverClass = "ui-datepicker-days-cell-over"; // The name of the day hover marker class
	this.regional = []; // Available regional settings, indexed by language code
	this.regional[""] = { // Default regional settings
		closeText: "Done", // Display text for close link
		prevText: "Prev", // Display text for previous month link
		nextText: "Next", // Display text for next month link
		currentText: "Today", // Display text for current month link
		monthNames: ["January","February","March","April","May","June",
			"July","August","September","October","November","December"], // Names of months for drop-down and formatting
		monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // For formatting
		dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // For formatting
		dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // For formatting
		dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"], // Column headings for days starting at Sunday
		weekHeader: "Wk", // Column header for week of the year
		dateFormat: "mm/dd/yy", // See format options on parseDate
		firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
		isRTL: false, // True if right-to-left language, false if left-to-right
		showMonthAfterYear: false, // True if the year select precedes month, false for month then year
		yearSuffix: "" // Additional text to append to the year in the month headers
	};
	this._defaults = { // Global defaults for all the date picker instances
		showOn: "focus", // "focus" for popup on focus,
			// "button" for trigger button, or "both" for either
		showAnim: "fadeIn", // Name of jQuery animation for popup
		showOptions: {}, // Options for enhanced animations
		defaultDate: null, // Used when field is blank: actual date,
			// +/-number for offset from today, null for today
		appendText: "", // Display text following the input box, e.g. showing the format
		buttonText: "...", // Text for trigger button
		buttonImage: "", // URL for trigger button image
		buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
		hideIfNoPrevNext: false, // True to hide next/previous month links
			// if not applicable, false to just disable them
		navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
		gotoCurrent: false, // True if today link goes back to current selection instead
		changeMonth: false, // True if month can be selected directly, false if only prev/next
		changeYear: false, // True if year can be selected directly, false if only prev/next
		yearRange: "c-10:c+10", // Range of years to display in drop-down,
			// either relative to today's year (-nn:+nn), relative to currently displayed year
			// (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
		showOtherMonths: false, // True to show dates in other months, false to leave blank
		selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
		showWeek: false, // True to show week of the year, false to not show it
		calculateWeek: this.iso8601Week, // How to calculate the week of the year,
			// takes a Date and returns the number of the week for it
		shortYearCutoff: "+10", // Short year values < this are in the current century,
			// > this are in the previous century,
			// string value starting with "+" for current year + value
		minDate: null, // The earliest selectable date, or null for no limit
		maxDate: null, // The latest selectable date, or null for no limit
		duration: "fast", // Duration of display/closure
		beforeShowDay: null, // Function that takes a date and returns an array with
			// [0] = true if selectable, false if not, [1] = custom CSS class name(s) or "",
			// [2] = cell title (optional), e.g. $.datepicker.noWeekends
		beforeShow: null, // Function that takes an input field and
			// returns a set of custom settings for the date picker
		onSelect: null, // Define a callback function when a date is selected
		onChangeMonthYear: null, // Define a callback function when the month or year is changed
		onClose: null, // Define a callback function when the datepicker is closed
		numberOfMonths: 1, // Number of months to show at a time
		showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
		stepMonths: 1, // Number of months to step back/forward
		stepBigMonths: 12, // Number of months to step back/forward for the big links
		altField: "", // Selector for an alternate field to store selected dates into
		altFormat: "", // The date format to use for the alternate field
		constrainInput: true, // The input is constrained by the current date format
		showButtonPanel: false, // True to show button panel, false to not show it
		autoSize: false, // True to size the input for the date format, false to leave as is
		disabled: false // The initial disabled state
	};
	$.extend(this._defaults, this.regional[""]);
	this.dpDiv = bindHover($("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"));
}

$.extend(Datepicker.prototype, {
	/* Class name added to elements to indicate already configured with a date picker. */
	markerClassName: "hasDatepicker",

	//Keep track of the maximum number of rows displayed (see #7043)
	maxRows: 4,

	// TODO rename to "widget" when switching to widget factory
	_widgetDatepicker: function() {
		return this.dpDiv;
	},

	/* Override the default settings for all instances of the date picker.
	 * @param  settings  object - the new settings to use as defaults (anonymous object)
	 * @return the manager object
	 */
	setDefaults: function(settings) {
		extendRemove(this._defaults, settings || {});
		return this;
	},

	/* Attach the date picker to a jQuery selection.
	 * @param  target	element - the target input field or division or span
	 * @param  settings  object - the new settings to use for this date picker instance (anonymous)
	 */
	_attachDatepicker: function(target, settings) {
		var nodeName, inline, inst;
		nodeName = target.nodeName.toLowerCase();
		inline = (nodeName === "div" || nodeName === "span");
		if (!target.id) {
			this.uuid += 1;
			target.id = "dp" + this.uuid;
		}
		inst = this._newInst($(target), inline);
		inst.settings = $.extend({}, settings || {});
		if (nodeName === "input") {
			this._connectDatepicker(target, inst);
		} else if (inline) {
			this._inlineDatepicker(target, inst);
		}
	},

	/* Create a new instance object. */
	_newInst: function(target, inline) {
		var id = target[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"); // escape jQuery meta chars
		return {id: id, input: target, // associated target
			selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
			drawMonth: 0, drawYear: 0, // month being drawn
			inline: inline, // is datepicker inline or not
			dpDiv: (!inline ? this.dpDiv : // presentation div
			bindHover($("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")))};
	},

	/* Attach the date picker to an input field. */
	_connectDatepicker: function(target, inst) {
		var input = $(target);
		inst.append = $([]);
		inst.trigger = $([]);
		if (input.hasClass(this.markerClassName)) {
			return;
		}
		this._attachments(input, inst);
		input.addClass(this.markerClassName).keydown(this._doKeyDown).
			keypress(this._doKeyPress).keyup(this._doKeyUp);
		this._autoSize(inst);
		$.data(target, PROP_NAME, inst);
		//If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
		if( inst.settings.disabled ) {
			this._disableDatepicker( target );
		}
	},

	/* Make attachments based on settings. */
	_attachments: function(input, inst) {
		var showOn, buttonText, buttonImage,
			appendText = this._get(inst, "appendText"),
			isRTL = this._get(inst, "isRTL");

		if (inst.append) {
			inst.append.remove();
		}
		if (appendText) {
			inst.append = $("<span class='" + this._appendClass + "'>" + appendText + "</span>");
			input[isRTL ? "before" : "after"](inst.append);
		}

		input.unbind("focus", this._showDatepicker);

		if (inst.trigger) {
			inst.trigger.remove();
		}

		showOn = this._get(inst, "showOn");
		if (showOn === "focus" || showOn === "both") { // pop-up date picker when in the marked field
			input.focus(this._showDatepicker);
		}
		if (showOn === "button" || showOn === "both") { // pop-up date picker when button clicked
			buttonText = this._get(inst, "buttonText");
			buttonImage = this._get(inst, "buttonImage");
			inst.trigger = $(this._get(inst, "buttonImageOnly") ?
				$("<img/>").addClass(this._triggerClass).
					attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
				$("<button type='button'></button>").addClass(this._triggerClass).
					html(!buttonImage ? buttonText : $("<img/>").attr(
					{ src:buttonImage, alt:buttonText, title:buttonText })));
			input[isRTL ? "before" : "after"](inst.trigger);
			inst.trigger.click(function() {
				if ($.datepicker._datepickerShowing && $.datepicker._lastInput === input[0]) {
					$.datepicker._hideDatepicker();
				} else if ($.datepicker._datepickerShowing && $.datepicker._lastInput !== input[0]) {
					$.datepicker._hideDatepicker();
					$.datepicker._showDatepicker(input[0]);
				} else {
					$.datepicker._showDatepicker(input[0]);
				}
				return false;
			});
		}
	},

	/* Apply the maximum length for the date format. */
	_autoSize: function(inst) {
		if (this._get(inst, "autoSize") && !inst.inline) {
			var findMax, max, maxI, i,
				date = new Date(2009, 12 - 1, 20), // Ensure double digits
				dateFormat = this._get(inst, "dateFormat");

			if (dateFormat.match(/[DM]/)) {
				findMax = function(names) {
					max = 0;
					maxI = 0;
					for (i = 0; i < names.length; i++) {
						if (names[i].length > max) {
							max = names[i].length;
							maxI = i;
						}
					}
					return maxI;
				};
				date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
					"monthNames" : "monthNamesShort"))));
				date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
					"dayNames" : "dayNamesShort"))) + 20 - date.getDay());
			}
			inst.input.attr("size", this._formatDate(inst, date).length);
		}
	},

	/* Attach an inline date picker to a div. */
	_inlineDatepicker: function(target, inst) {
		var divSpan = $(target);
		if (divSpan.hasClass(this.markerClassName)) {
			return;
		}
		divSpan.addClass(this.markerClassName).append(inst.dpDiv);
		$.data(target, PROP_NAME, inst);
		this._setDate(inst, this._getDefaultDate(inst), true);
		this._updateDatepicker(inst);
		this._updateAlternate(inst);
		//If disabled option is true, disable the datepicker before showing it (see ticket #5665)
		if( inst.settings.disabled ) {
			this._disableDatepicker( target );
		}
		// Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
		// http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
		inst.dpDiv.css( "display", "block" );
	},

	/* Pop-up the date picker in a "dialog" box.
	 * @param  input element - ignored
	 * @param  date	string or Date - the initial date to display
	 * @param  onSelect  function - the function to call when a date is selected
	 * @param  settings  object - update the dialog date picker instance's settings (anonymous object)
	 * @param  pos int[2] - coordinates for the dialog's position within the screen or
	 *					event - with x/y coordinates or
	 *					leave empty for default (screen centre)
	 * @return the manager object
	 */
	_dialogDatepicker: function(input, date, onSelect, settings, pos) {
		var id, browserWidth, browserHeight, scrollX, scrollY,
			inst = this._dialogInst; // internal instance

		if (!inst) {
			this.uuid += 1;
			id = "dp" + this.uuid;
			this._dialogInput = $("<input type='text' id='" + id +
				"' style='position: absolute; top: -100px; width: 0px;'/>");
			this._dialogInput.keydown(this._doKeyDown);
			$("body").append(this._dialogInput);
			inst = this._dialogInst = this._newInst(this._dialogInput, false);
			inst.settings = {};
			$.data(this._dialogInput[0], PROP_NAME, inst);
		}
		extendRemove(inst.settings, settings || {});
		date = (date && date.constructor === Date ? this._formatDate(inst, date) : date);
		this._dialogInput.val(date);

		this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
		if (!this._pos) {
			browserWidth = document.documentElement.clientWidth;
			browserHeight = document.documentElement.clientHeight;
			scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
			scrollY = document.documentElement.scrollTop || document.body.scrollTop;
			this._pos = // should use actual width/height below
				[(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
		}

		// move input on screen for focus, but hidden behind dialog
		this._dialogInput.css("left", (this._pos[0] + 20) + "px").css("top", this._pos[1] + "px");
		inst.settings.onSelect = onSelect;
		this._inDialog = true;
		this.dpDiv.addClass(this._dialogClass);
		this._showDatepicker(this._dialogInput[0]);
		if ($.blockUI) {
			$.blockUI(this.dpDiv);
		}
		$.data(this._dialogInput[0], PROP_NAME, inst);
		return this;
	},

	/* Detach a datepicker from its control.
	 * @param  target	element - the target input field or division or span
	 */
	_destroyDatepicker: function(target) {
		var nodeName,
			$target = $(target),
			inst = $.data(target, PROP_NAME);

		if (!$target.hasClass(this.markerClassName)) {
			return;
		}

		nodeName = target.nodeName.toLowerCase();
		$.removeData(target, PROP_NAME);
		if (nodeName === "input") {
			inst.append.remove();
			inst.trigger.remove();
			$target.removeClass(this.markerClassName).
				unbind("focus", this._showDatepicker).
				unbind("keydown", this._doKeyDown).
				unbind("keypress", this._doKeyPress).
				unbind("keyup", this._doKeyUp);
		} else if (nodeName === "div" || nodeName === "span") {
			$target.removeClass(this.markerClassName).empty();
		}
	},

	/* Enable the date picker to a jQuery selection.
	 * @param  target	element - the target input field or division or span
	 */
	_enableDatepicker: function(target) {
		var nodeName, inline,
			$target = $(target),
			inst = $.data(target, PROP_NAME);

		if (!$target.hasClass(this.markerClassName)) {
			return;
		}

		nodeName = target.nodeName.toLowerCase();
		if (nodeName === "input") {
			target.disabled = false;
			inst.trigger.filter("button").
				each(function() { this.disabled = false; }).end().
				filter("img").css({opacity: "1.0", cursor: ""});
		} else if (nodeName === "div" || nodeName === "span") {
			inline = $target.children("." + this._inlineClass);
			inline.children().removeClass("ui-state-disabled");
			inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
				prop("disabled", false);
		}
		this._disabledInputs = $.map(this._disabledInputs,
			function(value) { return (value === target ? null : value); }); // delete entry
	},

	/* Disable the date picker to a jQuery selection.
	 * @param  target	element - the target input field or division or span
	 */
	_disableDatepicker: function(target) {
		var nodeName, inline,
			$target = $(target),
			inst = $.data(target, PROP_NAME);

		if (!$target.hasClass(this.markerClassName)) {
			return;
		}

		nodeName = target.nodeName.toLowerCase();
		if (nodeName === "input") {
			target.disabled = true;
			inst.trigger.filter("button").
				each(function() { this.disabled = true; }).end().
				filter("img").css({opacity: "0.5", cursor: "default"});
		} else if (nodeName === "div" || nodeName === "span") {
			inline = $target.children("." + this._inlineClass);
			inline.children().addClass("ui-state-disabled");
			inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
				prop("disabled", true);
		}
		this._disabledInputs = $.map(this._disabledInputs,
			function(value) { return (value === target ? null : value); }); // delete entry
		this._disabledInputs[this._disabledInputs.length] = target;
	},

	/* Is the first field in a jQuery collection disabled as a datepicker?
	 * @param  target	element - the target input field or division or span
	 * @return boolean - true if disabled, false if enabled
	 */
	_isDisabledDatepicker: function(target) {
		if (!target) {
			return false;
		}
		for (var i = 0; i < this._disabledInputs.length; i++) {
			if (this._disabledInputs[i] === target) {
				return true;
			}
		}
		return false;
	},

	/* Retrieve the instance data for the target control.
	 * @param  target  element - the target input field or division or span
	 * @return  object - the associated instance data
	 * @throws  error if a jQuery problem getting data
	 */
	_getInst: function(target) {
		try {
			return $.data(target, PROP_NAME);
		}
		catch (err) {
			throw "Missing instance data for this datepicker";
		}
	},

	/* Update or retrieve the settings for a date picker attached to an input field or division.
	 * @param  target  element - the target input field or division or span
	 * @param  name	object - the new settings to update or
	 *				string - the name of the setting to change or retrieve,
	 *				when retrieving also "all" for all instance settings or
	 *				"defaults" for all global defaults
	 * @param  value   any - the new value for the setting
	 *				(omit if above is an object or to retrieve a value)
	 */
	_optionDatepicker: function(target, name, value) {
		var settings, date, minDate, maxDate,
			inst = this._getInst(target);

		if (arguments.length === 2 && typeof name === "string") {
			return (name === "defaults" ? $.extend({}, $.datepicker._defaults) :
				(inst ? (name === "all" ? $.extend({}, inst.settings) :
				this._get(inst, name)) : null));
		}

		settings = name || {};
		if (typeof name === "string") {
			settings = {};
			settings[name] = value;
		}

		if (inst) {
			if (this._curInst === inst) {
				this._hideDatepicker();
			}

			date = this._getDateDatepicker(target, true);
			minDate = this._getMinMaxDate(inst, "min");
			maxDate = this._getMinMaxDate(inst, "max");
			extendRemove(inst.settings, settings);
			// reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
			if (minDate !== null && settings.dateFormat !== undefined && settings.minDate === undefined) {
				inst.settings.minDate = this._formatDate(inst, minDate);
			}
			if (maxDate !== null && settings.dateFormat !== undefined && settings.maxDate === undefined) {
				inst.settings.maxDate = this._formatDate(inst, maxDate);
			}
			if ( "disabled" in settings ) {
				if ( settings.disabled ) {
					this._disableDatepicker(target);
				} else {
					this._enableDatepicker(target);
				}
			}
			this._attachments($(target), inst);
			this._autoSize(inst);
			this._setDate(inst, date);
			this._updateAlternate(inst);
			this._updateDatepicker(inst);
		}
	},

	// change method deprecated
	_changeDatepicker: function(target, name, value) {
		this._optionDatepicker(target, name, value);
	},

	/* Redraw the date picker attached to an input field or division.
	 * @param  target  element - the target input field or division or span
	 */
	_refreshDatepicker: function(target) {
		var inst = this._getInst(target);
		if (inst) {
			this._updateDatepicker(inst);
		}
	},

	/* Set the dates for a jQuery selection.
	 * @param  target element - the target input field or division or span
	 * @param  date	Date - the new date
	 */
	_setDateDatepicker: function(target, date) {
		var inst = this._getInst(target);
		if (inst) {
			this._setDate(inst, date);
			this._updateDatepicker(inst);
			this._updateAlternate(inst);
		}
	},

	/* Get the date(s) for the first entry in a jQuery selection.
	 * @param  target element - the target input field or division or span
	 * @param  noDefault boolean - true if no default date is to be used
	 * @return Date - the current date
	 */
	_getDateDatepicker: function(target, noDefault) {
		var inst = this._getInst(target);
		if (inst && !inst.inline) {
			this._setDateFromField(inst, noDefault);
		}
		return (inst ? this._getDate(inst) : null);
	},

	/* Handle keystrokes. */
	_doKeyDown: function(event) {
		var onSelect, dateStr, sel,
			inst = $.datepicker._getInst(event.target),
			handled = true,
			isRTL = inst.dpDiv.is(".ui-datepicker-rtl");

		inst._keyEvent = true;
		if ($.datepicker._datepickerShowing) {
			switch (event.keyCode) {
				case 9: $.datepicker._hideDatepicker();
						handled = false;
						break; // hide on tab out
				case 13: sel = $("td." + $.datepicker._dayOverClass + ":not(." +
									$.datepicker._currentClass + ")", inst.dpDiv);
						if (sel[0]) {
							$.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
						}

						onSelect = $.datepicker._get(inst, "onSelect");
						if (onSelect) {
							dateStr = $.datepicker._formatDate(inst);

							// trigger custom callback
							onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
						} else {
							$.datepicker._hideDatepicker();
						}

						return false; // don't submit the form
				case 27: $.datepicker._hideDatepicker();
						break; // hide on escape
				case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							-$.datepicker._get(inst, "stepBigMonths") :
							-$.datepicker._get(inst, "stepMonths")), "M");
						break; // previous month/year on page up/+ ctrl
				case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
							+$.datepicker._get(inst, "stepBigMonths") :
							+$.datepicker._get(inst, "stepMonths")), "M");
						break; // next month/year on page down/+ ctrl
				case 35: if (event.ctrlKey || event.metaKey) {
							$.datepicker._clearDate(event.target);
						}
						handled = event.ctrlKey || event.metaKey;
						break; // clear on ctrl or command +end
				case 36: if (event.ctrlKey || event.metaKey) {
							$.datepicker._gotoToday(event.target);
						}
						handled = event.ctrlKey || event.metaKey;
						break; // current on ctrl or command +home
				case 37: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), "D");
						}
						handled = event.ctrlKey || event.metaKey;
						// -1 day on ctrl or command +left
						if (event.originalEvent.altKey) {
							$.datepicker._adjustDate(event.target, (event.ctrlKey ?
								-$.datepicker._get(inst, "stepBigMonths") :
								-$.datepicker._get(inst, "stepMonths")), "M");
						}
						// next month/year on alt +left on Mac
						break;
				case 38: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, -7, "D");
						}
						handled = event.ctrlKey || event.metaKey;
						break; // -1 week on ctrl or command +up
				case 39: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), "D");
						}
						handled = event.ctrlKey || event.metaKey;
						// +1 day on ctrl or command +right
						if (event.originalEvent.altKey) {
							$.datepicker._adjustDate(event.target, (event.ctrlKey ?
								+$.datepicker._get(inst, "stepBigMonths") :
								+$.datepicker._get(inst, "stepMonths")), "M");
						}
						// next month/year on alt +right
						break;
				case 40: if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, +7, "D");
						}
						handled = event.ctrlKey || event.metaKey;
						break; // +1 week on ctrl or command +down
				default: handled = false;
			}
		} else if (event.keyCode === 36 && event.ctrlKey) { // display the date picker on ctrl+home
			$.datepicker._showDatepicker(this);
		} else {
			handled = false;
		}

		if (handled) {
			event.preventDefault();
			event.stopPropagation();
		}
	},

	/* Filter entered characters - based on date format. */
	_doKeyPress: function(event) {
		var chars, chr,
			inst = $.datepicker._getInst(event.target);

		if ($.datepicker._get(inst, "constrainInput")) {
			chars = $.datepicker._possibleChars($.datepicker._get(inst, "dateFormat"));
			chr = String.fromCharCode(event.charCode == null ? event.keyCode : event.charCode);
			return event.ctrlKey || event.metaKey || (chr < " " || !chars || chars.indexOf(chr) > -1);
		}
	},

	/* Synchronise manual entry and field/alternate field. */
	_doKeyUp: function(event) {
		var date,
			inst = $.datepicker._getInst(event.target);

		if (inst.input.val() !== inst.lastVal) {
			try {
				date = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
					(inst.input ? inst.input.val() : null),
					$.datepicker._getFormatConfig(inst));

				if (date) { // only if valid
					$.datepicker._setDateFromField(inst);
					$.datepicker._updateAlternate(inst);
					$.datepicker._updateDatepicker(inst);
				}
			}
			catch (err) {
			}
		}
		return true;
	},

	/* Pop-up the date picker for a given input field.
	 * If false returned from beforeShow event handler do not show.
	 * @param  input  element - the input field attached to the date picker or
	 *					event - if triggered by focus
	 */
	_showDatepicker: function(input) {
		input = input.target || input;
		if (input.nodeName.toLowerCase() !== "input") { // find from button/image trigger
			input = $("input", input.parentNode)[0];
		}

		if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput === input) { // already here
			return;
		}

		var inst, beforeShow, beforeShowSettings, isFixed,
			offset, showAnim, duration;

		inst = $.datepicker._getInst(input);
		if ($.datepicker._curInst && $.datepicker._curInst !== inst) {
			$.datepicker._curInst.dpDiv.stop(true, true);
			if ( inst && $.datepicker._datepickerShowing ) {
				$.datepicker._hideDatepicker( $.datepicker._curInst.input[0] );
			}
		}

		beforeShow = $.datepicker._get(inst, "beforeShow");
		beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
		if(beforeShowSettings === false){
			return;
		}
		extendRemove(inst.settings, beforeShowSettings);

		inst.lastVal = null;
		$.datepicker._lastInput = input;
		$.datepicker._setDateFromField(inst);

		if ($.datepicker._inDialog) { // hide cursor
			input.value = "";
		}
		if (!$.datepicker._pos) { // position below input
			$.datepicker._pos = $.datepicker._findPos(input);
			$.datepicker._pos[1] += input.offsetHeight; // add the height
		}

		isFixed = false;
		$(input).parents().each(function() {
			isFixed |= $(this).css("position") === "fixed";
			return !isFixed;
		});

		offset = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
		$.datepicker._pos = null;
		//to avoid flashes on Firefox
		inst.dpDiv.empty();
		// determine sizing offscreen
		inst.dpDiv.css({position: "absolute", display: "block", top: "-1000px"});
		$.datepicker._updateDatepicker(inst);
		// fix width for dynamic number of date pickers
		// and adjust position before showing
		offset = $.datepicker._checkOffset(inst, offset, isFixed);
		inst.dpDiv.css({position: ($.datepicker._inDialog && $.blockUI ?
			"static" : (isFixed ? "fixed" : "absolute")), display: "none",
			left: offset.left + "px", top: offset.top + "px"});

		if (!inst.inline) {
			showAnim = $.datepicker._get(inst, "showAnim");
			duration = $.datepicker._get(inst, "duration");
			inst.dpDiv.zIndex($(input).zIndex()+1);
			$.datepicker._datepickerShowing = true;

			if ( $.effects && $.effects.effect[ showAnim ] ) {
				inst.dpDiv.show(showAnim, $.datepicker._get(inst, "showOptions"), duration);
			} else {
				inst.dpDiv[showAnim || "show"](showAnim ? duration : null);
			}

			if ( $.datepicker._shouldFocusInput( inst ) ) {
				inst.input.focus();
			}

			$.datepicker._curInst = inst;
		}
	},

	/* Generate the date picker content. */
	_updateDatepicker: function(inst) {
		this.maxRows = 4; //Reset the max number of rows being displayed (see #7043)
		instActive = inst; // for delegate hover events
		inst.dpDiv.empty().append(this._generateHTML(inst));
		this._attachHandlers(inst);
		inst.dpDiv.find("." + this._dayOverClass + " a").mouseover();

		var origyearshtml,
			numMonths = this._getNumberOfMonths(inst),
			cols = numMonths[1],
			width = 17;

		inst.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
		if (cols > 1) {
			inst.dpDiv.addClass("ui-datepicker-multi-" + cols).css("width", (width * cols) + "em");
		}
		inst.dpDiv[(numMonths[0] !== 1 || numMonths[1] !== 1 ? "add" : "remove") +
			"Class"]("ui-datepicker-multi");
		inst.dpDiv[(this._get(inst, "isRTL") ? "add" : "remove") +
			"Class"]("ui-datepicker-rtl");

		if (inst === $.datepicker._curInst && $.datepicker._datepickerShowing && $.datepicker._shouldFocusInput( inst ) ) {
			inst.input.focus();
		}

		// deffered render of the years select (to avoid flashes on Firefox)
		if( inst.yearshtml ){
			origyearshtml = inst.yearshtml;
			setTimeout(function(){
				//assure that inst.yearshtml didn't change.
				if( origyearshtml === inst.yearshtml && inst.yearshtml ){
					inst.dpDiv.find("select.ui-datepicker-year:first").replaceWith(inst.yearshtml);
				}
				origyearshtml = inst.yearshtml = null;
			}, 0);
		}
	},

	// #6694 - don't focus the input if it's already focused
	// this breaks the change event in IE
	// Support: IE and jQuery <1.9
	_shouldFocusInput: function( inst ) {
		return inst.input && inst.input.is( ":visible" ) && !inst.input.is( ":disabled" ) && !inst.input.is( ":focus" );
	},

	/* Check positioning to remain on screen. */
	_checkOffset: function(inst, offset, isFixed) {
		var dpWidth = inst.dpDiv.outerWidth(),
			dpHeight = inst.dpDiv.outerHeight(),
			inputWidth = inst.input ? inst.input.outerWidth() : 0,
			inputHeight = inst.input ? inst.input.outerHeight() : 0,
			viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft()),
			viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());

		offset.left -= (this._get(inst, "isRTL") ? (dpWidth - inputWidth) : 0);
		offset.left -= (isFixed && offset.left === inst.input.offset().left) ? $(document).scrollLeft() : 0;
		offset.top -= (isFixed && offset.top === (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

		// now check if datepicker is showing outside window viewport - move to a better place if so.
		offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
			Math.abs(offset.left + dpWidth - viewWidth) : 0);
		offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
			Math.abs(dpHeight + inputHeight) : 0);

		return offset;
	},

	/* Find an object's position on the screen. */
	_findPos: function(obj) {
		var position,
			inst = this._getInst(obj),
			isRTL = this._get(inst, "isRTL");

		while (obj && (obj.type === "hidden" || obj.nodeType !== 1 || $.expr.filters.hidden(obj))) {
			obj = obj[isRTL ? "previousSibling" : "nextSibling"];
		}

		position = $(obj).offset();
		return [position.left, position.top];
	},

	/* Hide the date picker from view.
	 * @param  input  element - the input field attached to the date picker
	 */
	_hideDatepicker: function(input) {
		var showAnim, duration, postProcess, onClose,
			inst = this._curInst;

		if (!inst || (input && inst !== $.data(input, PROP_NAME))) {
			return;
		}

		if (this._datepickerShowing) {
			showAnim = this._get(inst, "showAnim");
			duration = this._get(inst, "duration");
			postProcess = function() {
				$.datepicker._tidyDialog(inst);
			};

			// DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
			if ( $.effects && ( $.effects.effect[ showAnim ] || $.effects[ showAnim ] ) ) {
				inst.dpDiv.hide(showAnim, $.datepicker._get(inst, "showOptions"), duration, postProcess);
			} else {
				inst.dpDiv[(showAnim === "slideDown" ? "slideUp" :
					(showAnim === "fadeIn" ? "fadeOut" : "hide"))]((showAnim ? duration : null), postProcess);
			}

			if (!showAnim) {
				postProcess();
			}
			this._datepickerShowing = false;

			onClose = this._get(inst, "onClose");
			if (onClose) {
				onClose.apply((inst.input ? inst.input[0] : null), [(inst.input ? inst.input.val() : ""), inst]);
			}

			this._lastInput = null;
			if (this._inDialog) {
				this._dialogInput.css({ position: "absolute", left: "0", top: "-100px" });
				if ($.blockUI) {
					$.unblockUI();
					$("body").append(this.dpDiv);
				}
			}
			this._inDialog = false;
		}
	},

	/* Tidy up after a dialog display. */
	_tidyDialog: function(inst) {
		inst.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar");
	},

	/* Close date picker if clicked elsewhere. */
	_checkExternalClick: function(event) {
		if (!$.datepicker._curInst) {
			return;
		}

		var $target = $(event.target),
			inst = $.datepicker._getInst($target[0]);

		if ( ( ( $target[0].id !== $.datepicker._mainDivId &&
				$target.parents("#" + $.datepicker._mainDivId).length === 0 &&
				!$target.hasClass($.datepicker.markerClassName) &&
				!$target.closest("." + $.datepicker._triggerClass).length &&
				$.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI) ) ) ||
			( $target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst !== inst ) ) {
				$.datepicker._hideDatepicker();
		}
	},

	/* Adjust one of the date sub-fields. */
	_adjustDate: function(id, offset, period) {
		var target = $(id),
			inst = this._getInst(target[0]);

		if (this._isDisabledDatepicker(target[0])) {
			return;
		}
		this._adjustInstDate(inst, offset +
			(period === "M" ? this._get(inst, "showCurrentAtPos") : 0), // undo positioning
			period);
		this._updateDatepicker(inst);
	},

	/* Action for current link. */
	_gotoToday: function(id) {
		var date,
			target = $(id),
			inst = this._getInst(target[0]);

		if (this._get(inst, "gotoCurrent") && inst.currentDay) {
			inst.selectedDay = inst.currentDay;
			inst.drawMonth = inst.selectedMonth = inst.currentMonth;
			inst.drawYear = inst.selectedYear = inst.currentYear;
		} else {
			date = new Date();
			inst.selectedDay = date.getDate();
			inst.drawMonth = inst.selectedMonth = date.getMonth();
			inst.drawYear = inst.selectedYear = date.getFullYear();
		}
		this._notifyChange(inst);
		this._adjustDate(target);
	},

	/* Action for selecting a new month/year. */
	_selectMonthYear: function(id, select, period) {
		var target = $(id),
			inst = this._getInst(target[0]);

		inst["selected" + (period === "M" ? "Month" : "Year")] =
		inst["draw" + (period === "M" ? "Month" : "Year")] =
			parseInt(select.options[select.selectedIndex].value,10);

		this._notifyChange(inst);
		this._adjustDate(target);
	},

	/* Action for selecting a day. */
	_selectDay: function(id, month, year, td) {
		var inst,
			target = $(id);

		if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
			return;
		}

		inst = this._getInst(target[0]);
		inst.selectedDay = inst.currentDay = $("a", td).html();
		inst.selectedMonth = inst.currentMonth = month;
		inst.selectedYear = inst.currentYear = year;
		this._selectDate(id, this._formatDate(inst,
			inst.currentDay, inst.currentMonth, inst.currentYear));
	},

	/* Erase the input field and hide the date picker. */
	_clearDate: function(id) {
		var target = $(id);
		this._selectDate(target, "");
	},

	/* Update the input field with the selected date. */
	_selectDate: function(id, dateStr) {
		var onSelect,
			target = $(id),
			inst = this._getInst(target[0]);

		dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
		if (inst.input) {
			inst.input.val(dateStr);
		}
		this._updateAlternate(inst);

		onSelect = this._get(inst, "onSelect");
		if (onSelect) {
			onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
		} else if (inst.input) {
			inst.input.trigger("change"); // fire the change event
		}

		if (inst.inline){
			this._updateDatepicker(inst);
		} else {
			this._hideDatepicker();
			this._lastInput = inst.input[0];
			if (typeof(inst.input[0]) !== "object") {
				inst.input.focus(); // restore focus
			}
			this._lastInput = null;
		}
	},

	/* Update any alternate field to synchronise with the main field. */
	_updateAlternate: function(inst) {
		var altFormat, date, dateStr,
			altField = this._get(inst, "altField");

		if (altField) { // update alternate field too
			altFormat = this._get(inst, "altFormat") || this._get(inst, "dateFormat");
			date = this._getDate(inst);
			dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
			$(altField).each(function() { $(this).val(dateStr); });
		}
	},

	/* Set as beforeShowDay function to prevent selection of weekends.
	 * @param  date  Date - the date to customise
	 * @return [boolean, string] - is this date selectable?, what is its CSS class?
	 */
	noWeekends: function(date) {
		var day = date.getDay();
		return [(day > 0 && day < 6), ""];
	},

	/* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
	 * @param  date  Date - the date to get the week for
	 * @return  number - the number of the week within the year that contains this date
	 */
	iso8601Week: function(date) {
		var time,
			checkDate = new Date(date.getTime());

		// Find Thursday of this week starting on Monday
		checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

		time = checkDate.getTime();
		checkDate.setMonth(0); // Compare with Jan 1
		checkDate.setDate(1);
		return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
	},

	/* Parse a string value into a date object.
	 * See formatDate below for the possible formats.
	 *
	 * @param  format string - the expected format of the date
	 * @param  value string - the date in the above format
	 * @param  settings Object - attributes include:
	 *					shortYearCutoff  number - the cutoff year for determining the century (optional)
	 *					dayNamesShort	string[7] - abbreviated names of the days from Sunday (optional)
	 *					dayNames		string[7] - names of the days from Sunday (optional)
	 *					monthNamesShort string[12] - abbreviated names of the months (optional)
	 *					monthNames		string[12] - names of the months (optional)
	 * @return  Date - the extracted date value or null if value is blank
	 */
	parseDate: function (format, value, settings) {
		if (format == null || value == null) {
			throw "Invalid arguments";
		}

		value = (typeof value === "object" ? value.toString() : value + "");
		if (value === "") {
			return null;
		}

		var iFormat, dim, extra,
			iValue = 0,
			shortYearCutoffTemp = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff,
			shortYearCutoff = (typeof shortYearCutoffTemp !== "string" ? shortYearCutoffTemp :
				new Date().getFullYear() % 100 + parseInt(shortYearCutoffTemp, 10)),
			dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
			dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
			monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
			monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
			year = -1,
			month = -1,
			day = -1,
			doy = -1,
			literal = false,
			date,
			// Check whether a format character is doubled
			lookAhead = function(match) {
				var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
				if (matches) {
					iFormat++;
				}
				return matches;
			},
			// Extract a number from the string value
			getNumber = function(match) {
				var isDoubled = lookAhead(match),
					size = (match === "@" ? 14 : (match === "!" ? 20 :
					(match === "y" && isDoubled ? 4 : (match === "o" ? 3 : 2)))),
					digits = new RegExp("^\\d{1," + size + "}"),
					num = value.substring(iValue).match(digits);
				if (!num) {
					throw "Missing number at position " + iValue;
				}
				iValue += num[0].length;
				return parseInt(num[0], 10);
			},
			// Extract a name from the string value and convert to an index
			getName = function(match, shortNames, longNames) {
				var index = -1,
					names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
						return [ [k, v] ];
					}).sort(function (a, b) {
						return -(a[1].length - b[1].length);
					});

				$.each(names, function (i, pair) {
					var name = pair[1];
					if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
						index = pair[0];
						iValue += name.length;
						return false;
					}
				});
				if (index !== -1) {
					return index + 1;
				} else {
					throw "Unknown name at position " + iValue;
				}
			},
			// Confirm that a literal character matches the string value
			checkLiteral = function() {
				if (value.charAt(iValue) !== format.charAt(iFormat)) {
					throw "Unexpected literal at position " + iValue;
				}
				iValue++;
			};

		for (iFormat = 0; iFormat < format.length; iFormat++) {
			if (literal) {
				if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
					literal = false;
				} else {
					checkLiteral();
				}
			} else {
				switch (format.charAt(iFormat)) {
					case "d":
						day = getNumber("d");
						break;
					case "D":
						getName("D", dayNamesShort, dayNames);
						break;
					case "o":
						doy = getNumber("o");
						break;
					case "m":
						month = getNumber("m");
						break;
					case "M":
						month = getName("M", monthNamesShort, monthNames);
						break;
					case "y":
						year = getNumber("y");
						break;
					case "@":
						date = new Date(getNumber("@"));
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case "!":
						date = new Date((getNumber("!") - this._ticksTo1970) / 10000);
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case "'":
						if (lookAhead("'")){
							checkLiteral();
						} else {
							literal = true;
						}
						break;
					default:
						checkLiteral();
				}
			}
		}

		if (iValue < value.length){
			extra = value.substr(iValue);
			if (!/^\s+/.test(extra)) {
				throw "Extra/unparsed characters found in date: " + extra;
			}
		}

		if (year === -1) {
			year = new Date().getFullYear();
		} else if (year < 100) {
			year += new Date().getFullYear() - new Date().getFullYear() % 100 +
				(year <= shortYearCutoff ? 0 : -100);
		}

		if (doy > -1) {
			month = 1;
			day = doy;
			do {
				dim = this._getDaysInMonth(year, month - 1);
				if (day <= dim) {
					break;
				}
				month++;
				day -= dim;
			} while (true);
		}

		date = this._daylightSavingAdjust(new Date(year, month - 1, day));
		if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
			throw "Invalid date"; // E.g. 31/02/00
		}
		return date;
	},

	/* Standard date formats. */
	ATOM: "yy-mm-dd", // RFC 3339 (ISO 8601)
	COOKIE: "D, dd M yy",
	ISO_8601: "yy-mm-dd",
	RFC_822: "D, d M y",
	RFC_850: "DD, dd-M-y",
	RFC_1036: "D, d M y",
	RFC_1123: "D, d M yy",
	RFC_2822: "D, d M yy",
	RSS: "D, d M y", // RFC 822
	TICKS: "!",
	TIMESTAMP: "@",
	W3C: "yy-mm-dd", // ISO 8601

	_ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
		Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),

	/* Format a date object into a string value.
	 * The format can be combinations of the following:
	 * d  - day of month (no leading zero)
	 * dd - day of month (two digit)
	 * o  - day of year (no leading zeros)
	 * oo - day of year (three digit)
	 * D  - day name short
	 * DD - day name long
	 * m  - month of year (no leading zero)
	 * mm - month of year (two digit)
	 * M  - month name short
	 * MM - month name long
	 * y  - year (two digit)
	 * yy - year (four digit)
	 * @ - Unix timestamp (ms since 01/01/1970)
	 * ! - Windows ticks (100ns since 01/01/0001)
	 * "..." - literal text
	 * '' - single quote
	 *
	 * @param  format string - the desired format of the date
	 * @param  date Date - the date value to format
	 * @param  settings Object - attributes include:
	 *					dayNamesShort	string[7] - abbreviated names of the days from Sunday (optional)
	 *					dayNames		string[7] - names of the days from Sunday (optional)
	 *					monthNamesShort string[12] - abbreviated names of the months (optional)
	 *					monthNames		string[12] - names of the months (optional)
	 * @return  string - the date in the above format
	 */
	formatDate: function (format, date, settings) {
		if (!date) {
			return "";
		}

		var iFormat,
			dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
			dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
			monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
			monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
			// Check whether a format character is doubled
			lookAhead = function(match) {
				var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
				if (matches) {
					iFormat++;
				}
				return matches;
			},
			// Format a number, with leading zero if necessary
			formatNumber = function(match, value, len) {
				var num = "" + value;
				if (lookAhead(match)) {
					while (num.length < len) {
						num = "0" + num;
					}
				}
				return num;
			},
			// Format a name, short or long as requested
			formatName = function(match, value, shortNames, longNames) {
				return (lookAhead(match) ? longNames[value] : shortNames[value]);
			},
			output = "",
			literal = false;

		if (date) {
			for (iFormat = 0; iFormat < format.length; iFormat++) {
				if (literal) {
					if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
						literal = false;
					} else {
						output += format.charAt(iFormat);
					}
				} else {
					switch (format.charAt(iFormat)) {
						case "d":
							output += formatNumber("d", date.getDate(), 2);
							break;
						case "D":
							output += formatName("D", date.getDay(), dayNamesShort, dayNames);
							break;
						case "o":
							output += formatNumber("o",
								Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
							break;
						case "m":
							output += formatNumber("m", date.getMonth() + 1, 2);
							break;
						case "M":
							output += formatName("M", date.getMonth(), monthNamesShort, monthNames);
							break;
						case "y":
							output += (lookAhead("y") ? date.getFullYear() :
								(date.getYear() % 100 < 10 ? "0" : "") + date.getYear() % 100);
							break;
						case "@":
							output += date.getTime();
							break;
						case "!":
							output += date.getTime() * 10000 + this._ticksTo1970;
							break;
						case "'":
							if (lookAhead("'")) {
								output += "'";
							} else {
								literal = true;
							}
							break;
						default:
							output += format.charAt(iFormat);
					}
				}
			}
		}
		return output;
	},

	/* Extract all possible characters from the date format. */
	_possibleChars: function (format) {
		var iFormat,
			chars = "",
			literal = false,
			// Check whether a format character is doubled
			lookAhead = function(match) {
				var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
				if (matches) {
					iFormat++;
				}
				return matches;
			};

		for (iFormat = 0; iFormat < format.length; iFormat++) {
			if (literal) {
				if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
					literal = false;
				} else {
					chars += format.charAt(iFormat);
				}
			} else {
				switch (format.charAt(iFormat)) {
					case "d": case "m": case "y": case "@":
						chars += "0123456789";
						break;
					case "D": case "M":
						return null; // Accept anything
					case "'":
						if (lookAhead("'")) {
							chars += "'";
						} else {
							literal = true;
						}
						break;
					default:
						chars += format.charAt(iFormat);
				}
			}
		}
		return chars;
	},

	/* Get a setting value, defaulting if necessary. */
	_get: function(inst, name) {
		return inst.settings[name] !== undefined ?
			inst.settings[name] : this._defaults[name];
	},

	/* Parse existing date and initialise date picker. */
	_setDateFromField: function(inst, noDefault) {
		if (inst.input.val() === inst.lastVal) {
			return;
		}

		var dateFormat = this._get(inst, "dateFormat"),
			dates = inst.lastVal = inst.input ? inst.input.val() : null,
			defaultDate = this._getDefaultDate(inst),
			date = defaultDate,
			settings = this._getFormatConfig(inst);

		try {
			date = this.parseDate(dateFormat, dates, settings) || defaultDate;
		} catch (event) {
			dates = (noDefault ? "" : dates);
		}
		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		inst.currentDay = (dates ? date.getDate() : 0);
		inst.currentMonth = (dates ? date.getMonth() : 0);
		inst.currentYear = (dates ? date.getFullYear() : 0);
		this._adjustInstDate(inst);
	},

	/* Retrieve the default date shown on opening. */
	_getDefaultDate: function(inst) {
		return this._restrictMinMax(inst,
			this._determineDate(inst, this._get(inst, "defaultDate"), new Date()));
	},

	/* A date may be specified as an exact value or a relative one. */
	_determineDate: function(inst, date, defaultDate) {
		var offsetNumeric = function(offset) {
				var date = new Date();
				date.setDate(date.getDate() + offset);
				return date;
			},
			offsetString = function(offset) {
				try {
					return $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
						offset, $.datepicker._getFormatConfig(inst));
				}
				catch (e) {
					// Ignore
				}

				var date = (offset.toLowerCase().match(/^c/) ?
					$.datepicker._getDate(inst) : null) || new Date(),
					year = date.getFullYear(),
					month = date.getMonth(),
					day = date.getDate(),
					pattern = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
					matches = pattern.exec(offset);

				while (matches) {
					switch (matches[2] || "d") {
						case "d" : case "D" :
							day += parseInt(matches[1],10); break;
						case "w" : case "W" :
							day += parseInt(matches[1],10) * 7; break;
						case "m" : case "M" :
							month += parseInt(matches[1],10);
							day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
							break;
						case "y": case "Y" :
							year += parseInt(matches[1],10);
							day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
							break;
					}
					matches = pattern.exec(offset);
				}
				return new Date(year, month, day);
			},
			newDate = (date == null || date === "" ? defaultDate : (typeof date === "string" ? offsetString(date) :
				(typeof date === "number" ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));

		newDate = (newDate && newDate.toString() === "Invalid Date" ? defaultDate : newDate);
		if (newDate) {
			newDate.setHours(0);
			newDate.setMinutes(0);
			newDate.setSeconds(0);
			newDate.setMilliseconds(0);
		}
		return this._daylightSavingAdjust(newDate);
	},

	/* Handle switch to/from daylight saving.
	 * Hours may be non-zero on daylight saving cut-over:
	 * > 12 when midnight changeover, but then cannot generate
	 * midnight datetime, so jump to 1AM, otherwise reset.
	 * @param  date  (Date) the date to check
	 * @return  (Date) the corrected date
	 */
	_daylightSavingAdjust: function(date) {
		if (!date) {
			return null;
		}
		date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
		return date;
	},

	/* Set the date(s) directly. */
	_setDate: function(inst, date, noChange) {
		var clear = !date,
			origMonth = inst.selectedMonth,
			origYear = inst.selectedYear,
			newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));

		inst.selectedDay = inst.currentDay = newDate.getDate();
		inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
		inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
		if ((origMonth !== inst.selectedMonth || origYear !== inst.selectedYear) && !noChange) {
			this._notifyChange(inst);
		}
		this._adjustInstDate(inst);
		if (inst.input) {
			inst.input.val(clear ? "" : this._formatDate(inst));
		}
	},

	/* Retrieve the date(s) directly. */
	_getDate: function(inst) {
		var startDate = (!inst.currentYear || (inst.input && inst.input.val() === "") ? null :
			this._daylightSavingAdjust(new Date(
			inst.currentYear, inst.currentMonth, inst.currentDay)));
			return startDate;
	},

	/* Attach the onxxx handlers.  These are declared statically so
	 * they work with static code transformers like Caja.
	 */
	_attachHandlers: function(inst) {
		var stepMonths = this._get(inst, "stepMonths"),
			id = "#" + inst.id.replace( /\\\\/g, "\\" );
		inst.dpDiv.find("[data-handler]").map(function () {
			var handler = {
				prev: function () {
					$.datepicker._adjustDate(id, -stepMonths, "M");
				},
				next: function () {
					$.datepicker._adjustDate(id, +stepMonths, "M");
				},
				hide: function () {
					$.datepicker._hideDatepicker();
				},
				today: function () {
					$.datepicker._gotoToday(id);
				},
				selectDay: function () {
					$.datepicker._selectDay(id, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this);
					return false;
				},
				selectMonth: function () {
					$.datepicker._selectMonthYear(id, this, "M");
					return false;
				},
				selectYear: function () {
					$.datepicker._selectMonthYear(id, this, "Y");
					return false;
				}
			};
			$(this).bind(this.getAttribute("data-event"), handler[this.getAttribute("data-handler")]);
		});
	},

	/* Generate the HTML for the current state of the date picker. */
	_generateHTML: function(inst) {
		var maxDraw, prevText, prev, nextText, next, currentText, gotoDate,
			controls, buttonPanel, firstDay, showWeek, dayNames, dayNamesMin,
			monthNames, monthNamesShort, beforeShowDay, showOtherMonths,
			selectOtherMonths, defaultDate, html, dow, row, group, col, selectedDate,
			cornerClass, calender, thead, day, daysInMonth, leadDays, curRows, numRows,
			printDate, dRow, tbody, daySettings, otherMonth, unselectable,
			tempDate = new Date(),
			today = this._daylightSavingAdjust(
				new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate())), // clear time
			isRTL = this._get(inst, "isRTL"),
			showButtonPanel = this._get(inst, "showButtonPanel"),
			hideIfNoPrevNext = this._get(inst, "hideIfNoPrevNext"),
			navigationAsDateFormat = this._get(inst, "navigationAsDateFormat"),
			numMonths = this._getNumberOfMonths(inst),
			showCurrentAtPos = this._get(inst, "showCurrentAtPos"),
			stepMonths = this._get(inst, "stepMonths"),
			isMultiMonth = (numMonths[0] !== 1 || numMonths[1] !== 1),
			currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
				new Date(inst.currentYear, inst.currentMonth, inst.currentDay))),
			minDate = this._getMinMaxDate(inst, "min"),
			maxDate = this._getMinMaxDate(inst, "max"),
			drawMonth = inst.drawMonth - showCurrentAtPos,
			drawYear = inst.drawYear;

		if (drawMonth < 0) {
			drawMonth += 12;
			drawYear--;
		}
		if (maxDate) {
			maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
				maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
			maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
			while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
				drawMonth--;
				if (drawMonth < 0) {
					drawMonth = 11;
					drawYear--;
				}
			}
		}
		inst.drawMonth = drawMonth;
		inst.drawYear = drawYear;

		prevText = this._get(inst, "prevText");
		prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
			this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
			this._getFormatConfig(inst)));

		prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
			"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click'" +
			" title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w") + "'>" + prevText + "</span></a>" :
			(hideIfNoPrevNext ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+ prevText +"'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w") + "'>" + prevText + "</span></a>"));

		nextText = this._get(inst, "nextText");
		nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
			this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
			this._getFormatConfig(inst)));

		next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
			"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click'" +
			" title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e") + "'>" + nextText + "</span></a>" :
			(hideIfNoPrevNext ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+ nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e") + "'>" + nextText + "</span></a>"));

		currentText = this._get(inst, "currentText");
		gotoDate = (this._get(inst, "gotoCurrent") && inst.currentDay ? currentDate : today);
		currentText = (!navigationAsDateFormat ? currentText :
			this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));

		controls = (!inst.inline ? "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" +
			this._get(inst, "closeText") + "</button>" : "");

		buttonPanel = (showButtonPanel) ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (isRTL ? controls : "") +
			(this._isInRange(inst, gotoDate) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'" +
			">" + currentText + "</button>" : "") + (isRTL ? "" : controls) + "</div>" : "";

		firstDay = parseInt(this._get(inst, "firstDay"),10);
		firstDay = (isNaN(firstDay) ? 0 : firstDay);

		showWeek = this._get(inst, "showWeek");
		dayNames = this._get(inst, "dayNames");
		dayNamesMin = this._get(inst, "dayNamesMin");
		monthNames = this._get(inst, "monthNames");
		monthNamesShort = this._get(inst, "monthNamesShort");
		beforeShowDay = this._get(inst, "beforeShowDay");
		showOtherMonths = this._get(inst, "showOtherMonths");
		selectOtherMonths = this._get(inst, "selectOtherMonths");
		defaultDate = this._getDefaultDate(inst);
		html = "";
		dow;
		for (row = 0; row < numMonths[0]; row++) {
			group = "";
			this.maxRows = 4;
			for (col = 0; col < numMonths[1]; col++) {
				selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
				cornerClass = " ui-corner-all";
				calender = "";
				if (isMultiMonth) {
					calender += "<div class='ui-datepicker-group";
					if (numMonths[1] > 1) {
						switch (col) {
							case 0: calender += " ui-datepicker-group-first";
								cornerClass = " ui-corner-" + (isRTL ? "right" : "left"); break;
							case numMonths[1]-1: calender += " ui-datepicker-group-last";
								cornerClass = " ui-corner-" + (isRTL ? "left" : "right"); break;
							default: calender += " ui-datepicker-group-middle"; cornerClass = ""; break;
						}
					}
					calender += "'>";
				}
				calender += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + cornerClass + "'>" +
					(/all|left/.test(cornerClass) && row === 0 ? (isRTL ? next : prev) : "") +
					(/all|right/.test(cornerClass) && row === 0 ? (isRTL ? prev : next) : "") +
					this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
					row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
					"</div><table class='ui-datepicker-calendar'><thead>" +
					"<tr>";
				thead = (showWeek ? "<th class='ui-datepicker-week-col'>" + this._get(inst, "weekHeader") + "</th>" : "");
				for (dow = 0; dow < 7; dow++) { // days of the week
					day = (dow + firstDay) % 7;
					thead += "<th" + ((dow + firstDay + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" +
						"<span title='" + dayNames[day] + "'>" + dayNamesMin[day] + "</span></th>";
				}
				calender += thead + "</tr></thead><tbody>";
				daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
				if (drawYear === inst.selectedYear && drawMonth === inst.selectedMonth) {
					inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
				}
				leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
				curRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
				numRows = (isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows); //If multiple months, use the higher number of rows (see #7043)
				this.maxRows = numRows;
				printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
				for (dRow = 0; dRow < numRows; dRow++) { // create date picker rows
					calender += "<tr>";
					tbody = (!showWeek ? "" : "<td class='ui-datepicker-week-col'>" +
						this._get(inst, "calculateWeek")(printDate) + "</td>");
					for (dow = 0; dow < 7; dow++) { // create date picker days
						daySettings = (beforeShowDay ?
							beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, ""]);
						otherMonth = (printDate.getMonth() !== drawMonth);
						unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] ||
							(minDate && printDate < minDate) || (maxDate && printDate > maxDate);
						tbody += "<td class='" +
							((dow + firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + // highlight weekends
							(otherMonth ? " ui-datepicker-other-month" : "") + // highlight days from other months
							((printDate.getTime() === selectedDate.getTime() && drawMonth === inst.selectedMonth && inst._keyEvent) || // user pressed key
							(defaultDate.getTime() === printDate.getTime() && defaultDate.getTime() === selectedDate.getTime()) ?
							// or defaultDate is current printedDate and defaultDate is selectedDate
							" " + this._dayOverClass : "") + // highlight selected day
							(unselectable ? " " + this._unselectableClass + " ui-state-disabled": "") +  // highlight unselectable days
							(otherMonth && !showOtherMonths ? "" : " " + daySettings[1] + // highlight custom dates
							(printDate.getTime() === currentDate.getTime() ? " " + this._currentClass : "") + // highlight selected day
							(printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")) + "'" + // highlight today (if different)
							((!otherMonth || showOtherMonths) && daySettings[2] ? " title='" + daySettings[2].replace(/'/g, "&#39;") + "'" : "") + // cell title
							(unselectable ? "" : " data-handler='selectDay' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + // actions
							(otherMonth && !showOtherMonths ? "&#xa0;" : // display for other months
							(unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" +
							(printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") +
							(printDate.getTime() === currentDate.getTime() ? " ui-state-active" : "") + // highlight selected day
							(otherMonth ? " ui-priority-secondary" : "") + // distinguish dates from other months
							"' href='#'>" + printDate.getDate() + "</a>")) + "</td>"; // display selectable date
						printDate.setDate(printDate.getDate() + 1);
						printDate = this._daylightSavingAdjust(printDate);
					}
					calender += tbody + "</tr>";
				}
				drawMonth++;
				if (drawMonth > 11) {
					drawMonth = 0;
					drawYear++;
				}
				calender += "</tbody></table>" + (isMultiMonth ? "</div>" +
							((numMonths[0] > 0 && col === numMonths[1]-1) ? "<div class='ui-datepicker-row-break'></div>" : "") : "");
				group += calender;
			}
			html += group;
		}
		html += buttonPanel;
		inst._keyEvent = false;
		return html;
	},

	/* Generate the month and year header. */
	_generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate,
			secondary, monthNames, monthNamesShort) {

		var inMinYear, inMaxYear, month, years, thisYear, determineYear, year, endYear,
			changeMonth = this._get(inst, "changeMonth"),
			changeYear = this._get(inst, "changeYear"),
			showMonthAfterYear = this._get(inst, "showMonthAfterYear"),
			html = "<div class='ui-datepicker-title'>",
			monthHtml = "";

		// month selection
		if (secondary || !changeMonth) {
			monthHtml += "<span class='ui-datepicker-month'>" + monthNames[drawMonth] + "</span>";
		} else {
			inMinYear = (minDate && minDate.getFullYear() === drawYear);
			inMaxYear = (maxDate && maxDate.getFullYear() === drawYear);
			monthHtml += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
			for ( month = 0; month < 12; month++) {
				if ((!inMinYear || month >= minDate.getMonth()) && (!inMaxYear || month <= maxDate.getMonth())) {
					monthHtml += "<option value='" + month + "'" +
						(month === drawMonth ? " selected='selected'" : "") +
						">" + monthNamesShort[month] + "</option>";
				}
			}
			monthHtml += "</select>";
		}

		if (!showMonthAfterYear) {
			html += monthHtml + (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "");
		}

		// year selection
		if ( !inst.yearshtml ) {
			inst.yearshtml = "";
			if (secondary || !changeYear) {
				html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
			} else {
				// determine range of years to display
				years = this._get(inst, "yearRange").split(":");
				thisYear = new Date().getFullYear();
				determineYear = function(value) {
					var year = (value.match(/c[+\-].*/) ? drawYear + parseInt(value.substring(1), 10) :
						(value.match(/[+\-].*/) ? thisYear + parseInt(value, 10) :
						parseInt(value, 10)));
					return (isNaN(year) ? thisYear : year);
				};
				year = determineYear(years[0]);
				endYear = Math.max(year, determineYear(years[1] || ""));
				year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
				endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
				inst.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
				for (; year <= endYear; year++) {
					inst.yearshtml += "<option value='" + year + "'" +
						(year === drawYear ? " selected='selected'" : "") +
						">" + year + "</option>";
				}
				inst.yearshtml += "</select>";

				html += inst.yearshtml;
				inst.yearshtml = null;
			}
		}

		html += this._get(inst, "yearSuffix");
		if (showMonthAfterYear) {
			html += (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "") + monthHtml;
		}
		html += "</div>"; // Close datepicker_header
		return html;
	},

	/* Adjust one of the date sub-fields. */
	_adjustInstDate: function(inst, offset, period) {
		var year = inst.drawYear + (period === "Y" ? offset : 0),
			month = inst.drawMonth + (period === "M" ? offset : 0),
			day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) + (period === "D" ? offset : 0),
			date = this._restrictMinMax(inst, this._daylightSavingAdjust(new Date(year, month, day)));

		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		if (period === "M" || period === "Y") {
			this._notifyChange(inst);
		}
	},

	/* Ensure a date is within any min/max bounds. */
	_restrictMinMax: function(inst, date) {
		var minDate = this._getMinMaxDate(inst, "min"),
			maxDate = this._getMinMaxDate(inst, "max"),
			newDate = (minDate && date < minDate ? minDate : date);
		return (maxDate && newDate > maxDate ? maxDate : newDate);
	},

	/* Notify change of month/year. */
	_notifyChange: function(inst) {
		var onChange = this._get(inst, "onChangeMonthYear");
		if (onChange) {
			onChange.apply((inst.input ? inst.input[0] : null),
				[inst.selectedYear, inst.selectedMonth + 1, inst]);
		}
	},

	/* Determine the number of months to show. */
	_getNumberOfMonths: function(inst) {
		var numMonths = this._get(inst, "numberOfMonths");
		return (numMonths == null ? [1, 1] : (typeof numMonths === "number" ? [1, numMonths] : numMonths));
	},

	/* Determine the current maximum date - ensure no time components are set. */
	_getMinMaxDate: function(inst, minMax) {
		return this._determineDate(inst, this._get(inst, minMax + "Date"), null);
	},

	/* Find the number of days in a given month. */
	_getDaysInMonth: function(year, month) {
		return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
	},

	/* Find the day of the week of the first of a month. */
	_getFirstDayOfMonth: function(year, month) {
		return new Date(year, month, 1).getDay();
	},

	/* Determines if we should allow a "next/prev" month display change. */
	_canAdjustMonth: function(inst, offset, curYear, curMonth) {
		var numMonths = this._getNumberOfMonths(inst),
			date = this._daylightSavingAdjust(new Date(curYear,
			curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));

		if (offset < 0) {
			date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
		}
		return this._isInRange(inst, date);
	},

	/* Is the given date in the accepted range? */
	_isInRange: function(inst, date) {
		var yearSplit, currentYear,
			minDate = this._getMinMaxDate(inst, "min"),
			maxDate = this._getMinMaxDate(inst, "max"),
			minYear = null,
			maxYear = null,
			years = this._get(inst, "yearRange");
			if (years){
				yearSplit = years.split(":");
				currentYear = new Date().getFullYear();
				minYear = parseInt(yearSplit[0], 10);
				maxYear = parseInt(yearSplit[1], 10);
				if ( yearSplit[0].match(/[+\-].*/) ) {
					minYear += currentYear;
				}
				if ( yearSplit[1].match(/[+\-].*/) ) {
					maxYear += currentYear;
				}
			}

		return ((!minDate || date.getTime() >= minDate.getTime()) &&
			(!maxDate || date.getTime() <= maxDate.getTime()) &&
			(!minYear || date.getFullYear() >= minYear) &&
			(!maxYear || date.getFullYear() <= maxYear));
	},

	/* Provide the configuration settings for formatting/parsing. */
	_getFormatConfig: function(inst) {
		var shortYearCutoff = this._get(inst, "shortYearCutoff");
		shortYearCutoff = (typeof shortYearCutoff !== "string" ? shortYearCutoff :
			new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
		return {shortYearCutoff: shortYearCutoff,
			dayNamesShort: this._get(inst, "dayNamesShort"), dayNames: this._get(inst, "dayNames"),
			monthNamesShort: this._get(inst, "monthNamesShort"), monthNames: this._get(inst, "monthNames")};
	},

	/* Format the given date for display. */
	_formatDate: function(inst, day, month, year) {
		if (!day) {
			inst.currentDay = inst.selectedDay;
			inst.currentMonth = inst.selectedMonth;
			inst.currentYear = inst.selectedYear;
		}
		var date = (day ? (typeof day === "object" ? day :
			this._daylightSavingAdjust(new Date(year, month, day))) :
			this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
		return this.formatDate(this._get(inst, "dateFormat"), date, this._getFormatConfig(inst));
	}
});

/*
 * Bind hover events for datepicker elements.
 * Done via delegate so the binding only occurs once in the lifetime of the parent div.
 * Global instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
 */
function bindHover(dpDiv) {
	var selector = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
	return dpDiv.delegate(selector, "mouseout", function() {
			$(this).removeClass("ui-state-hover");
			if (this.className.indexOf("ui-datepicker-prev") !== -1) {
				$(this).removeClass("ui-datepicker-prev-hover");
			}
			if (this.className.indexOf("ui-datepicker-next") !== -1) {
				$(this).removeClass("ui-datepicker-next-hover");
			}
		})
		.delegate(selector, "mouseover", function(){
			if (!$.datepicker._isDisabledDatepicker( instActive.inline ? dpDiv.parent()[0] : instActive.input[0])) {
				$(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
				$(this).addClass("ui-state-hover");
				if (this.className.indexOf("ui-datepicker-prev") !== -1) {
					$(this).addClass("ui-datepicker-prev-hover");
				}
				if (this.className.indexOf("ui-datepicker-next") !== -1) {
					$(this).addClass("ui-datepicker-next-hover");
				}
			}
		});
}

/* jQuery extend now ignores nulls! */
function extendRemove(target, props) {
	$.extend(target, props);
	for (var name in props) {
		if (props[name] == null) {
			target[name] = props[name];
		}
	}
	return target;
}

/* Invoke the datepicker functionality.
   @param  options  string - a command, optionally followed by additional parameters or
					Object - settings for attaching new datepicker functionality
   @return  jQuery object */
$.fn.datepicker = function(options){

	/* Verify an empty collection wasn't passed - Fixes #6976 */
	if ( !this.length ) {
		return this;
	}

	/* Initialise the date picker. */
	if (!$.datepicker.initialized) {
		$(document).mousedown($.datepicker._checkExternalClick);
		$.datepicker.initialized = true;
	}

	/* Append datepicker main container to body if not exist. */
	if ($("#"+$.datepicker._mainDivId).length === 0) {
		$("body").append($.datepicker.dpDiv);
	}

	var otherArgs = Array.prototype.slice.call(arguments, 1);
	if (typeof options === "string" && (options === "isDisabled" || options === "getDate" || options === "widget")) {
		return $.datepicker["_" + options + "Datepicker"].
			apply($.datepicker, [this[0]].concat(otherArgs));
	}
	if (options === "option" && arguments.length === 2 && typeof arguments[1] === "string") {
		return $.datepicker["_" + options + "Datepicker"].
			apply($.datepicker, [this[0]].concat(otherArgs));
	}
	return this.each(function() {
		typeof options === "string" ?
			$.datepicker["_" + options + "Datepicker"].
				apply($.datepicker, [this].concat(otherArgs)) :
			$.datepicker._attachDatepicker(this, options);
	});
};

$.datepicker = new Datepicker(); // singleton instance
$.datepicker.initialized = false;
$.datepicker.uuid = new Date().getTime();
$.datepicker.version = "1.10.4";

})(jQuery);


/*
@chalk overview
@name mac-affix

@description
Fix the component at a certain position

@param {Expr}  mac-affix-disabled To unpin element (default false)
@param {Expr}  mac-affix-top      Top offset (default 0)
@param {Expr}  mac-affix-bottom   Bottom offset (default 0)
@param {Event} refresh-mac-affix  To update the position of affixed element
 */
angular.module("Mac").directive("macAffix", [
  "$document", "$window", function($document, $window) {
    return {
      link: function($scope, element, attrs) {
        var defaults, disabled, getPinnedOffset, lastAffix, offset, pinnedOffset, scrollEvent, setOffset, unpin, windowEl;
        defaults = {
          top: 0,
          bottom: 0,
          disabled: false,
          classes: "affix affix-top affix-bottom"
        };
        offset = {
          top: defaults.top,
          bottom: defaults.bottom
        };
        disabled = defaults.disabled;
        lastAffix = null;
        unpin = null;
        pinnedOffset = null;
        windowEl = angular.element($window);

        /*
        @name setOffset
        @description
        Update top or bottom offset. This function will make sure the value is
        an integer and use default value
        @param {String} key Offset key
        @param {String|Integer} value Update value
        @param {Bool} useDefault
         */
        setOffset = function(key, value, useDefault) {
          if (useDefault == null) {
            useDefault = false;
          }
          if (useDefault && (value == null)) {
            value = defaults[key];
          }
          if ((value != null) && !isNaN(+value)) {
            return offset[key] = +value;
          }
        };
        if (attrs.macAffixTop != null) {
          setOffset("top", $scope.$eval(attrs.macAffixTop), true);
          $scope.$watch(attrs.macAffixTop, function(value) {
            return setOffset("top", value);
          });
        }
        if (attrs.macAffixBottom != null) {
          setOffset("bottom", $scope.$eval(attrs.macAffixBottom), true);
          $scope.$watch(attrs.macAffixBottom, function(value) {
            return setOffset("bottom", value);
          });
        }
        getPinnedOffset = function() {
          var scrollHeight;
          if (pinnedOffset != null) {
            return pinnedOffset;
          }
          element.removeClass(defaults.classes).addClass("affix");
          scrollHeight = $document.height();
          pinnedOffset = scrollHeight - element.outerHeight() - offset.bottom;
          return pinnedOffset;
        };
        scrollEvent = function() {
          var affix, curOffset, elementHeight, position, scrollHeight, scrollTop;
          if (element[0].offsetHeight <= 0 && element[0].offsetWidth <= 0) {
            return;
          }
          position = element.offset();
          scrollTop = windowEl.scrollTop();
          scrollHeight = $document.height();
          elementHeight = element.outerHeight();
          affix = (unpin != null) && scrollTop <= unpin ? false : (offset.bottom != null) && scrollTop > scrollHeight - elementHeight - offset.bottom ? "bottom" : (offset.top != null) && scrollTop <= offset.top ? "top" : false;
          if (affix === lastAffix) {
            return;
          }
          if (unpin) {
            element.css("top", "");
          }
          lastAffix = affix;
          unpin = affix === "bottom" ? getPinnedOffset() : null;
          element.removeClass(defaults.classes).addClass("affix" + (affix ? "-" + affix : ""));
          if (affix === "bottom") {
            curOffset = element.offset();
            element.css("top", unpin - curOffset.top);
          }
          return true;
        };
        if (attrs.macAffixDisabled != null) {
          disabled = $scope.$eval(attrs.macAffixDisabled) || defaults.disabled;
          $scope.$watch(attrs.macAffixDisabled, function(value) {
            var action;
            if ((value == null) || value === disabled) {
              return;
            }
            disabled = value;
            action = value ? "unbind" : "bind";
            windowEl[action]("scroll", scrollEvent);
            if (disabled) {
              lastAffix = null;
              unpin = null;
              return element.css("top", "").removeClass(defaults.classes);
            } else {
              return scrollEvent();
            }
          });
        }
        if (!disabled) {
          windowEl.bind("scroll", scrollEvent);
        }
        $scope.$on("refresh-mac-affix", function() {
          var position;
          return position = element.offset();
        });
        return $scope.$on("$destroy", function() {
          return windowEl.unbind("scroll", scrollEvent);
        });
      }
    };
  }
]);


/*
@chalk overview
@name Autocomplete

@description
A directive for providing suggestions while typing into the field

Autocomplete allows for custom html templating in the dropdown and some properties are exposed on the local scope on each template instance, including:

| Variable  | Type    | Details                                                                     |
|-----------|---------|-----------------------------------------------------------------------------|
| `$index`  | Number  | iterator offset of the repeated element (0..length-1)                       |
| `$first`  | Boolean | true if the repeated element is first in the iterator.                      |
| `$middle` | Boolean | true if the repeated element is between the first and last in the iterator. |
| `$last`   | Boolean | true if the repeated element is last in the iterator.                       |
| `$even`   | Boolean | true if the iterator position `$index` is even (otherwise false).           |
| `$odd`    | Boolean | true if the iterator position `$index` is odd (otherwise false).            |
| `item`    | Object  | item object with `value` and `label` if label-key is set                    |

To use custom templating

```
<mac-autocomplete mac-autocomplete-url="someUrl" ng-model="model">
  <span> {{item.label}} </span>
</mac-autocomplete>
```

Template default to `{{item.label}}` if not defined

@dependencies
- mac-menu

@param {String} ng-model Assignable angular expression to data-bind to (required)
@param {String} mac-placeholder Placeholder text
@param {String} mac-autocomplete-url Url to fetch autocomplete dropdown list data. URL may include GET params e.g. "/users?nocache=1"
@param {Expression} mac-autocomplete-source Data to use.
Source support multiple types:
- Array: An array can be used for local data and there are two supported formats:
  - An array of strings: ["Item1", "Item2"]
  - An array of objects with mac-autocomplete-label key: [{name:"Item1"}, {name:"Item2"}]
- String: Using a string as the source is the same as passing the variable into mac-autocomplete-url
- Function: A callback when querying for data. The callback receive two arguments:
  - {String} Value currently in the text input
  - {Function} A response callback which expects a single argument, data to user. The data will be
  populated on the menu and the menu will adjust accordingly
@param {Boolean} mac-autocomplete-disabled Boolean value if autocomplete should be disabled
@param {Function} mac-autocomplete-on-select Function called when user select on an item
- `selected` - {Object} The item selected
@param {Function} mac-autocomplete-on-success function called on success ajax request
- `data` - {Object} Data returned from the request
- `status` - {Number} The status code of the response
- `header` - {Object} Header of the response
@param {Function} mac-autocomplete-on-error Function called on ajax request error
- `data` - {Object} Data returned from the request
- `status` - {Number} The status code of the response
- `header` - {Object} Header of the response
@param {String}  mac-autocomplete-label The label to display to the users (default "name")
@param {String}  mac-autocomplete-query The query parameter on GET command (default "q")
@param {Integer} mac-autocomplete-delay Delay on fetching autocomplete data after keyup (default 800)

@param {Expr} mac-menu-class Classes for mac-menu used by mac-autocomplete. For more info, check [ngClass](http://docs.angularjs.org/api/ng/directive/ngClass)
 */
angular.module("Mac").directive("macAutocomplete", [
  "$animate", "$compile", "$filter", "$http", "$parse", "$rootScope", "$timeout", "keys", function($animate, $compile, $filter, $http, $parse, $rootScope, $timeout, keys) {
    return {
      restrict: "EA",
      template: "<input type=\"text\"/>",
      transclude: true,
      replace: true,
      require: "ngModel",
      link: function($scope, element, attrs, ctrl, transclude) {
        var $menuScope, appendMenu, autocompleteUrl, blurHandler, currentAutocomplete, delay, disabled, getData, inside, isMenuAppended, labelGetter, labelKey, menuEl, onError, onSelect, onSuccess, positionMenu, preventParser, queryData, queryKey, reset, source, timeoutId, updateItem;
        labelKey = attrs.macAutocompleteLabel || "name";
        labelGetter = $parse(labelKey);
        queryKey = attrs.macAutocompleteQuery || "q";
        delay = +(attrs.macAutocompleteDelay || 800);
        inside = attrs.macAutocompleteInside != null;
        autocompleteUrl = $parse(attrs.macAutocompleteUrl);
        onSelect = $parse(attrs.macAutocompleteOnSelect);
        onSuccess = $parse(attrs.macAutocompleteOnSuccess);
        onError = $parse(attrs.macAutocompleteOnError);
        source = $parse(attrs.macAutocompleteSource);
        disabled = $parse(attrs.macAutocompleteDisabled);
        currentAutocomplete = [];
        timeoutId = null;
        isMenuAppended = false;
        preventParser = false;
        $menuScope = $scope.$new();
        $menuScope.items = [];
        $menuScope.index = 0;
        $menuScope.select = function(index) {
          var label, selected;
          selected = currentAutocomplete[index];
          onSelect($scope, {
            selected: selected
          });
          label = $menuScope.items[index].label || "";
          preventParser = true;
          if (attrs.ngModel != null) {
            ctrl.$setViewValue(label);
            ctrl.$render();
          }
          return reset();
        };
        menuEl = angular.element(document.createElement("mac-menu"));
        menuEl.attr({
          "ng-class": attrs.macMenuClass || null,
          "mac-menu-items": "items",
          "mac-menu-select": "select(index)",
          "mac-menu-index": "index"
        });
        transclude($menuScope, function(clone) {
          return menuEl.append(clone);
        });
        $compile(menuEl)($menuScope);
        ctrl.$parsers.push(function(value) {
          if (value && !disabled($scope) && !preventParser) {
            if (timeoutId != null) {
              $timeout.cancel(timeoutId);
            }
            if (delay > 0) {
              timeoutId = $timeout(function() {
                return queryData(value);
              }, delay);
            } else {
              queryData(value);
            }
          } else {
            reset();
          }
          preventParser = false;
          return value;
        });

        /*
        @name blurHandler
        @description
        Create a blur handler function to make sure directive is unbinding
        the correct handler
         */
        blurHandler = function() {
          return $scope.$apply(function() {
            return reset();
          });
        };

        /*
        @function
        @name appendMenu
        @description
        Adding menu to DOM
        @param {Function} callback Callback after enter animation completes
         */
        appendMenu = function(callback) {
          if (!isMenuAppended) {
            element.bind("blur", blurHandler);
            menuEl.on('mousedown', function(event) {
              return event.preventDefault();
            });
          }
          isMenuAppended = true;
          if (inside) {
            return $animate.enter(menuEl, void 0, element, callback);
          } else {
            return $animate.enter(menuEl, angular.element(document.body), void 0, callback);
          }
        };

        /*
        @function
        @name reset
        @description
        Resetting autocomplete
         */
        reset = function() {
          $animate.leave(menuEl, function() {
            $menuScope.index = 0;
            $menuScope.items.length = 0;
            menuEl[0].style.top = "";
            menuEl[0].style.left = "";
            isMenuAppended = false;
            return element.unbind("blur", blurHandler);
          });
        };

        /*
        @function
        @name positionMenu
        @description
        Calculate the style include position and width for menu
         */
        positionMenu = function() {
          var offset, parentElement, parentStyles;
          parentElement = inside ? element[0] : document.body;
          parentStyles = window.getComputedStyle(parentElement);
          offset = element.offset();
          offset.left -= parseInt(parentStyles.marginLeft);
          offset.top += element.outerHeight() - parseInt(parentStyles.marginTop);
          offset.minWidth = element.outerWidth();
          return angular.forEach(offset, function(value, key) {
            if (!isNaN(+value) && angular.isNumber(+value)) {
              value = "" + value + "px";
            }
            return menuEl[0].style[key] = value;
          });
        };

        /*
        @function
        @name updateItem
        @description
        Update list of items getting passed to menu
        @param {Array} data Array of data
         */
        updateItem = function(data) {
          if ((data != null ? data.length : void 0) > 0) {
            currentAutocomplete = data;
            $menuScope.items = data.map(function(item) {
              if (angular.isObject(item)) {
                if (item.value == null) {
                  item.value = labelGetter(item) || "";
                }
                if (item.label == null) {
                  item.label = labelGetter(item) || "";
                }
                return item;
              } else {
                return {
                  label: item,
                  value: item
                };
              }
            });
            return appendMenu(positionMenu);
          } else {
            return reset();
          }
        };

        /*
        @function
        @name getData
        @description
        GET request to fetch data from server, update menu items and position
        menu
        @param {String} url URL to fetch data from
         */
        getData = function(url, query) {
          var options;
          options = {
            method: "GET",
            url: url,
            params: {}
          };
          options.params[queryKey] = query;
          return $http(options).success(function(data, status, headers, config) {
            var dataList;
            dataList = onSuccess($scope, {
              data: data,
              status: status,
              headers: headers
            });
            if (dataList == null) {
              dataList = data.data;
            }
            return updateItem(dataList);
          }).error(function(data, status, headers, config) {
            return onError($scope, {
              data: data,
              status: status,
              headers: headers
            });
          });
        };

        /*
        @function
        @name queryData
        @description
        Used for querying data
        @param {String} query Search query
         */
        queryData = function(query) {
          var sourceData, url;
          url = autocompleteUrl($scope);
          if (url) {
            return getData(url, query);
          } else {
            sourceData = source($scope);
            if (angular.isArray(sourceData)) {
              return updateItem($filter("filter")(sourceData, query));
            } else if (angular.isString(sourceData)) {
              return getData(sourceData, query);
            } else if (angular.isFunction(sourceData)) {
              return sourceData(query, updateItem);
            }
          }
        };
        element.bind("keydown", function(event) {
          if ($menuScope.items.length === 0) {
            return true;
          }
          switch (event.which) {
            case keys.DOWN:
              $scope.$apply(function() {
                $menuScope.index = ($menuScope.index + 1) % $menuScope.items.length;
                return event.preventDefault();
              });
              break;
            case keys.UP:
              $scope.$apply(function() {
                $menuScope.index = ($menuScope.index ? $menuScope.index : $menuScope.items.length) - 1;
                return event.preventDefault();
              });
              break;
            case keys.ENTER:
              $scope.$apply(function() {
                $menuScope.select($menuScope.index);
                return event.preventDefault();
              });
              break;
            case keys.ESCAPE:
              $scope.$apply(function() {
                reset();
                return event.preventDefault();
              });
          }
          return true;
        });
        $scope.$on("$destroy", function() {
          $menuScope.$destroy();
          return reset();
        });

        /*
        @event
        @name reset-mac-autocomplete
        @description
        Event to reset autocomplete
         */
        return $scope.$on("reset-mac-autocomplete", function() {
          return reset();
        });
      }
    };
  }
]);


/*
@chalk overview
@name Canvas Spinner

@description
A directive for generating a canvas spinner
This spinner requires much less CPU/GPU resources than CSS spinner

@param {Integer} mac-cspinner-width   Width of each bar (default 2)
@param {Integer} mac-cspinner-height  Height of each bar (default 5)
@param {Integer} mac-cpsinner-border  Border radius (default 1)
@param {Integer} mac-cspinner-size    Dimension of the whole spinner excluding padding (default 20)
@param {Integer} mac-cspinner-radius  Center radius (default 4)
@param {Integer} mac-cspinner-bars    Number of bars (default 10)
@param {Integer} mac-cspinner-padding Padding around the spinner (default 3)
@param {Integer} mac-cspinner-speed   ms delay between each animation
@param {String}  mac-cspinner-color   Color of each bar
@param {Expr}    mac-cspinner-spin    Start or stop spinner
 */
angular.module("Mac").directive("macCspinner", [
  "$timeout", "util", function($timeout, util) {
    return {
      restrict: "E",
      replace: "true",
      template: "<div class=\"mac-cspinner\"></div>",
      compile: function(element, attrs) {
        var canvas, canvasRadius, ctx, defaults, height, i, left, maxCanvasRadius, maxRadius, opacity, opts, prop, radius, ratio, rgb, rotation, showCtx, size, templateCanvas, top, width, _i, _j, _len, _ref, _ref1;
        if (!window.HTMLCanvasElement) {
          return console.log("Browser does not support canvas");
        }
        defaults = {
          width: 2,
          height: 5,
          border: 1,
          radius: 4,
          bars: 10,
          padding: 3,
          speed: 100,
          color: "#2f3035",
          size: 20
        };
        opts = util.extendAttributes("macCspinner", defaults, attrs);
        if (attrs.macCspinnerSize != null) {
          size = !isNaN(+attrs.macCspinnerSize) && +attrs.macCspinnerSize;
          if (size) {
            ratio = size / defaults.size;
            _ref = ["width", "height", "border", "radius"];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              prop = _ref[_i];
              opts[prop] = defaults[prop] * ratio;
            }
          }
        }
        width = opts.width;
        height = opts.height;
        radius = opts.border;
        maxRadius = opts.radius + height;
        maxCanvasRadius = Math.max(width, maxRadius);
        canvasRadius = Math.ceil(Math.max(maxCanvasRadius, util.pyth(maxRadius, width / 2)));
        canvasRadius += opts.padding;
        templateCanvas = angular.element("<canvas></canvas>");
        ctx = templateCanvas[0].getContext("2d");
        rotation = util.radian(360 / opts.bars);
        ctx.translate(canvasRadius, canvasRadius);
        top = -maxRadius;
        left = -width / 2;
        rgb = util.hex2rgb(opts.color);
        for (i = _j = 0, _ref1 = opts.bars - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
          opacity = 1 - (0.8 / opts.bars) * i;
          ctx.fillStyle = "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + opacity + ")";
          ctx.beginPath();
          ctx.moveTo(left + radius, top);
          ctx.arc(left + width - radius, top + radius, radius, util.radian(-90), util.radian(0), false);
          ctx.arc(left + width - radius, top + height - radius, radius, util.radian(0), util.radian(90), false);
          ctx.arc(left + radius, top + height - radius, radius, util.radian(90), util.radian(180), false);
          ctx.arc(left + radius, top + radius, radius, util.radian(-180), util.radian(-90), false);
          ctx.closePath();
          ctx.fill();
          ctx.rotate(rotation);
        }
        canvas = angular.element("<canvas></canvas>");
        canvas.attr({
          width: canvasRadius * 2,
          height: canvasRadius * 2
        });
        showCtx = canvas[0].getContext("2d");
        showCtx.translate(canvasRadius, canvasRadius);
        element.append(canvas);
        return function($scope, element, attrs) {
          var intervalID, spinning, start, stop;
          intervalID = null;
          spinning = false;
          stop = function() {
            spinning = false;
            if (intervalID != null) {
              return $timeout.cancel(intervalID);
            }
          };
          start = function() {
            var drawFn, rotate;
            if (spinning) {
              return;
            }
            spinning = true;
            rotate = util.radian(360 / opts.bars);
            return (drawFn = function(startCycle) {
              if (startCycle == null) {
                startCycle = false;
              }
              showCtx.clearRect(-canvasRadius, -canvasRadius, canvasRadius * 2, canvasRadius * 2);
              showCtx.rotate(rotate);
              showCtx.drawImage(templateCanvas[0], -canvasRadius, -canvasRadius);
              if (spinning) {
                if (!startCycle && element[0].offsetHeight <= 0 && element[0].offsetWidth <= 0) {
                  return stop();
                }
                return intervalID = $timeout(drawFn, opts.speed, false);
              }
            })(true);
          };
          if (attrs.macCspinnerSpin != null) {
            $scope.$watch(attrs.macCspinnerSpin, function(value) {
              if (value && !spinning) {
                return start();
              } else {
                return stop();
              }
            });
          } else {
            start();
          }
          if (attrs.ngShow) {
            $scope.$watch(attrs.ngShow, function(value) {
              if (value) {
                return start();
              } else {
                return stop();
              }
            });
          } else if (attrs.ngHide) {
            $scope.$watch(attrs.ngHide, function(value) {
              if (value) {
                return stop();
              } else {
                return start();
              }
            });
          }
          return $scope.$on("$destroy", function() {
            return stop();
          });
        };
      }
    };
  }
]);


/*
@chalk overview
@name Datepicker
@description
A directive for creating a datepicker on text input using jquery ui. Time input can use any `ng-` attributes support by text input type.

@dependencies
- jQuery
- jQuery datepicker

@param {String}     ng-model The model to store the selected date
Clearing model by setting it to null or '' will clear the input field
@param {Function}   mac-datepicker-on-select Function called before setting the value to the model
  - `date` - {String} Selected date from the datepicker
  - `instance` - {Object} Datepicker instance
@param {String}     mac-datepicker-on-close Function called before closing datepicker
  - `date` - {String} Selected date from the datepicker
  - `instance` - {Object} Datepicker instance
@param {String}     mac-datepicker-append-text          The text to display after each date field
@param {Boolean}    mac-datepicker-auto-size            Automatically resize the input to accommodate dates in the current dateFormat
@param {Boolean}    mac-datepicker-change-month         Whether the month should be rendered as a dropdown instead of text
@param {Boolean}    mac-datepicker-change-year          Whether the year should be rendered as a dropdown instead of text
@param {Boolean}    mac-datepicker-constrain-input-type Constrain characters allowed by the current dateFormat
@param {String}     mac-datepicker-current-text         Text to display for the current day link
@param {String}     mac-datepicker-date-format          The format for parse and displayed dates
@param {Expression} mac-datepicker-default-date         Date to highligh on first opening if the field is blank {Date|Number|String}
@param {String}     mac-datepicker-duration             Control the speed at which the datepicker appears
@param {Integer}    mac-datepicker-first-day            Set the first day of the week. Sunday is 0, Monday is 1
@param {Expression} mac-datepicker-max-date             The maximum selectable date {Date|Number|String}
@param {Expression} mac-datepicker-min-date             The minimum selectable date {Date|Number|String}
@param {Integer}    mac-datepicker-number-of-months     The number of months to show at once
@param {String}     mac-datepicker-show-on              When the datepicker should appear
@param {Integer}    mac-datepicker-year-range           The range of years displayed in the year drop-down
@param {Boolean}    ng-disabled                         Enable or disable datepicker
 */
angular.module("Mac").directive("macDatepicker", [
  "$parse", "$timeout", "util", function($parse, $timeout, util) {
    var defaults;
    defaults = {
      appendText: "",
      autoSize: false,
      changeMonth: false,
      changeYear: false,
      constrainInputType: true,
      currentText: "Today",
      dateFormat: "mm/dd/yy",
      defaultDate: null,
      duration: "normal",
      firstDay: 0,
      maxDate: null,
      minDate: null,
      numberOfMonths: 1,
      showOn: "focus",
      yearRange: "c-10:c+10"
    };
    return {
      restrict: "E",
      require: "ngModel",
      replace: true,
      template: "<input type=\"text\" class=\"mac-date-time\"/>",
      link: function($scope, element, attrs, ngModelCtrl) {
        var datepickerValidator, onClose, onSelect, opts, setOptions;
        opts = util.extendAttributes("macDatepicker", defaults, attrs);
        onSelect = $parse(attrs.macDatepickerOnSelect);
        onClose = $parse(attrs.macDatepickerOnClose);
        datepickerValidator = function(value) {
          var e;
          if (!value) {
            ngModelCtrl.$setValidity("date", true);
            return value;
          }
          try {
            $.datepicker.parseDate(opts.dateFormat, value);
            ngModelCtrl.$setValidity("date", true);
            return value;
          } catch (_error) {
            e = _error;
            ngModelCtrl.$setValidity("date", false);
            return void 0;
          }
        };
        ngModelCtrl.$formatters.push(datepickerValidator);
        ngModelCtrl.$parsers.push(datepickerValidator);
        opts.onSelect = function(date, instance) {
          return $scope.$apply(function() {
            if (typeof onSelect === "function") {
              onSelect($scope, {
                date: date,
                instance: instance
              });
            }
            ngModelCtrl.$setViewValue(date);
            return ngModelCtrl.$render();
          });
        };
        opts.onClose = function(date, instance) {
          return $scope.$apply(function() {
            return typeof onClose === "function" ? onClose($scope, {
              date: date,
              instance: instance
            }) : void 0;
          });
        };
        element.datepicker(opts);
        setOptions = function(name, value) {
          if (value != null) {
            return element.datepicker("option", name, value);
          }
        };
        if (attrs.macDatepickerDefaultDate != null) {
          $scope.$watch(attrs.macDatepickerDefaultDate, function(value) {
            return setOptions("defaultDate", value);
          });
        }
        if (attrs.macDatepickerMaxDate != null) {
          $scope.$watch(attrs.macDatepickerMaxDate, function(value) {
            return setOptions("maxDate", value);
          });
        }
        if (attrs.macDatepickerMinDate != null) {
          return $scope.$watch(attrs.macDatepickerMinDate, function(value) {
            return setOptions("minDate", value);
          });
        }
      }
    };
  }
]);


/*
@chalk overview
@name Keydown events

@description
A directive for handling certain keys on keydown event
Currently MacGyver supports enter, escape, space, left, up, right and down

@param {Expression} mac-keydown-enter  Expression to evaluate on hitting enter
@param {Expression} mac-keydown-escape Expression to evaluate on hitting escape
@param {Expression} mac-keydown-space  Expression to evaluate on hitting space
@param {Expression} mac-keydown-left   Expression to evaluate on hitting left
@param {Expression} mac-keydown-up     Expression to evaluate on hitting up
@param {Expression} mac-keydown-right  Expression to evaluate on hitting right
@param {Expression} mac-keydown-down   Expression to evaluate on hitting down
 */
var key, _fn, _i, _len, _ref;

_ref = ["Enter", "Escape", "Space", "Left", "Up", "Right", "Down"];
_fn = function(key) {
  return angular.module("Mac").directive("macKeydown" + key, [
    "$parse", "keys", function($parse, keys) {
      return {
        restrict: "A",
        link: function(scope, element, attributes) {
          var expression;
          expression = $parse(attributes["macKeydown" + key]);
          return element.bind("keydown", function($event) {
            if ($event.which === keys["" + (key.toUpperCase())]) {
              $event.preventDefault();
              return scope.$apply(function() {
                return expression(scope, {
                  $event: $event
                });
              });
            }
          });
        }
      };
    }
  ]);
};
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  key = _ref[_i];
  _fn(key);
}


/*
@chalk overview
@name Pause Typing

@description
macPauseTyping directive allow user to specify custom behavior after user stops typing for more than (delay) milliseconds

@param {Expression} mac-pause-typing       Expression to evaluate after delay
@param {Expression} mac-pause-typing-delay Delay value to evaluate expression (default 800)
 */
angular.module("Mac").directive("macPauseTyping", [
  "$parse", "$timeout", function($parse, $timeout) {
    return {
      restrict: "A",
      link: function(scope, element, attributes) {
        var delay, expression, keyupTimer;
        expression = $parse(attributes["macPauseTyping"]);
        delay = scope.$eval(attributes["macPauseTypingDelay"]) || 800;
        keyupTimer = null;
        return element.bind("keyup", function($event) {
          if (keyupTimer != null) {
            $timeout.cancel(keyupTimer);
          }
          return keyupTimer = $timeout(function() {
            return expression(scope, {
              $event: $event
            });
          }, delay);
        });
      }
    };
  }
]);


/*
@chalk overview
@name Windows Resize

@description
Binding custom behavior on window resize event

@param {Expression} mac-window-resize Expression to evaluate on window resize
 */
angular.module("Mac").directive("macWindowResize", [
  "$parse", "$window", function($parse, $window) {
    return {
      restrict: "A",
      link: function($scope, element, attrs) {
        var handler;
        handler = function($event) {
          var callbackFn;
          callbackFn = $parse(attrs.macWindowResize);
          $scope.$apply(function() {
            return callbackFn($scope, {
              $event: $event
            });
          });
          return true;
        };
        angular.element($window).bind("resize", handler);
        return $scope.$on("destroy", function() {
          return angular.element($window).unbind("resize", handler);
        });
      }
    };
  }
]);


/*
@chalk overview
@name mac-focus-on-event

@description
Scroll window to the element and focus on the element

@param {String}  mac-focus-on-event Event to focus on element
@param {Boolean} mac-focus-on-event-scroll Scroll to element location or not
 */
angular.module("Mac").directive("macFocusOnEvent", [
  "$timeout", function($timeout) {
    return function(scope, element, attributes) {
      return scope.$on(attributes.macFocusOnEvent, function() {
        return $timeout(function() {
          var x, y;
          element.focus();
          if (attributes.macFocusOnEventScroll) {
            x = window.scrollX;
            y = window.scrollY;
            return window.scrollTo(x, y);
          }
        }, 0, false);
      });
    };
  }
]);

angular.module("Mac").factory("keys", function() {
  return {
    CANCEL: 3,
    HELP: 6,
    BACKSPACE: 8,
    TAB: 9,
    CLEAR: 12,
    ENTER: 13,
    RETURN: 13,
    SHIFT: 16,
    CONTROL: 17,
    ALT: 18,
    PAUSE: 19,
    CAPS_LOCK: 20,
    ESCAPE: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    PRINT_SCREEN: 44,
    INSERT: 45,
    DELETE: 46,
    ZERO: 48,
    ONE: 49,
    TWO: 50,
    THREE: 51,
    FOUR: 52,
    FIVE: 53,
    SIX: 54,
    SEVEN: 55,
    EIGHT: 56,
    NINE: 57,
    SEMICOLON: 59,
    EQUALS: 61,
    COMMAND: 91,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    CONTEXT_MENU: 93,
    NUMPAD0: 96,
    NUMPAD1: 97,
    NUMPAD2: 98,
    NUMPAD3: 99,
    NUMPAD4: 100,
    NUMPAD5: 101,
    NUMPAD6: 102,
    NUMPAD7: 103,
    NUMPAD8: 104,
    NUMPAD9: 105,
    MULTIPLY: 106,
    ADD: 107,
    SEPARATOR: 108,
    SUBTRACT: 109,
    DECIMAL: 110,
    DIVIDE: 111,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    F13: 124,
    F14: 125,
    F15: 126,
    F16: 127,
    F17: 128,
    F18: 129,
    F19: 130,
    F20: 131,
    F21: 132,
    F22: 133,
    F23: 134,
    F24: 135,
    NUM_LOCK: 144,
    SCROLL_LOCK: 145,
    COMMA: 188,
    PERIOD: 190,
    SLASH: 191,
    BACK_QUOTE: 192,
    OPEN_BRACKET: 219,
    BACK_SLASH: 220,
    CLOSE_BRACKET: 221,
    QUOTE: 222,
    META: 224
  };
});


/*
@chalk overview
@name Menu

@description
A directive for creating a menu with multiple items

Menu allows for custom html templating for each item.

Since macMenu is using ngRepeat, some ngRepeat properties along with `item` are exposed on the local scope of each template instance, including:

| Variable  | Type    | Details                                                                     |
|-----------|---------|-----------------------------------------------------------------------------|
| `$index`  | Number  | iterator offset of the repeated element (0..length-1)                       |
| `$first`  | Boolean | true if the repeated element is first in the iterator.                      |
| `$middle` | Boolean | true if the repeated element is between the first and last in the iterator. |
| `$last`   | Boolean | true if the repeated element is last in the iterator.                       |
| `$even`   | Boolean | true if the iterator position `$index` is even (otherwise false).           |
| `$odd`    | Boolean | true if the iterator position `$index` is odd (otherwise false).            |
| `item`    | Object  | item object                                                                 |

To use custom templating
```
<mac-menu>
  <span> {{item.label}} </span>
</mac-menu>
```

Template default to `{{item.label}}` if not defined

@param {Expression} mac-menu-items List of items to display in the menu
        Each item should have a `label` key as display text
@param {Function} mac-menu-select Callback on select
- `index` - {Integer} Item index
@param {Object} mac-menu-style Styles apply to the menu
@param {Expression} mac-menu-index Index of selected item
 */
angular.module("Mac").directive("macMenu", [
  function() {
    return {
      restrict: "EA",
      replace: true,
      template: "<div ng-style=\"style\" class=\"mac-menu\"><ul><li mac-menu-transclude=\"mac-menu-transclude\" ng-repeat=\"item in items\" ng-click=\"selectItem($index)\" ng-class=\"{'active': $index == index}\" ng-mouseenter=\"setIndex($index)\" class=\"mac-menu-item\"></li></ul></div>",
      transclude: true,
      controller: angular.noop,
      scope: {
        items: "=macMenuItems",
        style: "=macMenuStyle",
        select: "&macMenuSelect",
        pIndex: "=macMenuIndex"
      },
      link: function($scope, element, attrs, ctrls) {
        $scope.selectItem = function(index) {
          return $scope.select({
            index: index
          });
        };
        $scope.setIndex = function(index) {
          $scope.index = index;
          if (attrs.macMenuIndex != null) {
            return $scope.pIndex = parseInt(index);
          }
        };
        if (attrs.macMenuIndex != null) {
          $scope.$watch("pIndex", function(value) {
            return $scope.index = parseInt(value);
          });
        }
        return $scope.$watch("items.length", function(value) {
          if (!!value) {
            return attrs.$addClass("visible");
          } else {
            return attrs.$removeClass("visible");
          }
        });
      }
    };
  }
]).directive("macMenuTransclude", [
  "$compile", function($compile) {
    return {
      link: function($scope, element, attrs, ctrls, transclude) {
        return transclude($scope, function(clone) {
          element.empty();
          if (clone.length === 0) {
            clone = $compile("<span>{{item.label}}</span>")($scope);
          }
          return element.append(clone);
        });
      }
    };
  }
]);


/*
@chalk overview
@name mac-modal (element)
@description
Element directive to define the modal dialog. Modal content is transcluded into a
modal template

@param {Boolean} mac-modal-keyboard      Allow closing modal with keyboard (default false)
@param {Boolean} mac-modal-overlay-close Allow closing modal when clicking on overlay (default false)
@param {Boolean} mac-modal-resize        Allow modal to resize on window resize event (default true)
@param {Integer} mac-modal-topOffset     Top offset when the modal is larger than window height (default 20)
@param {Expr}    mac-modal-open          Callback when the modal is opened
@param {Expr}    mac-modal-before-show   Callback before showing the modal
@param {Expr}    mac-modal-after-show    Callback when modal is visible with CSS transitions completed
@param {Expr}    mac-modal-before-hide   Callback before hiding the modal
@param {Expr}    mac-modal-after-hide    Callback when modal is hidden from the user with CSS transitions completed
@param {Boolean} mac-modal-position      Calculate size and position with JS (default true)
 */
angular.module("Mac").directive("macModal", [
  "$parse", "modal", "modalViews", "util", function($parse, modal, modalViews, util) {
    return {
      restrict: "E",
      template: modal.modalTemplate,
      replace: true,
      transclude: true,
      link: function($scope, element, attrs, controller, transclude) {
        var callback, key, opts, regId, registerModal, _i, _len, _ref;
        transclude($scope, function(clone) {
          return angular.element(element[0].getElementsByClassName("mac-modal-content-wrapper")).replaceWith(clone);
        });
        opts = util.extendAttributes("macModal", modalViews.defaults, attrs);
        regId = null;
        if (opts.overlayClose) {
          element.on("click", function($event) {
            if (angular.element($event.target).hasClass("mac-modal-overlay")) {
              return $scope.$apply(function() {
                return modal.hide();
              });
            }
          });
        }
        _ref = ["beforeShow", "afterShow", "beforeHide", "afterHide", "open"];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          callback = _ref[_i];
          key = "macModal" + (util.capitalize(callback));
          opts[callback] = $parse(attrs[key]) || angular.noop;
        }
        registerModal = function(id) {
          if ((id != null) && id) {
            regId = id;
            return modal.register(id, element, opts);
          }
        };
        if (attrs.id) {
          registerModal(attrs.id);
        } else {
          attrs.$observe("macModal", function(id) {
            return registerModal(id);
          });
        }
        return $scope.$on("$destroy", function() {
          if (regId) {
            return modal.unregister(regId);
          }
        });
      }
    };
  }
]).directive("macModal", [
  "$parse", "modal", function($parse, modal) {
    return {
      restrict: "A",
      link: function($scope, element, attrs) {
        if (!attrs.macModal) {
          return;
        }
        element.bind("click", function() {
          return $scope.$apply(function() {
            var data;
            data = $parse(attrs.macModalData)($scope) || {};
            return modal.show(attrs.macModal, {
              data: data,
              scope: $scope
            });
          });
        });
      }
    };
  }
]).directive("macModalClose", [
  "modal", function(modal) {
    return {
      restrict: "A",
      link: function($scope, element, attrs) {
        return element.bind("click", function() {
          return $scope.$apply(function() {
            return modal.hide();
          });
        });
      }
    };
  }
]);


/*
@chalk overview
@name Placeholder

@description
Dynamically fill out the placeholder text of input

@param {String} mac-placeholder Variable that contains the placeholder text
 */
angular.module("Mac").directive("macPlaceholder", function() {
  return {
    restrict: "A",
    link: function($scope, element, attrs) {
      return $scope.$watch(attrs.macPlaceholder, function(value) {
        return attrs.$set("placeholder", value);
      });
    }
  };
});


/*
@chalk
@name mac-popover (attribute)
@description
Mac popover trigger directive. Without using mac-popover-child-popover, the last
popover will be closed automatically

@param {String}  mac-popover               ID of the popover to show
@param {Boolean} mac-popover-fixed         Determine if the popover is fixed
@param {Boolean} mac-popover-child-popover If the popover is child of another popover (default false)
@param {Integer} mac-popover-offset-x      Extra x offset (default 0)
@param {Integer} mac-popover-offset-y      Extra y offset (default 0)
@param {String}  mac-popover-trigger       Trigger option, click | hover | focus (default click)
- click: Popover only opens when user click on trigger
- hover: Popover shows when user hover on trigger
- focus: Popover shows when focus on input element
@param {String}  mac-popover-exclude       CSV of popover id that can't be shown at the same time
 */
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module("Mac").directive("macPopover", [
  "$timeout", "popover", "util", "popoverViews", function($timeout, popover, util, popoverViews) {
    return {
      restrict: "A",
      link: function(scope, element, attrs) {
        var clearDelays, closeDelayId, delayId, exclude, excludeList, hide, options, show;
        options = util.extendAttributes("macPopover", popoverViews.defaults, attrs);
        exclude = attrs.macPopoverExclude || "";
        excludeList = exclude ? exclude.split(",") : [];
        delayId = null;
        closeDelayId = null;
        clearDelays = function() {
          if (delayId != null) {
            $timeout.cancel(delayId);
          }
          if (closeDelayId != null) {
            return $timeout.cancel(closeDelayId);
          }
        };
        show = function(id, delay) {
          if (delay == null) {
            delay = 0;
          }
          clearDelays();
          delayId = $timeout(function() {
            var last, _ref;
            last = popover.last();
            if ((last != null) && (!excludeList.length || (_ref = last.id, __indexOf.call(excludeList, _ref) >= 0) || last.id === id)) {
              popover.hide();
              if (element[0] === last.element[0]) {
                return true;
              }
            }
            options.scope = scope;
            return popover.show(id, element, options);
          }, delay);
          return true;
        };
        hide = function(element, delay) {
          if (delay == null) {
            delay = 0;
          }
          clearDelays();
          return closeDelayId = $timeout(function() {
            return popover.hide(element);
          }, delay);
        };
        return attrs.$observe("macPopover", function(id) {
          var hideEvent, showEvent;
          if (!id) {
            return;
          }
          if (options.trigger === "click") {
            return element.bind("click", function() {
              return show(id, 0);
            });
          } else {
            showEvent = options.trigger === "focus" ? "focusin" : "mouseenter";
            hideEvent = options.trigger === "focus" ? "focusout" : "mouseleave";
            element.bind(showEvent, function() {
              return show(id, 400);
            });
            return element.bind(hideEvent, function() {
              return hide(element, 500);
            });
          }
        });
      }
    };
  }
]).directive("macPopover", [
  "popover", "popoverViews", "util", function(popover, popoverViews, util) {
    return {
      restrict: "E",
      compile: function(element, attrs) {
        var opts;
        if (!attrs.id) {
          throw Error("macPopover: Missing id");
        }
        opts = util.extendAttributes("macPopover", popoverViews.popoverDefaults, attrs);
        angular.extend(opts, {
          template: element.html()
        });
        element.replaceWith(document.createComment("macPopover: " + attrs.id));
        return function($scope, element, attrs) {
          return attrs.$observe("id", function(value) {
            return popover.register(value, opts);
          });
        };
      }
    };
  }
]).directive("macPopoverFillContent", [
  "$compile", function($compile) {
    return {
      restrict: "A",
      link: function($scope, element, attrs) {
        element.html($scope.macPopoverTemplate);
        return $compile(element.contents())($scope);
      }
    };
  }
]);


/*
@chalk overview
@name mac-scroll-spy

@description
Element to spy scroll event on

@param {Integer} mac-scroll-spy-offset Top offset when calculating scroll position
 */
angular.module("Mac").directive("macScrollSpy", [
  "$window", "scrollSpy", "scrollSpyDefaults", "util", function($window, scrollSpy, defaults, util) {
    return {
      link: function($scope, element, attrs) {
        var options, spyElement;
        options = util.extendAttributes("macScrollSpy", defaults, attrs);
        spyElement = element[0].tagName === "BODY" ? angular.element($window) : element;
        return spyElement.bind("scroll", function($event) {
          var anchors, i, maxScroll, scrollHeight, scrollTop, _i, _ref;
          scrollTop = spyElement.scrollTop() + options.offset;
          scrollHeight = this.scrollHeight || element[0].scrollHeight;
          maxScroll = scrollHeight - spyElement.height();
          if (!scrollSpy.registered.length) {
            return true;
          }
          if (scrollTop >= maxScroll) {
            return scrollSpy.setActive(scrollSpy.last());
          }
          for (i = _i = 0, _ref = scrollSpy.registered.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            anchors = scrollSpy.registered;
            if (scrollSpy.active.id !== anchors[i].id && scrollTop >= anchors[i].top && (!anchors[i + 1] || scrollTop <= anchors[i + 1].top)) {
              $scope.$apply(function() {
                return scrollSpy.setActive(anchors[i]);
              });
              return true;
            }
          }
        });
      }
    };
  }
]).directive("macScrollSpyAnchor", [
  "scrollSpy", function(scrollSpy) {
    return {
      link: function($scope, element, attrs) {
        var id, observeKey, registered, registering;
        id = attrs.id || attrs.macScrollSpyAnchor;
        registered = false;
        if (!id) {
          throw new Error("Missing scroll spy anchor id");
        }
        registering = function() {
          scrollSpy.register(id, element);
          if (!registered) {
            $scope.$on("$destroy", function() {
              return scrollSpy.unregister(id);
            });
          }
          return registered = true;
        };
        $scope.$on("refresh-scroll-spy", registering);
        if (/{{(.*)}}/.test(id)) {
          observeKey = attrs.id ? "id" : "macScrollSpyAnchor";
          return attrs.$observe(observeKey, function(value) {
            if ((value != null) && value) {
              id = value;
              return registering();
            }
          });
        } else {
          return registering();
        }
      }
    };
  }
]).directive("macScrollSpyTarget", [
  "scrollSpy", function(scrollSpy) {
    return {
      link: function($scope, element, attrs) {
        var highlightClass, register, registered, target;
        target = attrs.macScrollSpyTarget;
        highlightClass = attrs.macScrollSpyTargetClass || "active";
        registered = false;
        if (!target) {
          throw new Error("Missing scroll spy target name");
        }
        register = function(id) {
          var callback;
          if (!id) {
            return;
          }
          callback = function(active) {
            var action;
            action = id === active.id ? "addClass" : "removeClass";
            return element[action](highlightClass);
          };
          if (scrollSpy.active != null) {
            callback(scrollSpy.active);
          }
          if (!registered) {
            scrollSpy.addListener(callback);
            return $scope.$on("$destroy", function() {
              return scrollSpy.removeListener(callback);
            });
          }
        };
        if (/{{(.*)}}/.test(target)) {
          return attrs.$observe("macScrollSpyTarget", function(value) {
            return register(value);
          });
        } else {
          return register(target);
        }
      }
    };
  }
]);


/*
@chalk overview
@name Spinner

@description
A directive for generating spinner

@param {Integer} mac-spinner-size The size of the spinner (default 16)
@param {Integer} mac-spinner-z-index The z-index (default inherit)
@param {String}  mac-spinner-color Color of all the bars (default #2f3035)
 */
angular.module("Mac").directive("macSpinner", [
  "util", function(util) {
    return {
      restrict: "E",
      replace: true,
      template: "<div class=\"mac-spinner\"></div>",
      compile: function(element, attrs) {
        var animateCss, bar, degree, delay, i, prefixes, styl, transformCss, vendor, _i;
        prefixes = ["webkit", "Moz", "ms", "O"];
        vendor = function(el, name) {
          var prefix, _i, _len;
          name = util.capitalize(name);
          for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
            prefix = prefixes[_i];
            if (el.style[prefix + name] != null) {
              return prefix + name;
            }
          }
          return name;
        };
        animateCss = vendor(element[0], "animation");
        transformCss = vendor(element[0], "transform");
        for (i = _i = 0; _i <= 9; i = ++_i) {
          delay = i * 0.1 - 1 + (!i);
          degree = i * 36;
          styl = {};
          bar = angular.element("<div class=\"bar\"></div>");
          styl[animateCss] = "fade 1s linear infinite " + delay + "s";
          styl[transformCss] = "rotate(" + degree + "deg) translate(0, 130%)";
          bar.css(styl);
          element.append(bar);
        }
        return function($scope, element, attrs) {
          var bars, defaults, setSpinnerSize;
          defaults = {
            size: 16,
            zIndex: "inherit",
            color: "#2f3035"
          };
          bars = angular.element(element[0].getElementsByClassName("bar"));
          setSpinnerSize = function(size) {
            bars.css({
              height: size * 0.32 + "px",
              left: size * 0.445 + "px",
              top: size * 0.37 + "px",
              width: size * 0.13 + "px",
              borderRadius: size * 0.32 * 2 + "px",
              position: "absolute"
            });
            if (!isNaN(+size) && angular.isNumber(+size)) {
              size = "" + size + "px";
            }
            return element.css({
              height: size,
              width: size
            });
          };
          if (attrs.macSpinnerSize != null) {
            attrs.$observe("macSpinnerSize", function(value) {
              if ((value != null) && value) {
                return setSpinnerSize(value);
              }
            });
          } else {
            setSpinnerSize(defaults.size);
          }
          attrs.$observe("macSpinnerZIndex", function(value) {
            if ((value != null) && value) {
              return element.css("z-index", value);
            }
          });
          if (attrs.macSpinnerColor != null) {
            return attrs.$observe("macSpinnerColor", function(value) {
              if ((value != null) && value) {
                return bars.css("background", value);
              }
            });
          } else {
            return bars.css("background", defaults.color);
          }
        };
      }
    };
  }
]);


/*
@chalk overview
@name Tag Autocomplete

@description
A directive for generating tag input with autocomplete support on text input.
Tag autocomplete has priority 800

@dependencies
- mac-autocomplete
- mac-menu

@param {String}  mac-tag-autocomplete-url         Url to fetch autocomplete dropdown list data.
mac-tag-autocomplete-url and mac-tag-autocomplete-source cannot be used together. Url
will always take priority over mac-tag-autocomplete-source.
@param {String}  mac-tag-autocomplete-source      Data to use.
Source support multiple types:
- Array: An array can be used for local data and there are two supported formats:
  - An array of strings: ["Item1", "Item2"]
  - An array of objects with mac-autocomplete-label key: [{name:"Item1"}, {name:"Item2"}]
- String: Using a string as the source is the same as passing the variable into mac-autocomplete-url
- Function: A callback when querying for data. The callback receive two arguments:
  - {String} Value currently in the text input
  - {Function} A response callback which expects a single argument, data to user. The data will be
  populated on the menu and the menu will adjust accordingly
@param {String}  mac-tag-autocomplete-value       The value to be sent back upon selection (default "id")
@param {String}  mac-tag-autocomplete-label       The label to display to the users (default "name")
@param {Expr}    mac-tag-autocomplete-model       Model for autocomplete
@param {Array}   mac-tag-autocomplete-selected    The list of elements selected by the user (required)
@param {String}  mac-tag-autocomplete-query       The query parameter on GET command (defualt "q")
@param {Integer} mac-tag-autocomplete-delay       Time delayed on fetching autocomplete data after keyup  (default 800)
@param {String}  mac-tag-autocomplete-placeholder Placeholder text of the text input (default "")
@param {Boolean} mac-tag-autocomplete-disabled    If autocomplete is enabled or disabled (default false)
@param {Expr}    mac-tag-autocomplete-on-enter    When autocomplete is disabled, this function is called on enter, Should return either string, object or boolean. If false, item is not added
- `item` - {String} User input
@param {String}  mac-tag-autocomplete-events      A CSV list of events to attach functions to
@param {Expr}    mac-tag-autocomplete-on-         Function to be called when specified event is fired
- `event` - {Object} jQuery event
- `value` - {String} Value in the input text

@param {Event} mac-tag-autocomplete-clear-input $broadcast message; clears text input when received
 */
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module("Mac").directive("macTagAutocomplete", [
  "$parse", "$timeout", "keys", "util", function($parse, $timeout, keys, util) {
    return {
      restrict: "E",
      template: "<div ng-click=\"focusTextInput()\" class=\"mac-tag-autocomplete\"><ul class=\"mac-tag-list\"><li ng-repeat=\"tag in selected\" class=\"mac-tag mac-label\"><div ng-click=\"selected.splice($index, 1)\" class=\"mac-tag-close\">&times;</div><span class=\"tag-label\">{{getTagLabel(tag)}}</span></li><li ng-class=\"{'fullwidth': !selected.length}\" class=\"mac-tag mac-input-tag\"><mac-autocomplete ng-model=\"textInput\" mac-autocomplete-disabled=\"disabled\" mac-autocomplete-on-select=\"onSelect(selected)\" mac-autocomplete-on-success=\"onSuccess(data)\" mac-placeholder=\"autocompletePlaceholder\" ng-keydown=\"onKeyDown($event)\" class=\"text-input mac-autocomplete\"></mac-autocomplete></li></ul></div>",
      replace: true,
      priority: 800,
      scope: {
        url: "=macTagAutocompleteUrl",
        placeholder: "=macTagAutocompletePlaceholder",
        selected: "=macTagAutocompleteSelected",
        source: "=macTagAutocompleteSource",
        disabled: "=macTagAutocompleteDisabled",
        model: "=macTagAutocompleteModel",
        onEnter: "&macTagAutocompleteOnEnter",
        onKeydown: "&macTagAutocompleteOnKeydown"
      },
      compile: function(element, attrs) {
        var attrsObject, delay, labelGetter, labelKey, queryKey, textInput, useSource, valueGetter, valueKey;
        valueKey = attrs.macTagAutocompleteValue;
        if (valueKey == null) {
          valueKey = "id";
        }
        valueGetter = $parse(valueKey);
        labelKey = attrs.macTagAutocompleteLabel;
        if (labelKey == null) {
          labelKey = "name";
        }
        labelGetter = $parse(labelKey);
        queryKey = attrs.macTagAutocompleteQuery || "q";
        delay = +attrs.macTagAutocompleteDelay || 800;
        useSource = false;
        textInput = angular.element(element[0].getElementsByClassName("mac-autocomplete"));
        attrsObject = {
          "mac-autocomplete-label": labelKey,
          "mac-autocomplete-query": queryKey,
          "mac-autocomplete-delay": delay
        };
        if (attrs.macTagAutocompleteUrl != null) {
          attrsObject["mac-autocomplete-url"] = "url";
        } else if (useSource = attrs.macTagAutocompleteSource != null) {
          attrsObject["mac-autocomplete-source"] = "autocompleteSource";
        }
        textInput.attr(attrsObject);
        return function($scope, element, attrs) {
          var updateAutocompleteSource, watchFn;
          $scope.textInput = "";
          $scope.autocompleteSource = angular.isArray($scope.source) ? [] : $scope.source;
          if (attrs.macTagAutocompleteModel != null) {
            $scope.$watch("textInput", function(value) {
              return $scope.model = value;
            });
            $scope.$watch("model", function(value) {
              return $scope.textInput = value;
            });
          }
          $scope.focusTextInput = function() {
            var textInputDOM;
            textInputDOM = element[0].getElementsByClassName("mac-autocomplete");
            return textInputDOM[0].focus();
          };
          $scope.getTagLabel = function(tag) {
            if (labelKey) {
              return labelGetter(tag);
            } else {
              return tag;
            }
          };
          $timeout(function() {
            var capitalized, eventFn, events, name, _i, _len, _ref, _results;
            if ((events = attrs.macTagAutocompleteEvents)) {
              textInput = angular.element(element[0].getElementsByClassName("text-input"));
              _ref = events.split(",");
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                name = _ref[_i];
                name = util.trim(name);
                capitalized = util.capitalize(name);
                eventFn = attrs["macTagAutocompleteOn" + capitalized];
                if (!(eventFn && name !== "keydown")) {
                  continue;
                }
                _results.push((function(name, eventFn) {
                  return textInput.bind(name, function($event) {
                    var expression;
                    expression = $parse(eventFn);
                    return $scope.$apply(function() {
                      return expression($scope.$parent, {
                        $event: $event,
                        item: $scope.textInput
                      });
                    });
                  });
                })(name, eventFn));
              }
              return _results;
            }
          }, 0, false);
          updateAutocompleteSource = function() {
            var difference, item, selectedValues, sourceValues, _ref;
            $scope.autocompletePlaceholder = ((_ref = $scope.selected) != null ? _ref.length : void 0) ? "" : $scope.placeholder;
            if (!(useSource && angular.isArray($scope.source))) {
              $scope.autocompleteSource = $scope.source;
              return;
            }
            sourceValues = (function() {
              var _i, _len, _ref1, _results;
              _ref1 = $scope.source || [];
              _results = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                item = _ref1[_i];
                _results.push(valueGetter(item));
              }
              return _results;
            })();
            selectedValues = (function() {
              var _i, _len, _ref1, _results;
              _ref1 = $scope.selected || [];
              _results = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                item = _ref1[_i];
                _results.push(valueGetter(item));
              }
              return _results;
            })();
            difference = (function() {
              var _i, _len, _results;
              _results = [];
              for (_i = 0, _len = sourceValues.length; _i < _len; _i++) {
                item = sourceValues[_i];
                if (__indexOf.call(selectedValues, item) < 0) {
                  _results.push(item);
                }
              }
              return _results;
            })();
            return $scope.autocompleteSource = (function() {
              var _i, _len, _ref1, _ref2, _results;
              _ref1 = $scope.source || [];
              _results = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                item = _ref1[_i];
                if (_ref2 = valueGetter(item), __indexOf.call(difference, _ref2) >= 0) {
                  _results.push(item);
                }
              }
              return _results;
            })();
          };
          if (useSource) {
            watchFn = angular.isArray($scope.source) ? "$watchCollection" : "$watch";
            $scope[watchFn]("source", updateAutocompleteSource);
          }
          $scope.$watchCollection("selected", updateAutocompleteSource);
          $scope.onKeyDown = function($event) {
            var stroke, _base;
            stroke = $event.which || $event.keyCode;
            switch (stroke) {
              case keys.BACKSPACE:
                if (!$scope.textInput) {
                  if (typeof (_base = $scope.selected).pop === "function") {
                    _base.pop();
                  }
                }
                break;
              case keys.ENTER:
                if ($scope.textInput.length > 0 && $scope.disabled) {
                  $scope.onSelect($scope.textInput);
                }
            }
            if (attrs.macTagAutocompleteOnKeydown != null) {
              if (typeof $scope.onKeydown === "function") {
                $scope.onKeydown({
                  $event: $event,
                  value: $scope.textInput
                });
              }
            }
            return true;
          };
          $scope.onSuccess = function(data) {
            var existingValues, item;
            existingValues = (function() {
              var _i, _len, _ref, _results;
              _ref = $scope.selected || [];
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                item = _ref[_i];
                _results.push(valueGetter(item));
              }
              return _results;
            })();
            return (function() {
              var _i, _len, _ref, _ref1, _results;
              _ref = data.data;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                item = _ref[_i];
                if (_ref1 = valueGetter(item) || item, __indexOf.call(existingValues, _ref1) < 0) {
                  _results.push(item);
                }
              }
              return _results;
            })();
          };
          $scope.onSelect = function(item) {
            if (attrs.macTagAutocompleteOnEnter != null) {
              item = $scope.onEnter({
                item: item
              });
            }
            if (item) {
              $scope.selected.push(item);
            }
            return $timeout(function() {
              return $scope.textInput = "";
            }, 0);
          };
          return $scope.$on("mac-tag-autocomplete-clear-input", function() {
            return $scope.textInput = "";
          });
        };
      }
    };
  }
]);


/*
@chalk overview
@name Time
@description
A directive for creating a time input field. Time input can use any `ng-` attributes support by text input type.

@param {String} ng-model         Assignable angular expression to data-bind to
Clearing model by setting it to null or '' will set model back to default value
@param {String} name             Property name of the form under which the control is published
@param {String} required         Adds `required` validation error key if the value is not entered.
@param {String} ng-required      Adds `required` attribute and `required` validation constraint to
 the element when the ngRequired expression evaluates to true. Use `ngRequired` instead of
 `required` when you want to data-bind to the `required` attribute.
@param {String} ng-pattern      Sets `pattern` validation error key if the value does not match the
 RegExp pattern expression. Expected value is `/regexp/` for inline patterns or `regexp` for
   patterns defined as scope expressions.
@param {String} ng-change       Angular expression to be executed when input changes due to user interaction with the input element.
@param {String} ng-disabled     Enable or disable time input

@param {String} mac-time-default If model is undefined, use this as the starting value (default 12:00 PM)
 */
angular.module("Mac").directive("macTime", [
  "$filter", "$timeout", "keys", "util", function($filter, $timeout, keys, util) {
    var defaults;
    defaults = {
      "default": "12:00 AM"
    };
    return {
      restrict: "E",
      require: "ngModel",
      replace: true,
      template: "<input type=\"text\" maxlength=\"8\" class=\"mac-date-time\"/>",
      link: function($scope, element, attrs, ngModelCtrl) {
        var getSelection, incrementHour, incrementMinute, initializeTime, opts, selectHours, selectMeridian, selectMinutes, selectNextSection, selectPreviousSection, selectRange, setMeridian, time, timeValidator, toggleMeridian, updateInput, updateTime;
        opts = util.extendAttributes("macTime", defaults, attrs);
        time = null;
        if (!attrs.placeholder) {
          attrs.$set("placeholder", "--:--");
        }
        timeValidator = function(value) {
          if (!value || util.timeRegex.exec(value)) {
            ngModelCtrl.$setValidity("time", true);
            return value;
          } else {
            ngModelCtrl.$setValidity("time", false);
            return void 0;
          }
        };
        ngModelCtrl.$formatters.push(timeValidator);
        ngModelCtrl.$parsers.push(timeValidator);
        (initializeTime = function() {
          var currentDate;
          currentDate = new Date().toDateString();
          time = new Date(currentDate + " " + opts["default"]);
          if (isNaN(time.getTime())) {
            return time = new Date(currentDate + " " + defaults["default"]);
          }
        })();
        getSelection = function() {
          var start;
          start = element[0].selectionStart;
          switch (false) {
            case !((0 <= start && start < 3)):
              return "hour";
            case !((3 <= start && start < 6)):
              return "minute";
            case !((6 <= start && start < 9)):
              return "meridian";
          }
        };
        selectRange = function(start, end) {
          return $timeout(function() {
            return element[0].setSelectionRange(start, end);
          }, 0, false);
        };
        selectHours = function() {
          return selectRange(0, 2);
        };
        selectMinutes = function() {
          return selectRange(3, 5);
        };
        selectMeridian = function() {
          return selectRange(6, 8);
        };
        selectNextSection = function() {
          switch (getSelection()) {
            case "hour":
              return selectMinutes();
            case "minute":
            case "meridian":
              return selectMeridian();
          }
        };
        selectPreviousSection = function() {
          switch (getSelection()) {
            case "hour":
            case "minute":
              return selectHours();
            case "meridian":
              return selectMinutes();
          }
        };
        setMeridian = function(meridian) {
          var hours;
          hours = time.getHours();
          if (hours >= 12 && meridian === "AM") {
            hours -= 12;
          }
          if (hours < 12 && meridian === "PM") {
            hours += 12;
          }
          return time.setHours(hours);
        };
        toggleMeridian = function() {
          var hours;
          hours = time.getHours();
          return time.setHours((hours + 12) % 24);
        };
        incrementHour = function(change) {
          return time.setHours(time.getHours() + change);
        };
        incrementMinute = function(change) {
          return time.setMinutes(time.getMinutes() + change);
        };
        updateInput = function() {
          var displayTime;
          displayTime = $filter("date")(time.getTime(), "hh:mm a");
          if (displayTime !== ngModelCtrl.$viewValue) {
            ngModelCtrl.$setViewValue(displayTime);
            return ngModelCtrl.$render();
          }
        };
        updateTime = function() {
          var hours, meridian, minutes, timeMatch;
          if (timeMatch = util.timeRegex.exec(ngModelCtrl.$modelValue)) {
            hours = +timeMatch[1];
            minutes = +timeMatch[2];
            meridian = timeMatch[3];
            if (meridian === "PM" && hours !== 12) {
              hours += 12;
            }
            if (meridian === "AM" && hours === 12) {
              hours = 0;
            }
            return time.setHours(hours, minutes);
          }
        };
        element.on('blur', function(event) {
          return $scope.$apply(function() {
            return updateInput();
          });
        });
        element.on('click', function(event) {
          return $scope.$apply(function() {
            updateTime();
            updateInput();
            switch (getSelection()) {
              case "hour":
                return selectHours();
              case "minute":
                return selectMinutes();
              case "meridian":
                return selectMeridian();
            }
          });
        });
        element.on('keydown', function(event) {
          var key;
          key = event.which;
          if (key !== keys.UP && key !== keys.DOWN && key !== keys.LEFT && key !== keys.RIGHT && key !== keys.A && key !== keys.P) {
            return true;
          }
          event.preventDefault();
          return $scope.$apply(function() {
            var change, meridianSelected;
            switch (key) {
              case keys.UP:
              case keys.DOWN:
                change = key === keys.UP ? 1 : -1;
                switch (getSelection()) {
                  case "hour":
                    incrementHour(change);
                    selectHours();
                    break;
                  case "minute":
                    incrementMinute(change);
                    selectMinutes();
                    break;
                  case "meridian":
                    toggleMeridian();
                    selectMeridian();
                }
                return updateInput();
              case keys.LEFT:
              case keys.RIGHT:
                switch (key) {
                  case keys.LEFT:
                    selectPreviousSection();
                    break;
                  case keys.RIGHT:
                    selectNextSection();
                }
                return updateInput();
              case keys.A:
              case keys.P:
                meridianSelected = getSelection() === "meridian";
                switch (false) {
                  case !(meridianSelected && key === keys.A):
                    setMeridian("AM");
                    break;
                  case !(meridianSelected && key === keys.P):
                    setMeridian("PM");
                }
                updateInput();
                return selectMeridian();
            }
          });
        });
        return element.on('keyup', function(event) {
          var key;
          key = event.which;
          if (!((keys.NUMPAD0 <= key && key <= keys.NUMPAD9) || (keys.ZERO <= key && key <= keys.NINE))) {
            event.preventDefault();
          }
          return $scope.$apply(function() {
            return updateTime();
          });
        });
      }
    };
  }
]);


/*
@chalk overview
@name Tooltip

@description
Tooltip directive

@param {String}  mac-tooltip           Text to show in tooltip
@param {String}  mac-tooltip-direction Direction of tooltip (default 'top')
@param {String}  mac-tooltip-trigger   How tooltip is triggered (default 'hover')
@param {Boolean} mac-tooltip-inside    Should the tooltip be appended inside element (default false)
@param {Expr}    mac-tooltip-disabled  Disable and enable tooltip
 */

/*
NOTE: This directive does not use $animate to append and remove DOM element or
  add and remove classes in order to optimize showing tooltips by eliminating
  the need for firing a $digest cycle.
 */
angular.module("Mac").directive("macTooltip", [
  "$timeout", "util", function($timeout, util) {
    return {
      restrict: "A",
      link: function(scope, element, attrs) {
        var defaults, disabled, enabled, opts, removeTip, showTip, text, toggle, tooltip;
        tooltip = null;
        text = "";
        enabled = false;
        disabled = false;
        defaults = {
          direction: "top",
          trigger: "hover",
          inside: false
        };
        opts = util.extendAttributes("macTooltip", defaults, attrs);
        showTip = function() {
          var elementSize, offset, tip, tooltipSize;
          if (disabled || !text) {
            return true;
          }
          tip = opts.inside ? element : angular.element(document.body);
          removeTip(0);
          tooltip = angular.element("<div class=\"mac-tooltip " + opts.direction + "\"><div class=\"tooltip-message\">" + text + "</div></div>");
          tip.append(tooltip);
          offset = opts.inside ? {
            top: 0,
            left: 0
          } : element.offset();
          elementSize = {
            width: element.outerWidth(),
            height: element.outerHeight()
          };
          tooltipSize = {
            width: tooltip.outerWidth(),
            height: tooltip.outerHeight()
          };
          switch (opts.direction) {
            case "bottom":
            case "top":
              offset.left += elementSize.width / 2.0 - tooltipSize.width / 2.0;
              break;
            case "left":
            case "right":
              offset.top += elementSize.height / 2.0 - tooltipSize.height / 2.0;
          }
          switch (opts.direction) {
            case "bottom":
              offset.top += elementSize.height;
              break;
            case "top":
              offset.top -= tooltipSize.height;
              break;
            case "left":
              offset.left -= tooltipSize.width;
              break;
            case "right":
              offset.left += elementSize.width;
          }
          offset.top = Math.max(0, offset.top);
          offset.left = Math.max(0, offset.left);
          angular.forEach(offset, function(value, key) {
            if (!isNaN(+value) && angular.isNumber(+value)) {
              value = "" + value + "px";
            }
            return tooltip.css(key, value);
          });
          tooltip.addClass("visible");
          return true;
        };
        removeTip = function(delay) {
          if (delay == null) {
            delay = 100;
          }
          if (tooltip != null) {
            tooltip.removeClass("visible");
            $timeout(function() {
              if (tooltip != null) {
                tooltip.remove();
              }
              return tooltip = null;
            }, delay, false);
          }
          return true;
        };
        toggle = function() {
          if (tooltip != null) {
            return removeTip();
          } else {
            return showTip();
          }
        };
        attrs.$observe("macTooltip", function(value) {
          var _ref;
          if (value != null) {
            text = value;
            if (!enabled) {
              if ((_ref = opts.trigger) !== "hover" && _ref !== "click") {
                throw "Invalid trigger";
              }
              switch (opts.trigger) {
                case "click":
                  element.bind("click", toggle);
                  break;
                case "hover":
                  element.bind("mouseenter", showTip);
                  element.bind("mouseleave click", function() {
                    return removeTip();
                  });
              }
              return enabled = true;
            }
          }
        });
        if (attrs.macTooltipDisabled != null) {
          scope.$watch(attrs.macTooltipDisabled, function(value) {
            return disabled = value;
          });
        }
        return scope.$on("$destroy", function() {
          if (tooltip != null) {
            return removeTip(0);
          }
        });
      }
    };
  }
]);

angular.module("Mac").filter("boolean", function() {
  return function(boolean, trueString, falseString) {
    if (trueString == null) {
      trueString = "true";
    }
    if (falseString == null) {
      falseString = "false";
    }
    if (boolean) {
      return trueString;
    } else {
      return falseString;
    }
  };
});

angular.module("Mac").filter("true", function() {
  return function(boolean, trueString) {
    if (trueString == null) {
      trueString = "true";
    }
    if (boolean) {
      return trueString;
    } else {
      return "";
    }
  };
});

angular.module("Mac").filter("false", function() {
  return function(boolean, falseString) {
    if (falseString == null) {
      falseString = "false";
    }
    if (boolean) {
      return "";
    } else {
      return falseString;
    }
  };
});


/*
@chalk overview
@name List
@description
List filter. Use for converting arrays into a string

@param {Array} list Array of items
@param {String} separator String to separate each element of the array (default ,)
@returns {String} Formatted string
 */
angular.module("Mac").filter("list", [
  function() {
    return function(list, separator) {
      if (separator == null) {
        separator = ", ";
      }
      return list.join(separator);
    };
  }
]);


/*
@chalk overview
@name Pluralize
@description
Pluralizes the given string. It's a simple proxy to the pluralize function on util.

@param {String} string Noun to pluralize
@param {Integer} count The numer of objects
@param {Boolean} includeCount To include the number in formatted string
@returns {String} Formatted plural
 */
angular.module("Mac").filter("pluralize", [
  "util", function(util) {
    return function(string, count, includeCount) {
      if (includeCount == null) {
        includeCount = true;
      }
      return util.pluralize(string, count, includeCount);
    };
  }
]);


/*
@chalk overview
@name Timestamp filter

@description
Takes in a unix timestamp and turns it into a human-readable relative time string, like "5
minutes ago" or "just now".

@param {Unix timestamp} time The time to format
@returns {String} Formatted string
 */
angular.module("Mac").filter("timestamp", [
  "util", function(util) {
    var _createTimestamp;
    _createTimestamp = function(count, noun) {
      noun = util.pluralize(noun, count);
      return "" + count + " " + noun + " ago";
    };
    return function(time) {
      var currentTime, days, hours, minutes, months, secondsAgo, weeks, years;
      time = +time;
      currentTime = Math.round(Date.now() / 1000);
      secondsAgo = currentTime - time;
      if (secondsAgo < 45) {
        return "just now";
      } else if (secondsAgo < 120) {
        return "about a minute ago";
      } else {
        years = Math.floor(secondsAgo / (365 * 24 * 60 * 60));
        if (years > 0) {
          return _createTimestamp(years, "year");
        }
        months = Math.floor(secondsAgo / (31 * 24 * 60 * 60));
        if (months > 0) {
          return _createTimestamp(months, "month");
        }
        weeks = Math.floor(secondsAgo / (7 * 24 * 60 * 60));
        if (weeks > 0) {
          return _createTimestamp(weeks, "week");
        }
        days = Math.floor(secondsAgo / (24 * 60 * 60));
        if (days > 0) {
          return _createTimestamp(days, "day");
        }
        hours = Math.floor(secondsAgo / (60 * 60));
        if (hours > 0) {
          return _createTimestamp(hours, "hour");
        }
        minutes = Math.floor(secondsAgo / 60);
        if (minutes > 0) {
          return _createTimestamp(minutes, "min");
        }
        return "" + secondsAgo + " seconds ago";
      }
    };
  }
]);


/*
@chalk overview
@name Underscore string

@description
Proxy filter for calling underscore string function

@param {String} string String to filter
@param {String} fn Underscore function to call
@param {Parameters} params Extra parameters to pass to Underscore string
@returns {String} Formatted string
 */
var __slice = [].slice;

angular.module("Mac").filter("underscoreString", function() {
  return function() {
    var fn, params, string;
    string = arguments[0], fn = arguments[1], params = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    params.unshift(string);
    return _.string[fn].apply(this, params);
  };
});


/*
@chalk overview
@name Modal Service

@description
There are multiple components used by modal.
- A modal service is used to keep state of modal opened in the applications.
- A modal element directive to define the modal dialog box
- A modal attribute directive as a modal trigger

@param {Function} show Show a modal based on the modal id
- {String} id The id of the modal to open
- {Object} triggerOptions Additional options to open modal

@param {Function} resize Update the position and also the size of the modal
- {Modal Object} modalObject The modal to reposition and resize (default opened modal)

@param {Function} hide Hide currently opened modal
- {Function} callback Callback after modal has been hidden

@param {Function} bindingEvents Binding escape key or resize event
- {String} action Either to bind or unbind events (default "bind")

@param {Function} register Registering modal with the service
- {String} id ID of the modal
- {DOM element} element The modal element
- {Object} options Additional options for the modal

@param {Function} unregister Remove modal from modal service
- {String} id ID of the modal to unregister

@param {Function} clearWaiting Remove certain modal id from waiting list
- {String} id ID of the modal
 */
angular.module("Mac").service("modal", [
  "$rootScope", "$animate", "$templateCache", "$compile", "$http", "$controller", "modalViews", "keys", function($rootScope, $animate, $templateCache, $compile, $http, $controller, modalViews, keys) {
    return {
      registered: modalViews.registered,
      waiting: null,
      opened: null,
      modalTemplate: "<div class=\"mac-modal-overlay hide\">\n  <div class=\"mac-modal\">\n    <a mac-modal-close class=\"mac-close-modal\"></a>\n    <div class=\"mac-modal-content-wrapper\"></div>\n  </div>\n</div>",
      show: function(id, triggerOptions) {
        var modalObject, options, path, renderModal, showModal, showOptions, template;
        if (triggerOptions == null) {
          triggerOptions = {};
        }
        if ((this.registered[id] != null) && (this.opened != null)) {
          return this.hide();
        } else if (this.registered[id] != null) {
          modalObject = this.registered[id];
          options = modalObject.options;
          showOptions = {};
          angular.extend(showOptions, options, triggerOptions);
          showModal = (function(_this) {
            return function(element) {
              showOptions.beforeShow(element.scope());
              return $animate.removeClass(element, "hide", function() {
                return $animate.addClass(element, "visible", function() {
                  _this.opened = {
                    id: id,
                    element: element,
                    options: showOptions
                  };
                  _this.resize(_this.opened);
                  _this.bindingEvents();
                  showOptions.open(element.scope());
                  showOptions.afterShow(element.scope());
                  $rootScope.$broadcast("modalWasShown", id);
                  return _this.clearWaiting();
                });
              });
            };
          })(this);
          if (showOptions.moduleMethod != null) {
            renderModal = (function(_this) {
              return function(template) {
                var element, viewScope, wrapper;
                if (isScope(showOptions.scope)) {
                  viewScope = showOptions.scope;
                } else {
                  viewScope = $rootScope.$new(true);
                  if (angular.isObject(showOptions.scope)) {
                    angular.extend(viewScope, showOptions.scope);
                  }
                }
                angular.extend(showOptions.attributes, {
                  id: id
                });
                element = angular.element(_this.modalTemplate).attr(showOptions.attributes);
                wrapper = angular.element(element[0].getElementsByClassName("mac-modal-content-wrapper"));
                wrapper.html(template);
                if (showOptions.overlayClose) {
                  element.bind("click", function($event) {
                    if (angular.element($event.target).hasClass("mac-modal-overlay")) {
                      return viewScope.$apply(function() {
                        return _this.hide();
                      });
                    }
                  });
                }
                if (showOptions.controller) {
                  $controller(showOptions.controller, {
                    $scope: viewScope,
                    $element: element,
                    macModalOptions: showOptions
                  });
                }
                $animate.enter(element, angular.element(document.body));
                $compile(element)(viewScope);
                return showModal(element);
              };
            })(this);
            if ((path = showOptions.templateUrl)) {
              template = $templateCache.get(path);
              if (template) {
                return renderModal(template);
              } else {
                return $http.get(path).then(function(resp) {
                  $templateCache.put(path, resp.data);
                  return renderModal(resp.data);
                }, function() {
                  throw Error("Failed to load template: " + path);
                });
              }
            } else if ((template = showOptions.template)) {
              return renderModal(template);
            }
          } else if (modalObject.element != null) {
            return showModal(modalObject.element);
          }
        } else {
          return this.waiting = {
            id: id,
            options: triggerOptions
          };
        }
      },
      resize: function(modalObject) {
        var css, element, height, modal, options, width;
        if (modalObject == null) {
          modalObject = this.opened;
        }
        if (modalObject == null) {
          return;
        }
        element = modalObject.element;
        options = modalObject.options;
        if (!options.position) {
          return;
        }
        modal = angular.element(element[0].getElementsByClassName("mac-modal")).attr("style", "");
        height = modal.outerHeight();
        width = modal.outerWidth();
        css = angular.element(window).height() > height ? {
          marginTop: -height / 2
        } : {
          top: options.topOffset
        };
        css.marginLeft = -width / 2;
        return angular.forEach(css, function(value, key) {
          if (!isNaN(+value) && angular.isNumber(+value)) {
            value = "" + value + "px";
          }
          return modal.css(key, value);
        });
      },
      hide: function(callback) {
        var element, id, options, _ref;
        if (this.opened == null) {
          return;
        }
        _ref = this.opened, id = _ref.id, options = _ref.options, element = _ref.element;
        options.beforeHide(element.scope());
        return $animate.removeClass(element, "visible", (function(_this) {
          return function() {
            _this.bindingEvents("unbind");
            _this.opened = null;
            if (options.moduleMethod) {
              if (!isScope(options.scope)) {
                element.scope().$destroy();
              }
              $animate.leave(element);
            } else {
              $animate.addClass(element, "hide");
            }
            options.afterHide(element.scope());
            $rootScope.$broadcast("modalWasHidden", id);
            return callback && callback();
          };
        })(this));
      },
      bindingEvents: function(action) {
        var escapeKeyHandler, options, resizeHandler;
        if (action == null) {
          action = "bind";
        }
        if (!((action === "bind" || action === "unbind") && (this.opened != null))) {
          return;
        }
        escapeKeyHandler = (function(_this) {
          return function(event) {
            if (event.which === keys.ESCAPE) {
              return _this.hide();
            }
          };
        })(this);
        resizeHandler = (function(_this) {
          return function(event) {
            return _this.resize();
          };
        })(this);
        options = this.opened.options;
        if (options.keyboard) {
          angular.element(document)[action]("keydown", escapeKeyHandler);
        }
        if (options.resize) {
          return angular.element(window)[action]("resize", resizeHandler);
        }
      },
      register: function(id, element, options) {
        var modalOpts;
        if (this.registered[id] != null) {
          throw new Error("Modal " + id + " already registered");
        }
        modalOpts = {};
        angular.extend(modalOpts, modalViews.defaults, options);
        this.registered[id] = {
          id: id,
          element: element,
          options: modalOpts
        };
        if ((this.waiting != null) && this.waiting.id === id) {
          return this.show(id, this.waiting.options);
        }
      },
      unregister: function(id) {
        var _ref;
        if (this.registered[id] == null) {
          throw new Error("Modal " + id + " is not registered");
        }
        if (((_ref = this.opened) != null ? _ref.id : void 0) === id) {
          this.hide();
        }
        this.clearWaiting(id);
        return delete this.registered[id];
      },
      clearWaiting: function(id) {
        var _ref;
        if ((id != null) && ((_ref = this.waiting) != null ? _ref.id : void 0) !== id) {
          return;
        }
        return this.waiting = null;
      }
    };
  }
]).provider("modalViews", function() {
  this.registered = {};
  this.defaults = {
    keyboard: false,
    overlayClose: false,
    resize: true,
    position: true,
    open: angular.noop,
    topOffset: 20,
    attributes: {},
    beforeShow: angular.noop,
    afterShow: angular.noop,
    beforeHide: angular.noop,
    afterHide: angular.noop
  };
  this.$get = function() {
    return this;
  };
  return this;
}).config([
  "modalViewsProvider", function(modalViews) {
    return angular.module("Mac").modal = function(id, modalOptions) {
      var options;
      if (modalViews.registered[id] == null) {
        options = {};
        angular.extend(options, modalViews.defaults, modalOptions, {
          moduleMethod: true
        });
        return modalViews.registered[id] = {
          id: id,
          options: options
        };
      }
    };
  }
]);


/*
@chalk overview
@name Popover Service

@description
A popover service to keep state of opened popover. Allowing user to hide certain
or all popovers

@param {Array} popoverList The popover that's currently being shown

@param {Array} registered Object storing all the registered popover DOM elements

@param {Function} last Get data of the last popover
- Returns {Object} The last opened popover

@param {Function} register Register a popover with an id and an element
- {String} id Popover id
- {DOM Element} element Popover element
- Returns {Bool} If the id already existed

@param {Function} unregister Remove id and element from registered list of popover
- {String} id Popover id
- Returns {Bool} If the id exist

@param {Function} add Add a new popover to opened list
- {String} id Popover id
- {DOM Element} popover Popover DOM element
- {DOM Element} element Trigger DOM element
- {Object} options Additional options
- Returns {Object} The new popover object

@param {Function} pop Get and remove the last popover from list
- Returns {Object} Last element from popoverList

@param {Function} show Show and position a registered popover
- {String} id Popover id
- {DOM Element} element Element that trigger the popover
- {Object} options Additional options for popover

@param {Function} getById Get opened popover object by id
- {String} id Popover id
- Returns {Object} Opened popover object

@param {Function} resize Update size and position of an opened popover
- {Object|String} popoverObj Support multiple type input:
  - Object: One of the popover objects in popoverList
  - String: Popover ID

@param {Function} hide Hide a certain popover. If no selector is provided, the
last opened popover is hidden
- {DOM Element|String} selector Support multiple type input:
  - DOM Element: Popover trigger element
  - String: Popover ID
- {Function} callback Callback after popover is hidden

@param {Function} hideAll Hide all popovers
 */
angular.module("Mac").provider("popoverViews", function() {
  this.registered = {};
  this.defaults = {
    fixed: false,
    childPopover: false,
    offsetY: 0,
    offsetX: 0,
    trigger: "click"
  };
  this.popoverDefaults = {
    footer: false,
    header: false,
    title: "",
    direction: "above left"
  };

  /*
  @name template
  @description
  Popover template
   */
  this.template = "<div class=\"mac-popover\" ng-class=\"macPopoverClasses\">\n  <div class=\"tip\"></div>\n  <div class=\"popover-header\">\n    <div class=\"title\">{{macPopoverTitle}}</div>\n  </div>\n  <div mac-popover-fill-content></div>\n</div>";
  this.$get = function() {
    return this;
  };
  return this;
}).service("popover", [
  "$animate", "$compile", "$controller", "$http", "$rootScope", "$templateCache", "$timeout", "popoverViews", function($animate, $compile, $controller, $http, $rootScope, $templateCache, $timeout, popoverViews) {
    var service;
    service = {
      popoverList: [],
      registered: popoverViews.registered,
      last: function() {
        return this.popoverList[this.popoverList.length - 1];
      },
      register: function(id, options) {
        var exist;
        if (!(exist = this.registered[id] != null)) {
          this.registered[id] = options;
        }
        return !exist;
      },
      unregister: function(id) {
        var exist;
        if (exist = this.registered[id] != null) {
          delete this.registered[id];
        }
        return exist;
      },
      add: function(id, popover, element, options) {
        var newObject;
        newObject = {
          id: id,
          popover: popover,
          element: element,
          options: options
        };
        this.popoverList.push(newObject);
        return newObject;
      },
      pop: function() {
        return this.popoverList.pop();
      },
      show: function(id, element, options) {
        var addPopover, popoverOptions;
        if (options == null) {
          options = {};
        }
        popoverOptions = this.registered[id];
        if (!popoverOptions) {
          return false;
        }
        addPopover = function() {
          var path, showPopover, template;
          showPopover = function(template) {
            var popover, popoverObj, viewScope;
            if (isScope(options.scope)) {
              viewScope = options.scope.$new();
            } else {
              viewScope = $rootScope.$new(true);
              if (angular.isObject(options.scope)) {
                angular.extend(viewScope, options.scope);
              }
            }
            if (popoverOptions.refreshOn) {
              viewScope.$on(popoverOptions.refreshOn, function() {
                return service.resize(id);
              });
            }
            if (popoverOptions.controller) {
              $controller(popoverOptions.controller, {
                $scope: viewScope
              });
            }
            angular.extend(viewScope, {
              macPopoverClasses: {
                footer: popoverOptions.footer || false,
                header: popoverOptions.header || !!popoverOptions.title || false,
                fixed: popoverOptions.fixed || false
              },
              macPopoverTitle: popoverOptions.title || "",
              macPopoverTemplate: template
            });
            popover = $compile(popoverViews.template)(viewScope);
            popover.attr({
              id: id,
              direction: popoverOptions.direction || "below left"
            });
            popoverObj = service.add(id, popover, element, options);
            $animate.addClass(element, "active");
            $rootScope.$broadcast("popoverWasShown", id);
            return $animate.enter(popover, angular.element(document.body), null, function() {
              return service.resize(popoverObj);
            });
          };
          if ((template = popoverOptions.template)) {
            return showPopover(template);
          } else if ((path = popoverOptions.templateUrl)) {
            template = $templateCache.get(path);
            if (template) {
              return showPopover(template);
            } else {
              return $http.get(path).then(function(resp) {
                $templateCache.put(path, resp.data);
                return showPopover(resp.data);
              }, function() {
                throw new Error('Failed to load template: #{path}');
              });
            }
          }
        };
        if (service.popoverList.length && !!!options.childPopover) {
          service.hide(addPopover);
        } else {
          addPopover();
        }
        return true;
      },
      getById: function(id, element) {
        var item, sameTrigger, _i, _len, _ref;
        _ref = this.popoverList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          sameTrigger = (element == null) || item.element === element;
          if (item.id === id && sameTrigger) {
            return item;
          }
        }
      },
      resize: function(popoverObj) {
        var $window, action, current, currentPopover, diff, left, leftScroll, offset, options, position, relative, relativeElement, setOverflowPosition, top, topScroll, updateOffset;
        if (angular.isString(popoverObj)) {
          popoverObj = service.getById(popoverObj);
        }
        if (popoverObj == null) {
          return;
        }
        currentPopover = popoverObj.popover;
        relativeElement = popoverObj.element;
        options = popoverObj.options;
        $window = angular.element(window);
        offset = relativeElement.offset();
        if (options.fixed) {
          offset.top = relativeElement.position().top;
        }
        relative = {
          height: relativeElement.outerHeight(),
          width: relativeElement.outerWidth()
        };
        current = {
          height: currentPopover.outerHeight(),
          width: currentPopover.outerWidth()
        };
        top = 0;
        left = 0;
        position = (currentPopover.attr("direction") || "top left").trim();
        setOverflowPosition = function(offset) {
          var tip, tipOffset;
          if (offset == null) {
            offset = 0;
          }
          tip = angular.element(currentPopover[0].getElementsByClassName("tip"));
          top -= offset;
          tipOffset = +tip.css("margin-top").replace("px", "");
          return tip.css("margin-top", tipOffset + offset);
        };
        updateOffset = function() {
          switch (position) {
            case "above left":
              top = -(current.height + 10);
              return left = -25 + relative.width / 2;
            case "above right":
              top = -(current.height + 10);
              return left = 25 + relative.width / 2 - current.width;
            case "below left":
              top = relative.height + 10;
              return left = -25 + relative.width / 2;
            case "below right":
              top = relative.height + 10;
              return left = 25 + relative.width / 2 - current.width;
            case "middle right":
              top = relative.height / 2 - current.height / 2;
              return left = relative.width + 10;
            case "middle left":
              top = relative.height / 2 - current.height / 2;
              return left = -(current.width + 10);
          }
        };
        updateOffset();
        topScroll = options.fixed ? 0 : $window.scrollTop();
        leftScroll = options.fixed ? 0 : $window.scrollLeft();
        action = {};
        if (position.indexOf("middle") === -1) {
          if (offset.top + top - topScroll < 0) {
            action = {
              remove: "above",
              add: "below"
            };
          } else if (offset.top + top + current.height - topScroll > $window.height()) {
            action = {
              remove: "below",
              add: "above"
            };
          }
        } else {
          if ((diff = offset.top + top - topScroll) < 0) {
            setOverflowPosition(diff);
          } else if ((diff = offset.top + top + currentPopover.outerHeight() - topScroll - $window.height()) > 0) {
            setOverflowPosition(diff);
          }
        }
        if (action.remove && action.add) {
          position = position.replace(action.remove, action.add);
        }
        action = {};
        if (offset.left + left - leftScroll < 0) {
          action = {
            remove: "right",
            add: "left"
          };
        } else if (offset.left + left + currentPopover.outerWidth() - leftScroll > $window.width()) {
          action = {
            remove: "left",
            add: "right"
          };
        }
        if (action.remove && action.add) {
          position = position.replace(action.remove, action.add);
        }
        updateOffset();
        offset.top += top;
        offset.left += left;
        if (options.offsetX != null) {
          offset.left += options.offsetX;
        }
        if (options.offsetY != null) {
          offset.top += options.offsetY;
        }
        angular.forEach(offset, function(value, key) {
          if (!isNaN(+value)) {
            value = "" + value + "px";
          }
          return currentPopover.css(key, value);
        });
        return currentPopover.addClass("visible " + position);
      },
      hide: function(selector, callback) {
        var comparator, i, index, popoverObj, removeScope, _i, _ref;
        if (!this.popoverList.length) {
          return typeof callback === "function" ? callback() : void 0;
        }
        if (angular.isFunction(selector)) {
          callback = selector;
          selector = null;
        }
        if (selector != null) {
          comparator = angular.isString(selector) ? function(item) {
            return item.id === selector;
          } : angular.isElement(selector) ? function(item) {
            return item.element === selector;
          } : void 0;
          index = -1;
          for (i = _i = _ref = this.popoverList.length - 1; _i >= 0; i = _i += -1) {
            if (!(comparator(this.popoverList[i]))) {
              continue;
            }
            popoverObj = this.popoverList[i];
            index = i;
            break;
          }
          if (index > -1) {
            this.popoverList.splice(index, 1);
          }
        } else {
          popoverObj = this.pop();
        }
        if (popoverObj == null) {
          return;
        }
        $rootScope.$broadcast("popoverBeforeHide", popoverObj.id);
        removeScope = popoverObj.popover.scope();
        return $animate.leave(popoverObj.popover, function() {
          $animate.removeClass(popoverObj.element, "active");
          $rootScope.$broadcast("popoverWasHidden", popoverObj.id);
          removeScope.$destroy();
          return typeof callback === "function" ? callback() : void 0;
        });
      },
      hideAll: function() {
        while (this.popoverList.length) {
          this.hide();
        }
      }
    };
    return service;
  }
]).config([
  "popoverViewsProvider", function(popoverViews) {
    return angular.module("Mac").popover = function(name, options) {
      var opts;
      if (popoverViews.registered[name] == null) {
        opts = {};
        angular.extend(opts, popoverViews.popoverDefaults, options, {
          id: name
        });
        return popoverViews.registered[name] = opts;
      }
    };
  }
]);


/*
@chalk overview
@name Scroll Spy Service

@description
There are multiple components used by scrollspy
- Scrollspy service is used to keep track of all and active anchors
- Multiple directives including:
- mac-scroll-spy - Element to spy scroll event
- mac-scroll-spy-anchor - Section in element spying on
- mac-scroll-spy-target - Element to highlight, most likely a nav item

Scrollspy defaults:
offset - 0

@param {Function} register Register an anchor with the service
- {String} id ID of the anchor
- {DOM Element} element Element to spy on

@param {Function} unregister Remove anchor from service
- {String} id ID of the anchor

@param {Function} setActive Set active anchor and fire all listeners
- {Object} anchor Anchor object

@param {Function} addListener Add listener when active is set
- {Function} fn Callback function

@param {Function} removeListener Remove listener
- {Function} fn Callback function
 */
angular.module("Mac").service("scrollSpy", [
  function() {
    return {
      registered: [],
      active: {},
      listeners: [],
      register: function(id, element) {
        var anchor, i, registered, top, _i, _len, _ref;
        registered = false;
        top = element.offset().top;
        _ref = this.registered;
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          anchor = _ref[i];
          if (!(anchor.id === id)) {
            continue;
          }
          this.registered[i] = {
            id: id,
            element: element,
            top: top
          };
          registered = true;
          break;
        }
        if (!registered) {
          this.registered.push({
            id: id,
            element: element,
            top: top
          });
        }
        return this.registered.sort(function(a, b) {
          if (a.top > b.top) {
            return 1;
          } else if (a.top < b.top) {
            return -1;
          }
          return 0;
        });
      },
      unregister: function(id) {
        var anchor, i, _i, _len, _ref, _ref1, _results;
        _ref = this.registered;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          anchor = _ref[i];
          if (!(anchor.id === id)) {
            continue;
          }
          [].splice.apply(this.registered, [i, i - i + 1].concat(_ref1 = [])), _ref1;
          break;
        }
        return _results;
      },
      last: function() {
        return this.registered[this.registered.length - 1];
      },
      setActive: function(anchor) {
        var listener, _i, _len, _ref, _results;
        this.active = anchor;
        _ref = this.listeners;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          listener = _ref[_i];
          _results.push(listener(anchor));
        }
        return _results;
      },
      addListener: function(fn) {
        return this.listeners.push(fn);
      },
      removeListener: function(fn) {
        var index, _ref;
        index = this.listeners.indexOf(fn);
        if (index !== -1) {
          return ([].splice.apply(this.listeners, [index, index - index + 1].concat(_ref = [])), _ref);
        }
      }
    };
  }
]).constant("scrollSpyDefaults", {
  offset: 0
});

var __hasProp = {}.hasOwnProperty;

angular.module("Mac.Util", []).factory("util", [
  "$filter", function($filter) {
    return {
      _inflectionConstants: {
        uncountables: ["sheep", "fish", "moose", "series", "species", "money", "rice", "information", "info", "equipment", "min"],
        irregulars: {
          child: "children",
          man: "men",
          woman: "women",
          person: "people",
          ox: "oxen",
          goose: "geese"
        },
        pluralizers: [[/(quiz)$/i, "$1zes"], [/([m|l])ouse$/i, "$1ice"], [/(matr|vert|ind)(ix|ex)$/i, "$1ices"], [/(x|ch|ss|sh)$/i, "$1es"], [/([^aeiouy]|qu)y$/i, "$1ies"], [/(?:([^f])fe|([lr])f)$/i, "$1$2ves"], [/sis$/i, "ses"], [/([ti])um$/i, "$1a"], [/(buffal|tomat)o$/i, "$1oes"], [/(bu)s$/i, "$1ses"], [/(alias|status)$/i, "$1es"], [/(octop|vir)us$/i, "$1i"], [/(ax|test)is$/i, "$1es"], [/x$/i, "xes"], [/s$/i, "s"], [/$/, "s"]]
      },

      /*
      @name pluralize
      @description
      Pluralize string based on the count
      
      @param {String}  string       String to pluralize (default "")
      @param {Integer} count        Object counts
      @param {Boolean} includeCount Include the number or not (default false)
      
      @returns {String} Pluralized string based on the count
       */
      pluralize: function(string, count, includeCount) {
        var irregulars, isUppercase, lowercaseWord, pluralizedString, pluralizedWord, pluralizer, pluralizers, uncountables, word, _i, _len, _ref;
        if (string == null) {
          string = "";
        }
        if (includeCount == null) {
          includeCount = false;
        }
        if (!angular.isString(string) || this.trim(string).length === 0) {
          return string;
        }
        if (includeCount && isNaN(+count)) {
          return "";
        }
        if (count == null) {
          count = 2;
        }
        _ref = this._inflectionConstants, pluralizers = _ref.pluralizers, uncountables = _ref.uncountables, irregulars = _ref.irregulars;
        word = string.split(/\s/).pop();
        isUppercase = word.toUpperCase() === word;
        lowercaseWord = word.toLowerCase();
        pluralizedWord = count === 1 || uncountables.indexOf(lowercaseWord) >= 0 ? word : null;
        if (pluralizedWord == null) {
          if (irregulars[lowercaseWord] != null) {
            pluralizedWord = irregulars[lowercaseWord];
          }
        }
        if (pluralizedWord == null) {
          for (_i = 0, _len = pluralizers.length; _i < _len; _i++) {
            pluralizer = pluralizers[_i];
            if (!(pluralizer[0].test(lowercaseWord))) {
              continue;
            }
            pluralizedWord = word.replace(pluralizer[0], pluralizer[1]);
            break;
          }
        }
        pluralizedWord || (pluralizedWord = word);
        if (isUppercase) {
          pluralizedWord = pluralizedWord.toUpperCase();
        }
        pluralizedString = string.slice(0, -word.length) + pluralizedWord;
        if (includeCount) {
          return "" + ($filter("number")(count)) + " " + pluralizedString;
        } else {
          return pluralizedString;
        }
      },
      trim: function(string) {
        var str;
        str = String(string) || "";
        if (String.prototype.trim != null) {
          return str.trim();
        } else {
          return str.replace(/^\s+|\s+$/gm, "");
        }
      },
      capitalize: function(string) {
        var str;
        str = String(string) || "";
        return str.charAt(0).toUpperCase() + str.substring(1);
      },
      uncapitalize: function(string) {
        var str;
        str = String(string) || "";
        return str.charAt(0).toLowerCase() + str.substring(1);
      },
      toCamelCase: function(string) {
        if (string == null) {
          string = "";
        }
        return this.trim(string).replace(/[-_\s]+(.)?/g, function(match, c) {
          return c.toUpperCase();
        });
      },
      toSnakeCase: function(string) {
        if (string == null) {
          string = "";
        }
        return this.trim(string).replace(/([a-z\d])([A-Z]+)/g, "$1_$2").replace(/[-\s]+/g, "_").toLowerCase();
      },
      convertKeysToCamelCase: function(object) {
        var key, result, value;
        result = {};
        for (key in object) {
          if (!__hasProp.call(object, key)) continue;
          value = object[key];
          key = this.toCamelCase(key);
          if (typeof value === "object" && (value != null ? value.constructor : void 0) !== Array) {
            value = this.convertKeysToCamelCase(value);
          }
          result[key] = value;
        }
        return result;
      },
      convertKeysToSnakeCase: function(object) {
        var key, result, value;
        result = {};
        for (key in object) {
          if (!__hasProp.call(object, key)) continue;
          value = object[key];
          key = this.toSnakeCase(key);
          if (typeof value === "object" && (value != null ? value.constructor : void 0) !== Array) {
            value = this.convertKeysToSnakeCase(value);
          }
          result[key] = value;
        }
        return result;
      },
      pyth: function(a, b) {
        return Math.sqrt(a * a + b * b);
      },
      degrees: function(radian) {
        return (radian * 180) / Math.PI;
      },
      radian: function(degrees) {
        return (degrees * Math.PI) / 180;
      },
      hex2rgb: function(hex) {
        var color, rgb, value;
        if (hex.indexOf('#') === 0) {
          hex = hex.substring(1);
        }
        hex = hex.toLowerCase();
        rgb = {};
        if (hex.length === 3) {
          rgb.r = hex.charAt(0) + hex.charAt(0);
          rgb.g = hex.charAt(1) + hex.charAt(1);
          rgb.b = hex.charAt(2) + hex.charAt(2);
        } else {
          rgb.r = hex.substring(0, 2);
          rgb.g = hex.substring(2, 4);
          rgb.b = hex.substring(4);
        }
        for (color in rgb) {
          value = rgb[color];
          rgb[color] = parseInt(value, 16);
        }
        return rgb;
      },
      timeRegex: /^(0?[1-9]|1[0-2]):([0-5][0-9])[\s]([AP]M)$/,
      _urlRegex: /(?:(http[s]?):\/\/)?(?:(www|[\d\w\-]+)\.)?([\d\w\-]+)\.([A-Za-z]{2,6})(:[\d]*)?([:\/?#\[\]@!$&'()*+,;=\w\d-._~%\\]*)?/i,
      _emailRegex: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      validateUrl: function(url) {
        var match;
        match = this._urlRegex.exec(url);
        if (match != null) {
          match = {
            url: match[0],
            protocol: match[1] || "http",
            subdomain: match[2],
            name: match[3],
            domain: match[4],
            port: match[5],
            path: match[6] || "/"
          };
          match["url"] = match.url;
        }
        return match;
      },
      validateEmail: function(email) {
        return this._emailRegex.test(email);
      },
      getQueryString: function(url, name) {
        var regex, regexS, results;
        if (name == null) {
          name = "";
        }
        name = name.replace(/[[]/, "\[").replace(/[]]/, "\]");
        regexS = "[\?&]" + name + "=([^&#]*)";
        regex = new RegExp(regexS);
        results = regex.exec(url);
        if (results != null) {
          return results[1];
        } else {
          return "";
        }
      },
      parseUrlPath: function(fullPath) {
        var path, pathComponents, queries, queryString, queryStrings, urlComponents, values, verb, _i, _len, _ref;
        urlComponents = fullPath.split("?");
        pathComponents = urlComponents[0].split("/");
        path = pathComponents.slice(0, pathComponents.length - 1).join("/");
        verb = pathComponents[pathComponents.length - 1];
        queries = {};
        if (urlComponents.length > 1) {
          queryStrings = urlComponents[urlComponents.length - 1];
          _ref = queryStrings.split("&");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            queryString = _ref[_i];
            values = queryString.split("=");
            queries[values[0]] = values[1] != null ? values[1] : "";
          }
        }
        return {
          fullPath: fullPath,
          path: path,
          pathComponents: pathComponents,
          verb: verb,
          queries: queries
        };
      },
      extendAttributes: function(prefix, defaults, attributes) {
        var altKey, key, macKey, output, value, _ref, _ref1;
        if (prefix == null) {
          prefix = "";
        }
        output = {};
        for (key in defaults) {
          if (!__hasProp.call(defaults, key)) continue;
          value = defaults[key];
          altKey = prefix ? this.capitalize(key) : key;
          macKey = "" + prefix + altKey;
          output[key] = attributes[macKey] != null ? attributes[macKey] || true : value;
          if ((_ref = output[key]) === "true" || _ref === "false") {
            output[key] = output[key] === "true";
          } else if (((_ref1 = output[key]) != null ? _ref1.length : void 0) > 0 && !isNaN(+output[key])) {
            output[key] = +output[key];
          }
        }
        return output;
      }
    };
  }
]);

})(window, window.angular);