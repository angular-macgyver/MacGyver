###
@chalk overview
@name Time
@description
A directive for creating a time input field

@param {String} mac-time-id           ID of the text input field (default: time-input)
@param {String} mac-time-model        Model to bind input to
@param {String} mac-time-placeholder  Placeholder text of the text input (default --:--)
@param {String} mac-time-disabled     Enable or disable time input
@param {String} mac-time-default      If model is undefined, use this as the starting value (default 12:00 PM)

###

angular.module("Mac").directive "macTime", [
  "util"
  "keys"
  "$filter"
  (util, keys, $filter) ->
    restrict: "E"
    scope:
      model:    "=macTimeModel"
      disabled: "=macTimeDisabled"
    replace:     true
    templateUrl: "template/time.html"

    compile: (element, attrs) ->

      defaults =
        id:          "time-input"
        placeholder: "--:--"
        default:     "12:00 AM"

      opts = util.extendAttributes "macTime", defaults, attrs

      inputElement = $("input", element)
      inputElement.attr "placeholder", opts.placeholder

      ($scope, element, attrs) ->
        inputDOM        = inputElement[0]
        timeRegex       = /(\d+):(\d+) ([AP]M)?/
        highlighActions =
          hours:   -> inputDOM.setSelectionRange 0, 2
          minutes: -> inputDOM.setSelectionRange 3, 5
          markers: -> inputDOM.setSelectionRange 6, 8

        $scope.$watch "model", (value) ->
          updateScopeTime() if value?

        $scope.reset = ->
          prefix = "Jan 1, 1970, "
          time   = new Date (prefix + opts.default)

          if isNaN time.getTime()
            # Invalid Date
            time = new Date prefix + "12:00 AM"

          $scope.time = time

        #
        # @name inputSelectAction
        # @description
        # Based on the index given, execute certain actions
        # @param {Integer} index Start index of selection
        # @param {Integer} endIndex End index of selection (default index)
        # @param {Object} actions Three functions to execute out based on selection
        #
        inputSelectAction = (index, endIndex = index, actions = {}) ->
          # Allow user to pass actions as the second parameter
          # Meaning the start and end index is the same
          if typeof endIndex is "object"
            actions  = endIndex
            endIndex = index

          if 0 <= index < 3 and 0 <= endIndex < 3
            actions.hours?()

          else if 3 <= index < 6 and 3 <= endIndex < 6
            actions.minutes?()

          else if 6 <= index < 9 and 6 <= index < 9
            actions.markers?()

          actions.all?()

        #
        # @name updateInput
        # @description
        # Update the text input with the current set time and highlight section accordingly
        # @param {Object} actions Three functions to execute out based on selection
        #
        updateInput = (actions = {}) ->
          start = inputDOM.selectionStart
          end   = inputDOM.selectionEnd

          inputSelectAction start, end, actions unless actions is {}

          $scope.$apply ->
            $scope.model = $filter("date") $scope.time.getTime(), "hh:mm a"

            # Highlight hour on activating the time input
            setTimeout (->
              inputSelectAction start, end, highlighActions
            ), 0

        #
        # @name updateScopeTime
        # @description
        # Using model on scope, try to convert to javascript datetime object
        #
        updateScopeTime = ->
          if timeMatch = timeRegex.exec $scope.model
            hours   = +timeMatch[1]
            minutes = +timeMatch[2]
            markers = timeMatch[3] or "AM"

            if 0 < hours <= 12 and 0 <= minutes <= 60
              hours += 12 if markers is "PM" and hours isnt 12
              hours  = 0 if markers is "AM" and hours is 12
              $scope.time.setHours hours, minutes
            else
              updateInput()

        # jQuery events
        inputElement
          .on "click", (event) ->
            updateInput()
          .on "blur", (event) ->
            updateScopeTime()
          .on "keydown", (event) ->
            key = event.which

            switch key
              when keys.UP, keys.DOWN
                event.preventDefault()
                change  = if key is keys.UP then 1 else -1
                updateInput
                  hours:   -> $scope.time.setHours $scope.time.getHours() + change
                  minutes: -> $scope.time.setMinutes $scope.time.getMinutes() + change
                  markers: -> $scope.time.setHours $scope.time.getHours() + change * 12

              when keys.LEFT, keys.RIGHT
                event.preventDefault()
                change = if key is keys.LEFT then -3 else 3
                start  = inputDOM.selectionStart
                end    = inputDOM.selectionEnd

                # Determine the next input to highlight
                inputSelectAction start, end,
                  hours:   -> change = 0 if key is keys.LEFT
                  markers: -> change = 0 if key is keys.RIGHT
                  all:     ->
                    start += change
                    end   += change
                # Using the new start and end index, select the correct value
                inputDOM.setSelectionRange start, end
                updateInput()
                #inputSelectAction start, end, highlighActions

          .on "keyup", (event) ->
            key = event.which
            if keys.NUMPAD0 <= key <= keys.NUMPAD9 or keys.ZERO <= key <= keys.NINE
              updateScopeTime()

        $scope.reset()
]
