(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.standard')
        .controller('StandardManageCtrl', StandardManageCtrl);

    /** @ngInject */
    function StandardManageCtrl($scope,$http,$uibModal,$stateParams,$state,toastr) {
        $scope.standard = $stateParams.row;
        if($scope.standard==null){
            $state.go('main.standard.standard');
            return;
        }
        
        //配置树
        $scope.standardData =  [];
        $scope.model = {};
        $scope.standardTreeConfig = {
            core : {
                multiple : false,
                animation: true,
                error : function(error) {
                    $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                },
                check_callback : true,
                worker : true
            },
            version:0
        };
        //tree event
        $scope.standardTreeEvents = {
            //'create_node': ,
            'select_node': onSelectstandard   // on node selected callback
        };

        //选择树节点
        function onSelectstandard(e, data){
            var original = data.node.original;
            $scope.selectNode = original;
            $scope.selectNode.name = original.properties['name'].value;
            $scope.selectNode.description = original.properties['description'].value;
        }

        //加载树
        $scope.loadingTree=true;
        function setText(list){
            if(list&&list.length>0)
            angular.forEach(list,function(o){
                o.text=o.properties['name'].value;
                setText(o.children);
            })
        }
        $http.get('/api/isms/standard/standardNodes',{params:{standardId:$scope.standard.standardId}}).then(function(response){
            var list = response.data.data;
            setText(list);
            $scope.standardData = list;
            $scope.standardTreeConfig.version++;
            $scope.loadingTree=false;
        });

        //更新属性
        $scope.updateProperty = function(){
            $scope.isSubmit = true;
            $http.post('/api/isms/standard/nodeProperty',{type:'string',id:$scope.selectNode.properties['description'].id,value:$scope.selectNode.description}).then(function(response){
                if(response.data.code==200){
                    $scope.selectNode.properties['description'].value = $scope.selectNode.description;
                    toastr.success('更新成功');
                }
                $scope.isSubmit = false;
            },function(response){
                $scope.isSubmit = false;
            });
        }
    }; 
    
    
})();