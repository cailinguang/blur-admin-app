(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.standard')
        .controller('EvaluationManageCtrl', EvaluationManageCtrl);

    /** @ngInject */
    function EvaluationManageCtrl($scope,$http,$uibModal,$stateParams,$state,$q, ngTreetableParams,blockUI,toastr,Constants) {

        if($stateParams.row){
            $scope.applicability = $stateParams.row;
        }else{
            $scope.applicability = {
                type: 'vda'
            };
        }

        $scope.typeSelect = Constants.standardType;

        var deferred = $q.defer();
        //search vda libary
        var vadLibary = null;
        var nodesList = null;
        $http.get('/api/standard/libary').then(function(response) {
            vadLibary = response.data.data.list[0];

            //query libary nodes
            $http.get('/api/standard/libary/standardNodes',{params:{standardId:vadLibary.id,level:'2'}}).then(function(response){
                nodesList = response.data.data;
                setText(nodesList);
                
                if($scope.applicability.id==null){
                    deferred.resolve(nodesList);
                    $scope.treeTableEnd = true;
                }
                //query applicability nodes
                else{
                    $http.get('/api/applicability/libary/standardNodes',{params:{applicabilityId:$scope.applicability.id,level:'2'}}).then(function(response){
                        var aNodeList = response.data.data;

                        setV(aNodeList,nodesList);
                        deferred.resolve(nodesList);
                        $scope.treeTableEnd = true;
                    });
                }
                
            });
        });
        
        $scope.expanded_params = new ngTreetableParams({
            getNodes: function(parent) {
                return  parent ? parent.children : deferred.promise;
            },
            getTemplate: function(node) {
                return 'tree_node.html';
            },
            options: {
                initialState: 'expanded'
            }
        });


        function setText(list,p){
            if(list&&list.length>0)
            angular.forEach(list,function(o){
                o.text=o.name;
                o.parent = p;
                setText(o.children,o);
            });
        }

        function setV(aNodeList,nodesList){
            aNodeList.forEach(function(e){
                var n = filterNodes(nodesList,e.standardNodeId);
                if(n && n.type=='vda_question'){
                    n.applicability = true;
                    n.targetValue = e.targetValue;
                    n.id=e.id;
                }
                setV(e.children,nodesList);
            })
        }

        function filterNodes(nodes,id){
            for(var i in nodes){
                if(nodes[i].id==id) return nodes[i];
                var n = filterNodes(nodes[i].children,id);
                if(n) return n;
            }
        }

        
        $scope.applicabilityClick = function(event){
            var tid = $(event.target).closest('tr').attr('data-tt-id');
            var node = $("#treeTable").treetable('node',tid);
            node.children.forEach(function(n){
                
                angular.element(n.row.find(':checkbox')).scope().node.applicability=event.target.checked;
            });

            
            if(node.parentId!=undefined){
                if($("#treeTable tr[data-tt-parent-id='"+node.parentId+"']").length == $("#treeTable tr[data-tt-parent-id='"+node.parentId+"'] :checkbox:checked").length){
                    $("#treeTable tr[data-tt-id='"+node.parentId+"'] :checkbox")[0].checked = true;
                }else{
                    $("#treeTable tr[data-tt-id='"+node.parentId+"'] :checkbox")[0].checked = false;
                }
            }
        }
       

        $scope.formSubmit = function(){
            if(angular.element($('form')).scope().form.$valid){

                blockUI.start();
                $scope.applicability.standardId = vadLibary.id;
                var selectNodes = angular.copy(nodesList);
                readNodes(selectNodes);
                $scope.applicability.selectNodes = selectNodes;

                if($scope.applicability.id == null){
                    $http.post('/api/applicability/libary/applicability',$scope.applicability).then(function(response){
                        blockUI.stop();
                        if(response.data.code==200){
                            toastr.success('发布成功');
                            $scope.goBack();
                        }
                    },function(response){
                        blockUI.stop();
                    });
                }
                else{
                    $http.put('/api/applicability/libary/applicability',$scope.applicability).then(function(response){
                        blockUI.stop();
                        if(response.data.code==200){
                            toastr.success('发布成功');
                            $scope.goBack();
                        }
                    },function(response){
                        blockUI.stop();
                    });
                }
            }
        }

        function readNodes(a){
            a.forEach(function(e){
                if(e.applicability&&e.parent){
                    e.parent.applicability=true;
                }
                delete e.parent;
                readNodes(e.children);
            })
        }


        $scope.goBack = function(){
            $state.go('main.standard.evaluation');
        }
        
    }; 
    
    
})();