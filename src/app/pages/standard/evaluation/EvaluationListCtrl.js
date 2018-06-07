(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.standard')
        .controller('EvaluationListCtrl', EvaluationListCtrl);

    /** @ngInject */
    function EvaluationListCtrl($scope,$http,$uibModal,toastr,$state,Constants) {
        $scope.isLoading = true;

        $scope.evaluationType = Constants.evaluationType;

        var loadStandard = function() {
            $http.get('/api/evaluation').then(function(response) {
                $scope.isLoading = false;
                
                $scope.rowCollection = response.data.data.list;
            },function(response){
                $scope.isLoading = false;
            });
        }

        loadStandard();

        $scope.openEvaluation = function(row){
            $state.go("main.standard.evaluationManage",{row:row});
        }
        
        $scope.deleteEvaluation = function(row){
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