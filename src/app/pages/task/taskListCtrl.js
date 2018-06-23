(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.task')
        .controller('TaskListCtrl', TaskListCtrl);

    /** @ngInject */
    function TaskListCtrl($scope,$http,$uibModal,$timeout,$log,Constants,$state,localStorage) {
        $scope.isLoading = true;
        //role
        $scope.roles = localStorage.getObject('dataRoles');

        var loadTask = function() {
            $http.get('/api/task').then(function(response) {
                $scope.isLoading = false;
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
            $state.go('main.taskView',{row:row});
        }

        $scope.toLog = function(row){
            $state.go("main.taskLog",{row:row});
        }
    }; 
})();