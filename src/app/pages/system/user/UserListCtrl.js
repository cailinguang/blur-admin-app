(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.system.user')
        .controller('UserListCtrl', UserListCtrl);

    /** @ngInject */
    function UserListCtrl($scope,$http) {
        $scope.isLoading = true;
        var vm = this;
        
        //配置树
        $scope.deptData =  [];
        $scope.deptTreeConfig = {
            core : {
                multiple : false,
                animation: true,
                check_callback : true,
                worker : true
            },
            version : 1
        };
        //加载树
        function loadDeptTree(){
            $http.get('/api/dept').then(function(response){
                var list = response.data.data.list;
                angular.forEach(list,function(o){
                    o.text=o.name;
                    if(o.parent=='#'){
                        o.state = {opened:true};
                        //first select root
                        $scope.rootDept = $scope.rootDept || o;
                    }
                });
                $scope.deptData = list;
                $scope.deptTreeConfig.version++;

                
            });
        };
        loadDeptTree();

        //tree event
        $scope.deptTreeEvents = {
            'ready': function(){
                //selected node
                if($scope.rootDept){
                    $scope.deptTree.jstree(true).open_node($scope.rootDept.id);
                    $scope.deptTree.jstree(true).select_node($scope.rootDept.id,false,false);
                }
             },
            //'create_node': ,
            'select_node': onSelectDept   // on node selected callback
        };
        //选择树节点,显示子部门列表
        $scope.isSelectNode = false;
        function onSelectDept(e, data){
            $scope.isSelectNode = true;
            $scope.rootDept = data.node;
            //list view
            $scope.isLoading = true;
            $scope.loadUsers();
        }

        $scope.loadUsers = () => {
            $http.get('/api/user',{params:{deptId:$scope.rootDept.id}}).then(function(response) {
                $scope.isLoading = false;
                $scope.rowCollection = response.data.data.list;
            },function(response){
                $scope.isLoading = false;
            });
        }

        
        
        
        
    }; 
    
})();