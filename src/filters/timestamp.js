/**
 * @ngdoc filter
 * @name timestamp
 * @description
 * Takes in a unix timestamp and turns it into a human-readable relative time string, like "5
 * minutes ago" or "just now".
 *
 * @param {integer} time The time to format
 * @returns {String} Formatted string
 *
 * @example
<example>
  <dl class="dl-horizontal">
    <dt>Now - 5 minutes</dt>
    <dd>{{ fiveMinAgo | timestamp}}</dd>
    <dt>Now - 1 day</dt>
    <dd>{{ oneDayAgo | timestamp}}</dd>
    <dt>Now - 3 days</dt>
    <dd>{{ threeDaysAgo | timestamp}}</dd>
  </dl>
</example>
<span>{{yesterday | timestamp}}</span>
 */

angular.module('Mac').filter('timestamp', ['util', function(util) {
  function _createTimestamp(count, noun) {
    noun = util.pluralize(noun, count);
    return count + ' ' + noun + ' ' + 'ago';
  }

  return function(time) {
    var parsedTime = parseInt(time),
        currentTime = Math.round(Date.now() / 1000),
        timeDiff;

    if (isNaN(parsedTime)) return time;

    timeDiff = currentTime - parsedTime;

    if (timeDiff < 45) {
      return 'just now';
    } else if (timeDiff < 120) {
      return 'about a minute ago';
    } else {
      if (timeDiff < 60) return timeDiff + ' seconds ago';

      timeDiff /= 60;
      if (timeDiff < 60)
        return _createTimestamp(Math.floor(timeDiff), 'min');

      timeDiff /= 60;
      if (timeDiff < 24)
        return _createTimestamp(Math.floor(timeDiff), 'hour');

      timeDiff /= 24;
      if (timeDiff < 7)
        return _createTimestamp(Math.floor(timeDiff), 'day');

      if (timeDiff < 31)
        return _createTimestamp(Math.floor(timeDiff/7), 'week');

      if (timeDiff < 365)
        return _createTimestamp(Math.floor(timeDiff/31), 'month');

      return _createTimestamp(Math.floor(timeDiff/365), 'year');
    }
  };
}]);
