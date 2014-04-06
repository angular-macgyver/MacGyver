/**
 * MacGyver v0.2.9
 * @link http://starttheshift.github.io/MacGyver
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
      return win.scrollTo(window.pageXOffset, value);
    } else {
      return element["scrollTop"] = value;
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
 * jQuery UI Widget 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */
(function( $, undefined ) {

var uuid = 0,
	slice = Array.prototype.slice,
	_cleanData = $.cleanData;
$.cleanData = function( elems ) {
	for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
		try {
			$( elem ).triggerHandler( "remove" );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems );
};

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );
};

$.widget.extend = function( target ) {
	var input = slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :
			options;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;
		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			// 1.9 BC for #7810
			// TODO remove dual storage
			.removeData( this.widgetName )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
			this.hoverable.removeClass( "ui-state-hover" );
			this.focusable.removeClass( "ui-state-focus" );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			// accept selectors, DOM elements
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^(\w+)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

})( jQuery );

/*!
 * jQuery UI Mouse 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

var mouseHandled = false;
$( document ).mouseup( function() {
	mouseHandled = false;
});

$.widget("ui.mouse", {
	version: "1.10.4",
	options: {
		cancel: "input,textarea,button,select,option",
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.bind("mousedown."+this.widgetName, function(event) {
				return that._mouseDown(event);
			})
			.bind("click."+this.widgetName, function(event) {
				if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
					$.removeData(event.target, that.widgetName + ".preventClickEvent");
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind("."+this.widgetName);
		if ( this._mouseMoveDelegate ) {
			$(document)
				.unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
				.unbind("mouseup."+this.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if( mouseHandled ) { return; }

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.which === 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				that.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
			$.removeData(event.target, this.widgetName + ".preventClickEvent");
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return that._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};
		$(document)
			.bind("mousemove."+this.widgetName, this._mouseMoveDelegate)
			.bind("mouseup."+this.widgetName, this._mouseUpDelegate);

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
			.unbind("mouseup."+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetName + ".preventClickEvent", true);
			}

			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(/* event */) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(/* event */) {},
	_mouseDrag: function(/* event */) {},
	_mouseStop: function(/* event */) {},
	_mouseCapture: function(/* event */) { return true; }
});

})(jQuery);

/*!
 * jQuery UI Position 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */
(function( $, undefined ) {

$.ui = $.ui || {};

var cachedScrollbarWidth,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
	var raw = elem[0];
	if ( raw.nodeType === 9 ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: 0, left: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
		};
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
	return {
		width: elem.outerWidth(),
		height: elem.outerHeight(),
		offset: elem.offset()
	};
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].clientWidth;
		}

		div.remove();

		return (cachedScrollbarWidth = w1 - w2);
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-x" ),
			overflowY = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[0].scrollHeight );
		return {
			width: hasOverflowY ? $.position.scrollbarWidth() : 0,
			height: hasOverflowX ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[0] ),
			isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9;
		return {
			element: withinElement,
			isWindow: isWindow,
			isDocument: isDocument,
			offset: withinElement.offset() || { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),
			width: isWindow ? withinElement.width() : withinElement.outerWidth(),
			height: isWindow ? withinElement.height() : withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = getDimensions( target );
	if ( target[0].preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
	}
	targetWidth = dimensions.width;
	targetHeight = dimensions.height;
	targetOffset = dimensions.offset;
	// clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't support fractions, then round for consistent results
		if ( !$.support.offsetFractions ) {
			position.left = round( position.left );
			position.top = round( position.top );
		}

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem : elem
				});
			}
		});

		if ( options.using ) {
			// adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// element is wider than within
			if ( data.collisionWidth > outerWidth ) {
				// element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
					position.left += overLeft - newOverRight;
				// element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;
				// element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}
			// too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// element is taller than within
			if ( data.collisionHeight > outerHeight ) {
				// element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
					position.top += overTop - newOverBottom;
				// element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;
				// element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			}
			else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
				if ( ( position.top + myOffset + atOffset + offset) > overTop && ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
			else if ( overBottom > 0 ) {
				newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
				if ( ( position.top + myOffset + atOffset + offset) > overBottom && ( newOverTop > 0 || abs( newOverTop ) < overBottom ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

// fraction support test
(function () {
	var testElement, testElementParent, testElementStyle, offsetLeft, i,
		body = document.getElementsByTagName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	div.style.cssText = "position: absolute; left: 10.7432222px;";

	offsetLeft = $( div ).offset().left;
	$.support.offsetFractions = offsetLeft > 10 && offsetLeft < 11;

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );
})();

}( jQuery ) );

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

/*!
 * jQuery UI Resizable 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/resizable/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

function num(v) {
	return parseInt(v, 10) || 0;
}

function isNumber(value) {
	return !isNaN(parseInt(value, 10));
}

$.widget("ui.resizable", $.ui.mouse, {
	version: "1.10.4",
	widgetEventPrefix: "resize",
	options: {
		alsoResize: false,
		animate: false,
		animateDuration: "slow",
		animateEasing: "swing",
		aspectRatio: false,
		autoHide: false,
		containment: false,
		ghost: false,
		grid: false,
		handles: "e,s,se",
		helper: false,
		maxHeight: null,
		maxWidth: null,
		minHeight: 10,
		minWidth: 10,
		// See #7960
		zIndex: 90,

		// callbacks
		resize: null,
		start: null,
		stop: null
	},
	_create: function() {

		var n, i, handle, axis, hname,
			that = this,
			o = this.options;
		this.element.addClass("ui-resizable");

		$.extend(this, {
			_aspectRatio: !!(o.aspectRatio),
			aspectRatio: o.aspectRatio,
			originalElement: this.element,
			_proportionallyResizeElements: [],
			_helper: o.helper || o.ghost || o.animate ? o.helper || "ui-resizable-helper" : null
		});

		//Wrap the element if it cannot hold child nodes
		if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {

			//Create a wrapper element and set the wrapper to the new current internal element
			this.element.wrap(
				$("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({
					position: this.element.css("position"),
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					top: this.element.css("top"),
					left: this.element.css("left")
				})
			);

			//Overwrite the original this.element
			this.element = this.element.parent().data(
				"ui-resizable", this.element.data("ui-resizable")
			);

			this.elementIsWrapper = true;

			//Move margins to the wrapper
			this.element.css({ marginLeft: this.originalElement.css("marginLeft"), marginTop: this.originalElement.css("marginTop"), marginRight: this.originalElement.css("marginRight"), marginBottom: this.originalElement.css("marginBottom") });
			this.originalElement.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0});

			//Prevent Safari textarea resize
			this.originalResizeStyle = this.originalElement.css("resize");
			this.originalElement.css("resize", "none");

			//Push the actual element to our proportionallyResize internal array
			this._proportionallyResizeElements.push(this.originalElement.css({ position: "static", zoom: 1, display: "block" }));

			// avoid IE jump (hard set the margin)
			this.originalElement.css({ margin: this.originalElement.css("margin") });

			// fix handlers offset
			this._proportionallyResize();

		}

		this.handles = o.handles || (!$(".ui-resizable-handle", this.element).length ? "e,s,se" : { n: ".ui-resizable-n", e: ".ui-resizable-e", s: ".ui-resizable-s", w: ".ui-resizable-w", se: ".ui-resizable-se", sw: ".ui-resizable-sw", ne: ".ui-resizable-ne", nw: ".ui-resizable-nw" });
		if(this.handles.constructor === String) {

			if ( this.handles === "all") {
				this.handles = "n,e,s,w,se,sw,ne,nw";
			}

			n = this.handles.split(",");
			this.handles = {};

			for(i = 0; i < n.length; i++) {

				handle = $.trim(n[i]);
				hname = "ui-resizable-"+handle;
				axis = $("<div class='ui-resizable-handle " + hname + "'></div>");

				// Apply zIndex to all handles - see #7960
				axis.css({ zIndex: o.zIndex });

				//TODO : What's going on here?
				if ("se" === handle) {
					axis.addClass("ui-icon ui-icon-gripsmall-diagonal-se");
				}

				//Insert into internal handles object and append to element
				this.handles[handle] = ".ui-resizable-"+handle;
				this.element.append(axis);
			}

		}

		this._renderAxis = function(target) {

			var i, axis, padPos, padWrapper;

			target = target || this.element;

			for(i in this.handles) {

				if(this.handles[i].constructor === String) {
					this.handles[i] = $(this.handles[i], this.element).show();
				}

				//Apply pad to wrapper element, needed to fix axis position (textarea, inputs, scrolls)
				if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {

					axis = $(this.handles[i], this.element);

					//Checking the correct pad and border
					padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

					//The padding type i have to apply...
					padPos = [ "padding",
						/ne|nw|n/.test(i) ? "Top" :
						/se|sw|s/.test(i) ? "Bottom" :
						/^e$/.test(i) ? "Right" : "Left" ].join("");

					target.css(padPos, padWrapper);

					this._proportionallyResize();

				}

				//TODO: What's that good for? There's not anything to be executed left
				if(!$(this.handles[i]).length) {
					continue;
				}
			}
		};

		//TODO: make renderAxis a prototype function
		this._renderAxis(this.element);

		this._handles = $(".ui-resizable-handle", this.element)
			.disableSelection();

		//Matching axis name
		this._handles.mouseover(function() {
			if (!that.resizing) {
				if (this.className) {
					axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
				}
				//Axis, default = se
				that.axis = axis && axis[1] ? axis[1] : "se";
			}
		});

		//If we want to auto hide the elements
		if (o.autoHide) {
			this._handles.hide();
			$(this.element)
				.addClass("ui-resizable-autohide")
				.mouseenter(function() {
					if (o.disabled) {
						return;
					}
					$(this).removeClass("ui-resizable-autohide");
					that._handles.show();
				})
				.mouseleave(function(){
					if (o.disabled) {
						return;
					}
					if (!that.resizing) {
						$(this).addClass("ui-resizable-autohide");
						that._handles.hide();
					}
				});
		}

		//Initialize the mouse interaction
		this._mouseInit();

	},

	_destroy: function() {

		this._mouseDestroy();

		var wrapper,
			_destroy = function(exp) {
				$(exp).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing")
					.removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove();
			};

		//TODO: Unwrap at same DOM position
		if (this.elementIsWrapper) {
			_destroy(this.element);
			wrapper = this.element;
			this.originalElement.css({
				position: wrapper.css("position"),
				width: wrapper.outerWidth(),
				height: wrapper.outerHeight(),
				top: wrapper.css("top"),
				left: wrapper.css("left")
			}).insertAfter( wrapper );
			wrapper.remove();
		}

		this.originalElement.css("resize", this.originalResizeStyle);
		_destroy(this.originalElement);

		return this;
	},

	_mouseCapture: function(event) {
		var i, handle,
			capture = false;

		for (i in this.handles) {
			handle = $(this.handles[i])[0];
			if (handle === event.target || $.contains(handle, event.target)) {
				capture = true;
			}
		}

		return !this.options.disabled && capture;
	},

	_mouseStart: function(event) {

		var curleft, curtop, cursor,
			o = this.options,
			iniPos = this.element.position(),
			el = this.element;

		this.resizing = true;

		// bugfix for http://dev.jquery.com/ticket/1749
		if ( (/absolute/).test( el.css("position") ) ) {
			el.css({ position: "absolute", top: el.css("top"), left: el.css("left") });
		} else if (el.is(".ui-draggable")) {
			el.css({ position: "absolute", top: iniPos.top, left: iniPos.left });
		}

		this._renderProxy();

		curleft = num(this.helper.css("left"));
		curtop = num(this.helper.css("top"));

		if (o.containment) {
			curleft += $(o.containment).scrollLeft() || 0;
			curtop += $(o.containment).scrollTop() || 0;
		}

		//Store needed variables
		this.offset = this.helper.offset();
		this.position = { left: curleft, top: curtop };
		this.size = this._helper ? { width: this.helper.width(), height: this.helper.height() } : { width: el.width(), height: el.height() };
		this.originalSize = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalPosition = { left: curleft, top: curtop };
		this.sizeDiff = { width: el.outerWidth() - el.width(), height: el.outerHeight() - el.height() };
		this.originalMousePosition = { left: event.pageX, top: event.pageY };

		//Aspect Ratio
		this.aspectRatio = (typeof o.aspectRatio === "number") ? o.aspectRatio : ((this.originalSize.width / this.originalSize.height) || 1);

		cursor = $(".ui-resizable-" + this.axis).css("cursor");
		$("body").css("cursor", cursor === "auto" ? this.axis + "-resize" : cursor);

		el.addClass("ui-resizable-resizing");
		this._propagate("start", event);
		return true;
	},

	_mouseDrag: function(event) {

		//Increase performance, avoid regex
		var data,
			el = this.helper, props = {},
			smp = this.originalMousePosition,
			a = this.axis,
			prevTop = this.position.top,
			prevLeft = this.position.left,
			prevWidth = this.size.width,
			prevHeight = this.size.height,
			dx = (event.pageX-smp.left)||0,
			dy = (event.pageY-smp.top)||0,
			trigger = this._change[a];

		if (!trigger) {
			return false;
		}

		// Calculate the attrs that will be change
		data = trigger.apply(this, [event, dx, dy]);

		// Put this in the mouseDrag handler since the user can start pressing shift while resizing
		this._updateVirtualBoundaries(event.shiftKey);
		if (this._aspectRatio || event.shiftKey) {
			data = this._updateRatio(data, event);
		}

		data = this._respectSize(data, event);

		this._updateCache(data);

		// plugins callbacks need to be called first
		this._propagate("resize", event);

		if (this.position.top !== prevTop) {
			props.top = this.position.top + "px";
		}
		if (this.position.left !== prevLeft) {
			props.left = this.position.left + "px";
		}
		if (this.size.width !== prevWidth) {
			props.width = this.size.width + "px";
		}
		if (this.size.height !== prevHeight) {
			props.height = this.size.height + "px";
		}
		el.css(props);

		if (!this._helper && this._proportionallyResizeElements.length) {
			this._proportionallyResize();
		}

		// Call the user callback if the element was resized
		if ( ! $.isEmptyObject(props) ) {
			this._trigger("resize", event, this.ui());
		}

		return false;
	},

	_mouseStop: function(event) {

		this.resizing = false;
		var pr, ista, soffseth, soffsetw, s, left, top,
			o = this.options, that = this;

		if(this._helper) {

			pr = this._proportionallyResizeElements;
			ista = pr.length && (/textarea/i).test(pr[0].nodeName);
			soffseth = ista && $.ui.hasScroll(pr[0], "left") /* TODO - jump height */ ? 0 : that.sizeDiff.height;
			soffsetw = ista ? 0 : that.sizeDiff.width;

			s = { width: (that.helper.width()  - soffsetw), height: (that.helper.height() - soffseth) };
			left = (parseInt(that.element.css("left"), 10) + (that.position.left - that.originalPosition.left)) || null;
			top = (parseInt(that.element.css("top"), 10) + (that.position.top - that.originalPosition.top)) || null;

			if (!o.animate) {
				this.element.css($.extend(s, { top: top, left: left }));
			}

			that.helper.height(that.size.height);
			that.helper.width(that.size.width);

			if (this._helper && !o.animate) {
				this._proportionallyResize();
			}
		}

		$("body").css("cursor", "auto");

		this.element.removeClass("ui-resizable-resizing");

		this._propagate("stop", event);

		if (this._helper) {
			this.helper.remove();
		}

		return false;

	},

	_updateVirtualBoundaries: function(forceAspectRatio) {
		var pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b,
			o = this.options;

		b = {
			minWidth: isNumber(o.minWidth) ? o.minWidth : 0,
			maxWidth: isNumber(o.maxWidth) ? o.maxWidth : Infinity,
			minHeight: isNumber(o.minHeight) ? o.minHeight : 0,
			maxHeight: isNumber(o.maxHeight) ? o.maxHeight : Infinity
		};

		if(this._aspectRatio || forceAspectRatio) {
			// We want to create an enclosing box whose aspect ration is the requested one
			// First, compute the "projected" size for each dimension based on the aspect ratio and other dimension
			pMinWidth = b.minHeight * this.aspectRatio;
			pMinHeight = b.minWidth / this.aspectRatio;
			pMaxWidth = b.maxHeight * this.aspectRatio;
			pMaxHeight = b.maxWidth / this.aspectRatio;

			if(pMinWidth > b.minWidth) {
				b.minWidth = pMinWidth;
			}
			if(pMinHeight > b.minHeight) {
				b.minHeight = pMinHeight;
			}
			if(pMaxWidth < b.maxWidth) {
				b.maxWidth = pMaxWidth;
			}
			if(pMaxHeight < b.maxHeight) {
				b.maxHeight = pMaxHeight;
			}
		}
		this._vBoundaries = b;
	},

	_updateCache: function(data) {
		this.offset = this.helper.offset();
		if (isNumber(data.left)) {
			this.position.left = data.left;
		}
		if (isNumber(data.top)) {
			this.position.top = data.top;
		}
		if (isNumber(data.height)) {
			this.size.height = data.height;
		}
		if (isNumber(data.width)) {
			this.size.width = data.width;
		}
	},

	_updateRatio: function( data ) {

		var cpos = this.position,
			csize = this.size,
			a = this.axis;

		if (isNumber(data.height)) {
			data.width = (data.height * this.aspectRatio);
		} else if (isNumber(data.width)) {
			data.height = (data.width / this.aspectRatio);
		}

		if (a === "sw") {
			data.left = cpos.left + (csize.width - data.width);
			data.top = null;
		}
		if (a === "nw") {
			data.top = cpos.top + (csize.height - data.height);
			data.left = cpos.left + (csize.width - data.width);
		}

		return data;
	},

	_respectSize: function( data ) {

		var o = this._vBoundaries,
			a = this.axis,
			ismaxw = isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width), ismaxh = isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
			isminw = isNumber(data.width) && o.minWidth && (o.minWidth > data.width), isminh = isNumber(data.height) && o.minHeight && (o.minHeight > data.height),
			dw = this.originalPosition.left + this.originalSize.width,
			dh = this.position.top + this.size.height,
			cw = /sw|nw|w/.test(a), ch = /nw|ne|n/.test(a);
		if (isminw) {
			data.width = o.minWidth;
		}
		if (isminh) {
			data.height = o.minHeight;
		}
		if (ismaxw) {
			data.width = o.maxWidth;
		}
		if (ismaxh) {
			data.height = o.maxHeight;
		}

		if (isminw && cw) {
			data.left = dw - o.minWidth;
		}
		if (ismaxw && cw) {
			data.left = dw - o.maxWidth;
		}
		if (isminh && ch) {
			data.top = dh - o.minHeight;
		}
		if (ismaxh && ch) {
			data.top = dh - o.maxHeight;
		}

		// fixing jump error on top/left - bug #2330
		if (!data.width && !data.height && !data.left && data.top) {
			data.top = null;
		} else if (!data.width && !data.height && !data.top && data.left) {
			data.left = null;
		}

		return data;
	},

	_proportionallyResize: function() {

		if (!this._proportionallyResizeElements.length) {
			return;
		}

		var i, j, borders, paddings, prel,
			element = this.helper || this.element;

		for ( i=0; i < this._proportionallyResizeElements.length; i++) {

			prel = this._proportionallyResizeElements[i];

			if (!this.borderDif) {
				this.borderDif = [];
				borders = [prel.css("borderTopWidth"), prel.css("borderRightWidth"), prel.css("borderBottomWidth"), prel.css("borderLeftWidth")];
				paddings = [prel.css("paddingTop"), prel.css("paddingRight"), prel.css("paddingBottom"), prel.css("paddingLeft")];

				for ( j = 0; j < borders.length; j++ ) {
					this.borderDif[ j ] = ( parseInt( borders[ j ], 10 ) || 0 ) + ( parseInt( paddings[ j ], 10 ) || 0 );
				}
			}

			prel.css({
				height: (element.height() - this.borderDif[0] - this.borderDif[2]) || 0,
				width: (element.width() - this.borderDif[1] - this.borderDif[3]) || 0
			});

		}

	},

	_renderProxy: function() {

		var el = this.element, o = this.options;
		this.elementOffset = el.offset();

		if(this._helper) {

			this.helper = this.helper || $("<div style='overflow:hidden;'></div>");

			this.helper.addClass(this._helper).css({
				width: this.element.outerWidth() - 1,
				height: this.element.outerHeight() - 1,
				position: "absolute",
				left: this.elementOffset.left +"px",
				top: this.elementOffset.top +"px",
				zIndex: ++o.zIndex //TODO: Don't modify option
			});

			this.helper
				.appendTo("body")
				.disableSelection();

		} else {
			this.helper = this.element;
		}

	},

	_change: {
		e: function(event, dx) {
			return { width: this.originalSize.width + dx };
		},
		w: function(event, dx) {
			var cs = this.originalSize, sp = this.originalPosition;
			return { left: sp.left + dx, width: cs.width - dx };
		},
		n: function(event, dx, dy) {
			var cs = this.originalSize, sp = this.originalPosition;
			return { top: sp.top + dy, height: cs.height - dy };
		},
		s: function(event, dx, dy) {
			return { height: this.originalSize.height + dy };
		},
		se: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		sw: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		},
		ne: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		nw: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		}
	},

	_propagate: function(n, event) {
		$.ui.plugin.call(this, n, [event, this.ui()]);
		(n !== "resize" && this._trigger(n, event, this.ui()));
	},

	plugins: {},

	ui: function() {
		return {
			originalElement: this.originalElement,
			element: this.element,
			helper: this.helper,
			position: this.position,
			size: this.size,
			originalSize: this.originalSize,
			originalPosition: this.originalPosition
		};
	}

});

