(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.standard')
        .controller('ApplicabilityListCtrl', ApplicabilityListCtrl);

    /** @ngInject */
    function ApplicabilityListCtrl($scope,$http,$uibModal,toastr,$log,$state) {
        $scope.isLoading = true;

        var loadStandard = function() {
            $http.get('/api/applicability/libary').then(function(response) {
                $scope.isLoading = false;
                
                $scope.rowCollection = response.data.data.list;
            },function(response){
                $scope.isLoading = false;
            });
        }

        loadStandard();

        $scope.openApplicability = function(row){
            $state.go("main.applicabilityManage",{row:row});
        }
        
        $scope.deleteApplicability = function(row){
            if(!confirm('是否删除?')) return false;
            
            $http.delete('/api/applicability/libary/'+row.id).then(function(response){
                if(response.data.code==200){
                    toastr.success('删除成功');
                    loadStandard();
                }
            });
        }
    }; 
    
    
})();