/**
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.system.role')
      .controller('roleAssignUserCtrl', roleAssignUserCtrl);

  /** @ngInject */
  function roleAssignUserCtrl($scope,$http,role,$uibModalInstance,toastr) {

    $scope.notAssignData = [];
    $scope.assignData = [];

    var notAssignDataOld;
    var assignDataOld;

    //未分配用户
    $http.get('/api/permission/roleAssignUsers',{params:{roleId:role.id}}).then(function(response) {
        $scope.notAssignLoding = false;
        $scope.notAssignData = response.data.data;
        notAssignDataOld = angular.copy(response.data.data);
    },function(response){
        $scope.notAssignLoding = false;
    });


    //已分配
    $http.get('/api/permission/roleUsers',{params:{roleId:role.id}}).then(function(response) {
        $scope.assignLoding = false;
        $scope.assignData = response.data.data;
        assignDataOld = angular.copy(response.data.data);
    },function(response){
        $scope.assignLoding = false;
    });

    //未分配选中
    $scope.notAssignDataSelects = [];
    $scope.setNotAssignDataSelect = function(id){
        var index = $scope.notAssignDataSelects.indexOf(id);
        if(index>-1){
            $scope.notAssignDataSelects.splice(index,1);
        }else{
            $scope.notAssignDataSelects.push(id);
        }
    }

    //已分配选中
    $scope.assignDataSelects = [];
    $scope.setAssignDataSelect = function(id){
        var index = $scope.assignDataSelects.indexOf(id);
        if(index>-1){
            $scope.assignDataSelects.splice(index,1);
        }else{
            $scope.assignDataSelects.push(id);
        }
    }

    //未分配按钮
    $scope.notAssignDataAssignClick = function(isAll){
        if(isAll){
            $scope.assignData = $scope.assignData.concat($scope.notAssignData);
            $scope.notAssignData = [];
            $scope.notAssignDataSelects = [];
        }else{
            for(var i=$scope.notAssignData.length-1;i>=0;i--){
                var element = $scope.notAssignData[i];
                var index = $scope.notAssignDataSelects.indexOf(element.id);
                if(index>-1){
                    $scope.notAssignDataSelects.splice(index,1);
                    $scope.notAssignData.splice(i,1);
                    $scope.assignData.push(element);
                }
            }
        }
    }
    //已分配按钮
    $scope.assignDataAssignClick = function(isAll){
        if(isAll){
            $scope.notAssignData = $scope.notAssignData.concat($scope.assignData);
            $scope.assignData = [];
            $scope.assignDataSelects = [];
        }else{
            for(var i=$scope.assignData.length-1;i>=0;i--){
                var element = $scope.assignData[i];
                var index = $scope.assignDataSelects.indexOf(element.id);
                if(index>-1){
                    $scope.assignDataSelects.splice(index,1);
                    $scope.assignData.splice(i,1);
                    $scope.notAssignData.push(element);
                }
            }
        }
    }


    //save
    $scope.save = function(){
        $scope.isSubmit = true;
        var assignUsers = [];
        var removeUsers = [];
    

        $scope.assignData.forEach(function(element){
            var isAdd = true;
            for(var index in assignDataOld){
                if(assignDataOld[index].id==element.id){
                    isAdd=false;
                    break;
                }
            }
            isAdd && assignUsers.push(element.id);
        });

        assignDataOld.forEach(function(element){
            var isAdd = true;
            for(var index in $scope.assignData){
                if($scope.assignData[index].id==element.id){
                    isAdd=false;
                    break;
                }
            }
            isAdd && removeUsers.push(element.id);
        });

        console.info('assignUsers',assignUsers);
        console.info('removeUsers',removeUsers);
        $http.post('/api/permission/roleAssignUsers',{roleId:role.id,assignUsers:assignUsers.join(','),removeUsers:removeUsers.join(',')}).then(function(response){
            $scope.isSubmit = false;
            toastr.success('角色分配用户成功');
            $uibModalInstance.close();
        },function(response){
            $scope.isSubmit = false;
        });
    }
  }
})();