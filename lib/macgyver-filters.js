/**
 * MacGyver v0.4.0
 * @link http://angular-macgyver.github.io/MacGyver
 * @license MIT
 */
(function(window, angular, undefined) {
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

})(window, window.angular);