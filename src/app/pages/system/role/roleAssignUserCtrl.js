/**
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.system.role')
      .controller('roleAssignUserCtrl', roleAssignUserCtrl);

  /** @ngInject */
  function roleAssignUserCtrl($scope,$http) {

    $scope.isLoading = true;
    $scope.notAssignData = [];
    $scope.assignData = [];

    $http.get('/api/user').then(function(response) {
        $scope.isLoading = false;

        $scope.notAssignData = response.data.data.list;
        $scope.assignData = response.data.data.list;
    },function(response){
        $scope.isLoading = false;
    });
  }
})();