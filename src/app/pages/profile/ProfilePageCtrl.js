/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.profile')
    .controller('ProfilePageCtrl', ProfilePageCtrl);

  /** @ngInject */
  function ProfilePageCtrl($scope, $uibModal,$http,localStorage,toastr,$state) {
    $scope.forms = {};

    $http.get('/api/user/currentUser').then(function(response){
      $scope.user=response.data.data;
    });

    $scope.editPassword = false;
    function watchPass(){ 
        $scope.editPassword = $scope.user.oldPassword  || $scope.user.password  || $scope.user.confirmPassword; 
    }
    $scope.$watch('user.oldPassword',watchPass);
    $scope.$watch('user.password',watchPass);
    $scope.$watch('user.confirmPassword',watchPass);

    $scope.updateProfile=function(){
      if($scope.editPassword){
        if($scope.user.oldPassword == undefined){
            alert('请输入原密码');
            return;
        }
        if($scope.user.password==undefined){
            alert('请输入新密码');
            return;
        }
        if($scope.user.password!=$scope.user.confirmPassword){
            alert('确认密码输入不一致');
            return;
        }

        $http.put('/api/user/updatePassword',{id:$scope.user.id,oldPassword:$scope.user.oldPassword,password:$scope.user.password}).then(function(response){
          if(response.data.code==200){
            toastr.success('密码修改成功!');
          }
        })
      }

      if($scope.forms.form.$valid){
        $http.put('/api/user/'+$scope.user.id,{nickName:$scope.user.nickName,phone:$scope.user.phone,email:$scope.user.email}).then(function(response){
          localStorage.setObject('nickName',$scope.user.nickName);
          $scope.$parent.$parent.nickName=$scope.user.nickName;
        });
      }


    }
  }

})();
