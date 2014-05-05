###
Documentation script
###
angular.module("Mac").
  directive("code", ->
    restrict: "E"
    terminal: true
  ).
  controller("modalController", [
    "$scope"
    "modal"
    ($scope, modal) ->
      $scope.$on "modalWasShown", (event, id) ->
        console.log modal.opened.options.data  if id is "test-modal"

  ]).
  controller "ExampleController", [
    "$scope"
    "$window"
    "keys"
    ($scope, $window, keys) ->
      $scope.keys = []
      for key, code of keys
        $scope.keys.push {key, code}

      $scope.selectedOptions = [
        {
          value: 1
          text: "text1"
        }
        {
          value: 2
          text: "text2"
        }
        {
          value: 3
          text: "text3"
        }
      ]
      $scope.selectedOptionValue = "1"

      # Menu section
      $scope.menuItems = [
        {
          label: "Page 1"
          key: "Page 1"
        }
        {
          label: "Page 2"
          key: "Page 2"
        }
        {
          label: "Page 3"
          key: "Page 3"
        }
        {
          label: "Page 4"
          key: "Page 4"
        }
      ]
      $scope.selectingMenuItem = (index) ->
        $scope.selectedItem = $scope.menuItems[index].label
        return

      # Autocomplete section
      # Used in autocomplete to transform data
      $scope.onSuccess = (data) ->
        data.data

      $scope.autocompleteQuery = ""

      # Url to remotely fetch content
      $scope.autocompleteUrl = "data.json"

      # Selected tags in tag autocomplete
      $scope.tagAutocompleteSelected         = []
      $scope.tagAutocompleteDisabledSelected = []
      $scope.tagAutocompleteEvents           = []
      $scope.tagAutocompletePlaceholder      = "Hello"
      $scope.tagAutocompleteModel            = ""
      $scope.tagAutocompleteOnSelected       = (item) ->
        key: item

      $scope.tagAutocompleteOnBlur = (event, item) ->
        return unless item
        $scope.tagAutocompleteEvents.push key: item
        $scope.tagAutocompleteModel = ""
        $scope.tagAutocompleteModel

      $scope.tagAutocompleteOnKeyup = (event, item) ->
        console.debug "You just typed something"

      $scope.extraTagInputs = [
        {
          name: "United States"
          id: "123"
        }
        {
          name: "United Kingdom"
          id: "234"
        }
        {
          name: "United Arab Emirates"
          id: "345"
        }
      ]
      $scope.selected = [
        name: "United States"
        id: "123"
      ]

      $scope.startDate    = "01/01/2013"
      $scope.minDate      = "07/01/2012"
      $scope.startTime    = "04:42 PM"
      $scope.fiveMinAgo   = Math.round(Date.now() / 1000) - 5 * 60
      $scope.oneDayAgo    = Math.round(Date.now() / 1000) - 24 * 60 * 60
      $scope.threeDaysAgo = Math.round(Date.now() / 1000) - 72 * 60 * 60
      $scope.afterPausing = ($event) ->
        $scope.pauseTypingModel = angular.element($event.target).val()
        return

      $scope.windowResizing = ($event) ->
        $scope.windowWidth = angular.element($event.target).width()
        return

      $scope.macGyverSeasonOne = [
        {
          "No.": "1"
          Title: "\"Pilot\""
          "Directed by": "Jerrold Freedman"
          "Written by": "Thackary Pallor"
          "Original air date": "September 29, 1985"
        }
        {
          "No.": "2"
          Title: "\"The Golden Triangle\""
          "Directed by": "Paul Stanley & Donald Petrie"
          "Written by": "Dennis R. Foley & Terry Nation"
          "Original air date": "October 6, 1985"
        }
        {
          "No.": "3"
          Title: "\"Thief of Budapest\""
          "Directed by": "Lee H. Katzin & John Patterson"
          "Written by": "Terry Nation & Stephen Downing & Joe Viola"
          "Original air date": "October 13, 1985"
        }
        {
          "No.": "4"
          Title: "\"The Gauntlet\""
          "Directed by": "Lee H. Katzin"
          "Written by": "Stephen Kandel"
          "Original air date": "October 20, 1985"
        }
        {
          "No.": "5"
          Title: "\"The Heist\""
          "Directed by": "Alan Smithee"
          "Written by": "Larry Alexander & James Schmerer"
          "Original air date": "November 3, 1985"
        }
        {
          "No.": "6"
          Title: "\"Trumbo's World\""
          "Directed by": "Donald Petrie & Lee H. Katzin"
          "Written by": "Stephen Kandel"
          "Original air date": "November 10, 1985"
        }
        {
          "No.": "7"
          Title: "\"Last Stand\""
          "Directed by": "John Florea"
          "Written by": "Judy Burns"
          "Original air date": "November 17, 1985"
        }
        {
          "No.": "8"
          Title: "\"Hellfire\""
          "Directed by": "Richard Colla"
          "Written by": "Story by: Douglas Brooks West"
          "Original air date": "November 24, 1985"
        }
        {
          "No.": "9"
          Title: "\"The Prodigal\""
          "Directed by": "Alexander Singer"
          "Written by": "Story by: David Abramowitz & Paul Savage"
          "Original air date": "December 8, 1985"
        }
        {
          "No.": "10"
          Title: "\"Target MacGyver\""
          "Directed by": "Lee H. Katzin & Ernest Pintoff"
          "Written by": "Story by: Mike Marvin"
          "Original air date": "December 22, 1985"
        }
        {
          "No.": "11"
          Title: "\"Nightmares\""
          "Directed by": "Cliff Bole"
          "Written by": "James Schmerer"
          "Original air date": "January 15, 1986"
        }
        {
          "No.": "12"
          Title: "\"Deathlock\""
          "Directed by": "Cliff Bole & Alexander Singer"
          "Written by": "Jerry Ludwig & Stephen Kandel"
          "Original air date": "January 22, 1986"
        }
        {
          "No.": "13"
          Title: "\"Flame's End\""
          "Directed by": "Bruce Seth Green"
          "Written by": "Story by: Hannah Louise Shearer"
          "Original air date": "January 29, 1986"
        }
        {
          "No.": "14"
          Title: "\"Countdown\""
          "Directed by": "Stan Jolley"
          "Written by": "Tony DiMarco & David Ketchum"
          "Original air date": "February 5, 1986"
        }
        {
          "No.": "15"
          Title: "\"The Enemy Within\""
          "Directed by": "Cliff Bole"
          "Written by": "David Abramowitz"
          "Original air date": "February 12, 1986"
        }
        {
          "No.": "16"
          Title: "\"Every Time She Smiles\""
          "Directed by": "Charlie Correll"
          "Written by": "James Schmerer"
          "Original air date": "February 19, 1986"
        }
        {
          "No.": "17"
          Title: "\"To Be a Man\""
          "Directed by": "Cliff Bole"
          "Written by": "Don Mankiewicz"
          "Original air date": "March 5, 1986"
        }
        {
          "No.": "18"
          Title: "\"Ugly Duckling\""
          "Directed by": "Charlie Correll"
          "Written by": "Larry Gross"
          "Original air date": "March 12, 1986"
        }
        {
          "No.": "19"
          Title: "\"Slow Death\""
          "Directed by": "Don Weis"
          "Written by": "Stephen Kandel"
          "Original air date": "April 2, 1986"
        }
        {
          "No.": "20"
          Title: "\"The Escape\""
          "Directed by": "Don Chaffey"
          "Written by": "Stephen Kandel"
          "Original air date": "April 16, 1986"
        }
        {
          "No.": "21"
          Title: "\"A Prisoner of Conscience\""
          "Directed by": "Cliff Bole"
          "Written by": "Stephen Kandel"
          "Original air date": "April 30, 1986"
        }
        {
          "No.": "22"
          Title: "\"The Assassin\""
          "Directed by": "Charlie Correll"
          "Written by": "James Schmerer"
          "Original air date": "May 7, 1986"
        }
      ]
      $scope.selectedModels = []
      $scope.unselectAll    = ->
        $scope.selectedModels = []
        return

      $scope.selectAll = ->
        $scope.selectedModels = $scope.macGyverSeasonOne.slice(0)
        return

      $scope.selectRandom = ->
        length = $scope.macGyverSeasonOne.length
        models = []
        for i in [1..(length / 2)]
          index = Math.floor Math.random() * length
          model = $scope.macGyverSeasonOne[index]
          models.push model unless model in models

        $scope.selectedModels = models
  ]

window.prettyPrint and prettyPrint()
