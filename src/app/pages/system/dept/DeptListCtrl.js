(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.system.dept')
        .controller('DeptListCtrl', DeptListCtrl);

    /** @ngInject */
    function DeptListCtrl($scope,$http) {  
        $scope.deptData =  [];
        $scope.deptTreeConfig = {
            core : {
                multiple : false,
                animation: true,
                error : function(error) {
                    $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                },
                check_callback : true,
                worker : true
            },
            version : 1
        };

        $http.get('/dept').then(function(response){
            var list = response.data.data.list;
            angular.forEach(list,function(o){
                o.text=o.name;
            });
            //angular.copy(list,$scope.deptData);
            $scope.deptData = list;
            $scope.deptTreeConfig.version++;
        });
        
        
        
    }; 
    
})();