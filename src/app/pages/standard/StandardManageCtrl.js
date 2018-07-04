(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.standard')
        .controller('StandardManageCtrl', StandardManageCtrl);

    /** @ngInject */
    function StandardManageCtrl($scope,$http,$uibModal,$stateParams,$state,toastr) {
        $scope.standard = $stateParams.row;
        if($scope.standard==null){
            $state.go('main.standard');
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
            "plugins" : [ "contextmenu"],
            "contextmenu": {
                "items": function (node) {
                    return createContextMenu(node);
                }
            },
            version:0
        };

        //tree contextMenu
        function createContextMenu(node){
            var temp = {
                "create":{"separator_before":false,"separator_after":true,"_disabled":false,"label":"Add","action": function (data) {
                    var inst = $.jstree.reference(data.reference),
                    obj = inst.get_node(data.reference);
                    inst.create_node(obj, {}, "last", function (new_node) {
                        try {
                            inst.edit(new_node);
                        } catch (ex) {
                            setTimeout(function () { inst.edit(new_node); },0);
                        }
                    });
                }},
                "rename":{"separator_before":false,"separator_after":false,"_disabled":false,"label":"Update","action": function (data) {
                    var inst = $.jstree.reference(data.reference),
                        obj = inst.get_node(data.reference);
                    inst.edit(obj);
                }},
                "remove":{"separator_before":false,"icon":false,"separator_after":false,"_disabled":false,"label":"Delete","action": function (data) {
                    var inst = $.jstree.reference(data.reference),
                        obj = inst.get_node(data.reference);
                    
                    var inst = $.jstree.reference(data.reference),
                        obj = inst.get_node(data.reference);
                    if(inst.is_selected(obj)) {
                        inst.delete_node(inst.get_selected());
                    }
                    else {
                        inst.delete_node(obj);
                    }
                    
                }}
            };

            if(node.original.type=='vda_chapter'){
                temp.create.label='Add Question';
            }
            else if(node.original.type=='vda_question'){
                temp.create.label='Add Level';
            }
            else if(node.original.type=='vda_level'){
                temp.create.label='Add Control';
            }
            else if(node.original.type=='vda_control'){
                temp.create.label='Add Control';
            }else{
                return [];
            }
            return temp;
        }
        
        //tree event
        $scope.standardTreeEvents = {
            //'create_node': ,
            'select_node': onSelectstandard,   // on node selected callback

            'delete_node':function(event,node,parent){
                console.info('delete',node);
            },
            'create_node':function(event,node,parent,position){
                console.info('create',node);
            },
            'rename_node':function(event,node,text,old){
                console.info('rename',node);
            }
        };

        //选择树节点
        function onSelectstandard(e, data){
            var original = data.node.original;
            $scope.selectNode = original;
        }

        //加载树
        $scope.loadingTree=true;
        function setText(list){
            if(list&&list.length>0)
            angular.forEach(list,function(o){
                o.text=o.name;
                setText(o.children);
            })
        }
        $http.get('/api/standard/libary/standardNodes',{params:{standardId:$scope.standard.id}}).then(function(response){
            var list = response.data.data;
            setText(list);
            $scope.standardData = list;
            $scope.standardTreeConfig.version++;
            $scope.loadingTree=false;
        });

        //更新属性
        $scope.updateProperty = function(){
            $scope.isSubmit = true;
            $http.put('/api/standard/libary/node',{id:$scope.selectNode.id,description:$scope.selectNode.description}).then(function(response){
                if(response.data.code==200){
                    toastr.success('更新成功');
                }
                $scope.isSubmit = false;
            },function(response){
                $scope.isSubmit = false;
            });
        }
    }; 
    
    
})();