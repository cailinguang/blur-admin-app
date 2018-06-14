(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.standard')
        .controller('EvaluationManageCtrl', EvaluationManageCtrl);

    /** @ngInject */
    function EvaluationManageCtrl($scope,$http,$uibModal,$stateParams,$state,$q, ngTreetableParams,blockUI,toastr,Constants,$compile,$templateCache) {
        $scope.typeSelect = [];
        $scope.evaluationTypeSelect = Constants.evaluationType;

        var tableContent = null;

        $scope.$on('$viewContentLoaded', function(){
            $http.get('tree_table.html', {cache: $templateCache}).then(function(result) {
                tableContent = result.data;
            });
        });

        if($stateParams.row){
            $scope.evaluation = $stateParams.row;
        }else{
            $scope.evaluation = {
                applicabilityId : undefined,
                evaluationType : "1"
            };
        }

        


        var treeDeferred = $q.defer();
        //search applicability libary
        var applicabilityLibary = null;
        var nodesList = null;
        $http.get('/api/applicability/libary').then(function(response) {
            $scope.typeSelect = response.data.data.list;
            if(response.data.data.list.length==0){
                return;
            }
            if($scope.evaluation.id){
                response.data.data.list.forEach(function(e){
                    if(e.id==$scope.evaluation.applicabilityId){
                        angular.element('#applicabilityId').scope().$broadcast('uis:select',e);
                    }
                });
            }
            else{
                $scope.evaluation.applicabilityId = response.data.data.list[0].id;
                $scope.evaluation.type = response.data.data.list[0].type;
                angular.element('#applicabilityId').scope().$broadcast('uis:select',response.data.data.list[0]);
            }

        });


        var childrenScope = $scope.$new();
        var compiledDirective = $compile(tableContent);
        var directiveElement = compiledDirective(childrenScope);
        $('#tableContent').empty().append(directiveElement);


        $scope.onTypeSelect = function(item){
            applicabilityLibary = item;

            treeDeferred = $q.defer();
            childrenScope.$destroy();
            childrenScope = $scope.$new();
            var compiledDirective = $compile(tableContent);
            var directiveElement = compiledDirective(childrenScope);
            $('#tableContent').empty().append(directiveElement);
            

            //query libary nodes
            $http.get('/api/applicability/libary/standardNodes',{params:{applicabilityId:applicabilityLibary.id,level:'2'}}).then(function(response){
                nodesList = response.data.data;
                setText(nodesList);
                
                if($scope.evaluation.id==null){
                    treeDeferred.resolve(nodesList);
                    $scope.treeTableEnd = true;
                }
                //query applicability nodes
                else{
                    $http.get('/api/evaluation/standardNodes',{params:{evaluationId:$scope.evaluation.id,level:'2'}}).then(function(response){
                        var aNodeList = response.data.data;

                        setV(aNodeList,nodesList);
                        treeDeferred.resolve(nodesList);

                        $scope.treeTableEnd = true;
                    });
                }
                
            });
        }
        
        $scope.expanded_params = new ngTreetableParams({
            getNodes: function(parent) {
                return  parent ? parent.children : treeDeferred.promise;
            },
            getTemplate: function(node) {
                return 'tree_node.html';
            },
            options: {
                initialState: 'expanded'
            },
            version:1
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
                var n = filterNodes(nodesList,e.applicabilityNodeId);
                if(n && n.type=='vda_question'){
                    n.applicability = true;
                    n.targetValue = e.targetValue;
                    n.id=e.id;
                    n.assign=e.assign;
                    if(n.assign) n.assignUser=n.assign.id;
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
                var selectNodes = angular.copy(nodesList);
                readNodes(selectNodes);
                $scope.evaluation.selectNodes = selectNodes;

                if($scope.evaluation.id == null){
                    $http.post('/api/evaluation',$scope.evaluation).then(function(response){
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
                    $http.put('/api/evaluation',$scope.evaluation).then(function(response){
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
            $state.go('main.evaluation');
        }

        
        $scope.openAssignUser = function(node){
            var uibModalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/standard/evaluation/assignUser.html',
                size: 'lg',
                controller: AssignUserCtrl,
                backdrop: 'static',
                keyboard  : false,
                scope: $scope,
                resolve: {
                  node: function () {
                    return node;
                  }
                }
            });
        }
    }; 
    
    var AssignUserCtrl = function ($scope,$http,$uibModal, $uibModalInstance,toastr, node) {
        $scope.node = node;
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

                    $scope.model.deptTree.jstree(true).open_all();
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

        var assignUser = null;
        $scope.rowClick = function($event,row){
            assignUser = row;
            $($event.target).closest('tr').find(":radio[value='"+row.id+"']")[0].checked = true;
        }

        $scope.assign = function(){
            if(assignUser){
                node.assign = assignUser
                node.assignUser = assignUser.id;
                $uibModalInstance.close();
            }else{
                toastr.error('请选择一个用户！');
            }
        }
    };
})();