/*
 * Resizable Extensions
 */

$.ui.plugin.add("resizable", "animate", {

	stop: function( event ) {
		var that = $(this).data("ui-resizable"),
			o = that.options,
			pr = that._proportionallyResizeElements,
			ista = pr.length && (/textarea/i).test(pr[0].nodeName),
			soffseth = ista && $.ui.hasScroll(pr[0], "left") /* TODO - jump height */ ? 0 : that.sizeDiff.height,
			soffsetw = ista ? 0 : that.sizeDiff.width,
			style = { width: (that.size.width - soffsetw), height: (that.size.height - soffseth) },
			left = (parseInt(that.element.css("left"), 10) + (that.position.left - that.originalPosition.left)) || null,
			top = (parseInt(that.element.css("top"), 10) + (that.position.top - that.originalPosition.top)) || null;

		that.element.animate(
			$.extend(style, top && left ? { top: top, left: left } : {}), {
				duration: o.animateDuration,
				easing: o.animateEasing,
				step: function() {

					var data = {
						width: parseInt(that.element.css("width"), 10),
						height: parseInt(that.element.css("height"), 10),
						top: parseInt(that.element.css("top"), 10),
						left: parseInt(that.element.css("left"), 10)
					};

					if (pr && pr.length) {
						$(pr[0]).css({ width: data.width, height: data.height });
					}

					// propagating resize, and updating values for each animation step
					that._updateCache(data);
					that._propagate("resize", event);

				}
			}
		);
	}

});

$.ui.plugin.add("resizable", "containment", {

	start: function() {
		var element, p, co, ch, cw, width, height,
			that = $(this).data("ui-resizable"),
			o = that.options,
			el = that.element,
			oc = o.containment,
			ce = (oc instanceof $) ? oc.get(0) : (/parent/.test(oc)) ? el.parent().get(0) : oc;

		if (!ce) {
			return;
		}

		that.containerElement = $(ce);

		if (/document/.test(oc) || oc === document) {
			that.containerOffset = { left: 0, top: 0 };
			that.containerPosition = { left: 0, top: 0 };

			that.parentData = {
				element: $(document), left: 0, top: 0,
				width: $(document).width(), height: $(document).height() || document.body.parentNode.scrollHeight
			};
		}

		// i'm a node, so compute top, left, right, bottom
		else {
			element = $(ce);
			p = [];
			$([ "Top", "Right", "Left", "Bottom" ]).each(function(i, name) { p[i] = num(element.css("padding" + name)); });

			that.containerOffset = element.offset();
			that.containerPosition = element.position();
			that.containerSize = { height: (element.innerHeight() - p[3]), width: (element.innerWidth() - p[1]) };

			co = that.containerOffset;
			ch = that.containerSize.height;
			cw = that.containerSize.width;
			width = ($.ui.hasScroll(ce, "left") ? ce.scrollWidth : cw );
			height = ($.ui.hasScroll(ce) ? ce.scrollHeight : ch);

			that.parentData = {
				element: ce, left: co.left, top: co.top, width: width, height: height
			};
		}
	},

	resize: function( event ) {
		var woset, hoset, isParent, isOffsetRelative,
			that = $(this).data("ui-resizable"),
			o = that.options,
			co = that.containerOffset, cp = that.position,
			pRatio = that._aspectRatio || event.shiftKey,
			cop = { top:0, left:0 }, ce = that.containerElement;

		if (ce[0] !== document && (/static/).test(ce.css("position"))) {
			cop = co;
		}

		if (cp.left < (that._helper ? co.left : 0)) {
			that.size.width = that.size.width + (that._helper ? (that.position.left - co.left) : (that.position.left - cop.left));
			if (pRatio) {
				that.size.height = that.size.width / that.aspectRatio;
			}
			that.position.left = o.helper ? co.left : 0;
		}

		if (cp.top < (that._helper ? co.top : 0)) {
			that.size.height = that.size.height + (that._helper ? (that.position.top - co.top) : that.position.top);
			if (pRatio) {
				that.size.width = that.size.height * that.aspectRatio;
			}
			that.position.top = that._helper ? co.top : 0;
		}

		that.offset.left = that.parentData.left+that.position.left;
		that.offset.top = that.parentData.top+that.position.top;

		woset = Math.abs( (that._helper ? that.offset.left - cop.left : (that.offset.left - cop.left)) + that.sizeDiff.width );
		hoset = Math.abs( (that._helper ? that.offset.top - cop.top : (that.offset.top - co.top)) + that.sizeDiff.height );

		isParent = that.containerElement.get(0) === that.element.parent().get(0);
		isOffsetRelative = /relative|absolute/.test(that.containerElement.css("position"));

		if ( isParent && isOffsetRelative ) {
			woset -= Math.abs( that.parentData.left );
		}

		if (woset + that.size.width >= that.parentData.width) {
			that.size.width = that.parentData.width - woset;
			if (pRatio) {
				that.size.height = that.size.width / that.aspectRatio;
			}
		}

		if (hoset + that.size.height >= that.parentData.height) {
			that.size.height = that.parentData.height - hoset;
			if (pRatio) {
				that.size.width = that.size.height * that.aspectRatio;
			}
		}
	},

	stop: function(){
		var that = $(this).data("ui-resizable"),
			o = that.options,
			co = that.containerOffset,
			cop = that.containerPosition,
			ce = that.containerElement,
			helper = $(that.helper),
			ho = helper.offset(),
			w = helper.outerWidth() - that.sizeDiff.width,
			h = helper.outerHeight() - that.sizeDiff.height;

		if (that._helper && !o.animate && (/relative/).test(ce.css("position"))) {
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });
		}

		if (that._helper && !o.animate && (/static/).test(ce.css("position"))) {
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });
		}

	}
});

$.ui.plugin.add("resizable", "alsoResize", {

	start: function () {
		var that = $(this).data("ui-resizable"),
			o = that.options,
			_store = function (exp) {
				$(exp).each(function() {
					var el = $(this);
					el.data("ui-resizable-alsoresize", {
						width: parseInt(el.width(), 10), height: parseInt(el.height(), 10),
						left: parseInt(el.css("left"), 10), top: parseInt(el.css("top"), 10)
					});
				});
			};

		if (typeof(o.alsoResize) === "object" && !o.alsoResize.parentNode) {
			if (o.alsoResize.length) { o.alsoResize = o.alsoResize[0]; _store(o.alsoResize); }
			else { $.each(o.alsoResize, function (exp) { _store(exp); }); }
		}else{
			_store(o.alsoResize);
		}
	},

	resize: function (event, ui) {
		var that = $(this).data("ui-resizable"),
			o = that.options,
			os = that.originalSize,
			op = that.originalPosition,
			delta = {
				height: (that.size.height - os.height) || 0, width: (that.size.width - os.width) || 0,
				top: (that.position.top - op.top) || 0, left: (that.position.left - op.left) || 0
			},

			_alsoResize = function (exp, c) {
				$(exp).each(function() {
					var el = $(this), start = $(this).data("ui-resizable-alsoresize"), style = {},
						css = c && c.length ? c : el.parents(ui.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];

					$.each(css, function (i, prop) {
						var sum = (start[prop]||0) + (delta[prop]||0);
						if (sum && sum >= 0) {
							style[prop] = sum || null;
						}
					});

					el.css(style);
				});
			};

		if (typeof(o.alsoResize) === "object" && !o.alsoResize.nodeType) {
			$.each(o.alsoResize, function (exp, c) { _alsoResize(exp, c); });
		}else{
			_alsoResize(o.alsoResize);
		}
	},

	stop: function () {
		$(this).removeData("resizable-alsoresize");
	}
});

$.ui.plugin.add("resizable", "ghost", {

	start: function() {

		var that = $(this).data("ui-resizable"), o = that.options, cs = that.size;

		that.ghost = that.originalElement.clone();
		that.ghost
			.css({ opacity: 0.25, display: "block", position: "relative", height: cs.height, width: cs.width, margin: 0, left: 0, top: 0 })
			.addClass("ui-resizable-ghost")
			.addClass(typeof o.ghost === "string" ? o.ghost : "");

		that.ghost.appendTo(that.helper);

	},

	resize: function(){
		var that = $(this).data("ui-resizable");
		if (that.ghost) {
			that.ghost.css({ position: "relative", height: that.size.height, width: that.size.width });
		}
	},

	stop: function() {
		var that = $(this).data("ui-resizable");
		if (that.ghost && that.helper) {
			that.helper.get(0).removeChild(that.ghost.get(0));
		}
	}

});

$.ui.plugin.add("resizable", "grid", {

	resize: function() {
		var that = $(this).data("ui-resizable"),
			o = that.options,
			cs = that.size,
			os = that.originalSize,
			op = that.originalPosition,
			a = that.axis,
			grid = typeof o.grid === "number" ? [o.grid, o.grid] : o.grid,
			gridX = (grid[0]||1),
			gridY = (grid[1]||1),
			ox = Math.round((cs.width - os.width) / gridX) * gridX,
			oy = Math.round((cs.height - os.height) / gridY) * gridY,
			newWidth = os.width + ox,
			newHeight = os.height + oy,
			isMaxWidth = o.maxWidth && (o.maxWidth < newWidth),
			isMaxHeight = o.maxHeight && (o.maxHeight < newHeight),
			isMinWidth = o.minWidth && (o.minWidth > newWidth),
			isMinHeight = o.minHeight && (o.minHeight > newHeight);

		o.grid = grid;

		if (isMinWidth) {
			newWidth = newWidth + gridX;
		}
		if (isMinHeight) {
			newHeight = newHeight + gridY;
		}
		if (isMaxWidth) {
			newWidth = newWidth - gridX;
		}
		if (isMaxHeight) {
			newHeight = newHeight - gridY;
		}

		if (/^(se|s|e)$/.test(a)) {
			that.size.width = newWidth;
			that.size.height = newHeight;
		} else if (/^(ne)$/.test(a)) {
			that.size.width = newWidth;
			that.size.height = newHeight;
			that.position.top = op.top - oy;
		} else if (/^(sw)$/.test(a)) {
			that.size.width = newWidth;
			that.size.height = newHeight;
			that.position.left = op.left - ox;
		} else {
			if ( newHeight - gridY > 0 ) {
				that.size.height = newHeight;
				that.position.top = op.top - oy;
			} else {
				that.size.height = gridY;
				that.position.top = op.top + os.height - gridY;
			}
			if ( newWidth - gridX > 0 ) {
				that.size.width = newWidth;
				that.position.left = op.left - ox;
			} else {
				that.size.width = gridX;
				that.position.left = op.left + os.width - gridX;
			}
		}
	}

});

})(jQuery);

