(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.task')
        .controller('TaskLogCtrl', TaskLogCtrl);

    /** @ngInject */
    function TaskLogCtrl($scope,$http,$uibModal,$timeout,$log,Constants,$state,$stateParams,$q,ngTreetableParams,$templateCache,$compile,toastr,localStorage,blockUI) {
        if($stateParams.row){
            $scope.evaluation = $stateParams.row;
        }else{
            $state.go('main.task');
            return;
        }


    }; 
})();