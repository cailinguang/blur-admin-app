(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.system.role')
        .controller('RoleListCtrl', RoleListCtrl);

    /** @ngInject */
    function RoleListCtrl($scope,$http,$uibModal,$timeout,$log) {
        $scope.isLoading = true;

        var loadRole = () => {
            $http.get('/api/role').then(function(response) {
                $scope.isLoading = false;
                
                $scope.rowCollection = response.data.data.list;
            },function(response){
                $scope.isLoading = false;
            });
        }

        loadRole();

        //新增
        $scope.openRole = (row) => {
            var uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/system/role/roleSaveModal.html',
                size: 'md',
                controller: RoleModalInstanceCtrl,
                scope: $scope,
                resolve: {
                  role: function () {
                    if(row){
                        return angular.copy(row);
                    }
                    return {};
                  }
                }
            });

            uibModalInstance.result.then(function (role) {
                loadRole();
            }, function () {
                //close modal
            });
        }
        
        //delete
        $scope.deleteRole = function(row){
            if(!confirm('确认删除？')) return false;

            $http.delete('/api/role/'+row.id).then(function(response){
                if(response.code=200){
                    loadRole();
                }
            });
        }

        //分配用户
        $scope.assignUser = function(row) {
            var uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/system/role/roleAssignUser.html',
                size: 'lg',
                controller: 'roleAssignUserCtrl',
                scope: $scope,
                resolve: {
                  role: function () {
                    return angular.copy(row);
                  }
                }
            });
        }

        //分配菜单
        $scope.assignModule = function(row) {
            var uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/system/role/roleAssignModule.html',
                size: 'lg',
                controller: 'roleAssignModuleCtrl',
                scope: $scope,
                resolve: {
                  role: function () {
                    return angular.copy(row);
                  }
                }
            });
        }
        
    }; 
    
    //弹框页面控制
    /** @ngInject */
    var RoleModalInstanceCtrl = function ($scope,$http,$uibModal, $uibModalInstance, role) {
        $scope.role = role;
        $scope.userSubmit = function () {
            if ($scope.form.$valid) {
                $http({
                    url:$scope.role.id?'/api/role/'+$scope.role.id:'/api/role',
                    data:$scope.role,
                    method:$scope.role.id?'PUT':'POST'
                }).then(function(response){
                    if(response.data.code==200){
                        $uibModalInstance.close();
                    }
                });
            }
        };
    };
})();