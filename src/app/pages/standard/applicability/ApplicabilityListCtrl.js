(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.standard')
        .controller('ApplicabilityListCtrl', ApplicabilityListCtrl);

    /** @ngInject */
    function ApplicabilityListCtrl($scope,$http,$uibModal,$timeout,$log,$state) {
        $scope.isLoading = true;

        var loadStandard = function() {
            $http.get('/api/isms/standard',{params:{isEvaluation:'0'}}).then(function(response) {
                $scope.isLoading = false;
                
                $scope.rowCollection = response.data.data.list;
            },function(response){
                $scope.isLoading = false;
            });
        }

        loadStandard();

        $scope.manageStandard = function(row){
            $state.go("main.standard.demo",{row:row});
        }
        
        
    }; 
    
    
})();