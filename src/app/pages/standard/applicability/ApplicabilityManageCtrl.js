(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.standard')
        .controller('ApplicabilityManageCtrl', ApplicabilityManageCtrl);

    /** @ngInject */
    function ApplicabilityManageCtrl($scope,$http,$uibModal,$timeout,$log,$state,$q, ngTreetableParams,blockUI) {
        $scope.typeSelect = [
            {label:'VDA',value:'vda'}
        ];

        $scope.applicability = {
            standardType: 'vda'
        };

        var deferred = $q.defer();
        //search vda libary
        var vadLibary = null;
        var nodesList = null;
        $http.get('/api/isms/standard',{params:{isEvaluation:'0'}}).then(function(response) {
            vadLibary = response.data.data.list[0];

            //query libary nodes
            $http.get('/api/isms/standard/standardNodes',{params:{standardId:vadLibary.standardId,level:'2'}}).then(function(response){
                nodesList = response.data.data;
                setText(nodesList);
                
                deferred.resolve(nodesList);
                $scope.treeTableEnd = true;
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
                o.text=o.properties['name'].value;
                o.parent = p;
                setText(o.children,o);
            });
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
                $scope.applicability.standardId = vadLibary.standardId;
                var selectNodes = angular.copy(nodesList);
                readNodes(selectNodes);
                $scope.applicability.selectNodes = selectNodes;

                $http.post('/api/isms/standard/applicability',$scope.applicability).then(function(response){
                    blockUI.stop();
                    if(response.data.code==200){

                    }
                },function(response){
                    blockUI.stop();
                });
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
        
    }; 
    
    
})();