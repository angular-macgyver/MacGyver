/**
 * @ngdoc service
 * @name util
 * @description
 * A bunch of utility functions
 */
angular.module('Mac.Util', []).factory('util', ['$filter', function($filter) {
  var inflectionConstants = {
    "uncountables": ["sheep", "fish", "moose", "series", "species", "money", "rice", "information", "info", "equipment", "min"],
    "irregulars": {
      "child": "children",
      "man": "men",
      "woman": "women",
      "person": "people",
      "ox": "oxen",
      "goose": "geese"
    },
    "pluralizers": [
      [/(quiz)$/i, "$1zes"],
      [/([m|l])ouse$/i, "$1ice"],
      [/(matr|vert|ind)(ix|ex)$/i, "$1ices"],
      [/(x|ch|ss|sh)$/i, "$1es"],
      [/([^aeiouy]|qu)y$/i, "$1ies"],
      [/(?:([^f])fe|([lr])f)$/i, "$1$2ves"],
      [/sis$/i, "ses"],
      [/([ti])um$/i, "$1a"],
      [/(buffal|tomat)o$/i, "$1oes"],
      [/(bu)s$/i, "$1ses"],
      [/(alias|status)$/i, "$1es"],
      [/(octop|vir)us$/i, "$1i"],
      [/(ax|test)is$/i, "$1es"],
      [/x$/i, "xes"],
      [/s$/i, "s"],
      [/$/, "s"]
    ]
  };

  var cssPrefixes = ['webkit', 'Moz', 'ms', 'O'];

  /**
   * @constant {string} timeRegexStr
   * @example
   * 01:30 PM or 9:45 AM
   * @private
   */
  var timeRegexStr = '^' +
    '(0?[1-9]|1[0-2])' +  // hours (starting zero optional)
    ':' +                 // colon
    '([0-5][0-9])' +      // minute
    '[\\s]' +             // space
    '([AP]M)' +           // meridian
    '$';
  var timeRegex = new RegExp(timeRegexStr);

  /**
    * @constant {string} urlRegexStr
    * @see {@link http://tools.ietf.org/html/rfc3986#section-2.2}
    * @private
    */
  var urlRegexStr = '(?:' +
      '(http[s]?):\\/\\/' +     // protocol (optional)
    ')?' +
    '(?:' +
      '(www|[\\d\\w\\-]+)\\.' + // subdomain (optional)
    ')?' +
    '([\\d\\w\\-]+)\\.' +       // domain
    '([A-Za-z]{2,6})' +         // tld
    '(:[\\d]*)?'  +             // port (optional)
    '([' +                      // path (optional)
      ':\\/?#\\[\\]@' +         // rfc3986 gen-delims
      '!$&\'()*+,;=' +          // rfc3986 sub-delims
      '\\w\\d-._~' +            // rfc3986 unreserved characters
      '%\\\\' +                 // additional characters
    ']*)?';
  var urlRegex = new RegExp(urlRegexStr, 'i');

  var emailRegex =  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  return {
    /**
     * @ngdoc method
     * @name util#pluralize
     * @description
     * Pluralize string based on the count
     *
     * @param {String} string String to pluralize (default '')
     * @param {Integer} count Object counts
     * @param {Boolean} includeCount Include the number or not (default false)
     *
     * @returns {String} Pluralized string based on the count
     *
     * @example
util.pluralize("apple", 5)
=> "apples"
util.pluralize("apple", 10, true)
=> "10 apples"
     */
    pluralize: function(string, count, includeCount) {
      var irregulars, isUppercase, lowercaseWord, pluralizedString, pluralizedWord, pluralizer, pluralizers, uncountables, word, i;
      string = string || '';
      includeCount = includeCount || false;
      if (!angular.isString(string) || this.trim(string).length === 0) {
        return string;
      }
      if (includeCount && isNaN(+count)) {
        return "";
      }
      if (count === undefined) {
        count = 2;
      }

      pluralizers = inflectionConstants.pluralizers;
      uncountables = inflectionConstants.uncountables;
      irregulars = inflectionConstants.irregulars;

      word = string.split(/\s/).pop();
      isUppercase = word.toUpperCase() === word;
      lowercaseWord = word.toLowerCase();

      pluralizedWord = count === 1 || uncountables.indexOf(lowercaseWord) >= 0 ? word : null;

      if (pluralizedWord === null && irregulars[lowercaseWord]) {
        pluralizedWord = irregulars[lowercaseWord];
      }

      if (!pluralizedWord) {
        for (i = 0; i < pluralizers.length; i++) {
          pluralizer = pluralizers[i];
          if (!(pluralizer[0].test(lowercaseWord))) {
            continue;
          }
          pluralizedWord = word.replace(pluralizer[0], pluralizer[1]);
          break;
        }
      }
      pluralizedWord = pluralizedWord || word;
      if (isUppercase) {
        pluralizedWord = pluralizedWord.toUpperCase();
      }
      pluralizedString = string.slice(0, -word.length) + pluralizedWord;
      if (includeCount) {
        return ($filter("number")(count)) + " " + pluralizedString;
      } else {
        return pluralizedString;
      }
    },

    /**
     * @ngdoc method
     * @name util#trim
     * @description
     * Trimming whitespaces on strings
     * @param {String} string input
     * @returns {String} Trimmed string
     */
    trim: function(string) {
      var str;
      str = String(string) || "";
      if (String.prototype.trim !== null) {
        return str.trim();
      } else {
        return str.replace(/^\s+|\s+$/gm, "");
      }
    },

    /**
     * @ngdoc method
     * @name util#capitalize
     * @description
     * Capitalize string
     * @param {String} string
     * @returns {String}
     *
     * @example
util.capitalize('lowercase')
=> "Lowercase"
     */
    capitalize: function(string) {
      var str;
      str = String(string) || "";
      return str.charAt(0).toUpperCase() + str.substring(1);
    },

    /**
     * @ngdoc method
     * @name util#uncapitalize
     * @description
     * Convert the first character to lowercase
     * @param {String} string
     * @returns {String}
     *
     * @example
util.uncapitalize('UPPERCASE')
=> "uPPERCASE"
     */
    uncapitalize: function(string) {
      var str;
      str = String(string) || "";
      return str.charAt(0).toLowerCase() + str.substring(1);
    },

    /**
     * @ngdoc method
     * @name util#toCamelCase
     * @description
     * Convert string with dashes, underscores and spaces to camel case
     * @param {String} string
     * @returns {String}
     *
     * @example
this-is-a-test => thisIsATest
another_test => anotherTest
hello world again => helloWorldAgain
a mix_of-everything => aMixOfEverything
     */
    toCamelCase: function(string) {
      string = string || '';
      return this.trim(string).replace(/[-_\s]+(.)?/g, function(match, c) {
        return c.toUpperCase();
      });
    },

    /**
     * @ngdoc method
     * @name util#toSnakeCase
     * @description
     * Convert other cases into snake case (separated by underscores)
     * @param {String} string
     * @returns {String}
     *
     * @example
util.toSnakeCase("just another string")
=> "just_another_string"
     */
    toSnakeCase: function(string) {
      string = string || '';
      return this.trim(string).replace(/([a-z\d])([A-Z]+)/g, "$1_$2").replace(/[-\s]+/g, "_").toLowerCase();
    },

    /**
     * @ngdoc method
     * @name util#convertKeysToCamelCase
     * @description
     * Convert object keys to camel case
     * @param {Object} object
     * @returns {Object}
     *
     * @example
util.toSnakeCase({'hello-world': 'test'})
=> {'helloWorld': 'test'}
     */
    convertKeysToCamelCase: function(object) {
      var key, result = {}, value;
      for (key in object) {
        value = object[key];
        key = this.toCamelCase(key);

        if (value && typeof value === 'object' && value.constructor !== Array) {
          value = this.convertKeysToCamelCase(value);
        }

        result[key] = value;
      }
      return result;
    },

    /**
     * @ngdoc method
     * @name util#convertKeysToSnakeCase
     * @description
     * Convert object keys to snake case
     * @param {Object} object
     * @returns {Object}
     *
     * @example
util.toSnakeCase({'helloWorld': 'test'})
=> {'hello_world': 'test'}
     */
    convertKeysToSnakeCase: function(object) {
      var key, result = {}, value;
      for (key in object) {
        value = object[key];
        key = this.toSnakeCase(key);

        if (value && typeof value === 'object' && value.constructor !== Array) {
          value = this.convertKeysToSnakeCase(value);
        }

        result[key] = value;
      }
      return result;
    },

    /**
     * @ngdoc method
     * @name util#pyth
     * @description
     * pythagoras theorem
     * @param {Integer} a
     * @param {Integer} b
     * @returns {Integer}
     */
    pyth: function(a, b) {
      return Math.sqrt(a * a + b * b);
    },

    /**
     * @ngdoc method
     * @name util#degrees
     * @description
     * Convert from radian to degrees
     * @param {Number} radian
     * @returns {Number}
     */
    degrees: function(radian) {
      return (radian * 180) / Math.PI;
    },

    /**
     * @ngdoc method
     * @name util#radian
     * @description
     * Convert degree to radian
     * @param {Number} degrees
     * @returns {Number}
     */
    radian: function(degrees) {
      return (degrees * Math.PI) / 180;
    },

    /**
     * @ngdoc method
     * @name util#hex2rgb
     * @description
     * Convert hex color value to rgb
     * @param {String} hex
     * @returns {Object} Object with r, g, and b values
     */
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

    /**
     * @ngdoc method
     * @name util#validateUrl
     * @description
     * Parse url
     * @param {String} url
     * @returns {Object} Object with url sections parsed out
     *
     * @example
 input: www.example.com:9000/testing
 output: {
   url: 'www.example.com:9000/testing',
   protocol: 'http',
   subdomain: 'www',
   name: 'example',
   domain: 'com',
   port: '9000',
   path: '/testing'
 }
     */
    validateUrl: function(url) {
      var match = urlRegex.exec(url);
      if (match !== null) {
        match = {
          url: match[0],
          protocol: match[1] || "http",
          subdomain: match[2],
          name: match[3],
          domain: match[4],
          port: match[5],
          path: match[6] || "/"
        };
      }
      return match;
    },

    /**
     * @ngdoc method
     * @name util#validateEmail
     * @description
     * Check if input string is a valid email address
     * @param {String} email
     * @returns {Boolean}
     */
    validateEmail: function(email) {
      return emailRegex.test(email);
    },

    /**
     * @ngdoc method
     * @name util#validateTime
     * @description
     * Check if time input match time regex
     * @param {String} time
     * @returns {Object}
     */
    validateTime: function(time) {
      return timeRegex.exec(time);
    },

    /**
     * @ngdoc method
     * @name util#getQueryString
     * @description
     * Return param value in querystring
     * @see {@link http://www.netlobo.com/url_query_string_javascript.html}
     * @param {String} url
     * @param {String} name
     * @returns {String}
     *
     * @example
util.getQueryString('http://www.example.com/macgyver?season=1&episode=3&time=12:23', 'episode')
=> 3
     */
    getQueryString: function(url, name) {
      var regex, regexS, results;
      name = name || '';
      name = name.replace(/\[/, "\[").replace(/\]/, "\]");
      regexS = "[\?&]" + name + "=([^&#]*)";
      regex = new RegExp(regexS);
      results = regex.exec(url);

      return results ? results[1] : '';
    },

    /**
     * @ngdoc method
     * @name util#extendAttributes
     * @description
     * Extend default values with attribute
     * @param {String} prefix Prefix of all attributes
     * @param {Object} defaults Default set of attributes
     * @param {Object} attributes User set attributes
     * @returns {Object}
     */
    extendAttributes: function(prefix, defaults, attributes) {
      var altKey, key, macKey, output, value, outputValue;
      prefix = prefix || '';
      output = {};
      for (key in defaults) {
        if (!defaults.hasOwnProperty(key)) continue;

        value = defaults[key];
        altKey = prefix ? this.capitalize(key) : key;
        macKey = "" + prefix + altKey;

        if (attributes.hasOwnProperty(macKey)) {
          // Value can be empty when only setting the attribute
          if (attributes[macKey] === '') {
            outputValue = true;
          } else {
            outputValue = attributes[macKey];
          }
        } else {
          outputValue = value;
        }

        // Convert to true boolean if passing in boolean string
        if (outputValue === "true" || outputValue === "false") {
          outputValue = outputValue === "true";

        // Convert to integer or numbers from strings
        } else if (outputValue != null && outputValue.length > 0 && !isNaN(+outputValue)) {
          outputValue = +outputValue;
        }

        output[key] = outputValue;
      }
      return output;
    },

    getCssVendorName: function (el, name) {
      var i, prefix;
      var capitalizedName = this.capitalize(name);
      for (i = 0; i < cssPrefixes.length; i++) {
        prefix = cssPrefixes[i];

        if (el.style.hasOwnProperty(prefix + capitalizedName)) {
          return prefix + capitalizedName;
        }
      }
      return name;
    }
  };
}]);
