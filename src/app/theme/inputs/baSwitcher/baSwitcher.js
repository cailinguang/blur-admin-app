/**
 * @author v.lugovsky
 * created on 10.12.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.inputs')
      .directive('baSwitcher', baSwitcher);

  /** @ngInject */
  function baSwitcher() {
    return {
      templateUrl: 'app/theme/inputs/baSwitcher/baSwitcher.html',
      scope: {
        switcherStyle: '@',
        switcherLabel: '@',
        switcherDisabled: '@',
        switcherValue: '='
      },
      controller:['$scope',function($scope){
        
        if($scope.switcherValue=='1'){
          $scope.checkboxValue=true;
        }else{
          $scope.checkboxValue=false;
        }

        $scope.$watch('checkboxValue',function(checked){
          if(checked){
            $scope.switcherValue='1';
          }else{
            $scope.switcherValue='0';
          }
        });

        
      }]
    };
  }

})();
