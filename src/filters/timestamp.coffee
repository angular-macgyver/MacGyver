###
@chalk overview
@name Timestamp filter

@description
Takes in a unix timestamp and turns it into a human-readable relative time string, like "5
minutes ago" or "just now".

@param {Unix timestamp} time The time to format
@returns {String} Formatted string
###

angular.module("Mac").filter "timestamp", ["util", (util) ->
  _createTimestamp = (count, noun) ->
    noun = util.pluralize noun, count
    "#{count} #{noun} ago"

  (time) ->
    time        = +time
    currentTime = Math.round Date.now() / 1000
    secondsAgo  = currentTime - time

    if secondsAgo < 45
      "just now"
    else if secondsAgo < 120
      "about a minute ago"
    else
      years = Math.floor(secondsAgo / (365 * 24 * 60 * 60))
      return _createTimestamp years, "year" if years > 0

      months = Math.floor(secondsAgo / (31 * 24 * 60 * 60))
      return _createTimestamp months, "month" if months > 0

      weeks = Math.floor(secondsAgo / (7 * 24 * 60 * 60))
      return _createTimestamp weeks, "week" if weeks > 0

      days = Math.floor(secondsAgo / (24 * 60 * 60))
      return _createTimestamp days, "day" if days > 0

      hours = Math.floor(secondsAgo / (60 * 60))
      return _createTimestamp hours, "hour" if hours > 0

      minutes = Math.floor(secondsAgo / 60)
      return _createTimestamp minutes, "min" if minutes > 0

      return "#{secondsAgo} seconds ago"
]
