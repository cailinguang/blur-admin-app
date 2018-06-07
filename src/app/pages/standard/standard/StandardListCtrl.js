(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.standard')
        .controller('StandardListCtrl', StandardListCtrl);

    /** @ngInject */
    function StandardListCtrl($scope,$http,$uibModal,$timeout,$log,$state) {
        $scope.isLoading = true;

        var loadStandard = function() {
            $http.get('/api/standard/libary').then(function(response) {
                $scope.isLoading = false;
                
                $scope.rowCollection = response.data.data.list;
            },function(response){
                $scope.isLoading = false;
            });
        }

        loadStandard();

        $scope.manageStandard = function(row){
            $state.go("main.standard.standardManage",{row:row});
        }
        
        
    }; 
    
    
})();