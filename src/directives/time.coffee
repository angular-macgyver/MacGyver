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

        inputDOM = element[0].getElementsByTagName("input")[0]

        do initializeTime = ->
          currentDate = new Date().toDateString()
          time        = new Date currentDate + " " + opts.default

          if isNaN time.getTime()
            time = new Date currentDate + " " + defaults.default

          #
          # @name $scope.time
          # @description
          # Javscript date variable for easier datetime manipulation
          #
          $scope.time = time

        getSelection = ->
          start = inputDOM.selectionStart

          switch
            when 0 <= start < 3 then "hour"
            when 3 <= start < 6 then "minute"
            when 6 <= start < 9 then "meridian"

        selectRange = (start, end) ->
          $timeout ->
            inputDOM.setSelectionRange start, end
          , 0, false

        selectHours    = -> selectRange 0, 2
        selectMinutes  = -> selectRange 3, 5
        selectMeridian = -> selectRange 6, 8

        selectNextSection = ->
          switch getSelection()
            when "hour" then selectMinutes()
            when "minute", "meridian" then selectMeridian()

        selectPreviousSection = ->
          switch getSelection()
            when "hour", "minute" then selectHours()
            when "meridian" then selectMinutes()

        setMeridian = (meridian) ->
          hours = $scope.time.getHours()

          hours -= 12 if hours >= 12 and meridian is "AM"
          hours += 12 if hours < 12 and meridian is "PM"

          $scope.time.setHours hours

        toggleMeridian = ->
          hours = $scope.time.getHours()

          $scope.time.setHours (hours + 12) % 24

        incrementHour = (change) ->
          $scope.time.setHours $scope.time.getHours() + change

        incrementMinute = (change) ->
          $scope.time.setMinutes $scope.time.getMinutes() + change

        updateInput = ->
          $scope.model = $filter("date") $scope.time.getTime(), "hh:mm a"

        updateTime = ->
          if timeMatch = util.timeRegex.exec $scope.model
            hours    = +timeMatch[1]
            minutes  = +timeMatch[2]
            meridian = timeMatch[3]

            hours += 12 if meridian is "PM" and hours isnt 12
            hours  = 0 if meridian is "AM" and hours is 12

            $scope.time.setHours hours, minutes

        $scope.blurEvent = (event) ->
          updateInput()

        #
        # @name $scope.clickEvent
        # @description
        # Note: The initial click into the input will not update the time because the
        # model is empty. The selection by default should be hour. This works
        # due to the cursor defaulting to 0,0.
        #
        $scope.clickEvent = (event) ->
          updateTime()
          updateInput()

          switch getSelection()
            when "hour" then selectHours()
            when "minute" then selectMinutes()
            when "meridian" then selectMeridian()

        $scope.keydownEvent = (event) ->
          key = event.which

          event.preventDefault() if key in [
            keys.UP
            keys.DOWN
            keys.LEFT
            keys.RIGHT
            keys.A
            keys.P
          ]

          switch key
            when keys.UP, keys.DOWN
              change = if key is keys.UP then 1 else -1

              switch getSelection()
                when "hour"
                  incrementHour(change)
                  selectHours()
                when "minute"
                  incrementMinute(change)
                  selectMinutes()
                when "meridian"
                  toggleMeridian()
                  selectMeridian()

              updateInput()
              
            when keys.LEFT, keys.RIGHT
              switch key
                when keys.LEFT then selectPreviousSection()
                when keys.RIGHT then selectNextSection()

              updateInput()

            when keys.A, keys.P
              meridianSelected = getSelection() is "meridian"

              switch
                when meridianSelected and key is keys.A
                  setMeridian("AM")
                when meridianSelected and key is keys.P
                  setMeridian("PM")

              selectMeridian()
              updateInput()

        $scope.keyupEvent = (event) ->
          key = event.which

          unless keys.NUMPAD0 <= key <= keys.NUMPAD9 or keys.ZERO <= key <= keys.NINE
            event.preventDefault()

          updateTime()
]

###
@name Time Input
@description
An internal directive for mac-time input element to add validator
###
angular.module("Mac").directive "macTimeInput", [
  "util"
  (util) ->
    restrict: "A"
    require:  "?ngModel"
    link:     ($scope, element, attrs, ctrl) ->
      timeValidator = (value) ->
        if !value or util.timeRegex.exec(value)
          ctrl.$setValidity "time", true

          return value
        else
          ctrl.$setValidity "time", false

          return undefined

      ctrl.$formatters.push timeValidator
      ctrl.$parsers.push timeValidator
]