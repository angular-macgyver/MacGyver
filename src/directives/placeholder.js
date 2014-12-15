/**
 * @chalk overview
 * @name Placeholder
 *
 * @description
 * Dynamically fill out the placeholder text of input
 *
 * @param {String} mac-placehodler Variable that contains the placeholder text
 */

 angular.module('Mac').directive('macPlaceholder', function() {
   return {
     restrict: 'A',
     link: function($scope, element, attrs) {
       $scope.$watch(attrs.macPlaceholder, function(value) {
         attrs.$set('placeholder', value);
       });
     }
   };
 });
