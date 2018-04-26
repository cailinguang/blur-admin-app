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
            "plugins" : [ "contextmenu"],
            "contextmenu": {
                "items": function (node) {
                    return createContextMenu(node);
                }
            },
            version : 1
        };
        //tree contextMenu
        function createContextMenu(node){
            var temp = {
                "create":{"separator_before":false,"separator_after":true,"_disabled":false,"label":"新增","action": function (data) {
                    var inst = $.jstree.reference(data.reference);
                    $scope.openDept();
                }},
                "rename":{"separator_before":false,"separator_after":false,"_disabled":false,"label":"修改","action": function (data) {
                    var inst = $.jstree.reference(data.reference),
                        obj = inst.get_node(data.reference);
                    $scope.openDept(obj);
                }},
                "remove":{"separator_before":false,"icon":false,"separator_after":false,"_disabled":false,"label":"删除","action": function (data) {
                    var inst = $.jstree.reference(data.reference),
                        obj = inst.get_node(data.reference);
                    if(inst.is_selected(obj)) {
                        $scope.deleteDept(inst.get_selected());
                    }
                    else {
                        $scope.deleteDept(obj);
                    }
                }}
            };
            if(node.parent=='#'){
                delete temp.delete;
            }
            return temp;
        }
        //tree event
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
        $scope.openDept = function(row){
            var uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/system/dept/deptSaveModal.html',
                size: 'md',
                controller: DeptModalInstanceCtrl,
                scope: $scope,
                resolve: {
                  dept: function () {
                    if(row){
                        return angular.copy(row);
                    }
                    return {parent:$scope.rootDept.id || '#'};
                  }
                }
            });

            uibModalInstance.result.then(function (dept) {
                loadDeptTree();
            }, function () {
                //close modal
            });
        }

        //delete
        $scope.deleteDept = function(row){
            if(!confirm('确认删除？')) return false;

            $http.delete('/dept/'+row.id).then(function(response){
                if(response.code=200){
                    loadDeptTree();
                }
            });
        }
    }; 
    
    //部门弹框页面控制
    /** @ngInject */
    var DeptModalInstanceCtrl = function ($scope,$http, $uibModalInstance, dept) {
        $scope.dept = dept;
        $scope.deptSubmit = function () {
            if ($scope.deptForm.$valid) {
                $http({
                    url:$scope.dept.id?'/dept/'+$scope.dept.id:'/dept',
                    data:$scope.dept,
                    method:$scope.dept.id?'PUT':'POST'
                }).then(function(response){
                    if(response.data.code==200){
                        $uibModalInstance.close($scope.dept);
                    }
                });
            }
        };
    };
})();