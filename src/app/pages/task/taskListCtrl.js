(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.task')
        .controller('TaskListCtrl', TaskListCtrl);

    /** @ngInject */
    function TaskListCtrl($scope,$http,$uibModal,$timeout,$log,Constants,$state) {
        $scope.isLoading = true;

        var loadTask = function() {
            $http.get('/api/task').then(function(response) {
                $scope.isLoading = false;
                response.data.data.list.forEach(function(element){
                    element.statusCn = Constants.translate(Constants.evaluationStatus,element.status);
                });
                $scope.rowCollection = response.data.data.list;
            },function(response){
                $scope.isLoading = false;
            });
        }

        loadTask();

        //to deal
        $scope.toDeal = function(row){
            $state.go('main.taskDeal',{row:row});
        }
        
        //to view
        $scope.viewTask = function(row){
            $state.go('main.taskDeal',{row:row});
        }

    }; 
})();