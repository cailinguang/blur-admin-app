(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.task')
        .controller('TaskListCtrl', TaskListCtrl);

    /** @ngInject */
    function TaskListCtrl($scope,$http,$uibModal,$timeout,$log) {
        $scope.isLoading = true;

        var loadTask = function() {
            $http.get('/api/task').then(function(response) {
                $scope.isLoading = false;
                
                $scope.rowCollection = response.data.data.list;
            },function(response){
                $scope.isLoading = false;
            });
        }

        loadTask();

        //新增
        $scope.openTask = function(row){
            var uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/system/task/taskSaveModal.html',
                size: 'md',
                controller: TaskModalInstanceCtrl,
                scope: $scope,
                resolve: {
                  task: function () {
                    if(row){
                        return angular.copy(row);
                    }
                    return {};
                  }
                }
            });

            uibModalInstance.result.then(function (task) {
                loadTask();
            }, function () {
                //close modal
            });
        }
        
        //delete
        $scope.deleteTask = function(row){
            if(!confirm('确认删除？')) return false;

            $http.delete('/api/task/'+row.id).then(function(response){
                if(response.code=200){
                    loadTask();
                }
            });
        }

        //分配用户
        $scope.assignUser = function(row) {
            var uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/system/task/taskAssignUser.html',
                size: 'lg',
                controller: 'taskAssignUserCtrl',
                scope: $scope,
                resolve: {
                  task: function () {
                    return angular.copy(row);
                  }
                }
            });
        }

        //分配菜单
        $scope.assignModule = function(row) {
            var uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/system/task/taskAssignModule.html',
                size: 'lg',
                controller: 'taskAssignModuleCtrl',
                scope: $scope,
                resolve: {
                  task: function () {
                    return angular.copy(row);
                  }
                }
            });
        }
        
    }; 
    
    //弹框页面控制
    /** @ngInject */
    var TaskModalInstanceCtrl = function ($scope,$http,$uibModal, $uibModalInstance, task) {
        $scope.task = task;
        $scope.userSubmit = function () {
            if ($scope.form.$valid) {
                $http({
                    url:$scope.task.id?'/api/task/'+$scope.task.id:'/api/task',
                    data:$scope.task,
                    method:$scope.task.id?'PUT':'POST'
                }).then(function(response){
                    if(response.data.code==200){
                        $uibModalInstance.close();
                    }
                });
            }
        };
    };
})();