/*!
 * jQuery UI Sortable 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/sortable/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

function isOverAxis( x, reference, size ) {
	return ( x > reference ) && ( x < ( reference + size ) );
}

function isFloating(item) {
	return (/left|right/).test(item.css("float")) || (/inline|table-cell/).test(item.css("display"));
}

$.widget("ui.sortable", $.ui.mouse, {
	version: "1.10.4",
	widgetEventPrefix: "sort",
	ready: false,
	options: {
		appendTo: "parent",
		axis: false,
		connectWith: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		dropOnEmpty: true,
		forcePlaceholderSize: false,
		forceHelperSize: false,
		grid: false,
		handle: false,
		helper: "original",
		items: "> *",
		opacity: false,
		placeholder: false,
		revert: false,
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		scope: "default",
		tolerance: "intersect",
		zIndex: 1000,

		// callbacks
		activate: null,
		beforeStop: null,
		change: null,
		deactivate: null,
		out: null,
		over: null,
		receive: null,
		remove: null,
		sort: null,
		start: null,
		stop: null,
		update: null
	},
	_create: function() {

		var o = this.options;
		this.containerCache = {};
		this.element.addClass("ui-sortable");

		//Get the items
		this.refresh();

		//Let's determine if the items are being displayed horizontally
		this.floating = this.items.length ? o.axis === "x" || isFloating(this.items[0].item) : false;

		//Let's determine the parent's offset
		this.offset = this.element.offset();

		//Initialize mouse events for interaction
		this._mouseInit();

		//We're ready to go
		this.ready = true;

	},

	_destroy: function() {
		this.element
			.removeClass("ui-sortable ui-sortable-disabled");
		this._mouseDestroy();

		for ( var i = this.items.length - 1; i >= 0; i-- ) {
			this.items[i].item.removeData(this.widgetName + "-item");
		}

		return this;
	},

	_setOption: function(key, value){
		if ( key === "disabled" ) {
			this.options[ key ] = value;

			this.widget().toggleClass( "ui-sortable-disabled", !!value );
		} else {
			// Don't call widget base _setOption for disable as it adds ui-state-disabled class
			$.Widget.prototype._setOption.apply(this, arguments);
		}
	},

	_mouseCapture: function(event, overrideHandle) {
		var currentItem = null,
			validHandle = false,
			that = this;

		if (this.reverting) {
			return false;
		}

		if(this.options.disabled || this.options.type === "static") {
			return false;
		}

		//We have to refresh the items data once first
		this._refreshItems(event);

		//Find out if the clicked node (or one of its parents) is a actual item in this.items
		$(event.target).parents().each(function() {
			if($.data(this, that.widgetName + "-item") === that) {
				currentItem = $(this);
				return false;
			}
		});
		if($.data(event.target, that.widgetName + "-item") === that) {
			currentItem = $(event.target);
		}

		if(!currentItem) {
			return false;
		}
		if(this.options.handle && !overrideHandle) {
			$(this.options.handle, currentItem).find("*").addBack().each(function() {
				if(this === event.target) {
					validHandle = true;
				}
			});
			if(!validHandle) {
				return false;
			}
		}

		this.currentItem = currentItem;
		this._removeCurrentsFromItems();
		return true;

	},

	_mouseStart: function(event, overrideHandle, noActivation) {

		var i, body,
			o = this.options;

		this.currentContainer = this;

		//We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
		this.refreshPositions();

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Get the next scrolling parent
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.currentItem.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		// Only after we got the offset, we can change the helper's position to absolute
		// TODO: Still need to figure out a way to make relative sorting possible
		this.helper.css("position", "absolute");
		this.cssPosition = this.helper.css("position");

		//Generate the original position
		this.originalPosition = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Cache the former DOM position
		this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };

		//If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
		if(this.helper[0] !== this.currentItem[0]) {
			this.currentItem.hide();
		}

		//Create the placeholder
		this._createPlaceholder();

		//Set a containment if given in the options
		if(o.containment) {
			this._setContainment();
		}

		if( o.cursor && o.cursor !== "auto" ) { // cursor option
			body = this.document.find( "body" );

			// support: IE
			this.storedCursor = body.css( "cursor" );
			body.css( "cursor", o.cursor );

			this.storedStylesheet = $( "<style>*{ cursor: "+o.cursor+" !important; }</style>" ).appendTo( body );
		}

		if(o.opacity) { // opacity option
			if (this.helper.css("opacity")) {
				this._storedOpacity = this.helper.css("opacity");
			}
			this.helper.css("opacity", o.opacity);
		}

		if(o.zIndex) { // zIndex option
			if (this.helper.css("zIndex")) {
				this._storedZIndex = this.helper.css("zIndex");
			}
			this.helper.css("zIndex", o.zIndex);
		}

		//Prepare scrolling
		if(this.scrollParent[0] !== document && this.scrollParent[0].tagName !== "HTML") {
			this.overflowOffset = this.scrollParent.offset();
		}

		//Call callbacks
		this._trigger("start", event, this._uiHash());

		//Recache the helper size
		if(!this._preserveHelperProportions) {
			this._cacheHelperProportions();
		}


		//Post "activate" events to possible containers
		if( !noActivation ) {
			for ( i = this.containers.length - 1; i >= 0; i-- ) {
				this.containers[ i ]._trigger( "activate", event, this._uiHash( this ) );
			}
		}

		//Prepare possible droppables
		if($.ui.ddmanager) {
			$.ui.ddmanager.current = this;
		}

		if ($.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(this, event);
		}

		this.dragging = true;

		this.helper.addClass("ui-sortable-helper");
		this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		return true;

	},

	_mouseDrag: function(event) {
		var i, item, itemElement, intersection,
			o = this.options,
			scrolled = false;

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		if (!this.lastPositionAbs) {
			this.lastPositionAbs = this.positionAbs;
		}

		//Do scrolling
		if(this.options.scroll) {
			if(this.scrollParent[0] !== document && this.scrollParent[0].tagName !== "HTML") {

				if((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
				} else if(event.pageY - this.overflowOffset.top < o.scrollSensitivity) {
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;
				}

				if((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
				} else if(event.pageX - this.overflowOffset.left < o.scrollSensitivity) {
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;
				}

			} else {

				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				} else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
				}

				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				} else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
				}

			}

			if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
				$.ui.ddmanager.prepareOffsets(this, event);
			}
		}

		//Regenerate the absolute position used for position checks
		this.positionAbs = this._convertPositionTo("absolute");

		//Set the helper position
		if(!this.options.axis || this.options.axis !== "y") {
			this.helper[0].style.left = this.position.left+"px";
		}
		if(!this.options.axis || this.options.axis !== "x") {
			this.helper[0].style.top = this.position.top+"px";
		}

		//Rearrange
		for (i = this.items.length - 1; i >= 0; i--) {

			//Cache variables and intersection, continue if no intersection
			item = this.items[i];
			itemElement = item.item[0];
			intersection = this._intersectsWithPointer(item);
			if (!intersection) {
				continue;
			}

			// Only put the placeholder inside the current Container, skip all
			// items from other containers. This works because when moving
			// an item from one container to another the
			// currentContainer is switched before the placeholder is moved.
			//
			// Without this, moving items in "sub-sortables" can cause
			// the placeholder to jitter beetween the outer and inner container.
			if (item.instance !== this.currentContainer) {
				continue;
			}

			// cannot intersect with itself
			// no useless actions that have been done before
			// no action if the item moved is the parent of the item checked
			if (itemElement !== this.currentItem[0] &&
				this.placeholder[intersection === 1 ? "next" : "prev"]()[0] !== itemElement &&
				!$.contains(this.placeholder[0], itemElement) &&
				(this.options.type === "semi-dynamic" ? !$.contains(this.element[0], itemElement) : true)
			) {

				this.direction = intersection === 1 ? "down" : "up";

				if (this.options.tolerance === "pointer" || this._intersectsWithSides(item)) {
					this._rearrange(event, item);
				} else {
					break;
				}

				this._trigger("change", event, this._uiHash());
				break;
			}
		}

		//Post events to containers
		this._contactContainers(event);

		//Interconnect with droppables
		if($.ui.ddmanager) {
			$.ui.ddmanager.drag(this, event);
		}

		//Call callbacks
		this._trigger("sort", event, this._uiHash());

		this.lastPositionAbs = this.positionAbs;
		return false;

	},

	_mouseStop: function(event, noPropagation) {

		if(!event) {
			return;
		}

		//If we are using droppables, inform the manager about the drop
		if ($.ui.ddmanager && !this.options.dropBehaviour) {
			$.ui.ddmanager.drop(this, event);
		}

		if(this.options.revert) {
			var that = this,
				cur = this.placeholder.offset(),
				axis = this.options.axis,
				animation = {};

			if ( !axis || axis === "x" ) {
				animation.left = cur.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollLeft);
			}
			if ( !axis || axis === "y" ) {
				animation.top = cur.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollTop);
			}
			this.reverting = true;
			$(this.helper).animate( animation, parseInt(this.options.revert, 10) || 500, function() {
				that._clear(event);
			});
		} else {
			this._clear(event, noPropagation);
		}

		return false;

	},

	cancel: function() {

		if(this.dragging) {

			this._mouseUp({ target: null });

			if(this.options.helper === "original") {
				this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
			} else {
				this.currentItem.show();
			}

			//Post deactivating events to containers
			for (var i = this.containers.length - 1; i >= 0; i--){
				this.containers[i]._trigger("deactivate", null, this._uiHash(this));
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", null, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		if (this.placeholder) {
			//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
			if(this.placeholder[0].parentNode) {
				this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
			}
			if(this.options.helper !== "original" && this.helper && this.helper[0].parentNode) {
				this.helper.remove();
			}

			$.extend(this, {
				helper: null,
				dragging: false,
				reverting: false,
				_noFinalSort: null
			});

			if(this.domPosition.prev) {
				$(this.domPosition.prev).after(this.currentItem);
			} else {
				$(this.domPosition.parent).prepend(this.currentItem);
			}
		}

		return this;

	},

	serialize: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected),
			str = [];
		o = o || {};

		$(items).each(function() {
			var res = ($(o.item || this).attr(o.attribute || "id") || "").match(o.expression || (/(.+)[\-=_](.+)/));
			if (res) {
				str.push((o.key || res[1]+"[]")+"="+(o.key && o.expression ? res[1] : res[2]));
			}
		});

		if(!str.length && o.key) {
			str.push(o.key + "=");
		}

		return str.join("&");

	},

	toArray: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected),
			ret = [];

		o = o || {};

		items.each(function() { ret.push($(o.item || this).attr(o.attribute || "id") || ""); });
		return ret;

	},

	/* Be careful with the following core functions */
	_intersectsWith: function(item) {

		var x1 = this.positionAbs.left,
			x2 = x1 + this.helperProportions.width,
			y1 = this.positionAbs.top,
			y2 = y1 + this.helperProportions.height,
			l = item.left,
			r = l + item.width,
			t = item.top,
			b = t + item.height,
			dyClick = this.offset.click.top,
			dxClick = this.offset.click.left,
			isOverElementHeight = ( this.options.axis === "x" ) || ( ( y1 + dyClick ) > t && ( y1 + dyClick ) < b ),
			isOverElementWidth = ( this.options.axis === "y" ) || ( ( x1 + dxClick ) > l && ( x1 + dxClick ) < r ),
			isOverElement = isOverElementHeight && isOverElementWidth;

		if ( this.options.tolerance === "pointer" ||
			this.options.forcePointerForContainers ||
			(this.options.tolerance !== "pointer" && this.helperProportions[this.floating ? "width" : "height"] > item[this.floating ? "width" : "height"])
		) {
			return isOverElement;
		} else {

			return (l < x1 + (this.helperProportions.width / 2) && // Right Half
				x2 - (this.helperProportions.width / 2) < r && // Left Half
				t < y1 + (this.helperProportions.height / 2) && // Bottom Half
				y2 - (this.helperProportions.height / 2) < b ); // Top Half

		}
	},

	_intersectsWithPointer: function(item) {

		var isOverElementHeight = (this.options.axis === "x") || isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
			isOverElementWidth = (this.options.axis === "y") || isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
			isOverElement = isOverElementHeight && isOverElementWidth,
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (!isOverElement) {
			return false;
		}

		return this.floating ?
			( ((horizontalDirection && horizontalDirection === "right") || verticalDirection === "down") ? 2 : 1 )
			: ( verticalDirection && (verticalDirection === "down" ? 2 : 1) );

	},

	_intersectsWithSides: function(item) {

		var isOverBottomHalf = isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height/2), item.height),
			isOverRightHalf = isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width/2), item.width),
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (this.floating && horizontalDirection) {
			return ((horizontalDirection === "right" && isOverRightHalf) || (horizontalDirection === "left" && !isOverRightHalf));
		} else {
			return verticalDirection && ((verticalDirection === "down" && isOverBottomHalf) || (verticalDirection === "up" && !isOverBottomHalf));
		}

	},

	_getDragVerticalDirection: function() {
		var delta = this.positionAbs.top - this.lastPositionAbs.top;
		return delta !== 0 && (delta > 0 ? "down" : "up");
	},

	_getDragHorizontalDirection: function() {
		var delta = this.positionAbs.left - this.lastPositionAbs.left;
		return delta !== 0 && (delta > 0 ? "right" : "left");
	},

	refresh: function(event) {
		this._refreshItems(event);
		this.refreshPositions();
		return this;
	},

	_connectWith: function() {
		var options = this.options;
		return options.connectWith.constructor === String ? [options.connectWith] : options.connectWith;
	},

	_getItemsAsjQuery: function(connected) {

		var i, j, cur, inst,
			items = [],
			queries = [],
			connectWith = this._connectWith();

		if(connectWith && connected) {
			for (i = connectWith.length - 1; i >= 0; i--){
				cur = $(connectWith[i]);
				for ( j = cur.length - 1; j >= 0; j--){
					inst = $.data(cur[j], this.widgetFullName);
					if(inst && inst !== this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), inst]);
					}
				}
			}
		}

		queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);

		function addItems() {
			items.push( this );
		}
		for (i = queries.length - 1; i >= 0; i--){
			queries[i][0].each( addItems );
		}

		return $(items);

	},

	_removeCurrentsFromItems: function() {

		var list = this.currentItem.find(":data(" + this.widgetName + "-item)");

		this.items = $.grep(this.items, function (item) {
			for (var j=0; j < list.length; j++) {
				if(list[j] === item.item[0]) {
					return false;
				}
			}
			return true;
		});

	},

	_refreshItems: function(event) {

		this.items = [];
		this.containers = [this];

		var i, j, cur, inst, targetData, _queries, item, queriesLength,
			items = this.items,
			queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : $(this.options.items, this.element), this]],
			connectWith = this._connectWith();

		if(connectWith && this.ready) { //Shouldn't be run the first time through due to massive slow-down
			for (i = connectWith.length - 1; i >= 0; i--){
				cur = $(connectWith[i]);
				for (j = cur.length - 1; j >= 0; j--){
					inst = $.data(cur[j], this.widgetFullName);
					if(inst && inst !== this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : $(inst.options.items, inst.element), inst]);
						this.containers.push(inst);
					}
				}
			}
		}

		for (i = queries.length - 1; i >= 0; i--) {
			targetData = queries[i][1];
			_queries = queries[i][0];

			for (j=0, queriesLength = _queries.length; j < queriesLength; j++) {
				item = $(_queries[j]);

				item.data(this.widgetName + "-item", targetData); // Data for target checking (mouse manager)

				items.push({
					item: item,
					instance: targetData,
					width: 0, height: 0,
					left: 0, top: 0
				});
			}
		}

	},

	refreshPositions: function(fast) {

		//This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
		if(this.offsetParent && this.helper) {
			this.offset.parent = this._getParentOffset();
		}

		var i, item, t, p;

		for (i = this.items.length - 1; i >= 0; i--){
			item = this.items[i];

			//We ignore calculating positions of all connected containers when we're not over them
			if(item.instance !== this.currentContainer && this.currentContainer && item.item[0] !== this.currentItem[0]) {
				continue;
			}

			t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

			if (!fast) {
				item.width = t.outerWidth();
				item.height = t.outerHeight();
			}

			p = t.offset();
			item.left = p.left;
			item.top = p.top;
		}

		if(this.options.custom && this.options.custom.refreshContainers) {
			this.options.custom.refreshContainers.call(this);
		} else {
			for (i = this.containers.length - 1; i >= 0; i--){
				p = this.containers[i].element.offset();
				this.containers[i].containerCache.left = p.left;
				this.containers[i].containerCache.top = p.top;
				this.containers[i].containerCache.width	= this.containers[i].element.outerWidth();
				this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
			}
		}

		return this;
	},

	_createPlaceholder: function(that) {
		that = that || this;
		var className,
			o = that.options;

		if(!o.placeholder || o.placeholder.constructor === String) {
			className = o.placeholder;
			o.placeholder = {
				element: function() {

					var nodeName = that.currentItem[0].nodeName.toLowerCase(),
						element = $( "<" + nodeName + ">", that.document[0] )
							.addClass(className || that.currentItem[0].className+" ui-sortable-placeholder")
							.removeClass("ui-sortable-helper");

					if ( nodeName === "tr" ) {
						that.currentItem.children().each(function() {
							$( "<td>&#160;</td>", that.document[0] )
								.attr( "colspan", $( this ).attr( "colspan" ) || 1 )
								.appendTo( element );
						});
					} else if ( nodeName === "img" ) {
						element.attr( "src", that.currentItem.attr( "src" ) );
					}

					if ( !className ) {
						element.css( "visibility", "hidden" );
					}

					return element;
				},
				update: function(container, p) {

					// 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
					// 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
					if(className && !o.forcePlaceholderSize) {
						return;
					}

					//If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
					if(!p.height()) { p.height(that.currentItem.innerHeight() - parseInt(that.currentItem.css("paddingTop")||0, 10) - parseInt(that.currentItem.css("paddingBottom")||0, 10)); }
					if(!p.width()) { p.width(that.currentItem.innerWidth() - parseInt(that.currentItem.css("paddingLeft")||0, 10) - parseInt(that.currentItem.css("paddingRight")||0, 10)); }
				}
			};
		}

		//Create the placeholder
		that.placeholder = $(o.placeholder.element.call(that.element, that.currentItem));

		//Append it after the actual current item
		that.currentItem.after(that.placeholder);

		//Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
		o.placeholder.update(that, that.placeholder);

	},

	_contactContainers: function(event) {
		var i, j, dist, itemWithLeastDistance, posProperty, sizeProperty, base, cur, nearBottom, floating,
			innermostContainer = null,
			innermostIndex = null;

		// get innermost container that intersects with item
		for (i = this.containers.length - 1; i >= 0; i--) {

			// never consider a container that's located within the item itself
			if($.contains(this.currentItem[0], this.containers[i].element[0])) {
				continue;
			}

			if(this._intersectsWith(this.containers[i].containerCache)) {

				// if we've already found a container and it's more "inner" than this, then continue
				if(innermostContainer && $.contains(this.containers[i].element[0], innermostContainer.element[0])) {
					continue;
				}

				innermostContainer = this.containers[i];
				innermostIndex = i;

			} else {
				// container doesn't intersect. trigger "out" event if necessary
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", event, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		// if no intersecting containers found, return
		if(!innermostContainer) {
			return;
		}

		// move the item into the container if it's not there already
		if(this.containers.length === 1) {
			if (!this.containers[innermostIndex].containerCache.over) {
				this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
				this.containers[innermostIndex].containerCache.over = 1;
			}
		} else {

			//When entering a new container, we will find the item with the least distance and append our item near it
			dist = 10000;
			itemWithLeastDistance = null;
			floating = innermostContainer.floating || isFloating(this.currentItem);
			posProperty = floating ? "left" : "top";
			sizeProperty = floating ? "width" : "height";
			base = this.positionAbs[posProperty] + this.offset.click[posProperty];
			for (j = this.items.length - 1; j >= 0; j--) {
				if(!$.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) {
					continue;
				}
				if(this.items[j].item[0] === this.currentItem[0]) {
					continue;
				}
				if (floating && !isOverAxis(this.positionAbs.top + this.offset.click.top, this.items[j].top, this.items[j].height)) {
					continue;
				}
				cur = this.items[j].item.offset()[posProperty];
				nearBottom = false;
				if(Math.abs(cur - base) > Math.abs(cur + this.items[j][sizeProperty] - base)){
					nearBottom = true;
					cur += this.items[j][sizeProperty];
				}

				if(Math.abs(cur - base) < dist) {
					dist = Math.abs(cur - base); itemWithLeastDistance = this.items[j];
					this.direction = nearBottom ? "up": "down";
				}
			}

			//Check if dropOnEmpty is enabled
			if(!itemWithLeastDistance && !this.options.dropOnEmpty) {
				return;
			}

			if(this.currentContainer === this.containers[innermostIndex]) {
				return;
			}

			itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);
			this._trigger("change", event, this._uiHash());
			this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));
			this.currentContainer = this.containers[innermostIndex];

			//Update the placeholder
			this.options.placeholder.update(this.currentContainer, this.placeholder);

			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
			this.containers[innermostIndex].containerCache.over = 1;
		}


	},

	_createHelper: function(event) {

		var o = this.options,
			helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper === "clone" ? this.currentItem.clone() : this.currentItem);

		//Add the helper to the DOM if that didn't happen already
		if(!helper.parents("body").length) {
			$(o.appendTo !== "parent" ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);
		}

		if(helper[0] === this.currentItem[0]) {
			this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") };
		}

		if(!helper[0].style.width || o.forceHelperSize) {
			helper.width(this.currentItem.width());
		}
		if(!helper[0].style.height || o.forceHelperSize) {
			helper.height(this.currentItem.height());
		}

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj === "string") {
			obj = obj.split(" ");
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ("left" in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ("right" in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ("top" in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ("bottom" in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {


		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		// This needs to be actually done for all browsers, since pageX/pageY includes this information
		// with an ugly IE fix
		if( this.offsetParent[0] === document.body || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie)) {
			po = { top: 0, left: 0 };
		}

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition === "relative") {
			var p = this.currentItem.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.currentItem.css("marginLeft"),10) || 0),
			top: (parseInt(this.currentItem.css("marginTop"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var ce, co, over,
			o = this.options;
		if(o.containment === "parent") {
			o.containment = this.helper[0].parentNode;
		}
		if(o.containment === "document" || o.containment === "window") {
			this.containment = [
				0 - this.offset.relative.left - this.offset.parent.left,
				0 - this.offset.relative.top - this.offset.parent.top,
				$(o.containment === "document" ? document : window).width() - this.helperProportions.width - this.margins.left,
				($(o.containment === "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
			];
		}

		if(!(/^(document|window|parent)$/).test(o.containment)) {
			ce = $(o.containment)[0];
			co = $(o.containment).offset();
			over = ($(ce).css("overflow") !== "hidden");

			this.containment = [
				co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
				co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
				co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
				co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
			];
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) {
			pos = this.position;
		}
		var mod = d === "absolute" ? 1 : -1,
			scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
			scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top	+																// The absolute mouse position
				this.offset.relative.top * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top * mod -											// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left +																// The absolute mouse position
				this.offset.relative.left * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var top, left,
			o = this.options,
			pageX = event.pageX,
			pageY = event.pageY,
			scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		// This is another very weird special case that only happens for relative elements:
		// 1. If the css position is relative
		// 2. and the scroll parent is the document or similar to the offset parent
		// we have to refresh the relative offset during the scroll so there are no jumps
		if(this.cssPosition === "relative" && !(this.scrollParent[0] !== document && this.scrollParent[0] !== this.offsetParent[0])) {
			this.offset.relative = this._getRelativeOffset();
		}

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options

			if(this.containment) {
				if(event.pageX - this.offset.click.left < this.containment[0]) {
					pageX = this.containment[0] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top < this.containment[1]) {
					pageY = this.containment[1] + this.offset.click.top;
				}
				if(event.pageX - this.offset.click.left > this.containment[2]) {
					pageX = this.containment[2] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top > this.containment[3]) {
					pageY = this.containment[3] + this.offset.click.top;
				}
			}

			if(o.grid) {
				top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? ( (top - this.offset.click.top >= this.containment[1] && top - this.offset.click.top <= this.containment[3]) ? top : ((top - this.offset.click.top >= this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? ( (left - this.offset.click.left >= this.containment[0] && left - this.offset.click.left <= this.containment[2]) ? left : ((left - this.offset.click.left >= this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY -																// The absolute mouse position
				this.offset.click.top -													// Click offset (relative to the element)
				this.offset.relative.top	-											// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top +												// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX -																// The absolute mouse position
				this.offset.click.left -												// Click offset (relative to the element)
				this.offset.relative.left	-											// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left +												// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_rearrange: function(event, i, a, hardRefresh) {

		a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction === "down" ? i.item[0] : i.item[0].nextSibling));

		//Various things done here to improve the performance:
		// 1. we create a setTimeout, that calls refreshPositions
		// 2. on the instance, we have a counter variable, that get's higher after every append
		// 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
		// 4. this lets only the last addition to the timeout stack through
		this.counter = this.counter ? ++this.counter : 1;
		var counter = this.counter;

		this._delay(function() {
			if(counter === this.counter) {
				this.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
			}
		});

	},

	_clear: function(event, noPropagation) {

		this.reverting = false;
		// We delay all events that have to be triggered to after the point where the placeholder has been removed and
		// everything else normalized again
		var i,
			delayedTriggers = [];

		// We first have to update the dom position of the actual currentItem
		// Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
		if(!this._noFinalSort && this.currentItem.parent().length) {
			this.placeholder.before(this.currentItem);
		}
		this._noFinalSort = null;

		if(this.helper[0] === this.currentItem[0]) {
			for(i in this._storedCSS) {
				if(this._storedCSS[i] === "auto" || this._storedCSS[i] === "static") {
					this._storedCSS[i] = "";
				}
			}
			this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
		} else {
			this.currentItem.show();
		}

		if(this.fromOutside && !noPropagation) {
			delayedTriggers.push(function(event) { this._trigger("receive", event, this._uiHash(this.fromOutside)); });
		}
		if((this.fromOutside || this.domPosition.prev !== this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent !== this.currentItem.parent()[0]) && !noPropagation) {
			delayedTriggers.push(function(event) { this._trigger("update", event, this._uiHash()); }); //Trigger update callback if the DOM position has changed
		}

		// Check if the items Container has Changed and trigger appropriate
		// events.
		if (this !== this.currentContainer) {
			if(!noPropagation) {
				delayedTriggers.push(function(event) { this._trigger("remove", event, this._uiHash()); });
				delayedTriggers.push((function(c) { return function(event) { c._trigger("receive", event, this._uiHash(this)); };  }).call(this, this.currentContainer));
				delayedTriggers.push((function(c) { return function(event) { c._trigger("update", event, this._uiHash(this));  }; }).call(this, this.currentContainer));
			}
		}


		//Post events to containers
		function delayEvent( type, instance, container ) {
			return function( event ) {
				container._trigger( type, event, instance._uiHash( instance ) );
			};
		}
		for (i = this.containers.length - 1; i >= 0; i--){
			if (!noPropagation) {
				delayedTriggers.push( delayEvent( "deactivate", this, this.containers[ i ] ) );
			}
			if(this.containers[i].containerCache.over) {
				delayedTriggers.push( delayEvent( "out", this, this.containers[ i ] ) );
				this.containers[i].containerCache.over = 0;
			}
		}

		//Do what was originally in plugins
		if ( this.storedCursor ) {
			this.document.find( "body" ).css( "cursor", this.storedCursor );
			this.storedStylesheet.remove();
		}
		if(this._storedOpacity) {
			this.helper.css("opacity", this._storedOpacity);
		}
		if(this._storedZIndex) {
			this.helper.css("zIndex", this._storedZIndex === "auto" ? "" : this._storedZIndex);
		}

		this.dragging = false;
		if(this.cancelHelperRemoval) {
			if(!noPropagation) {
				this._trigger("beforeStop", event, this._uiHash());
				for (i=0; i < delayedTriggers.length; i++) {
					delayedTriggers[i].call(this, event);
				} //Trigger all delayed events
				this._trigger("stop", event, this._uiHash());
			}

			this.fromOutside = false;
			return false;
		}

		if(!noPropagation) {
			this._trigger("beforeStop", event, this._uiHash());
		}

		//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
		this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

		if(this.helper[0] !== this.currentItem[0]) {
			this.helper.remove();
		}
		this.helper = null;

		if(!noPropagation) {
			for (i=0; i < delayedTriggers.length; i++) {
				delayedTriggers[i].call(this, event);
			} //Trigger all delayed events
			this._trigger("stop", event, this._uiHash());
		}

		this.fromOutside = false;
		return true;

	},

	_trigger: function() {
		if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
			this.cancel();
		}
	},

	_uiHash: function(_inst) {
		var inst = _inst || this;
		return {
			helper: inst.helper,
			placeholder: inst.placeholder || $([]),
			position: inst.position,
			originalPosition: inst.originalPosition,
			offset: inst.positionAbs,
			item: inst.currentItem,
			sender: _inst ? _inst.element : null
		};
	}

});

})(jQuery);

/*
 * jQuery File Upload Plugin 5.32.6
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true, unparam: true, regexp: true */
/*global define, window, document, location, File, Blob, FormData */

(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define([
            'jquery',
            'jquery.ui.widget'
        ], factory);
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
}(function ($) {
    'use strict';

    // Detect file input support, based on
    // http://viljamis.com/blog/2012/file-upload-support-on-mobile/
    $.support.fileInput = !(new RegExp(
        // Handle devices which give false positives for the feature detection:
        '(Android (1\\.[0156]|2\\.[01]))' +
            '|(Windows Phone (OS 7|8\\.0))|(XBLWP)|(ZuneWP)|(WPDesktop)' +
            '|(w(eb)?OSBrowser)|(webOS)' +
            '|(Kindle/(1\\.0|2\\.[05]|3\\.0))'
    ).test(window.navigator.userAgent) ||
        // Feature detection for all other devices:
        $('<input type="file">').prop('disabled'));

    // The FileReader API is not actually used, but works as feature detection,
    // as e.g. Safari supports XHR file uploads via the FormData API,
    // but not non-multipart XHR file uploads:
    $.support.xhrFileUpload = !!(window.XMLHttpRequestUpload && window.FileReader);
    $.support.xhrFormDataFileUpload = !!window.FormData;

    // Detect support for Blob slicing (required for chunked uploads):
    $.support.blobSlice = window.Blob && (Blob.prototype.slice ||
        Blob.prototype.webkitSlice || Blob.prototype.mozSlice);

    // The fileupload widget listens for change events on file input fields defined
    // via fileInput setting and paste or drop events of the given dropZone.
    // In addition to the default jQuery Widget methods, the fileupload widget
    // exposes the "add" and "send" methods, to add or directly send files using
    // the fileupload API.
    // By default, files added via file input selection, paste, drag & drop or
    // "add" method are uploaded immediately, but it is possible to override
    // the "add" callback option to queue file uploads.
    $.widget('blueimp.fileupload', {

        options: {
            // The drop target element(s), by the default the complete document.
            // Set to null to disable drag & drop support:
            dropZone: $(document),
            // The paste target element(s), by the default the complete document.
            // Set to null to disable paste support:
            pasteZone: $(document),
            // The file input field(s), that are listened to for change events.
            // If undefined, it is set to the file input fields inside
            // of the widget element on plugin initialization.
            // Set to null to disable the change listener.
            fileInput: undefined,
            // By default, the file input field is replaced with a clone after
            // each input field change event. This is required for iframe transport
            // queues and allows change events to be fired for the same file
            // selection, but can be disabled by setting the following option to false:
            replaceFileInput: true,
            // The parameter name for the file form data (the request argument name).
            // If undefined or empty, the name property of the file input field is
            // used, or "files[]" if the file input name property is also empty,
            // can be a string or an array of strings:
            paramName: undefined,
            // By default, each file of a selection is uploaded using an individual
            // request for XHR type uploads. Set to false to upload file
            // selections in one request each:
            singleFileUploads: true,
            // To limit the number of files uploaded with one XHR request,
            // set the following option to an integer greater than 0:
            limitMultiFileUploads: undefined,
            // Set the following option to true to issue all file upload requests
            // in a sequential order:
            sequentialUploads: false,
            // To limit the number of concurrent uploads,
            // set the following option to an integer greater than 0:
            limitConcurrentUploads: undefined,
            // Set the following option to true to force iframe transport uploads:
            forceIframeTransport: false,
            // Set the following option to the location of a redirect url on the
            // origin server, for cross-domain iframe transport uploads:
            redirect: undefined,
            // The parameter name for the redirect url, sent as part of the form
            // data and set to 'redirect' if this option is empty:
            redirectParamName: undefined,
            // Set the following option to the location of a postMessage window,
            // to enable postMessage transport uploads:
            postMessage: undefined,
            // By default, XHR file uploads are sent as multipart/form-data.
            // The iframe transport is always using multipart/form-data.
            // Set to false to enable non-multipart XHR uploads:
            multipart: true,
            // To upload large files in smaller chunks, set the following option
            // to a preferred maximum chunk size. If set to 0, null or undefined,
            // or the browser does not support the required Blob API, files will
            // be uploaded as a whole.
            maxChunkSize: undefined,
            // When a non-multipart upload or a chunked multipart upload has been
            // aborted, this option can be used to resume the upload by setting
            // it to the size of the already uploaded bytes. This option is most
            // useful when modifying the options object inside of the "add" or
            // "send" callbacks, as the options are cloned for each file upload.
            uploadedBytes: undefined,
            // By default, failed (abort or error) file uploads are removed from the
            // global progress calculation. Set the following option to false to
            // prevent recalculating the global progress data:
            recalculateProgress: true,
            // Interval in milliseconds to calculate and trigger progress events:
            progressInterval: 100,
            // Interval in milliseconds to calculate progress bitrate:
            bitrateInterval: 500,
            // By default, uploads are started automatically when adding files:
            autoUpload: true,

            // Error and info messages:
            messages: {
                uploadedBytes: 'Uploaded bytes exceed file size'
            },

            // Translation function, gets the message key to be translated
            // and an object with context specific data as arguments:
            i18n: function (message, context) {
                message = this.messages[message] || message.toString();
                if (context) {
                    $.each(context, function (key, value) {
                        message = message.replace('{' + key + '}', value);
                    });
                }
                return message;
            },

            // Additional form data to be sent along with the file uploads can be set
            // using this option, which accepts an array of objects with name and
            // value properties, a function returning such an array, a FormData
            // object (for XHR file uploads), or a simple object.
            // The form of the first fileInput is given as parameter to the function:
            formData: function (form) {
                return form.serializeArray();
            },

            // The add callback is invoked as soon as files are added to the fileupload
            // widget (via file input selection, drag & drop, paste or add API call).
            // If the singleFileUploads option is enabled, this callback will be
            // called once for each file in the selection for XHR file uploads, else
            // once for each file selection.
            //
            // The upload starts when the submit method is invoked on the data parameter.
            // The data object contains a files property holding the added files
            // and allows you to override plugin options as well as define ajax settings.
            //
            // Listeners for this callback can also be bound the following way:
            // .bind('fileuploadadd', func);
            //
            // data.submit() returns a Promise object and allows to attach additional
            // handlers using jQuery's Deferred callbacks:
            // data.submit().done(func).fail(func).always(func);
            add: function (e, data) {
                if (data.autoUpload || (data.autoUpload !== false &&
                        $(this).fileupload('option', 'autoUpload'))) {
                    data.process().done(function () {
                        data.submit();
                    });
                }
            },

            // Other callbacks:

            // Callback for the submit event of each file upload:
            // submit: function (e, data) {}, // .bind('fileuploadsubmit', func);

            // Callback for the start of each file upload request:
            // send: function (e, data) {}, // .bind('fileuploadsend', func);

            // Callback for successful uploads:
            // done: function (e, data) {}, // .bind('fileuploaddone', func);

            // Callback for failed (abort or error) uploads:
            // fail: function (e, data) {}, // .bind('fileuploadfail', func);

            // Callback for completed (success, abort or error) requests:
            // always: function (e, data) {}, // .bind('fileuploadalways', func);

            // Callback for upload progress events:
            // progress: function (e, data) {}, // .bind('fileuploadprogress', func);

            // Callback for global upload progress events:
            // progressall: function (e, data) {}, // .bind('fileuploadprogressall', func);

            // Callback for uploads start, equivalent to the global ajaxStart event:
            // start: function (e) {}, // .bind('fileuploadstart', func);

            // Callback for uploads stop, equivalent to the global ajaxStop event:
            // stop: function (e) {}, // .bind('fileuploadstop', func);

            // Callback for change events of the fileInput(s):
            // change: function (e, data) {}, // .bind('fileuploadchange', func);

            // Callback for paste events to the pasteZone(s):
            // paste: function (e, data) {}, // .bind('fileuploadpaste', func);

            // Callback for drop events of the dropZone(s):
            // drop: function (e, data) {}, // .bind('fileuploaddrop', func);

            // Callback for dragover events of the dropZone(s):
            // dragover: function (e) {}, // .bind('fileuploaddragover', func);

            // Callback for the start of each chunk upload request:
            // chunksend: function (e, data) {}, // .bind('fileuploadchunksend', func);

            // Callback for successful chunk uploads:
            // chunkdone: function (e, data) {}, // .bind('fileuploadchunkdone', func);

            // Callback for failed (abort or error) chunk uploads:
            // chunkfail: function (e, data) {}, // .bind('fileuploadchunkfail', func);

            // Callback for completed (success, abort or error) chunk upload requests:
            // chunkalways: function (e, data) {}, // .bind('fileuploadchunkalways', func);

            // The plugin options are used as settings object for the ajax calls.
            // The following are jQuery ajax settings required for the file uploads:
            processData: false,
            contentType: false,
            cache: false
        },

        // A list of options that require reinitializing event listeners and/or
        // special initialization code:
        _specialOptions: [
            'fileInput',
            'dropZone',
            'pasteZone',
            'multipart',
            'forceIframeTransport'
        ],

        _blobSlice: $.support.blobSlice && function () {
            var slice = this.slice || this.webkitSlice || this.mozSlice;
            return slice.apply(this, arguments);
        },

        _BitrateTimer: function () {
            this.timestamp = ((Date.now) ? Date.now() : (new Date()).getTime());
            this.loaded = 0;
            this.bitrate = 0;
            this.getBitrate = function (now, loaded, interval) {
                var timeDiff = now - this.timestamp;
                if (!this.bitrate || !interval || timeDiff > interval) {
                    this.bitrate = (loaded - this.loaded) * (1000 / timeDiff) * 8;
                    this.loaded = loaded;
                    this.timestamp = now;
                }
                return this.bitrate;
            };
        },

        _isXHRUpload: function (options) {
            return !options.forceIframeTransport &&
                ((!options.multipart && $.support.xhrFileUpload) ||
                $.support.xhrFormDataFileUpload);
        },

        _getFormData: function (options) {
            var formData;
            if (typeof options.formData === 'function') {
                return options.formData(options.form);
            }
            if ($.isArray(options.formData)) {
                return options.formData;
            }
            if ($.type(options.formData) === 'object') {
                formData = [];
                $.each(options.formData, function (name, value) {
                    formData.push({name: name, value: value});
                });
                return formData;
            }
            return [];
        },

        _getTotal: function (files) {
            var total = 0;
            $.each(files, function (index, file) {
                total += file.size || 1;
            });
            return total;
        },

        _initProgressObject: function (obj) {
            var progress = {
                loaded: 0,
                total: 0,
                bitrate: 0
            };
            if (obj._progress) {
                $.extend(obj._progress, progress);
            } else {
                obj._progress = progress;
            }
        },

        _initResponseObject: function (obj) {
            var prop;
            if (obj._response) {
                for (prop in obj._response) {
                    if (obj._response.hasOwnProperty(prop)) {
                        delete obj._response[prop];
                    }
                }
            } else {
                obj._response = {};
            }
        },

        _onProgress: function (e, data) {
            if (e.lengthComputable) {
                var now = ((Date.now) ? Date.now() : (new Date()).getTime()),
                    loaded;
                if (data._time && data.progressInterval &&
                        (now - data._time < data.progressInterval) &&
                        e.loaded !== e.total) {
                    return;
                }
                data._time = now;
                loaded = Math.floor(
                    e.loaded / e.total * (data.chunkSize || data._progress.total)
                ) + (data.uploadedBytes || 0);
                // Add the difference from the previously loaded state
                // to the global loaded counter:
                this._progress.loaded += (loaded - data._progress.loaded);
                this._progress.bitrate = this._bitrateTimer.getBitrate(
                    now,
                    this._progress.loaded,
                    data.bitrateInterval
                );
                data._progress.loaded = data.loaded = loaded;
                data._progress.bitrate = data.bitrate = data._bitrateTimer.getBitrate(
                    now,
                    loaded,
                    data.bitrateInterval
                );
                // Trigger a custom progress event with a total data property set
                // to the file size(s) of the current upload and a loaded data
                // property calculated accordingly:
                this._trigger('progress', e, data);
                // Trigger a global progress event for all current file uploads,
                // including ajax calls queued for sequential file uploads:
                this._trigger('progressall', e, this._progress);
            }
        },

        _initProgressListener: function (options) {
            var that = this,
                xhr = options.xhr ? options.xhr() : $.ajaxSettings.xhr();
            // Accesss to the native XHR object is required to add event listeners
            // for the upload progress event:
            if (xhr.upload) {
                $(xhr.upload).bind('progress', function (e) {
                    var oe = e.originalEvent;
                    // Make sure the progress event properties get copied over:
                    e.lengthComputable = oe.lengthComputable;
                    e.loaded = oe.loaded;
                    e.total = oe.total;
                    that._onProgress(e, options);
                });
                options.xhr = function () {
                    return xhr;
                };
            }
        },

        _isInstanceOf: function (type, obj) {
            // Cross-frame instanceof check
            return Object.prototype.toString.call(obj) === '[object ' + type + ']';
        },

        _initXHRData: function (options) {
            var that = this,
                formData,
                file = options.files[0],
                // Ignore non-multipart setting if not supported:
                multipart = options.multipart || !$.support.xhrFileUpload,
                paramName = options.paramName[0];
            options.headers = $.extend({}, options.headers);
            if (options.contentRange) {
                options.headers['Content-Range'] = options.contentRange;
            }
            if (!multipart || options.blob || !this._isInstanceOf('File', file)) {
                options.headers['Content-Disposition'] = 'attachment; filename="' +
                    encodeURI(file.name) + '"';
            }
            if (!multipart) {
                options.contentType = file.type;
                options.data = options.blob || file;
            } else if ($.support.xhrFormDataFileUpload) {
                if (options.postMessage) {
                    // window.postMessage does not allow sending FormData
                    // objects, so we just add the File/Blob objects to
                    // the formData array and let the postMessage window
                    // create the FormData object out of this array:
                    formData = this._getFormData(options);
                    if (options.blob) {
                        formData.push({
                            name: paramName,
                            value: options.blob
                        });
                    } else {
                        $.each(options.files, function (index, file) {
                            formData.push({
                                name: options.paramName[index] || paramName,
                                value: file
                            });
                        });
                    }
                } else {
                    if (that._isInstanceOf('FormData', options.formData)) {
                        formData = options.formData;
                    } else {
                        formData = new FormData();
                        $.each(this._getFormData(options), function (index, field) {
                            formData.append(field.name, field.value);
                        });
                    }
                    if (options.blob) {
                        formData.append(paramName, options.blob, file.name);
                    } else {
                        $.each(options.files, function (index, file) {
                            // This check allows the tests to run with
                            // dummy objects:
                            if (that._isInstanceOf('File', file) ||
                                    that._isInstanceOf('Blob', file)) {
                                formData.append(
                                    options.paramName[index] || paramName,
                                    file,
                                    file.name
                                );
                            }
                        });
                    }
                }
                options.data = formData;
            }
            // Blob reference is not needed anymore, free memory:
            options.blob = null;
        },

        _initIframeSettings: function (options) {
            var targetHost = $('<a></a>').prop('href', options.url).prop('host');
            // Setting the dataType to iframe enables the iframe transport:
            options.dataType = 'iframe ' + (options.dataType || '');
            // The iframe transport accepts a serialized array as form data:
            options.formData = this._getFormData(options);
            // Add redirect url to form data on cross-domain uploads:
            if (options.redirect && targetHost && targetHost !== location.host) {
                options.formData.push({
                    name: options.redirectParamName || 'redirect',
                    value: options.redirect
                });
            }
        },

        _initDataSettings: function (options) {
            if (this._isXHRUpload(options)) {
                if (!this._chunkedUpload(options, true)) {
                    if (!options.data) {
                        this._initXHRData(options);
                    }
                    this._initProgressListener(options);
                }
                if (options.postMessage) {
                    // Setting the dataType to postmessage enables the
                    // postMessage transport:
                    options.dataType = 'postmessage ' + (options.dataType || '');
                }
            } else {
                this._initIframeSettings(options);
            }
        },

        _getParamName: function (options) {
            var fileInput = $(options.fileInput),
                paramName = options.paramName;
            if (!paramName) {
                paramName = [];
                fileInput.each(function () {
                    var input = $(this),
                        name = input.prop('name') || 'files[]',
                        i = (input.prop('files') || [1]).length;
                    while (i) {
                        paramName.push(name);
                        i -= 1;
                    }
                });
                if (!paramName.length) {
                    paramName = [fileInput.prop('name') || 'files[]'];
                }
            } else if (!$.isArray(paramName)) {
                paramName = [paramName];
            }
            return paramName;
        },

        _initFormSettings: function (options) {
            // Retrieve missing options from the input field and the
            // associated form, if available:
            if (!options.form || !options.form.length) {
                options.form = $(options.fileInput.prop('form'));
                // If the given file input doesn't have an associated form,
                // use the default widget file input's form:
                if (!options.form.length) {
                    options.form = $(this.options.fileInput.prop('form'));
                }
            }
            options.paramName = this._getParamName(options);
            if (!options.url) {
                options.url = options.form.prop('action') || location.href;
            }
            // The HTTP request method must be "POST" or "PUT":
            options.type = (options.type ||
                ($.type(options.form.prop('method')) === 'string' &&
                    options.form.prop('method')) || ''
                ).toUpperCase();
            if (options.type !== 'POST' && options.type !== 'PUT' &&
                    options.type !== 'PATCH') {
                options.type = 'POST';
            }
            if (!options.formAcceptCharset) {
                options.formAcceptCharset = options.form.attr('accept-charset');
            }
        },

        _getAJAXSettings: function (data) {
            var options = $.extend({}, this.options, data);
            this._initFormSettings(options);
            this._initDataSettings(options);
            return options;
        },

        // jQuery 1.6 doesn't provide .state(),
        // while jQuery 1.8+ removed .isRejected() and .isResolved():
        _getDeferredState: function (deferred) {
            if (deferred.state) {
                return deferred.state();
            }
            if (deferred.isResolved()) {
                return 'resolved';
            }
            if (deferred.isRejected()) {
                return 'rejected';
            }
            return 'pending';
        },

        // Maps jqXHR callbacks to the equivalent
        // methods of the given Promise object:
        _enhancePromise: function (promise) {
            promise.success = promise.done;
            promise.error = promise.fail;
            promise.complete = promise.always;
            return promise;
        },

        // Creates and returns a Promise object enhanced with
        // the jqXHR methods abort, success, error and complete:
        _getXHRPromise: function (resolveOrReject, context, args) {
            var dfd = $.Deferred(),
                promise = dfd.promise();
            context = context || this.options.context || promise;
            if (resolveOrReject === true) {
                dfd.resolveWith(context, args);
            } else if (resolveOrReject === false) {
                dfd.rejectWith(context, args);
            }
            promise.abort = dfd.promise;
            return this._enhancePromise(promise);
        },

        // Adds convenience methods to the data callback argument:
        _addConvenienceMethods: function (e, data) {
            var that = this,
                getPromise = function (data) {
                    return $.Deferred().resolveWith(that, [data]).promise();
                };
            data.process = function (resolveFunc, rejectFunc) {
                if (resolveFunc || rejectFunc) {
                    data._processQueue = this._processQueue =
                        (this._processQueue || getPromise(this))
                            .pipe(resolveFunc, rejectFunc);
                }
                return this._processQueue || getPromise(this);
            };
            data.submit = function () {
                if (this.state() !== 'pending') {
                    data.jqXHR = this.jqXHR =
                        (that._trigger('submit', e, this) !== false) &&
                        that._onSend(e, this);
                }
                return this.jqXHR || that._getXHRPromise();
            };
            data.abort = function () {
                if (this.jqXHR) {
                    return this.jqXHR.abort();
                }
                return that._getXHRPromise();
            };
            data.state = function () {
                if (this.jqXHR) {
                    return that._getDeferredState(this.jqXHR);
                }
                if (this._processQueue) {
                    return that._getDeferredState(this._processQueue);
                }
            };
            data.progress = function () {
                return this._progress;
            };
            data.response = function () {
                return this._response;
            };
        },

        // Parses the Range header from the server response
        // and returns the uploaded bytes:
        _getUploadedBytes: function (jqXHR) {
            var range = jqXHR.getResponseHeader('Range'),
                parts = range && range.split('-'),
                upperBytesPos = parts && parts.length > 1 &&
                    parseInt(parts[1], 10);
            return upperBytesPos && upperBytesPos + 1;
        },

        // Uploads a file in multiple, sequential requests
        // by splitting the file up in multiple blob chunks.
        // If the second parameter is true, only tests if the file
        // should be uploaded in chunks, but does not invoke any
        // upload requests:
        _chunkedUpload: function (options, testOnly) {
            options.uploadedBytes = options.uploadedBytes || 0;
            var that = this,
                file = options.files[0],
                fs = file.size,
                ub = options.uploadedBytes,
                mcs = options.maxChunkSize || fs,
                slice = this._blobSlice,
                dfd = $.Deferred(),
                promise = dfd.promise(),
                jqXHR,
                upload;
            if (!(this._isXHRUpload(options) && slice && (ub || mcs < fs)) ||
                    options.data) {
                return false;
            }
            if (testOnly) {
                return true;
            }
            if (ub >= fs) {
                file.error = options.i18n('uploadedBytes');
                return this._getXHRPromise(
                    false,
                    options.context,
                    [null, 'error', file.error]
                );
            }
            // The chunk upload method:
            upload = function () {
                // Clone the options object for each chunk upload:
                var o = $.extend({}, options),
                    currentLoaded = o._progress.loaded;
                o.blob = slice.call(
                    file,
                    ub,
                    ub + mcs,
                    file.type
                );
                // Store the current chunk size, as the blob itself
                // will be dereferenced after data processing:
                o.chunkSize = o.blob.size;
                // Expose the chunk bytes position range:
                o.contentRange = 'bytes ' + ub + '-' +
                    (ub + o.chunkSize - 1) + '/' + fs;
                // Process the upload data (the blob and potential form data):
                that._initXHRData(o);
                // Add progress listeners for this chunk upload:
                that._initProgressListener(o);
                jqXHR = ((that._trigger('chunksend', null, o) !== false && $.ajax(o)) ||
                        that._getXHRPromise(false, o.context))
                    .done(function (result, textStatus, jqXHR) {
                        ub = that._getUploadedBytes(jqXHR) ||
                            (ub + o.chunkSize);
                        // Create a progress event if no final progress event
                        // with loaded equaling total has been triggered
                        // for this chunk:
                        if (currentLoaded + o.chunkSize - o._progress.loaded) {
                            that._onProgress($.Event('progress', {
                                lengthComputable: true,
                                loaded: ub - o.uploadedBytes,
                                total: ub - o.uploadedBytes
                            }), o);
                        }
                        options.uploadedBytes = o.uploadedBytes = ub;
                        o.result = result;
                        o.textStatus = textStatus;
                        o.jqXHR = jqXHR;
                        that._trigger('chunkdone', null, o);
                        that._trigger('chunkalways', null, o);
                        if (ub < fs) {
                            // File upload not yet complete,
                            // continue with the next chunk:
                            upload();
                        } else {
                            dfd.resolveWith(
                                o.context,
                                [result, textStatus, jqXHR]
                            );
                        }
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        o.jqXHR = jqXHR;
                        o.textStatus = textStatus;
                        o.errorThrown = errorThrown;
                        that._trigger('chunkfail', null, o);
                        that._trigger('chunkalways', null, o);
                        dfd.rejectWith(
                            o.context,
                            [jqXHR, textStatus, errorThrown]
                        );
                    });
            };
            this._enhancePromise(promise);
            promise.abort = function () {
                return jqXHR.abort();
            };
            upload();
            return promise;
        },

        _beforeSend: function (e, data) {
            if (this._active === 0) {
                // the start callback is triggered when an upload starts
                // and no other uploads are currently running,
                // equivalent to the global ajaxStart event:
                this._trigger('start');
                // Set timer for global bitrate progress calculation:
                this._bitrateTimer = new this._BitrateTimer();
                // Reset the global progress values:
                this._progress.loaded = this._progress.total = 0;
                this._progress.bitrate = 0;
            }
            // Make sure the container objects for the .response() and
            // .progress() methods on the data object are available
            // and reset to their initial state:
            this._initResponseObject(data);
            this._initProgressObject(data);
            data._progress.loaded = data.loaded = data.uploadedBytes || 0;
            data._progress.total = data.total = this._getTotal(data.files) || 1;
            data._progress.bitrate = data.bitrate = 0;
            this._active += 1;
            // Initialize the global progress values:
            this._progress.loaded += data.loaded;
            this._progress.total += data.total;
        },

        _onDone: function (result, textStatus, jqXHR, options) {
            var total = options._progress.total,
                response = options._response;
            if (options._progress.loaded < total) {
                // Create a progress event if no final progress event
                // with loaded equaling total has been triggered:
                this._onProgress($.Event('progress', {
                    lengthComputable: true,
                    loaded: total,
                    total: total
                }), options);
            }
            response.result = options.result = result;
            response.textStatus = options.textStatus = textStatus;
            response.jqXHR = options.jqXHR = jqXHR;
            this._trigger('done', null, options);
        },

        _onFail: function (jqXHR, textStatus, errorThrown, options) {
            var response = options._response;
            if (options.recalculateProgress) {
                // Remove the failed (error or abort) file upload from
                // the global progress calculation:
                this._progress.loaded -= options._progress.loaded;
                this._progress.total -= options._progress.total;
            }
            response.jqXHR = options.jqXHR = jqXHR;
            response.textStatus = options.textStatus = textStatus;
            response.errorThrown = options.errorThrown = errorThrown;
            this._trigger('fail', null, options);
        },

        _onAlways: function (jqXHRorResult, textStatus, jqXHRorError, options) {
            // jqXHRorResult, textStatus and jqXHRorError are added to the
            // options object via done and fail callbacks
            this._trigger('always', null, options);
        },

        _onSend: function (e, data) {
            if (!data.submit) {
                this._addConvenienceMethods(e, data);
            }
            var that = this,
                jqXHR,
                aborted,
                slot,
                pipe,
                options = that._getAJAXSettings(data),
                send = function () {
                    that._sending += 1;
                    // Set timer for bitrate progress calculation:
                    options._bitrateTimer = new that._BitrateTimer();
                    jqXHR = jqXHR || (
                        ((aborted || that._trigger('send', e, options) === false) &&
                        that._getXHRPromise(false, options.context, aborted)) ||
                        that._chunkedUpload(options) || $.ajax(options)
                    ).done(function (result, textStatus, jqXHR) {
                        that._onDone(result, textStatus, jqXHR, options);
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        that._onFail(jqXHR, textStatus, errorThrown, options);
                    }).always(function (jqXHRorResult, textStatus, jqXHRorError) {
                        that._onAlways(
                            jqXHRorResult,
                            textStatus,
                            jqXHRorError,
                            options
                        );
                        that._sending -= 1;
                        that._active -= 1;
                        if (options.limitConcurrentUploads &&
                                options.limitConcurrentUploads > that._sending) {
                            // Start the next queued upload,
                            // that has not been aborted:
                            var nextSlot = that._slots.shift();
                            while (nextSlot) {
                                if (that._getDeferredState(nextSlot) === 'pending') {
                                    nextSlot.resolve();
                                    break;
                                }
                                nextSlot = that._slots.shift();
                            }
                        }
                        if (that._active === 0) {
                            // The stop callback is triggered when all uploads have
                            // been completed, equivalent to the global ajaxStop event:
                            that._trigger('stop');
                        }
                    });
                    return jqXHR;
                };
            this._beforeSend(e, options);
            if (this.options.sequentialUploads ||
                    (this.options.limitConcurrentUploads &&
                    this.options.limitConcurrentUploads <= this._sending)) {
                if (this.options.limitConcurrentUploads > 1) {
                    slot = $.Deferred();
                    this._slots.push(slot);
                    pipe = slot.pipe(send);
                } else {
                    this._sequence = this._sequence.pipe(send, send);
                    pipe = this._sequence;
                }
                // Return the piped Promise object, enhanced with an abort method,
                // which is delegated to the jqXHR object of the current upload,
                // and jqXHR callbacks mapped to the equivalent Promise methods:
                pipe.abort = function () {
                    aborted = [undefined, 'abort', 'abort'];
                    if (!jqXHR) {
                        if (slot) {
                            slot.rejectWith(options.context, aborted);
                        }
                        return send();
                    }
                    return jqXHR.abort();
                };
                return this._enhancePromise(pipe);
            }
            return send();
        },

        _onAdd: function (e, data) {
            var that = this,
                result = true,
                options = $.extend({}, this.options, data),
                limit = options.limitMultiFileUploads,
                paramName = this._getParamName(options),
                paramNameSet,
                paramNameSlice,
                fileSet,
                i;
            if (!(options.singleFileUploads || limit) ||
                    !this._isXHRUpload(options)) {
                fileSet = [data.files];
                paramNameSet = [paramName];
            } else if (!options.singleFileUploads && limit) {
                fileSet = [];
                paramNameSet = [];
                for (i = 0; i < data.files.length; i += limit) {
                    fileSet.push(data.files.slice(i, i + limit));
                    paramNameSlice = paramName.slice(i, i + limit);
                    if (!paramNameSlice.length) {
                        paramNameSlice = paramName;
                    }
                    paramNameSet.push(paramNameSlice);
                }
            } else {
                paramNameSet = paramName;
            }
            data.originalFiles = data.files;
            $.each(fileSet || data.files, function (index, element) {
                var newData = $.extend({}, data);
                newData.files = fileSet ? element : [element];
                newData.paramName = paramNameSet[index];
                that._initResponseObject(newData);
                that._initProgressObject(newData);
                that._addConvenienceMethods(e, newData);
                result = that._trigger('add', e, newData);
                return result;
            });
            return result;
        },

        _replaceFileInput: function (input) {
            var inputClone = input.clone(true);
            $('<form></form>').append(inputClone)[0].reset();
            // Detaching allows to insert the fileInput on another form
            // without loosing the file input value:
            input.after(inputClone).detach();
            // Avoid memory leaks with the detached file input:
            $.cleanData(input.unbind('remove'));
            // Replace the original file input element in the fileInput
            // elements set with the clone, which has been copied including
            // event handlers:
            this.options.fileInput = this.options.fileInput.map(function (i, el) {
                if (el === input[0]) {
                    return inputClone[0];
                }
                return el;
            });
            // If the widget has been initialized on the file input itself,
            // override this.element with the file input clone:
            if (input[0] === this.element[0]) {
                this.element = inputClone;
            }
        },

        _handleFileTreeEntry: function (entry, path) {
            var that = this,
                dfd = $.Deferred(),
                errorHandler = function (e) {
                    if (e && !e.entry) {
                        e.entry = entry;
                    }
                    // Since $.when returns immediately if one
                    // Deferred is rejected, we use resolve instead.
                    // This allows valid files and invalid items
                    // to be returned together in one set:
                    dfd.resolve([e]);
                },
                dirReader;
            path = path || '';
            if (entry.isFile) {
                if (entry._file) {
                    // Workaround for Chrome bug #149735
                    entry._file.relativePath = path;
                    dfd.resolve(entry._file);
                } else {
                    entry.file(function (file) {
                        file.relativePath = path;
                        dfd.resolve(file);
                    }, errorHandler);
                }
            } else if (entry.isDirectory) {
                dirReader = entry.createReader();
                dirReader.readEntries(function (entries) {
                    that._handleFileTreeEntries(
                        entries,
                        path + entry.name + '/'
                    ).done(function (files) {
                        dfd.resolve(files);
                    }).fail(errorHandler);
                }, errorHandler);
            } else {
                // Return an empy list for file system items
                // other than files or directories:
                dfd.resolve([]);
            }
            return dfd.promise();
        },

        _handleFileTreeEntries: function (entries, path) {
            var that = this;
            return $.when.apply(
                $,
                $.map(entries, function (entry) {
                    return that._handleFileTreeEntry(entry, path);
                })
            ).pipe(function () {
                return Array.prototype.concat.apply(
                    [],
                    arguments
                );
            });
        },

        _getDroppedFiles: function (dataTransfer) {
            dataTransfer = dataTransfer || {};
            var items = dataTransfer.items;
            if (items && items.length && (items[0].webkitGetAsEntry ||
                    items[0].getAsEntry)) {
                return this._handleFileTreeEntries(
                    $.map(items, function (item) {
                        var entry;
                        if (item.webkitGetAsEntry) {
                            entry = item.webkitGetAsEntry();
                            if (entry) {
                                // Workaround for Chrome bug #149735:
                                entry._file = item.getAsFile();
                            }
                            return entry;
                        }
                        return item.getAsEntry();
                    })
                );
            }
            return $.Deferred().resolve(
                $.makeArray(dataTransfer.files)
            ).promise();
        },

        _getSingleFileInputFiles: function (fileInput) {
            fileInput = $(fileInput);
            var entries = fileInput.prop('webkitEntries') ||
                    fileInput.prop('entries'),
                files,
                value;
            if (entries && entries.length) {
                return this._handleFileTreeEntries(entries);
            }
            files = $.makeArray(fileInput.prop('files'));
            if (!files.length) {
                value = fileInput.prop('value');
                if (!value) {
                    return $.Deferred().resolve([]).promise();
                }
                // If the files property is not available, the browser does not
                // support the File API and we add a pseudo File object with
                // the input value as name with path information removed:
                files = [{name: value.replace(/^.*\\/, '')}];
            } else if (files[0].name === undefined && files[0].fileName) {
                // File normalization for Safari 4 and Firefox 3:
                $.each(files, function (index, file) {
                    file.name = file.fileName;
                    file.size = file.fileSize;
                });
            }
            return $.Deferred().resolve(files).promise();
        },

        _getFileInputFiles: function (fileInput) {
            if (!(fileInput instanceof $) || fileInput.length === 1) {
                return this._getSingleFileInputFiles(fileInput);
            }
            return $.when.apply(
                $,
                $.map(fileInput, this._getSingleFileInputFiles)
            ).pipe(function () {
                return Array.prototype.concat.apply(
                    [],
                    arguments
                );
            });
        },

        _onChange: function (e) {
            var that = this,
                data = {
                    fileInput: $(e.target),
                    form: $(e.target.form)
                };
            this._getFileInputFiles(data.fileInput).always(function (files) {
                data.files = files;
                if (that.options.replaceFileInput) {
                    that._replaceFileInput(data.fileInput);
                }
                if (that._trigger('change', e, data) !== false) {
                    that._onAdd(e, data);
                }
            });
        },

        _onPaste: function (e) {
            var items = e.originalEvent && e.originalEvent.clipboardData &&
                    e.originalEvent.clipboardData.items,
                data = {files: []};
            if (items && items.length) {
                $.each(items, function (index, item) {
                    var file = item.getAsFile && item.getAsFile();
                    if (file) {
                        data.files.push(file);
                    }
                });
                if (this._trigger('paste', e, data) !== false) {
                    this._onAdd(e, data);
                }
            }
        },

        _onDrop: function (e) {
            e.dataTransfer = e.originalEvent && e.originalEvent.dataTransfer;
            var that = this,
                dataTransfer = e.dataTransfer,
                data = {};
            if (dataTransfer && dataTransfer.files && dataTransfer.files.length) {
                e.preventDefault();
                this._getDroppedFiles(dataTransfer).always(function (files) {
                    data.files = files;
                    if (that._trigger('drop', e, data) !== false) {
                        that._onAdd(e, data);
                    }
                });
            }
        },

        _onDragOver: function (e) {
            e.dataTransfer = e.originalEvent && e.originalEvent.dataTransfer;
            var dataTransfer = e.dataTransfer,
                data = {
                    dropEffect: 'copy',
                    preventDefault: true
                };
            if (dataTransfer && $.inArray('Files', dataTransfer.types) !== -1 &&
                    this._trigger('dragover', e, data) !== false) {
                dataTransfer.dropEffect = data.dropEffect;
                if (data.preventDefault) {
                    e.preventDefault();
                }
            }
        },

        _initEventHandlers: function () {
            if (this._isXHRUpload(this.options)) {
                this._on(this.options.dropZone, {
                    dragover: this._onDragOver,
                    drop: this._onDrop
                });
                this._on(this.options.pasteZone, {
                    paste: this._onPaste
                });
            }
            if ($.support.fileInput) {
                this._on(this.options.fileInput, {
                    change: this._onChange
                });
            }
        },

        _destroyEventHandlers: function () {
            this._off(this.options.dropZone, 'dragover drop');
            this._off(this.options.pasteZone, 'paste');
            this._off(this.options.fileInput, 'change');
        },

        _setOption: function (key, value) {
            var reinit = $.inArray(key, this._specialOptions) !== -1;
            if (reinit) {
                this._destroyEventHandlers();
            }
            this._super(key, value);
            if (reinit) {
                this._initSpecialOptions();
                this._initEventHandlers();
            }
        },

        _initSpecialOptions: function () {
            var options = this.options;
            if (options.fileInput === undefined) {
                options.fileInput = this.element.is('input[type="file"]') ?
                        this.element : this.element.find('input[type="file"]');
            } else if (!(options.fileInput instanceof $)) {
                options.fileInput = $(options.fileInput);
            }
            if (!(options.dropZone instanceof $)) {
                options.dropZone = $(options.dropZone);
            }
            if (!(options.pasteZone instanceof $)) {
                options.pasteZone = $(options.pasteZone);
            }
        },

        _getRegExp: function (str) {
            var parts = str.split('/'),
                modifiers = parts.pop();
            parts.shift();
            return new RegExp(parts.join('/'), modifiers);
        },

        _isRegExpOption: function (key, value) {
            return key !== 'url' && $.type(value) === 'string' &&
                /^\/.*\/[igm]{0,3}$/.test(value);
        },

        _initDataAttributes: function () {
            var that = this,
                options = this.options;
            // Initialize options set via HTML5 data-attributes:
            $.each(
                $(this.element[0].cloneNode(false)).data(),
                function (key, value) {
                    if (that._isRegExpOption(key, value)) {
                        value = that._getRegExp(value);
                    }
                    options[key] = value;
                }
            );
        },

        _create: function () {
            this._initDataAttributes();
            this._initSpecialOptions();
            this._slots = [];
            this._sequence = this._getXHRPromise(true);
            this._sending = this._active = 0;
            this._initProgressObject(this);
            this._initEventHandlers();
        },

        // This method is exposed to the widget API and allows to query
        // the number of active uploads:
        active: function () {
            return this._active;
        },

        // This method is exposed to the widget API and allows to query
        // the widget upload progress.
        // It returns an object with loaded, total and bitrate properties
        // for the running uploads:
        progress: function () {
            return this._progress;
        },

        // This method is exposed to the widget API and allows adding files
        // using the fileupload API. The data parameter accepts an object which
        // must have a files property and can contain additional options:
        // .fileupload('add', {files: filesList});
        add: function (data) {
            var that = this;
            if (!data || this.options.disabled) {
                return;
            }
            if (data.fileInput && !data.files) {
                this._getFileInputFiles(data.fileInput).always(function (files) {
                    data.files = files;
                    that._onAdd(null, data);
                });
            } else {
                data.files = $.makeArray(data.files);
                this._onAdd(null, data);
            }
        },

        // This method is exposed to the widget API and allows sending files
        // using the fileupload API. The data parameter accepts an object which
        // must have a files or fileInput property and can contain additional options:
        // .fileupload('send', {files: filesList});
        // The method returns a Promise object for the file upload call.
        send: function (data) {
            if (data && !this.options.disabled) {
                if (data.fileInput && !data.files) {
                    var that = this,
                        dfd = $.Deferred(),
                        promise = dfd.promise(),
                        jqXHR,
                        aborted;
                    promise.abort = function () {
                        aborted = true;
                        if (jqXHR) {
                            return jqXHR.abort();
                        }
                        dfd.reject(null, 'abort', 'abort');
                        return promise;
                    };
                    this._getFileInputFiles(data.fileInput).always(
                        function (files) {
                            if (aborted) {
                                return;
                            }
                            if (!files.length) {
                                dfd.reject();
                                return;
                            }
                            data.files = files;
                            jqXHR = that._onSend(null, data).then(
                                function (result, textStatus, jqXHR) {
                                    dfd.resolve(result, textStatus, jqXHR);
                                },
                                function (jqXHR, textStatus, errorThrown) {
                                    dfd.reject(jqXHR, textStatus, errorThrown);
                                }
                            );
                        }
                    );
                    return this._enhancePromise(promise);
                }
                data.files = $.makeArray(data.files);
                if (data.files.length) {
                    return this._onSend(null, data);
                }
            }
            return this._getXHRPromise(false, data && data.context);
        }

    });

}));

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
        var defaults, disabled, lastAffix, offset, position, scrollEvent, setOffset, unpin, windowEl;
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
        position = element.offset();
        disabled = defaults.disabled;
        lastAffix = null;
        unpin = null;
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
        scrollEvent = function() {
          var affix, scrollHeight, scrollTop;
          if (element[0].offsetHeight <= 0 && element[0].offsetWidth <= 0) {
            return;
          }
          scrollTop = windowEl.scrollTop();
          scrollHeight = $document.height();
          affix = (unpin != null) && scrollTop + unpin <= position.top ? false : position.top + element.height() >= scrollHeight - offset.bottom ? "bottom" : scrollTop <= offset.top ? "top" : false;
          if (affix === lastAffix) {
            return;
          }
          lastAffix = affix;
          if (unpin) {
            element.css("top", "");
          }
          element.removeClass(defaults.classes).addClass("affix" + (affix ? "-" + affix : ""));
          if (affix === "bottom") {
            unpin = position.top - scrollTop;
            element.css("top", $document[0].body.offsetHeight - offset.bottom - element.height());
          } else {
            unpin = null;
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
  "$animate", "$http", "$filter", "$compile", "$timeout", "$parse", "$rootScope", "$document", "keys", function($animate, $http, $filter, $compile, $timeout, $parse, $rootScope, $document, keys) {
    return {
      restrict: "EA",
      template: "<input type=\"text\"/>",
      transclude: true,
      replace: true,
      require: "ngModel",
      link: function($scope, element, attrs, ctrl, transclude) {
        var $menuScope, appendMenu, autocompleteUrl, clickHandler, currentAutocomplete, delay, disabled, getData, inside, labelKey, menuEl, onError, onSelect, onSelectBool, onSuccess, positionMenu, queryData, queryKey, reset, source, timeoutId, updateItem;
        labelKey = attrs.macAutocompleteLabel || "name";
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
        onSelectBool = false;
        $menuScope = $scope.$new();
        $menuScope.items = [];
        $menuScope.index = 0;
        menuEl = angular.element(document.createElement("mac-menu"));
        menuEl.attr({
          "ng-class": attrs.macMenuClass || null,
          "mac-menu-items": "items",
          "mac-menu-style": "style",
          "mac-menu-select": "select(index)",
          "mac-menu-index": "index"
        });
        transclude($menuScope, function(clone) {
          return menuEl.append(clone);
        });
        $compile(menuEl)($menuScope);
        ctrl.$parsers.push(function(value) {
          if (value && !disabled($scope) && !onSelectBool) {
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
          onSelectBool = false;
          return value;
        });
        /*
        @name clickHandler
        @description
        Create a click handler function to make sure directive is unbinding
        the correct handler
        */

        clickHandler = function() {
          return reset(true);
        };
        /*
        @function
        @name appendMenu
        @description
        Adding menu to DOM
        */

        appendMenu = function() {
          if (inside) {
            $animate.enter(menuEl, void 0, element);
          } else {
            $animate.enter(menuEl, angular.element(document.body));
          }
          return $document.bind("click", clickHandler);
        };
        /*
        @function
        @name reset
        @description
        Resetting autocomplete
        */

        reset = function(invokeApply) {
          if (invokeApply == null) {
            invokeApply = false;
          }
          $animate.leave(menuEl, function() {
            $menuScope.items = [];
            $menuScope.index = 0;
            return $document.unbind("click", clickHandler);
          });
          if (invokeApply) {
            return $scope.$apply();
          }
        };
        /*
        @function
        @name positionMenu
        @description
        Calculate the style include position and width for menu
        */

        positionMenu = function() {
          if ($menuScope.items.length > 0) {
            $menuScope.style = element.offset();
            $menuScope.style.top += element.outerHeight();
            $menuScope.style.minWidth = element.outerWidth();
            angular.forEach($menuScope.style, function(value, key) {
              if (!isNaN(+value) && angular.isNumber(+value)) {
                value = "" + value + "px";
              }
              return $menuScope.style[key] = value;
            });
            return appendMenu();
          }
        };
        /*
        @function
        @name updateItem
        @description
        Update list of items getting passed to menu
        @param {Array} data Array of data
        */

        updateItem = function(data) {
          if (data == null) {
            data = [];
          }
          if (data.length > 0) {
            currentAutocomplete = data;
            $menuScope.items = data.map(function(item) {
              if (angular.isObject(item)) {
                if (item.value == null) {
                  item.value = item[labelKey] || "";
                }
                if (item.label == null) {
                  item.label = item[labelKey] || "";
                }
                return item;
              } else {
                return {
                  label: item,
                  value: item
                };
              }
            });
            return positionMenu();
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
        $menuScope.select = function(index) {
          var label, selected;
          selected = currentAutocomplete[index];
          onSelect($scope, {
            selected: selected
          });
          label = $menuScope.items[index].label || "";
          onSelectBool = true;
          if (attrs.ngModel != null) {
            ctrl.$setViewValue(label);
            ctrl.$render();
          }
          return reset();
        };
        element.bind("keydown", function(event) {
          switch (event.which) {
            case keys.DOWN:
              $scope.$apply(function() {
                return $menuScope.index = ($menuScope.index + 1) % $menuScope.items.length;
              });
              break;
            case keys.UP:
              $scope.$apply(function() {
                return $menuScope.index = ($menuScope.index ? $menuScope.index : $menuScope.items.length) - 1;
              });
              break;
            case keys.ENTER:
              $scope.$apply(function() {
                if ($menuScope.items.length > 0) {
                  $menuScope.select($menuScope.index);
                  return event.preventDefault();
                }
              });
              break;
            case keys.ESCAPE:
              $scope.$apply(function() {
                return reset();
              });
          }
          return true;
        });
        $scope.$on("$destroy", function() {
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
A directive for creating a datepicker on text input using jquery ui

@dependencies
- jQuery
- jQuery datepicker

@param {String}     mac-datepicker-id        The id of the text input field
@param {String}     mac-datepicker-model     The model to store the selected date
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
@param {Boolean}    mac-datepicker-disabled             Enable or disable datepicker
*/

angular.module("Mac").directive("macDatepicker", [
  "$parse", "$timeout", "util", function($parse, $timeout, util) {
    return {
      restrict: "E",
      replace: true,
      template: "<div class=\"date-time\"><i class=\"mac-icons mac-icon-calendar\"></i><input type=\"text\"/></div>",
      compile: function(element, attrs) {
        var defaults, inputAttrs, inputElement, opts;
        defaults = {
          id: "input-date",
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
        opts = util.extendAttributes("macDatepicker", defaults, attrs);
        inputAttrs = {
          "mac-id": opts.id
        };
        if (attrs.macDatepickerModel) {
          inputAttrs["ng-model"] = attrs.macDatepickerModel;
          inputAttrs["mac-datepicker-input"] = opts.dateFormat;
        }
        if (attrs.macDatepickerDisabled != null) {
          inputAttrs["ng-disabled"] = attrs.macDatepickerDisabled;
        }
        inputElement = angular.element(element[0].getElementsByTagName("input"));
        inputElement.attr(inputAttrs);
        return function($scope, element, attrs) {
          var model, onClose, onSelect, setOptions;
          onSelect = $parse(attrs.macDatepickerOnSelect);
          onClose = $parse(attrs.macDatepickerOnClose);
          model = $parse(attrs.macDatepickerModel);
          opts.onSelect = function(date, instance) {
            return $scope.$apply(function() {
              if (typeof onSelect === "function") {
                onSelect($scope, {
                  date: date,
                  instance: instance
                });
              }
              return typeof model.assign === "function" ? model.assign($scope, date) : void 0;
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
          inputElement.datepicker(opts);
          setOptions = function(name, value) {
            if (value != null) {
              return inputElement.datepicker("option", name, value);
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
        };
      }
    };
  }
]);

/*
@name Datepicker Input
@description
An internal directive for mac-datepicker input element to add validator
*/


angular.module("Mac").directive("macDatepickerInput", function() {
  return {
    restrict: "A",
    require: "?ngModel",
    link: function($scope, element, attrs, ctrl) {
      var datepickerValidator;
      if (ctrl) {
        datepickerValidator = function(value) {
          var e, format;
          format = attrs.macDatepickerInput;
          try {
            $.datepicker.parseDate(format, value);
            ctrl.$setValidity("date", true);
            return value;
          } catch (_error) {
            e = _error;
            ctrl.$setValidity("date", false);
            return void 0;
          }
        };
        ctrl.$formatters.push(datepickerValidator);
        return ctrl.$parsers.push(datepickerValidator);
      }
    }
  };
});

/*
@chalk overview
@name Events

@description
A directive for handling basic html events (e.g., blur, keyup, focus, etc.)
Currently MacGyver has blur, focus, keydown, keyup, mouseenter and mouseleave

@param {Expression} mac-blur       Expression to evaluate on blur
@param {Expression} mac-focus      Expression to evaluate on focus
@param {Expression} mac-keydown    Expression to evaluate on keydown
@param {Expression} mac-keyup      Expression to evaluate on keyup
@param {Expression} mac-mouseenter Expression to evaluate on mouseenter
@param {Expression} mac-mouseleave Expression to evaluate on mouseleave
*/

var event, _fn, _i, _len, _ref;

_ref = ["Blur", "Focus", "Keydown", "Keyup", "Mouseenter", "Mouseleave"];
_fn = function(event) {
  return angular.module("Mac").directive("mac" + event, [
    "$parse", function($parse) {
      return {
        restrict: "A",
        link: function(scope, element, attributes) {
          var expression;
          expression = $parse(attributes["mac" + event]);
          return element.bind(event.toLowerCase(), function($event) {
            scope.$apply(function() {
              return expression(scope, {
                $event: $event
              });
            });
            return true;
          });
        }
      };
    }
  ]);
};
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  event = _ref[_i];
  _fn(event);
}

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
@name File upload
@description
Directive for proxying jQuery file upload

@dependencies
- jQuery
- jQuery file upload

@param {String}     mac-upload-route      File upload route
@param {Function}   mac-upload-submit     Function to call on submit
@param {Function}   mac-upload-success    Upload success callback
@param {Function}   mac-upload-error      Upload error callback
@param {Function}   mac-upload-always     Callback for completed (success, abort or error) requests
@param {Expression} mac-upload-previews   List of uploaded files {Array}
@param {Function}   mac-upload-progress   Upload progress callback (requires mac-upload-previews)
@param {String}     mac-upload-drop-zone  The selector that we can drop files onto
@param {Expression} mac-upload-form-data  Additional form data {Array|Object|Function|FormData}
@param {Expression} mac-upload-options    Additional options to pass to jquery fileupload
*/

angular.module("Mac").directive("macUpload", [
  "$rootScope", "$parse", "$timeout", "$document", "util", function($rootScope, $parse, $timeout, $document, util) {
    return {
      require: ["macUpload", "?macUploadPreviews"],
      controller: ["$scope", function() {}],
      link: function($scope, element, attrs, ctrls) {
        var applyCallback, defaults, dragoverTimeout, dropZone, extraOptions, options, opts, previewCtrl, setOptions, uploadCtrl;
        uploadCtrl = ctrls[0], previewCtrl = ctrls[1];
        defaults = {
          route: "",
          dropZone: null,
          submit: "",
          success: "",
          error: "",
          always: "",
          progress: "",
          formData: "",
          options: ""
        };
        opts = util.extendAttributes("macUpload", defaults, attrs);
        setOptions = function(option, value) {
          if (value != null) {
            return element.fileupload("option", option, value);
          }
        };
        applyCallback = function(action, $event, $data) {
          var capitalized;
          capitalized = util.capitalize(action);
          if (attrs["macUpload" + capitalized] != null) {
            return $scope.$apply(function() {
              var $response, $status, $xhr, err, responseText, _ref, _ref1;
              $xhr = $data.jqXHR;
              $status = (_ref = $data.jqXHR) != null ? _ref.status : void 0;
              responseText = ((_ref1 = $data.jqXHR) != null ? _ref1.responseText : void 0) || "";
              try {
                $response = JSON.parse(responseText);
              } catch (_error) {
                err = _error;
                $response = responseText;
              }
              return $parse(opts[action])($scope, {
                $event: $event,
                $data: $data,
                $status: $status,
                $xhr: $xhr,
                $response: $response
              });
            });
          }
        };
        options = {
          url: $parse(opts.route)($scope) || "",
          replaceFileInput: false,
          submit: function($event, $data) {
            var submitEvent;
            submitEvent = function() {
              return applyCallback("submit", $event, $data);
            };
            if (previewCtrl != null) {
              return previewCtrl.add($data.files, submitEvent);
            } else {
              return submitEvent();
            }
          },
          fail: function($event, $data) {
            return applyCallback("error", $event, $data);
          },
          done: function($event, $data) {
            return applyCallback("success", $event, $data);
          },
          always: function($event, $data) {
            element.val("");
            return applyCallback("always", $event, $data);
          },
          progress: function($event, $data) {
            if (previewCtrl != null) {
              if (typeof previewCtrl.updateProgress === "function") {
                previewCtrl.updateProgress($data);
              }
            }
            return applyCallback("progress", $event, $data);
          }
        };
        if (opts.dropZone != null) {
          $document.bind("drop dragover", function(event) {
            return event.preventDefault();
          });
          dragoverTimeout = null;
          dropZone = element.parents(opts.dropZone);
          $document.bind("dragover", function(event) {
            var method, node;
            if (dragoverTimeout != null) {
              $timeout.cancel(dragoverTimeout);
            }
            node = angular.element(event.target).parents(opts.dropZone);
            method = node.length ? "addClass" : "removeClass";
            dropZone[method]("droppable");
            return dragoverTimeout = $timeout(function() {
              if (dragoverTimeout != null) {
                $timeout.cancel(dragoverTimeout);
              }
              return dropZone.removeClass("droppable");
            }, 250, false);
          });
        }
        options.dropZone = dropZone || angular.element();
        options.pasteZone = null;
        if (opts.options) {
          extraOptions = $scope.$eval(opts.options) || {};
          angular.extend(options, extraOptions);
        }
        element.fileupload(options).on(['fileuploadadd', 'fileuploadsubmit', 'fileuploadsend', 'fileuploaddone', 'fileuploadfail', 'fileuploadalways', 'fileuploadprogress', 'fileuploadprogressall', 'fileuploadstart', 'fileuploadstop', 'fileuploadchange', 'fileuploadpaste', 'fileuploaddrop', 'fileuploaddragover', 'fileuploadchunksend', 'fileuploadchunkdone', 'fileuploadchunkfail', 'fileuploadchunkalways', 'fileuploadprocessstart', 'fileuploadprocess', 'fileuploadprocessdone', 'fileuploadprocessfail', 'fileuploadprocessalways', 'fileuploadprocessstop'].join(' '), function(event, data) {
          return $scope.$emit(event.type, data);
        });
        $scope.$watch(opts.route, function(route) {
          return setOptions("url", route);
        });
        $scope.$watch(opts.formData, function(value) {
          return setOptions("formData", value);
        });
        return $scope.$watch(opts.options, function(value) {
          return element.fileupload("option", value);
        });
      }
    };
  }
]).directive("macUploadPreviews", [
  "$rootScope", function($rootScope) {
    return {
      restrict: "A",
      require: ["macUploadPreviews", "macUpload"],
      controller: [
        "$scope", "$attrs", "$parse", function($scope, $attrs, $parse) {
          var previewsGet, previewsSet;
          previewsGet = $parse($attrs.macUploadPreviews);
          previewsSet = previewsGet.assign;
          this.previews = function(value) {
            if (value != null) {
              return previewsSet($scope, value);
            } else {
              return previewsGet($scope);
            }
          };
          this.getByFilename = function(filename) {
            var i, preview, previews, _i, _ref;
            previews = this.previews() || [];
            for (i = _i = _ref = previews.length - 1; _i >= 0; i = _i += -1) {
              preview = previews[i];
              if (preview.fileName === filename) {
                return preview;
              }
            }
          };
          this.add = function(files, callback) {
            var file, pushToPreviews, reader, _i, _len, _ref, _results,
              _this = this;
            if (files == null) {
              files = [];
            }
            _results = [];
            for (_i = 0, _len = files.length; _i < _len; _i++) {
              file = files[_i];
              pushToPreviews = function(event) {
                var newFile, previews;
                previews = this.previews();
                if (previews != null) {
                  newFile = {
                    fileName: file.name,
                    type: file.type,
                    fileData: event != null ? event.target.result : void 0
                  };
                  previews.push(newFile);
                  this.previews(previews);
                }
                return typeof callback === "function" ? callback(newFile) : void 0;
              };
              if (((_ref = file.constructor) != null ? _ref.name : void 0) === "File") {
                reader = new FileReader;
                reader.onload = function(event) {
                  return pushToPreviews.apply(_this, [event, "load"]);
                };
                reader.onerror = function(event) {
                  return pushToPreviews.apply(_this, [event, "error"]);
                };
                _results.push(reader.readAsDataURL(file));
              } else {
                _results.push(pushToPreviews.apply(this));
              }
            }
            return _results;
          };
        }
      ]
    };
  }
]).directive("macUploadProgress", [
  function() {
    return {
      restrict: "A",
      require: ["macUploadProgress", "macUploadPreviews"],
      controller: [
        "$scope", function($scope) {
          this.updatePreviewCtrl = function(ctrl) {
            return ctrl.updateProgress = function(data) {
              var preview;
              if ((preview = this.getByFilename(data.files[0].name)) != null) {
                return preview.progress = parseInt(data.loaded / data.total * 100, 10);
              }
            };
          };
          return this;
        }
      ],
      link: function($scope, element, attrs, ctrls) {
        var previewsCtrl, progressCtrl;
        progressCtrl = ctrls[0], previewsCtrl = ctrls[1];
        return progressCtrl.updatePreviewCtrl(previewsCtrl);
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
      template: "<div ng-style=\"style\" class=\"mac-menu\"><ul><li mac-menu-transclude=\"mac-menu-transclude\" ng-repeat=\"item in items\" ng-click=\"selectItem($index)\" ng-class=\"{'active': $index == index}\" mac-mouseenter=\"setIndex($index)\" class=\"mac-menu-item\"></li></ul></div>",
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
          return angular.element(element[0].getElementsByClassName("modal-content-wrapper")).replaceWith(clone);
        });
        opts = util.extendAttributes("macModal", modalViews.defaults, attrs);
        regId = null;
        if (opts.overlayClose) {
          element.on("click", function($event) {
            if (angular.element($event.target).hasClass("modal-overlay")) {
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
@param {String}  mac-popover-trigger       Trigger option, click | hover | manual (default click)
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
            showEvent = "focus" ? "focusin" : "mouseenter";
            hideEvent = "focus" ? "focusout" : "mouseleave";
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
      link: function($scope, element, attrs) {
        var opts;
        opts = util.extendAttributes("macPopover", popoverViews.popoverDefaults, attrs);
        if (!attrs.id) {
          return;
        }
        angular.extend(opts, {
          template: element.html()
        });
        element.replaceWith(document.createComment("macPopover: " + attrs.id));
        return popover.register(attrs.id, opts);
      }
    };
  }
]).directive("macPopoverFillContent", [
  "$compile", function($compile) {
    return {
      restrict: "A",
      link: function($scope, element, attrs, ctrl) {
        element.html($scope.macPopoverTemplate);
        return $compile(element.contents())($scope);
      }
    };
  }
]);

angular.module("Mac").directive("macReorderable", [
  "hookableDirectiveController", function(hookableDirectiveController) {
    return {
      require: ["macReorderable"],
      controller: ["$scope", "$element", "$attrs", hookableDirectiveController],
      link: function($scope, $element, $attrs, controllers) {
        var selector;
        selector = $attrs.macReorderable;
        return $element.sortable({
          items: selector,
          cursor: "move",
          opacity: 0.8,
          tolerance: "pointer",
          update: function(event, ui) {
            return controllers[0].fireCallbacks(event, ui, $element.find(selector));
          }
        });
      }
    };
  }
]);

angular.module("Mac").directive("macReorderableColumns", [
  function() {
    return {
      require: ["^macTable", "macReorderable"],
      link: function($scope, $element, $attr, controllers) {
        return controllers[1].registerCallback(function(event, ui, columnElements) {
          var changedElement, columnsOrder;
          columnsOrder = [];
          changedElement = $(ui.item);
          columnElements.each(function() {
            return columnsOrder.push($(this).scope().cell.column.colName);
          });
          return $scope.$apply(function() {
            controllers[0].table.columnsOrder = columnsOrder;
            return controllers[0].table.columnsCtrl.syncOrder();
          });
        });
      }
    };
  }
]);

angular.module("Mac").directive("macResizable", [
  "hookableDirectiveController", function(hookableDirectiveController) {
    return {
      require: ["macResizable"],
      controller: ["$scope", "$element", "$attrs", hookableDirectiveController],
      link: function($scope, $element, $attrs, controllers) {
        var axis, containment;
        axis = $attrs.macResizable || "x";
        containment = $attrs.macResizableContainment || "parent";
        return $element.resizable({
          axis: axis,
          containment: containment,
          handles: "e",
          resize: function(event, ui) {
            return controllers[0].fireCallbacks(event, ui);
          }
        });
      }
    };
  }
]);

angular.module("Mac").directive("macResizableColumn", [
  function() {
    return {
      require: ["^macColumns", "macResizable"],
      link: function($scope, $element, $attrs, controllers) {
        return controllers[1].registerCallback(function(event, ui) {
          var column, percentage, width;
          column = $scope.cell.column;
          width = ui.size.width;
          percentage = (width / controllers[0].element.width()) * 100;
          $element.css("width", "");
          return $scope.$apply(function() {
            return controllers[0].recalculateWidths(null, $scope.$id, percentage, +column.width);
          });
        });
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
@name Columns
@description
Directive that keeps track of the widths of the columns in the table.
This directive is automatically added to any row whose cells use `mac-columns-width`.

@dependencies
macTable, macTableSection, macTableRow
*/

angular.module("Mac").factory("macColumnsController", function() {
  var MacColumnsController;
  return MacColumnsController = (function() {
    function MacColumnsController(scope, element, attrs) {
      this.scope = scope;
      this.element = element;
      this.attrs = attrs;
      this.trackedColumns = {};
    }

    MacColumnsController.prototype.getSiblingScopes = function(siblings) {
      var el, li, siblingScope, _i, _len;
      li = [];
      for (_i = 0, _len = siblings.length; _i < _len; _i++) {
        el = siblings[_i];
        siblingScope = angular.element(el).scope();
        if (this.trackedColumns[siblingScope.$id] != null) {
          li.push(siblingScope);
        }
      }
      return li;
    };

    MacColumnsController.prototype.recalculateWidths = function(event, id, newValue, oldValue) {
      var cElement, cScope, nextSiblings, nextSiblingsWidthMap, prevSiblings, scale, siblingScope, siblingsTotalWidth, width, _i, _j, _len, _len1, _ref, _results;
      if (!(!isNaN(newValue) && !isNaN(oldValue))) {
        return;
      }
      _ref = this.trackedColumns[id], cScope = _ref[0], cElement = _ref[1];
      nextSiblings = this.getSiblingScopes(cElement.nextAll());
      scale = (oldValue - newValue) / nextSiblings.length;
      nextSiblingsWidthMap = {};
      siblingsTotalWidth = 0;
      for (_i = 0, _len = nextSiblings.length; _i < _len; _i++) {
        siblingScope = nextSiblings[_i];
        width = +siblingScope.cell.column.width + scale;
        if (width < 5) {
          width = 5;
        }
        nextSiblingsWidthMap[siblingScope.$id] = width;
        siblingsTotalWidth += width;
      }
      prevSiblings = this.getSiblingScopes(cElement.prevAll());
      siblingsTotalWidth += prevSiblings.reduce(function(m, v) {
        return +v.cell.column.width + m;
      }, 0);
      if (!((siblingsTotalWidth + newValue) <= 100)) {
        return;
      }
      cScope.cell.column.width = newValue;
      _results = [];
      for (_j = 0, _len1 = nextSiblings.length; _j < _len1; _j++) {
        siblingScope = nextSiblings[_j];
        _results.push(siblingScope.cell.column.width = nextSiblingsWidthMap[siblingScope.$id]);
      }
      return _results;
    };

    return MacColumnsController;

  })();
});

angular.module("Mac").directive("macColumns", [
  "macColumnsController", function(macColumnsController) {
    return {
      require: ["^macTable", "^macTableSection", "macTableRow", "macColumns"],
      controller: ["$scope", "$element", "$attrs", macColumnsController],
      link: function($scope, $element, $attrs, controllers) {
        return $scope.$on("mac-columns-" + $scope.$id + "-changed", function(event, id, newValue, oldValue) {
          return controllers[3].recalculateWidths.apply(controllers[3], arguments);
        });
      }
    };
  }
]);

angular.module("Mac").directive("macColumnWidth", [
  function() {
    return {
      require: ["^macTable", "^macTableSection", "^macTableRow", "^macColumns"],
      priority: 500,
      compile: function(element, attr) {
        return function($scope, $element, $attrs, controllers) {
          controllers[3].trackedColumns[$scope.$id] = [$scope, $element];
          return $attrs.$observe("macColumnWidth", function(value) {
            if ($scope.cell.column.width) {
              return;
            }
            return $scope.cell.column.width = +value.replace("%", "");
          });
        };
      }
    };
  }
]);

/*
@chalk overview
@name Cell Template
@description
Directive for assigning cell templates to table columns

@dependencies
macTable, macTableSection, macTableRow

@param {String}     mac-cell-template     Space-delimited column names specifying when to show this template
*/

angular.module("Mac").directive("macCellTemplate", [
  function() {
    return {
      transclude: "element",
      priority: 1000,
      require: ["^macTable", "^macTableSection", "^macTableRow"],
      compile: function(element, attr, linker) {
        return function($scope, $element, $attr, controllers) {
          var templateName, templateNames, _i, _len, _results;
          templateNames = $attr.macCellTemplate ? $attr.macCellTemplate.split(" ") : ["?"];
          _results = [];
          for (_i = 0, _len = templateNames.length; _i < _len; _i++) {
            templateName = templateNames[_i];
            _results.push(controllers[1].cellTemplates[templateName] = [$element, linker, $attr]);
          }
          return _results;
        };
      }
    };
  }
]);

/*
@chalk overview
@name Table Row
@description
Directive initializing a table row for cell templates to be registered under

@dependencies
macTable, macTableSection
*/

angular.module("Mac").factory("MacTableRowController", [
  "directiveHelpers", function(directiveHelpers) {
    var MacTableRowController;
    return MacTableRowController = (function() {
      function MacTableRowController() {}

      MacTableRowController.prototype.repeatCells = function(cells, rowElement, sectionController) {
        var linkerFactory;
        rowElement.children().remove();
        linkerFactory = function(cell) {
          var template, templateName;
          templateName = cell.column.colName in sectionController.cellTemplates ? cell.column.colName : "?";
          if (template = sectionController.cellTemplates[templateName]) {
            return template[1];
          }
        };
        return directiveHelpers.repeater(cells, "cell", rowElement.scope(), rowElement, linkerFactory);
      };

      return MacTableRowController;

    })();
  }
]);

angular.module("Mac").directive("macTableRow", [
  "MacTableRowController", function(MacTableRowController) {
    return {
      require: ["^macTable", "^macTableSection", "macTableRow"],
      controller: MacTableRowController,
      compile: function(element, attr) {
        return function($scope, $element, $attr, controllers) {
          return $scope.$watch("row.cells", function(cells) {
            var _ref;
            if (((_ref = controllers[1].section) != null ? _ref.name : void 0) == null) {
              return;
            }
            return controllers[2].repeatCells(cells, $element, controllers[1]);
          });
        };
      }
    };
  }
]);

/*
@chalk overview
@name Table Section 
@description
Main directive for registering table sections. Can optionally have 
macTableSectionModels, macTableSectionController, or macTableSectionBlankRow.

@dependencies
macTable
*/

angular.module("Mac").directive("macTableSection", function() {
  var MacTableSectionController;
  MacTableSectionController = (function() {
    function MacTableSectionController(scope, attrs) {
      this.scope = scope;
      this.attrs = attrs;
      this.name = null;
      this.section = null;
      this.cellTemplates = {};
      this.watchers = {};
    }

    MacTableSectionController.prototype.registerWatcher = function(directiveName, controller) {
      return this.watchers[directiveName] = controller;
    };

    MacTableSectionController.prototype.applyWatchers = function() {
      var controller, directiveName, _ref, _results,
        _this = this;
      _ref = this.watchers;
      _results = [];
      for (directiveName in _ref) {
        controller = _ref[directiveName];
        _results.push((function(directiveName, controller) {
          return _this.attrs.$observe(directiveName, function(expression) {
            return controller.watch(expression, _this.name);
          });
        })(directiveName, controller));
      }
      return _results;
    };

    return MacTableSectionController;

  })();
  return {
    require: ["^macTable", "macTableSection"],
    scope: true,
    controller: ["$scope", "$attrs", MacTableSectionController],
    compile: function(element, attr, linker) {
      return function($scope, $element, $attr, controllers) {
        return $attr.$observe("macTableSection", function(sectionName) {
          if (!sectionName) {
            return;
          }
          controllers[1].name = sectionName;
          return $scope.$watch("table", function(table) {
            if (!table) {
              return;
            }
            $scope.$watch("table.sections." + sectionName, function(section) {
              return $scope.section = controllers[1].section = $scope.table.sections[sectionName];
            });
            return controllers[1].applyWatchers();
          });
        });
      };
    }
  };
});

/*
@chalk overview
@name Table Section Blank Row
@description
Inserts a blank row with keys matching those of the tables columns.

@dependencies
macTable, macTableSection
*/


angular.module("Mac").directive("macTableSectionBlankRow", function() {
  var MacTableSectionBlankRowCtrl;
  MacTableSectionBlankRowCtrl = (function() {
    function MacTableSectionBlankRowCtrl(scope) {
      this.scope = scope;
    }

    MacTableSectionBlankRowCtrl.prototype.watch = function(expression, sectionName) {
      var killWatcher, sectionToWaitOn,
        _this = this;
      sectionToWaitOn = expression || "body";
      return killWatcher = this.scope.$watch("table.sections." + sectionToWaitOn + ".rows", function(rows) {
        if (!rows) {
          return;
        }
        killWatcher();
        return _this.scope.$watch("table.columnsOrder", function() {
          if (sectionName in _this.scope.table.sections) {
            _this.scope.table.clear(sectionName);
          }
          _this.scope.table.load(sectionName);
          return _this.scope.table.insert(sectionName, _this.scope.table.blankRow());
        });
      });
    };

    return MacTableSectionBlankRowCtrl;

  })();
  return {
    require: ["^macTable", "macTableSection", "macTableSectionBlankRow"],
    controller: ["$scope", MacTableSectionBlankRowCtrl],
    link: function($scope, $element, $attrs, controllers) {
      return controllers[1].registerWatcher("macTableSectionBlankRow", controllers[2]);
    }
  };
});

/*
@chalk overview
@name Table Section Models
@description
Watches a models expression and loads them into the section

@dependencies
macTable, macTableSection
*/


angular.module("Mac").directive("macTableSectionModels", [
  "$parse", function($parse) {
    var MacTableSectionModelsCtrl;
    MacTableSectionModelsCtrl = (function() {
      function MacTableSectionModelsCtrl(scope) {
        this.scope = scope;
      }

      MacTableSectionModelsCtrl.prototype.watch = function(expression, sectionName) {
        var lastStringified,
          _this = this;
        lastStringified = "";
        return this.scope.$watch(function() {
          var currStringified, models;
          models = $parse(expression)(_this.scope);
          if (!angular.isArray(models)) {
            return;
          }
          currStringified = JSON.stringify(models);
          if (currStringified !== lastStringified) {
            lastStringified = currStringified;
            _this.models = models;
            _this.scope.table.load(sectionName, models);
            return currStringified;
          }
        });
      };

      return MacTableSectionModelsCtrl;

    })();
    return {
      require: ["^macTable", "macTableSection", "macTableSectionModels"],
      controller: ["$scope", MacTableSectionModelsCtrl],
      link: function($scope, $element, $attrs, controllers) {
        return controllers[1].registerWatcher("macTableSectionModels", controllers[2]);
      }
    };
  }
]);

/*
@chalk overview
@name Table Section Controller
@description
Watches a controller expression and loads the controller into the section

@dependencies
macTable, macTableSection
*/


angular.module("Mac").directive("macTableSectionController", function() {
  var MacTableSectionControllerCtrl;
  MacTableSectionControllerCtrl = (function() {
    function MacTableSectionControllerCtrl(scope) {
      this.scope = scope;
    }

    MacTableSectionControllerCtrl.prototype.watch = function(expression, sectionName) {
      var _this = this;
      return this.scope.$watch(expression, function(controller) {
        if (!controller) {
          return;
        }
        _this.controller = controller;
        return _this.scope.table.load(sectionName, null, controller);
      });
    };

    return MacTableSectionControllerCtrl;

  })();
  return {
    require: ["^macTable", "macTableSection", "macTableSectionController"],
    controller: ["$scope", MacTableSectionControllerCtrl],
    link: function($scope, $element, $attrs, controllers) {
      return controllers[1].registerWatcher("macTableSectionController", controllers[2]);
    }
  };
});

/*
@chalk overview
@name Table Section Selected Models
@description
Creates two way binding between a selected models array

@param {array}       mac-table-section-selected-models    A two-way bound array to see selected models and to select them 

@dependencies
macTable, macTableSection
*/

var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module("Mac").directive("macTableSectionSelectedModels", [
  "$parse", function($parse) {
    var SelectedModelsController;
    SelectedModelsController = (function() {
      function SelectedModelsController(scope, element, attrs) {
        this.scope = scope;
        this.element = element;
        this.attrs = attrs;
        this.rangeModel = $parse(this.attrs.macTableSectionSelectedModels);
      }

      SelectedModelsController.prototype.watch = function(expression, sectionName) {
        var _this = this;
        this.sectionName = sectionName;
        this.scope.$watch(expression, function(range) {
          var model, row, _i, _len;
          if (_this.scope.table.sections[_this.sectionName] == null) {
            return;
          }
          if (range == null) {
            range = [];
          }
          _this.unselectAll();
          for (_i = 0, _len = range.length; _i < _len; _i++) {
            model = range[_i];
            if (row = _this.findRowForModel(model)) {
              row.selected = true;
            }
          }
          range = _this.removeModelsNotInTable(range);
          return _this.setModel(range);
        });
        return this.scope.$watch("table.sections." + sectionName + ".rows.length", function() {
          var range;
          range = _this.removeModelsNotInTable(_this.getModel());
          return _this.setModel(range);
        });
      };

      SelectedModelsController.prototype.removeModelsNotInTable = function(range) {
        var index, model, removeIndexes, _i, _j, _len, _len1;
        removeIndexes = [];
        for (index = _i = 0, _len = range.length; _i < _len; index = ++_i) {
          model = range[index];
          if (!this.findRowForModel(model)) {
            removeIndexes.push(index);
          }
        }
        removeIndexes.reverse();
        for (_j = 0, _len1 = removeIndexes.length; _j < _len1; _j++) {
          index = removeIndexes[_j];
          range.splice(index, 1);
        }
        return range;
      };

      SelectedModelsController.prototype.findRowForModel = function(model) {
        var row, _i, _len, _ref;
        _ref = this.getSectionRows();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          row = _ref[_i];
          if (row.model === model) {
            return row;
          }
        }
      };

      SelectedModelsController.prototype.setModel = function(range) {
        return this.rangeModel.assign(this.scope, range);
      };

      SelectedModelsController.prototype.getModel = function() {
        return this.rangeModel(this.scope).slice(0);
      };

      SelectedModelsController.prototype.getSectionRows = function() {
        return this.scope.table.sections[this.sectionName].rows;
      };

      SelectedModelsController.prototype.unselectAll = function() {
        var index, row, _i, _len, _ref, _results;
        _ref = this.getSectionRows();
        _results = [];
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          row = _ref[index];
          _results.push(row.selected = false);
        }
        return _results;
      };

      return SelectedModelsController;

    })();
    return {
      controller: ["$scope", "$element", "$attrs", SelectedModelsController],
      require: ["^macTable", "macTableSection", "macTableSectionSelectedModels"],
      compile: function(element, attrs) {
        return function($scope, $element, $attrs, controllers) {
          return controllers[1].registerWatcher("macTableSectionSelectedModels", controllers[2]);
        };
      }
    };
  }
]);

/*
@chalk overview
@name Table Selectable
@description
Gives element it is on a click event that selects the row it shares a scope with

@param {bool}       mac-table-selectable    whether the current element is selectable

@dependencies
macTable, macTableSection, macTableSectionSelectedModels
*/


angular.module("Mac").directive("macTableSelectable", [
  "$document", "$window", "keys", function($document, $window, keys) {
    var SelectHandleController, commandselect, shiftselect,
      _this = this;
    shiftselect = false;
    commandselect = false;
    $document.bind("keydown", function(event) {
      if (event.which === keys.SHIFT) {
        shiftselect = true;
      }
      if (event.which === keys.COMMAND) {
        return commandselect = true;
      }
    });
    $document.bind("keyup", function(event) {
      if (event.which === keys.SHIFT) {
        shiftselect = false;
      }
      if (event.which === keys.COMMAND) {
        return commandselect = false;
      }
    });
    angular.element($window).bind("focus", function(event) {
      return shiftselect = commandselect = false;
    });
    SelectHandleController = (function() {
      function SelectHandleController(scope, element, attrs) {
        this.scope = scope;
        this.element = element;
        this.attrs = attrs;
      }

      SelectHandleController.prototype.getIndexOfFirstSelected = function() {
        var index, row, _i, _len, _ref;
        _ref = this.parentController.getSectionRows();
        for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
          row = _ref[index];
          if (row.selected) {
            return index;
          }
        }
      };

      SelectHandleController.prototype.selectAllBetween = function(start, end) {
        var row, rowsSlice;
        rowsSlice = this.parentController.getSectionRows().slice(start, end + 1);
        return this.parentController.setModel((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = rowsSlice.length; _i < _len; _i++) {
            row = rowsSlice[_i];
            _results.push(row.model);
          }
          return _results;
        })());
      };

      SelectHandleController.prototype.selectRow = function(row) {
        var _this = this;
        $document[0].getSelection().removeAllRanges();
        return this.scope.$apply(function() {
          var range, startIndex, targetIndex, _ref, _ref1;
          if (commandselect) {
            range = _this.parentController.getModel();
            if (_ref = row.model, __indexOf.call(range, _ref) >= 0) {
              return _this.parentController.setModel(range.filter(function(model) {
                return model !== row.model;
              }));
            } else {
              return _this.parentController.setModel(range.concat([row.model]));
            }
          } else if (shiftselect) {
            startIndex = _this.getIndexOfFirstSelected();
            targetIndex = _this.parentController.getSectionRows().indexOf(row);
            if (startIndex === targetIndex) {

            } else if (startIndex < targetIndex) {
              return _this.selectAllBetween(startIndex, targetIndex);
            } else if (startIndex > targetIndex) {
              return _this.selectAllBetween(targetIndex, startIndex);
            }
          } else {
            range = _this.parentController.getModel();
            if (range.length > 1) {
              return _this.parentController.setModel([row.model]);
            } else if (_ref1 = row.model, __indexOf.call(range, _ref1) >= 0) {
              return _this.parentController.setModel([]);
            } else {
              return _this.parentController.setModel([row.model]);
            }
          }
        });
      };

      return SelectHandleController;

    })();
    return {
      require: ["^macTable", "^macTableSectionSelectedModels", "macTableSelectable"],
      controller: ["$scope", "$element", "$attrs", SelectHandleController],
      link: function($scope, $element, $attrs, controllers) {
        controllers[2].parentController = controllers[1];
        return $element.on("click", function(event) {
          var selection;
          if (!$scope.$eval($attrs.macTableSelectable)) {
            return;
          }
          if ($window.getSelection) {
            selection = $window.getSelection();
          } else if ($document.selection) {
            selection = $document.selection.createRange();
          }
          if (selection.toString()) {
            return;
          }
          return controllers[2].selectRow($scope.row);
        });
      }
    };
  }
]);

/*
@chalk overview
@name Table 
@description
Directive for displaying tabluar data

@param {None}       mac-table-resizable-columns     Convenience param to add macResizableColumn and dependent directives to template elements
@param {None}       mac-table-reorderable-columns   Convenience param to add macReorderableColumn and dependent directives to template elements
*/

angular.module("Mac").factory("MacTableController", [
  "Table", function(Table) {
    var MacTableController;
    return MacTableController = (function() {
      function MacTableController(scope) {
        this.scope = scope;
      }

      MacTableController.prototype.hasResizableColumns = false;

      MacTableController.prototype.hasReorderableColumns = false;

      MacTableController.prototype.makeTable = function(columns) {
        this.table = this.scope.table = new Table(columns);
        return this.table.$parent = this.scope.$parent;
      };

      return MacTableController;

    })();
  }
]);

angular.module("Mac").directive("macTable", [
  "MacTableController", function(MacTableController) {
    return {
      require: "macTable",
      scope: true,
      controller: ["$scope", MacTableController],
      compile: function(element, attr) {
        var autoWidthTemplates, headerSectionElement, initialWidthExp, remainingPercent, siblingTemplates;
        headerSectionElement = element.find("[mac-table-section=header]");
        element.find("[mac-column-width]").attr("width", "{{cell.column.width}}%").parents("[mac-table-row]").attr("mac-columns", "");
        element.find("[mac-cell-template]").wrapInner("<div class='cell-wrapper' />").attr("data-column-name", "{{cell.column.colName}}");
        if (attr.macTableResizableColumns != null) {
          headerSectionElement.find("[mac-cell-template]").find(".cell-wrapper").attr("mac-resizable-column", "").attr("mac-resizable", "").attr("mac-resizable-containment", "document");
        }
        if (attr.macTableReorderableColumns != null) {
          headerSectionElement.find("[mac-table-row]").attr("mac-reorderable", "[mac-cell-template]").attr("mac-reorderable-columns", "");
        }
        element.find("[mac-table-row]").not("[mac-table-row][ng-repeat]").attr("ng-repeat", "row in section.rows");
        autoWidthTemplates = headerSectionElement.find("[mac-column-width=auto]");
        if (autoWidthTemplates.length) {
          siblingTemplates = headerSectionElement.find("[mac-column-width]").not("[mac-column-width=auto]");
          remainingPercent = 100;
          siblingTemplates.each(function() {
            return remainingPercent -= +$(this).attr('mac-column-width').replace("%", "");
          });
          initialWidthExp = "{{" + remainingPercent + " / (table.columns.length - " + siblingTemplates.length + ")}}%";
          autoWidthTemplates.attr("mac-column-width", initialWidthExp);
        }
        return function($scope, $element, $attr, controller) {
          controller.$element = $element;
          return $attr.$observe("macTableColumns", function(columnsExp) {
            if (columnsExp === "dynamic") {
              return controller.makeTable("dynamic");
            } else {
              return $scope.$watch(columnsExp, function(columns) {
                return controller.makeTable(columns);
              }, true);
            }
          });
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
      template: "<div ng-click=\"focusTextInput()\" class=\"mac-tag-autocomplete\"><ul class=\"tag-list\"><li ng-repeat=\"tag in selected\" class=\"tag label\"><div ng-click=\"selected.splice($index, 1)\" class=\"tag-close\">&times;</div><span class=\"tag-label\">{{getTagLabel(tag)}}</span></li><li ng-class=\"{'fullwidth': !selected.length}\" class=\"tag input-tag\"><mac-autocomplete ng-model=\"textInput\" mac-autocomplete-disabled=\"disabled\" mac-autocomplete-on-select=\"onSelect(selected)\" mac-autocomplete-on-success=\"onSuccess(data)\" mac-placeholder=\"autocompletePlaceholder\" ng-keydown=\"onKeyDown($event)\" class=\"text-input mac-autocomplete\"></mac-autocomplete></li></ul></div>",
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
        var attrsObject, delay, labelKey, queryKey, textInput, useSource, valueKey;
        valueKey = attrs.macTagAutocompleteValue;
        if (valueKey == null) {
          valueKey = "id";
        }
        labelKey = attrs.macTagAutocompleteLabel;
        if (labelKey == null) {
          labelKey = "name";
        }
        queryKey = attrs.macTagAutocompleteQuery || "q";
        delay = +attrs.macTagAutocompleteDelay || 800;
        useSource = false;
        textInput = angular.element(element[0].getElementsByClassName("mac-autocomplete"));
        attrsObject = {
          "mac-autocomplete-value": valueKey,
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
              return tag[labelKey];
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
                _results.push(item[valueKey]);
              }
              return _results;
            })();
            selectedValues = (function() {
              var _i, _len, _ref1, _results;
              _ref1 = $scope.selected || [];
              _results = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                item = _ref1[_i];
                _results.push(item[valueKey]);
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
                if (_ref2 = item[valueKey], __indexOf.call(difference, _ref2) >= 0) {
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
                _results.push(item[valueKey]);
              }
              return _results;
            })();
            return (function() {
              var _i, _len, _ref, _ref1, _results;
              _ref = data.data;
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                item = _ref[_i];
                if (_ref1 = item[valueKey] || item, __indexOf.call(existingValues, _ref1) < 0) {
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
A directive for creating a time input field

@param {String} mac-time-model        Assignable angular expression to data-bind to
Clearing model by setting it to null or '' will set model back to default value
@param {String} mac-time-placeholder  Placeholder text of the text input (default --:--)
@param {String} mac-time-disabled     Enable or disable time input
@param {String} mac-time-default      If model is undefined, use this as the starting value (default 12:00 PM)
*/

angular.module("Mac").directive("macTime", [
  "$filter", "$timeout", "util", "keys", function($filter, $timeout, util, keys) {
    return {
      restrict: "E",
      scope: {
        model: "=macTimeModel",
        disabled: "=macTimeDisabled"
      },
      replace: true,
      template: "<div class=\"date-time\"><i class=\"mac-icons mac-icon-time\"></i><input type=\"text\" mac-placeholder=\"placeholder\" maxlength=\"8\" ng-model=\"model\" ng-disabled=\"disabled\" ng-click=\"clickEvent($event)\" ng-blur=\"blurEvent($event)\" ng-keydown=\"keydownEvent($event)\" ng-keyup=\"keyupEvent($event)\" mac-time-input=\"mac-time-input\"/></div>",
      compile: function(element, attrs) {
        var defaults, opts;
        defaults = {
          placeholder: "--:--",
          "default": "12:00 AM"
        };
        opts = util.extendAttributes("macTime", defaults, attrs);
        return function($scope, element, attrs) {
          var getSelection, incrementHour, incrementMinute, initializeTime, inputDOM, selectHours, selectMeridian, selectMinutes, selectNextSection, selectPreviousSection, selectRange, setMeridian, toggleMeridian, updateInput, updateTime;
          $scope.placeholder = opts.placeholder;
          inputDOM = element[0].getElementsByTagName("input")[0];
          (initializeTime = function() {
            var currentDate, time;
            currentDate = new Date().toDateString();
            time = new Date(currentDate + " " + opts["default"]);
            if (isNaN(time.getTime())) {
              time = new Date(currentDate + " " + defaults["default"]);
            }
            return $scope.time = time;
          })();
          getSelection = function() {
            var start;
            start = inputDOM.selectionStart;
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
              return inputDOM.setSelectionRange(start, end);
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
            hours = $scope.time.getHours();
            if (hours >= 12 && meridian === "AM") {
              hours -= 12;
            }
            if (hours < 12 && meridian === "PM") {
              hours += 12;
            }
            return $scope.time.setHours(hours);
          };
          toggleMeridian = function() {
            var hours;
            hours = $scope.time.getHours();
            return $scope.time.setHours((hours + 12) % 24);
          };
          incrementHour = function(change) {
            return $scope.time.setHours($scope.time.getHours() + change);
          };
          incrementMinute = function(change) {
            return $scope.time.setMinutes($scope.time.getMinutes() + change);
          };
          updateInput = function() {
            return $scope.model = $filter("date")($scope.time.getTime(), "hh:mm a");
          };
          updateTime = function() {
            var hours, meridian, minutes, timeMatch;
            if (timeMatch = util.timeRegex.exec($scope.model)) {
              hours = +timeMatch[1];
              minutes = +timeMatch[2];
              meridian = timeMatch[3];
              if (meridian === "PM" && hours !== 12) {
                hours += 12;
              }
              if (meridian === "AM" && hours === 12) {
                hours = 0;
              }
              return $scope.time.setHours(hours, minutes);
            }
          };
          $scope.blurEvent = function(event) {
            return updateInput();
          };
          $scope.clickEvent = function(event) {
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
          };
          $scope.keydownEvent = function(event) {
            var change, key, meridianSelected;
            key = event.which;
            if (key === keys.UP || key === keys.DOWN || key === keys.LEFT || key === keys.RIGHT || key === keys.A || key === keys.P) {
              event.preventDefault();
            }
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
                selectMeridian();
                return updateInput();
            }
          };
          return $scope.keyupEvent = function(event) {
            var key;
            key = event.which;
            if (!((keys.NUMPAD0 <= key && key <= keys.NUMPAD9) || (keys.ZERO <= key && key <= keys.NINE))) {
              event.preventDefault();
            }
            return updateTime();
          };
        };
      }
    };
  }
]);

/*
@name Time Input
@description
An internal directive for mac-time input element to add validator
*/


angular.module("Mac").directive("macTimeInput", [
  "util", function(util) {
    return {
      restrict: "A",
      require: "?ngModel",
      link: function($scope, element, attrs, ctrl) {
        var timeValidator;
        timeValidator = function(value) {
          if (!value || util.timeRegex.exec(value)) {
            ctrl.$setValidity("time", true);
            return value;
          } else {
            ctrl.$setValidity("time", false);
            return void 0;
          }
        };
        ctrl.$formatters.push(timeValidator);
        return ctrl.$parsers.push(timeValidator);
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
          tooltip = angular.element("<div class=\"tooltip " + opts.direction + "\"><div class=\"tooltip-message\">" + text + "</div></div>");
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

angular.module("Mac").factory("directiveHelpers", [
  function() {
    return {
      repeater: function(iterator, keyName, $scope, $element, linkerFactory, postClone) {
        var clonedElement, item, linkerFn, nScope, _i, _len, _results;
        if (!$element.length) {
          return;
        }
        _results = [];
        for (_i = 0, _len = iterator.length; _i < _len; _i++) {
          item = iterator[_i];
          nScope = $scope.$new();
          nScope[keyName] = item;
          if (linkerFn = linkerFactory(item)) {
            clonedElement = linkerFn(nScope, function(clone) {
              return $element[0].appendChild(clone[0]);
            });
            _results.push(postClone && postClone(item, clonedElement));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };
  }
]);

var __slice = [].slice;

angular.module("Mac").factory("hookableDirectiveController", [
  function() {
    var HookableDirectiveController;
    return HookableDirectiveController = (function() {
      function HookableDirectiveController(scope, element, attrs) {
        this.scope = scope;
        this.element = element;
        this.attrs = attrs;
        this._callbacks = [];
      }

      HookableDirectiveController.prototype.registerCallback = function(callback) {
        return this._callbacks.push(callback);
      };

      HookableDirectiveController.prototype.fireCallbacks = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return this._callbacks.forEach(function(callback) {
          return callback.apply(null, args);
        });
      };

      return HookableDirectiveController;

    })();
  }
]);

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
      modalTemplate: "<div class=\"modal-overlay hide\">\n  <div class=\"modal\">\n    <a mac-modal-close class=\"close-modal\"></a>\n    <div class=\"modal-content-wrapper\"></div>\n  </div>\n</div>",
      show: function(id, triggerOptions) {
        var modalObject, options, path, renderModal, showModal, showOptions, template,
          _this = this;
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
          showModal = function(element) {
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
          if (showOptions.moduleMethod != null) {
            renderModal = function(template) {
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
              wrapper = angular.element(element[0].getElementsByClassName("modal-content-wrapper"));
              wrapper.html(template);
              if (showOptions.overlayClose) {
                element.bind("click", function($event) {
                  if (angular.element($event.target).hasClass("modal-overlay")) {
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
        modal = angular.element(element[0].getElementsByClassName("modal")).attr("style", "");
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
        var element, id, options, _ref,
          _this = this;
        if (this.opened == null) {
          return;
        }
        _ref = this.opened, id = _ref.id, options = _ref.options, element = _ref.element;
        options.beforeHide(element.scope());
        return $animate.removeClass(element, "visible", function() {
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
        });
      },
      bindingEvents: function(action) {
        var escapeKeyHandler, options, resizeHandler,
          _this = this;
        if (action == null) {
          action = "bind";
        }
        if (!((action === "bind" || action === "unbind") && (this.opened != null))) {
          return;
        }
        escapeKeyHandler = function(event) {
          if (event.which === keys.ESCAPE) {
            return _this.hide();
          }
        };
        resizeHandler = function(event) {
          return _this.resize();
        };
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
              viewScope = options.scope;
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
        var $window, action, current, currentPopover, diff, left, offset, options, position, relative, relativeElement, setOverflowPosition, top, topScroll, updateOffset;
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
        action = {};
        if (position.indexOf("middle") === -1) {
          if (offset.top + top - topScroll < 0) {
            action = {
              remove: "above",
              add: "below"
            };
          } else if (offset.top + top - topScroll > $window.height()) {
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
        if (offset.left + left < 0) {
          action = {
            remove: "right",
            add: "left"
          };
        } else if (offset.left + left + currentPopover.outerWidth() > $window.width()) {
          action = {
            remove: "left",
            add: "right"
          };
        }
        if (action.remove && action.add) {
          position = position.replace(action.remove, action.add);
          updateOffset();
        }
        offset.top += top;
        offset.left += left;
        if (options.offsetX != null) {
          offset.left += options.offsetX;
        }
        if (options.offsetY != null) {
          offset.top += options.offsetY;
        }
        return currentPopover.css(offset).addClass("visible " + position);
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
          if (!isScope(popoverObj.options.scope)) {
            removeScope.$destroy();
          }
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

var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module("Mac").factory("TableSectionController", [
  function() {
    var TableSectionController;
    return TableSectionController = (function() {
      function TableSectionController(section) {
        this.section = section;
      }

      TableSectionController.prototype.cellValue = function(row, colName) {
        return this.defaultCellValue(row, colName);
      };

      TableSectionController.prototype.defaultCellValue = function(row, colName) {
        return row.model[colName];
      };

      return TableSectionController;

    })();
  }
]);

angular.module("Mac").factory("TableRow", function() {
  var TableRow;
  return TableRow = (function() {
    function TableRow(section, model, cells, cellsMap) {
      this.section = section;
      this.model = model;
      this.cells = cells != null ? cells : [];
      this.cellsMap = cellsMap != null ? cellsMap : {};
    }

    TableRow.prototype.toJSON = function() {
      return {
        cells: this.cells
      };
    };

    return TableRow;

  })();
});

angular.module("Mac").factory("TableSection", function() {
  var TableSection;
  return TableSection = (function() {
    function TableSection(controller, table, name, rows) {
      this.table = table;
      this.name = name;
      this.rows = rows != null ? rows : [];
      this.setController(controller);
    }

    TableSection.prototype.setController = function(controller) {
      return this.ctrl = new controller(this);
    };

    TableSection.prototype.toJSON = function() {
      return {
        rows: this.rows
      };
    };

    return TableSection;

  })();
});

angular.module("Mac").factory("TableCell", function() {
  var Cell;
  return Cell = (function() {
    function Cell(row, column) {
      this.row = row;
      this.column = column;
    }

    Cell.prototype.value = function() {
      var _ref, _ref1;
      return (_ref = this.row) != null ? (_ref1 = _ref.section) != null ? _ref1.ctrl.cellValue(this.row, this.column.colName) : void 0 : void 0;
    };

    Cell.prototype.toJSON = function() {
      return {
        value: this.value(),
        column: this.column.colName
      };
    };

    return Cell;

  })();
});

angular.module("Mac").factory("tableComponents", [
  "TableSectionController", "TableRow", "TableSection", "TableCell", function(TableSectionController, TableRow, TableSection, TableCell) {
    return {
      rowFactory: function(section, model) {
        return new TableRow(section, model);
      },
      columnFactory: function(colName) {
        var Column;
        Column = function(colName) {
          this.colName = colName;
        };
        return new Column(colName);
      },
      sectionFactory: function(table, sectionName, controller) {
        if (controller == null) {
          controller = TableSectionController;
        }
        return new TableSection(controller, table, sectionName);
      },
      cellFactory: function(row, column) {
        if (column == null) {
          column = {};
        }
        return new TableCell(row, column);
      }
    };
  }
]);

angular.module("Mac").factory("dynamicColumnsFunction", function() {
  return function(models) {
    var columns, first, key, model;
    first = models[0];
    columns = (function() {
      var _results;
      _results = [];
      for (key in first) {
        model = first[key];
        _results.push(key);
      }
      return _results;
    })();
    return this.set(columns);
  };
});

angular.module("Mac").factory("TableColumnsController", [
  "tableComponents", "dynamicColumnsFunction", function(tableComponents, dynamicColumnsFunction) {
    var ColumnsController;
    return ColumnsController = (function() {
      function ColumnsController(table) {
        this.table = table;
      }

      ColumnsController.prototype.dynamic = dynamicColumnsFunction;

      ColumnsController.prototype.blank = function() {
        var colName, obj, _i, _len, _ref;
        obj = {};
        _ref = this.table.columnsOrder;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          colName = _ref[_i];
          obj[colName] = null;
        }
        return obj;
      };

      ColumnsController.prototype.reset = function() {
        this.table.columnsOrder = [];
        this.table.columns = [];
        return this.table.columnsMap = {};
      };

      ColumnsController.prototype.set = function(columns) {
        var colName, column, _i, _len, _results;
        this.reset();
        this.table.columnsOrder = columns;
        _results = [];
        for (_i = 0, _len = columns.length; _i < _len; _i++) {
          colName = columns[_i];
          column = tableComponents.columnFactory(colName);
          this.table.columnsMap[colName] = column;
          _results.push(this.table.columns.push(column));
        }
        return _results;
      };

      ColumnsController.prototype.syncOrder = function() {
        var cells, colName, columns, row, section, sectionName, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
        _ref = this.table.sections;
        for (sectionName in _ref) {
          section = _ref[sectionName];
          _ref1 = section.rows;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            row = _ref1[_i];
            cells = [];
            _ref2 = this.table.columnsOrder;
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              colName = _ref2[_j];
              cells.push(row.cellsMap[colName]);
            }
            row.cells = cells;
          }
        }
        columns = [];
        _ref3 = this.table.columnsOrder;
        for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
          colName = _ref3[_k];
          columns.push(this.table.columnsMap[colName]);
        }
        return this.table.columns = columns;
      };

      return ColumnsController;

    })();
  }
]);

angular.module("Mac").factory("TableRowsController", [
  "tableComponents", function(tableComponents) {
    var RowsController;
    return RowsController = (function() {
      function RowsController(table) {
        this.table = table;
      }

      RowsController.prototype.make = function(section, model) {
        var cell, colName, column, row, _i, _len, _ref;
        row = tableComponents.rowFactory(section, model);
        _ref = this.table.columnsOrder;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          colName = _ref[_i];
          column = this.table.columnsMap[colName];
          cell = tableComponents.cellFactory(row, column);
          row.cellsMap[colName] = cell;
          row.cells.push(cell);
        }
        return row;
      };

      RowsController.prototype.set = function(sectionName, models, sectionController) {
        var model, rows, section, _i, _len;
        section = this.table.sections[sectionName];
        if ((models != null ? models.length : void 0) == null) {
          return;
        }
        if (this.table.dynamicColumns) {
          this.table.columnsCtrl.dynamic(models);
        }
        rows = [];
        for (_i = 0, _len = models.length; _i < _len; _i++) {
          model = models[_i];
          rows.push(this.make(section, model));
        }
        section.rows = rows;
        return this.table.columnsCtrl.syncOrder();
      };

      RowsController.prototype.insert = function(sectionName, model, index) {
        var row, section;
        section = this.table.sections[sectionName];
        row = this.make(section, model);
        return section.rows.splice(index, 0, row);
      };

      RowsController.prototype.remove = function(sectionName, index) {
        var section;
        section = this.table.sections[sectionName];
        return section.rows.splice(index, 1);
      };

      RowsController.prototype.clear = function(sectionName) {
        var section;
        section = this.table.sections[sectionName];
        return section.rows = [];
      };

      return RowsController;

    })();
  }
]);

angular.module("Mac").factory("Table", [
  "TableColumnsController", "TableRowsController", "tableComponents", function(TableColumnsController, TableRowsController, tableComponents) {
    var Table, convertObjectModelsToArray;
    convertObjectModelsToArray = function(models) {
      if (models && !angular.isArray(models)) {
        return [models];
      } else {
        return models;
      }
    };
    return Table = (function() {
      function Table(columns) {
        if (columns == null) {
          columns = [];
        }
        this.sections = {};
        this.columns = [];
        this.columnsCtrl = new TableColumnsController(this);
        this.rowsCtrl = new TableRowsController(this);
        this.dynamicColumns = columns === 'dynamic';
        if (!this.dynamicColumns) {
          this.columnsCtrl.set(columns);
        }
        return;
      }

      Table.prototype.makeSection = function(sectionName) {
        return this.sections[sectionName] = tableComponents.sectionFactory(this, sectionName);
      };

      Table.prototype.load = function(sectionName, models, controller) {
        if (!this.sections[sectionName]) {
          this.makeSection(sectionName);
        }
        if (controller) {
          this.loadController(sectionName, controller);
        }
        if (models) {
          return this.loadModels(sectionName, models);
        }
      };

      Table.prototype.loadModels = function(sectionName, models) {
        var args, index, model, row, tableModels, toBeInserted, toBeRemoved, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _results;
        models = convertObjectModelsToArray(models);
        if ((_ref = this.sections[sectionName]) != null ? _ref.rows.length : void 0) {
          tableModels = [];
          toBeRemoved = [];
          toBeInserted = [];
          _ref1 = this.sections[sectionName].rows;
          for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
            row = _ref1[index];
            if (_ref2 = row.model, __indexOf.call(models, _ref2) < 0) {
              toBeRemoved.push([sectionName, index]);
            } else {
              tableModels.push(row.model);
            }
          }
          toBeRemoved.reverse();
          for (_j = 0, _len1 = toBeRemoved.length; _j < _len1; _j++) {
            args = toBeRemoved[_j];
            this.remove.apply(this, args);
          }
          for (index = _k = 0, _len2 = models.length; _k < _len2; index = ++_k) {
            model = models[index];
            if (__indexOf.call(tableModels, model) < 0) {
              toBeInserted.push([sectionName, model, index]);
            }
          }
          _results = [];
          for (_l = 0, _len3 = toBeInserted.length; _l < _len3; _l++) {
            args = toBeInserted[_l];
            _results.push(this.insert.apply(this, args));
          }
          return _results;
        } else {
          return this.rowsCtrl.set(sectionName, models);
        }
      };

      Table.prototype.loadController = function(sectionName, sectionController) {
        if (sectionController) {
          return this.sections[sectionName].setController(sectionController);
        }
      };

      Table.prototype.insert = function(sectionName, model, index) {
        if (index == null) {
          index = 0;
        }
        return this.rowsCtrl.insert(sectionName, model, index);
      };

      Table.prototype.remove = function(sectionName, index) {
        if (index == null) {
          index = 0;
        }
        return this.rowsCtrl.remove(sectionName, index);
      };

      Table.prototype.clear = function(sectionName) {
        return this.rowsCtrl.clear(sectionName);
      };

      Table.prototype.blankRow = function() {
        return this.columnsCtrl.blank();
      };

      Table.prototype.toJSON = function() {
        return {
          sections: this.sections
        };
      };

      return Table;

    })();
  }
]);

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