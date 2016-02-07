/**
 * @ngdoc directive
 * @name macPlaceholder
 * @description
 * Dynamically fill out the placeholder text of input
 *
 * @param {String} mac-placeholder Variable that contains the placeholder text
 *
 * @example
<example>
  <input type="text" mac-placeholder="tagAutocompletePlaceholder" />
</example>
<input type="text" mac-placeholder="tagAutocompletePlaceholder" />
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
