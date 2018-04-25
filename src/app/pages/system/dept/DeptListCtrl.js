(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.system.dept')
        .controller('DeptListCtrl', DeptListCtrl);

    /** @ngInject */
    function DeptListCtrl($scope,$http,$uibModal,$timeout) {
        var vm = this;
        //配置树
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
            'ready': function(){
                if($scope.rootDept){
                    vm.deptTree.jstree(true).open_node($scope.rootDept.id);
                    vm.deptTree.jstree(true).select_node($scope.rootDept.id,false,false);
                }
             },
            //'create_node': ,
            'select_node': onSelectDept   // on node selected callback
        };

        //加载树
        function loadDeptTree(){
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
        };
        loadDeptTree();
        
        //选择树节点,显示子部门列表
        $scope.isSelectNode = false;
        function onSelectDept(e, data){
            $scope.isSelectNode = true;
            $scope.rootDept = data.node;
            //list view
            $scope.isLoading = true;
            $http.post('/dept/custom/childrens',angular.toJson(data.node.id)).then(function(response) {
                $scope.isLoading = false;
                $scope.rowCollection = response.data.data;
            },function(response){
                $scope.isLoading = false;
            });
        }
        
        //新增弹出
        $scope.openSave = function(){
            var uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/system/dept/deptSaveModal.html',
                size: 'md',
                controller: DeptModalInstanceCtrl,
                scope: $scope,
                resolve: {
                  rootDept: function () {
                    return $scope.rootDept;
                  }
                }
            });

            uibModalInstance.result.then(function (dept) {
                loadDeptTree();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }


    }; 
    
    //部门弹框页面控制
    /** @ngInject */
    var DeptModalInstanceCtrl = function ($scope,$http, $uibModalInstance, rootDept) {
        $scope.dept = {parent:rootDept.id||'#'};
        $scope.deptSubmit = function () {
            if ($scope.deptForm.$valid) {
                $http.post('/dept',$scope.dept).then(function(response){
                    if(response.data.code==200){
                        $uibModalInstance.close($scope.dept);
                    }
                    
                });
            }
        };
    };
})();