/**
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.system.role')
      .controller('roleAssignModuleCtrl', roleAssignModuleCtrl);

  /** @ngInject */
  function roleAssignModuleCtrl($scope,$http,role,$uibModalInstance,toastr) {
    //配置树
    $scope.moduleData =  [];
    $scope.model = {};
    $scope.moduleTreeConfig = {
        core : {
            multiple : true,
            animation: true,
            check_callback : true,
            worker : true
        },
        "plugins" : ["checkbox" ],
        version:0
    };
    $http.get('/api/menu').then(function(response){
        var list = response.data.data.list;
        angular.forEach(list,function(o){
            o.text=o.name;
            if(o.parent=='#'){
                o.state = {opened:true};
            }
        });
        $scope.moduleData = list;
        $scope.moduleTreeConfig.version++;
    });

    //设置已分配菜单
    $http.get('/api/permission/roleAssignMenu',{params:{roleId:role.id}}).then(function(response){
        var list = response.data.data;
        list.forEach(function(e){
            if(!$scope.model.moduleTree.jstree(true).is_parent(e.id)){
                $scope.model.moduleTree.jstree(true).check_node(e.id);
            }else{
                $scope.model.moduleTree.jstree(true).open_node(e.id);
            }
        });
    });

    $scope.save = function(){
        $scope.isSubmit = true;
        
        var selectNodeIds = [];
        var selectNodes = $scope.model.moduleTree.jstree(true).get_selected(true);
        selectNodes.forEach(function(n){
            selectNodeIds.push(n.id);
            selectNodeIds = selectNodeIds.concat(n.parents);
        });
        function unique(arr){
            var tmp = new Array();
            for(var i in arr){
                if(tmp.indexOf(arr[i])==-1 && arr[i]!='#'){
                    tmp.push(arr[i]);
                }
            }
            return tmp;
        }
        selectNodeIds = unique(selectNodeIds);


        $http.post('/api/permission/roleAssignMenu',{roleId:role.id,menuIds:selectNodeIds.join(',')}).then(function(response){
            $scope.isSubmit = false;
            toastr.success('角色分配菜单成功');
            $uibModalInstance.close();
        },function(response){
            $scope.isSubmit = false;
        })
    }
  }
})();