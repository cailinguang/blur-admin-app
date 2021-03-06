(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.system.user')
        .controller('UserListCtrl', UserListCtrl);


    /** @ngInject */
    function UserListCtrl($scope,$http,$uibModal,$timeout,$log,Constants) {
        $scope.isLoading = true;
        //配置树
        $scope.deptData =  [];
        $scope.model = {};
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
                    o.icon = 'fa fa-sitemap';
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
                    $scope.model.deptTree.jstree(true).open_node($scope.rootDept.id);
                    $scope.model.deptTree.jstree(true).select_node($scope.rootDept.id,false,false);
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

        $scope.loadUsers = function() {
            $http.get('/api/user',{params:{deptId:$scope.rootDept.id}}).then(function(response) {
                $scope.isLoading = false;
                $scope.rowCollection = response.data.data.list;
            },function(response){
                $scope.isLoading = false;
            });
        }

        //新增
        $scope.openUser = function(row){
            var uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/system/user/userSaveModal.html',
                size: 'md',
                controller: UserModalInstanceCtrl,
                scope: $scope,
                resolve: {
                  user: function () {
                    if(row){
                        return angular.copy(row);
                    }
                    return {deptId:$scope.rootDept.id,status:'1'};
                  }
                }
            });

            uibModalInstance.result.then(function (user) {
                loadDeptTree();
            }, function () {
                //close modal
            });
        }
        
        //delete
        $scope.deleteUser = function(row){
            if(!confirm('确认删除？')) return false;

            $http.delete('/api/user/'+row.id).then(function(response){
                if(response.data.code==200){
                    loadDeptTree();
                }
            });
        }

        $scope.resetPass = function(row){
            $http.put('/api/user/resetpassword/'+row.id).then(function(response){
                if(response.data.code==200){
                    //展示密码
                    row.password = response.data.data;
                    $uibModal.open({
                        animation: true,
                        templateUrl: 'app/pages/system/user/showPassword.html',
                        resolve: {
                            puser: function(){return row}
                        },
                        /** @ngInject */
                        controller:function(puser,$scope){
                            $scope.user=puser
                        }
                    });
                }
            });
        }
        
    }; 
    
    //弹框页面控制
    /** @ngInject */
    var UserModalInstanceCtrl = function ($scope,$http,$uibModal, $uibModalInstance, user,Constants) {
        $scope.user = user;
        if(user.roles&&user.roles.length!=0)user.roles=user.roles[0];

        $scope.statusSelect = Constants.userStatus;
        $scope.roleSelect = [];
        $http.get('/api/role').then(function(response){
            $scope.roleSelect = response.data.data.list;
        });

        $scope.userSubmit = function () {
            if ($scope.form.$valid) {
                $http({
                    url:$scope.user.id?'/api/user/'+$scope.user.id:'/api/user',
                    data:$scope.user,
                    method:$scope.user.id?'PUT':'POST'
                }).then(function(response){
                    if(response.data.code==200){
                        $uibModalInstance.close($scope.user);

                        if($scope.user.id==undefined){
                            //展示密码
                            $scope.user.password = response.data.data;
                            $uibModal.open({
                                animation: true,
                                templateUrl: 'app/pages/system/user/showPassword.html',
                                resolve: {
                                    puser: function(){return $scope.user}
                                },
                                /** @ngInject */
                                controller:function(puser,$scope){
                                    $scope.user=puser
                                }
                            });
                        }
                    }
                });
            }
        };
    };
})();