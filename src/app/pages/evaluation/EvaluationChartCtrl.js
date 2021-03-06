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

        $scope.options = { legend: { display: true },scale:{display:true,ticks:{display:true/*,fixedStepSize:1,max:5*/}}};
        $scope.labels = [];
        $scope.datas = [];
        $scope.series = [$scope.evaluation.name];

        $scope.nodes = [];
        $http.get('/api/evaluation/standardNodesWithScope',{params:{evaluationId:$scope.evaluation.id}}).then(function(response){
            var labels = [];
            var data = [];
            var allScope = 0;
            var allScopeIndex = 0;
            if(response.data.code==200){
                response.data.data.forEach(function(e){
                    labels.push(e.name);
                    data.push(e.scope.toFixed(2));
                    //allScope = allScope+e.scope;
                    e.children.forEach(function(c){
                        allScope+=c.scope;
                        allScopeIndex++;
                    });
                });
                $scope.labels = labels;
                $scope.datas.push(data);

                $scope.nodes = response.data.data;
                $scope.allScope = allScope/allScopeIndex;
            }
        });
    };
})();