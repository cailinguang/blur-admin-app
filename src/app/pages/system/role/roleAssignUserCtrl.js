/**
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.system.role')
      .controller('roleAssignUserCtrl', roleAssignUserCtrl);

  /** @ngInject */
  function roleAssignUserCtrl($scope,$http,role) {

    $scope.notAssignData = [];
    $scope.assignData = [];

    //未分配用户
    $http.get('/api/permission/roleAssignUsers',{params:{roleId:role.id}}).then(function(response) {
        $scope.notAssignLoding = false;
        $scope.notAssignData = response.data.data;
    },function(response){
        $scope.notAssignLoding = false;
    });


    //已分配
    $http.get('/api/permission/roleUsers',{params:{roleId:role.id}}).then(function(response) {
        $scope.assignLoding = false;
        $scope.assignData = response.data.data;
    },function(response){
        $scope.assignLoding = false;
    });

    //未分配选中
    $scope.notAssignDataSelects = [];
    $scope.setNotAssignDataSelect = function(id){
        let index = $scope.notAssignDataSelects.indexOf(id);
        if(index>-1){
            $scope.notAssignDataSelects.splice(index,1);
        }else{
            $scope.notAssignDataSelects.push(id);
        }
    }

    //已分配选中
    $scope.assignDataSelects = [];
    $scope.setAssignDataSelect = function(id){
        let index = $scope.assignDataSelects.indexOf(id);
        if(index>-1){
            $scope.assignDataSelects.splice(index,1);
        }else{
            $scope.assignDataSelects.push(id);
        }
    }

    //未分配按钮
    $scope.notAssignDataAssignClick = function(isAll){
        
    }
  }
})();