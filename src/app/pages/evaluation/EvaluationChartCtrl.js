(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.evaluation')
        .controller('EvaluationChartCtrl', EvaluationChartCtrl);

    /** @ngInject */
    function EvaluationChartCtrl($scope,$http,$uibModal,$stateParams,$state,$q,Constants,localStorage) {
        if($stateParams.row){
            $scope.evaluation = $stateParams.row;
        }else{
            $state.go('main.evaluation');
        }

        $scope.options = { legend: { display: true } };
        $scope.labels = [];
        $scope.datas = [];
        $scope.series = [$scope.evaluation.name];

        $scope.nodes = [{name:'a'},{name:'b'}];
        $http.get('/api/evaluation/standardNodesWithScope',{params:{evaluationId:$scope.evaluation.id}}).then(function(response){
            var labels = [];
            var data = [];
            if(response.data.code==200){
                response.data.data.forEach(function(e){
                    labels.push(e.name);
                    data.push(e.scope.toFixed(2));
                });
                $scope.labels = labels;
                $scope.datas.push(data);

                $scope.nodes = response.data.data;
            }
        });
    };
})();