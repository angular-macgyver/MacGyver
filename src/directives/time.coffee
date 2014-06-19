###
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

###

angular.module("Mac").directive "macTime", [
  "$filter"
  "$timeout"
  "keys"
  "util"
  (
    $filter
    $timeout
    keys
    util
  ) ->
    defaults =
      default: "12:00 AM"

    restrict:    "E"
    require:     "ngModel"
    replace:     true
    templateUrl: "template/time.html"
    link:        ($scope, element, attrs, ngModelCtrl) ->
      opts = util.extendAttributes "macTime", defaults, attrs
      time = null

      # Set default placeholder
      unless attrs.placeholder
        attrs.$set "placeholder", "--:--"

      # Validation
      timeValidator = (value) ->
        if !value or util.timeRegex.exec(value)
          ngModelCtrl.$setValidity "time", true

          return value
        else
          ngModelCtrl.$setValidity "time", false

          return undefined

      ngModelCtrl.$formatters.push timeValidator
      ngModelCtrl.$parsers.push timeValidator

      do initializeTime = ->
        currentDate = new Date().toDateString()
        time        = new Date currentDate + " " + opts.default

        if isNaN time.getTime()
          time = new Date currentDate + " " + defaults.default

      getSelection = ->
        start = element[0].selectionStart

        switch
          when 0 <= start < 3 then "hour"
          when 3 <= start < 6 then "minute"
          when 6 <= start < 9 then "meridian"

      selectRange = (start, end) ->
        $timeout ->
          element[0].setSelectionRange start, end
        , 0, false

      selectHours    = -> selectRange 0, 2
      selectMinutes  = -> selectRange 3, 5
      selectMeridian = -> selectRange 6, 8

      selectNextSection = ->
        switch getSelection()
          when "hour"               then selectMinutes()
          when "minute", "meridian" then selectMeridian()

      selectPreviousSection = ->
        switch getSelection()
          when "hour", "minute" then selectHours()
          when "meridian"       then selectMinutes()

      setMeridian = (meridian) ->
        hours = time.getHours()

        hours -= 12 if hours >= 12 and meridian is "AM"
        hours += 12 if hours < 12 and meridian is "PM"

        time.setHours hours

      toggleMeridian = ->
        hours = time.getHours()
        time.setHours (hours + 12) % 24

      incrementHour = (change) ->
        time.setHours time.getHours() + change

      incrementMinute = (change) ->
        time.setMinutes time.getMinutes() + change

      updateInput = ->
        displayTime = $filter("date") time.getTime(), "hh:mm a"

        unless displayTime is ngModelCtrl.$viewValue
          ngModelCtrl.$setViewValue displayTime
          ngModelCtrl.$render()

      updateTime = ->
        if timeMatch = util.timeRegex.exec ngModelCtrl.$modelValue
          hours    = +timeMatch[1]
          minutes  = +timeMatch[2]
          meridian = timeMatch[3]

          hours += 12 if meridian is "PM" and hours isnt 12
          hours  = 0 if meridian is "AM" and hours is 12

          time.setHours hours, minutes

      element.on 'blur', (event) ->
        $scope.$apply ->
          updateInput()

      #
      # @name Click event
      # @description
      # Note: The initial click into the input will not update the time because the
      # model is empty. The selection by default should be hour. This works
      # due to the cursor defaulting to 0,0.
      #
      element.on 'click', (event) ->
        $scope.$apply ->
          updateTime()
          updateInput()

          switch getSelection()
            when "hour" then selectHours()
            when "minute" then selectMinutes()
            when "meridian" then selectMeridian()

      element.on 'keydown', (event) ->
        key = event.which

        return true unless key in [
          keys.UP
          keys.DOWN
          keys.LEFT
          keys.RIGHT
          keys.A
          keys.P
        ]

        event.preventDefault()

        $scope.$apply ->
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

      element.on 'keyup', (event) ->
        key = event.which

        unless keys.NUMPAD0 <= key <= keys.NUMPAD9 or keys.ZERO <= key <= keys.NINE
          event.preventDefault()

        $scope.$apply ->
          updateTime()
]
