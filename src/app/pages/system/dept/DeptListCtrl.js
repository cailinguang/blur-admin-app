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
        $scope.deptTreeEvents = {
            //'ready': ,
            //'create_node': ,
            'select_node': onDeptSelect   // on node selected callback
        };

        $http.get('/dept').then(function(response){
            var list = response.data.data.list;
            angular.forEach(list,function(o){
                o.text=o.name;
                if(o.parent=='#'){
                    o.state = {opened:true};
                }
            });
            $scope.deptData = list;
            $scope.deptTreeConfig.version++;
        });
        
        $scope.isSelectNode = false;
        function onDeptSelect(e, data){
            $scope.isSelectNode = true;
            //list view
            $scope.isLoading = true;
            $http.post('/dept/childrens',{parent:data.node.id}).then(function(response) {
                $scope.isLoading = false;
                $scope.rowCollection = response.data;
            },function(response){
                $scope.isLoading = false;
            });
            $scope.displayedCollection = [].concat($scope.rowCollection);
        }
        

        

    }; 
    
})();