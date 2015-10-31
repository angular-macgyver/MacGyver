/**
 * Documentation script
 */
angular.module("MacDemo", ['Mac', 'ngAnimate']).directive("code", function() {
  return {
    restrict: "E",
    terminal: true
  };
})
.controller("modalController", ["$scope", "modal", function($scope, modal) {}])
.controller("ExampleController", [
  "$scope", "$window", "keys", function($scope, $window, keys) {
    var code, key;
    $scope.keys = [];
    for (key in keys) {
      code = keys[key];
      $scope.keys.push({
        key: key,
        code: code
      });
    }

    $scope.selectedOptions = [
      {
        value: 1,
        text: "text1"
      }, {
        value: 2,
        text: "text2"
      }, {
        value: 3,
        text: "text3"
      }
    ];
    $scope.selectedOptionValue = "1";

    // Menu section
    $scope.menuItems = [
      {
        label: "Page 1",
        key: "Page 1"
      }, {
        label: "Page 2",
        key: "Page 2"
      }, {
        label: "Page 3",
        key: "Page 3"
      }, {
        label: "Page 4",
        key: "Page 4"
      }
    ];
    $scope.selectingMenuItem = function(index) {
      $scope.selectedItem = $scope.menuItems[index].label;
    };

    // Autocomplete section
    // Used in autocomplete to transform data
    $scope.onSuccess = function(data) {
      return data.data;
    };

    $scope.autocompleteQuery = "";

    // Url to remotely fetch content
    $scope.autocompleteUrl = "data.json";

    // Selected tags in tag autocomplete
    $scope.tagAutocompleteSelected = [];
    $scope.tagAutocompleteDisabledSelected = [];
    $scope.tagAutocompleteEvents = [];
    $scope.tagAutocompletePlaceholder = "Hello";
    $scope.tagAutocompleteModel = "";
    $scope.tagAutocompleteOnSelected = function(item) {
      return {
        key: item
      };
    };

    $scope.tagAutocompleteOnBlur = function(event, item) {
      if (!item) {
        return;
      }
      $scope.tagAutocompleteEvents.push({
        key: item
      });
      $scope.tagAutocompleteModel = "";
      return $scope.tagAutocompleteModel;
    };

    $scope.tagAutocompleteOnKeyup = function(event, item) {
      console.debug("You just typed something");
    };

    $scope.extraTagInputs = [
      {
        name: "United States",
        id: "123"
      }, {
        name: "United Kingdom",
        id: "234"
      }, {
        name: "United Arab Emirates",
        id: "345"
      }
    ];
    $scope.selected = [
      {
        name: "United States",
        id: "123"
      }
    ];

    $scope.startDate = "01/01/2013";
    $scope.minDate = "07/01/2012";
    $scope.startTime = "04:42 PM";
    $scope.fiveMinAgo = Math.round(Date.now() / 1000) - 5 * 60;
    $scope.oneDayAgo = Math.round(Date.now() / 1000) - 24 * 60 * 60;
    $scope.threeDaysAgo = Math.round(Date.now() / 1000) - 72 * 60 * 60;

    $scope.afterPausing = function($event) {
      $scope.pauseTypingModel = angular.element($event.target).val();
    };

    $scope.windowResizing = function($event) {
      $scope.windowWidth = angular.element($event.target).width();
    };
  }
]);

window.prettyPrint && prettyPrint();
