###
@chalk overview
@name Time
@description
A directive for creating a time input field

@param {String} mac-time-model        Assignable angular expression to data-bind to
Clearing model by setting it to null or '' will set model back to default value
@param {String} mac-time-placeholder  Placeholder text of the text input (default --:--)
@param {String} mac-time-disabled     Enable or disable time input
@param {String} mac-time-default      If model is undefined, use this as the starting value (default 12:00 PM)

###

angular.module("Mac").directive "macTime", [
  "$filter"
  "$timeout"
  "util"
  "keys"
  ($filter, $timeout, util, keys) ->
    restrict: "E"
    scope:
      model:    "=macTimeModel"
      disabled: "=macTimeDisabled"
    replace:     true
    templateUrl: "template/time.html"

    compile: (element, attrs) ->

      defaults =
        placeholder: "--:--"
        default:     "12:00 AM"

      opts = util.extendAttributes "macTime", defaults, attrs

      ($scope, element, attrs) ->
        $scope.placeholder = opts.placeholder

        inputDOM         = element[0].getElementsByTagName("input")[0]
        timeRegex        = /^(0?[1-9]|1[0-2]):([0-5][0-9]) ([AP]M)$/
        highlightActions = 
          hours:   -> inputDOM.setSelectionRange 0, 2
          minutes: -> inputDOM.setSelectionRange 3, 5
          markers: -> inputDOM.setSelectionRange 6, 8

        resetTime = ->
          currentDate = new Date().toDateString()

          time = new Date currentDate + " " + opts.default

          # Invalid Date
          if isNaN time.getTime()
            time = new Date currentDate + " " + defaults.default

          #
          # @name $scope.time
          # @description
          # Javscript date variable for easier datetime manipulation
          #
          $scope.time = time

        resetTime()

        $scope.$watch "model", (value) ->
          if value? and value
            $scope.updateScopeTime()
          else
            resetTime()

        #
        # @name inputSelectAction
        # @description
        # Based on the index given, execute certain actions
        # @param {Integer} index Start index of selection
        # @param {Object} actions Three functions to execute out based on selection
        #
        inputSelectAction = (index, actions = {}) ->
          if 0 <= index < 3
            actions.hours?()

          else if 3 <= index < 6
            actions.minutes?()

          else if 6 <= index < 9
            actions.markers?()

          actions.all?()

        #
        # @name $scope.updateInput
        # @description
        # Update the text input with the current set time and highlight section accordingly
        # @param {Object} actions Three functions to execute out based on selection
        #
        $scope.updateInput = (actions = {}) ->
          start = inputDOM.selectionStart

          hasActions = (key for own key of actions).length > 0

          if hasActions
            inputSelectAction start, actions

          # Highlight hour on activating the time input
          $timeout ->
            inputSelectAction start, highlightActions
          , 0, false

          $scope.model = $filter("date") $scope.time.getTime(), "hh:mm a"

        #
        # @name $scope.updateScopeTime
        # @description
        # Using model on scope, try to convert to javascript datetime object
        #
        $scope.updateScopeTime = ->
          if timeMatch = timeRegex.exec $scope.model
            hours   = +timeMatch[1]
            minutes = +timeMatch[2]
            markers = timeMatch[3] or "AM"

            hours += 12 if markers is "PM" and hours isnt 12
            hours  = 0 if markers is "AM" and hours is 12

            $scope.time.setHours hours, minutes
          else
            $scope.updateInput()

        $scope.keydownEvent = (event) ->
          key = event.which

          switch key
            when keys.UP, keys.DOWN
              event.preventDefault()

              change  = if key is keys.UP then 1 else -1

              $scope.updateInput
                hours:   -> $scope.time.setHours $scope.time.getHours() + change
                minutes: -> $scope.time.setMinutes $scope.time.getMinutes() + change
                markers: -> $scope.time.setHours $scope.time.getHours() + change * 12

            when keys.LEFT, keys.RIGHT
              event.preventDefault()

              change = if key is keys.LEFT then -3 else 3
              start  = inputDOM.selectionStart
              end    = inputDOM.selectionEnd

              # Determine the next input to highlight
              inputSelectAction start,
                # if hours are highlighted, keep their selectionStart at 0
                hours:   -> change = 0 if key is keys.LEFT
                # if markers are highlighted, keep their selectionStart at 8
                markers: -> change = 0 if key is keys.RIGHT
                # otherwise, navigate between hours, minutes, markers
                all:     ->
                  start += change
                  end   += change

              # Using the new start and end index, select the correct value
              inputDOM.setSelectionRange start, end

              $scope.updateInput()

            when keys.A, keys.P
              event.preventDefault()

              hours  = $scope.time.getHours()

              if key is keys.A
                change = if hours >= 12 then -1 else 0
              else if key is keys.P
                change = if hours >= 12 then 0 else -1
              else
                change = 0

              $scope.updateInput
                # if markers are highlighted, change to AM or PM
                markers: -> $scope.time.setHours hours + change * 12

        $scope.keyupEvent = (event) ->
          key = event.which

          keyIsAorP   = keys.A or keys.P
          keyIsNumber = keys.NUMPAD0 <= key <= keys.NUMPAD9 or keys.ZERO <= key <= keys.NINE
          
          if keyIsNumber or keyIsAorP
            $scope.updateScopeTime()
]
