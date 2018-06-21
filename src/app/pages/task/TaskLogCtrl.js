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

        $scope.logs = [];
        $http.get('/api/task/logs',{params:{evaluationId:$scope.evaluation.id}}).then(function(response){
            if(response.data.code==200){
                //show time
                var logs = response.data.data;
                var tempTime = null;
                for(var i=0;i<logs.length;i++){
                    logs[i].showTime = false;
                    if(i==0){
                        tempTime = logs[i].time.substring(0,10);
                        logs[i].showTime = true;
                    }else{
                        if(tempTime!=logs[i].time.substring(0,10)){
                            logs[i].showTime = true;
                            tempTime = logs[i].time.substring(0,10);
                        }
                    }
                }
                $scope.logs = logs;
            }
        });

    }; 
})();