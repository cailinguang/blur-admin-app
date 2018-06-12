(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.task')
        .controller('TaskDealCtrl', TaskDealCtrl);

    /** @ngInject */
    function TaskDealCtrl($scope,$http,$uibModal,$timeout,$log,Constants,$state,$stateParams,$q,ngTreetableParams,$templateCache,$compile) {
        if($stateParams.row){
            $scope.evaluation = $stateParams.row;
        }else{
            $state.go('main.task');
            return;
        }
 
        $scope.severityLevelSelect = Constants.severityLevel;
        $scope.levelApprovedSelect = Constants.levelApproved;
        $scope.complianceLevelSelect = Constants.complianceLevel;

        var levelContent = null;
        $http.get('levelContent.html', {cache: $templateCache}).then(function(result) {
            levelContent = result.data;
        });

        var levelTree = null;
        $http.get('level_tree.html', {cache: $templateCache}).then(function(result) {
            levelTree = result.data;
        });

        var deferred = $q.defer();
        var nodesList = null;
        //query libary nodes
        $http.get('/api/task/standardNodes',{params:{evaluationId:$scope.evaluation.id,level:'2'}}).then(function(response){
            nodesList = response.data.data;
            setText(nodesList);
            
            deferred.resolve(nodesList);
            $scope.treeTableEnd = true;
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
                if(o.type=='vda_question'){
                    o.statusCn = Constants.translate(Constants.evaluationQuestionNodeStatus,o.status);
                }
                setText(o.children,o);
            });
        }


        function filterNodes(nodes,id){
            for(var i in nodes){
                if(nodes[i].id==id) return nodes[i];
                var n = filterNodes(nodes[i].children,id);
                if(n) return n;
            }
        }

        var currentTd = $('<i class="ion-arrow-left-b"></i>');
        $scope.questionClick = function(event,node){
            if(node.type!='vda_question'){
                return false;
            }
            var $tr = $(event.target).closest('tr');
            if(!$tr.hasClass('currentTr')){
                $tr.addClass('currentTr').siblings().removeClass('currentTr');
                $tr.find('td:last').append(currentTd);

                buildLevel(node);
            }
        }

        $scope.$on('$viewContentLoaded', function(){
            function click(){
                if(angular.element("#treeTable tbody tr").length==0){
                    $timeout(function(){
                        click();
                    },500);
                }else{
                    angular.element("#treeTable tbody tr[vdaType='vda_question']:first").triggerHandler('click')
                }
            };
            click();

        });

        var levelDeferred = $q.defer();
        $scope.level_table_params = new ngTreetableParams({
            getNodes: function(parent) {
                return  parent ? parent.children : levelDeferred.promise;
            },
            getTemplate: function(node) {
                return 'level_tree_node.html';
            },
            options: {
                initialState: 'expanded'
            }
        });
        var childrenScope = $scope.$new();
        var childrenTableScope = $scope.$new();

        var cacheNode = {};
        //build level html
        function buildLevel(node){
            function loadNodes(nodes){
                childrenScope.$destroy();
                childrenScope = $scope.$new();
                childrenScope.levels = nodes.children;
                childrenScope.levelSelect = function(item){
                    $timeout(function(){
                        if(item.children.length>0){
                            levelDeferred = $q.defer();

                            childrenTableScope.$destroy();
                            childrenTableScope = $scope.$new();
                            var compiledDirective1 = $compile(levelTree);
                            var directiveElement1 = compiledDirective1(childrenTableScope);
                            $("#levelTable-"+item.id).empty().append(directiveElement1);

                            levelDeferred.resolve(item.children);
                        }else{
                            $("#levelTable-"+item.id).empty().append('没有找到记录！');
                        }
                    },200)
                }

                var compiledDirective = $compile(levelContent);
                var directiveElement = compiledDirective(childrenScope);
                $('#levelContent').empty().append(directiveElement);
            }
            
            if(cacheNode[node.id]){
                loadNodes(cacheNode[node.id]);
            }else
            $http.get('/api/task/childrenNodes',{params:{parentId:node.id}}).then(function(response){
                var nodes = response.data.data;
                cacheNode[node.id] = nodes;
                node.children = nodes.children;
                loadNodes(nodes);
            });
        }
       

        $scope.save = function(){
            $http.put('/api/task',$scope.node).then(function(response){
                blockUI.stop();
                if(response.data.code==200){
                    toastr.success('发布成功');
                    $scope.goBack();
                }
            },function(response){
                blockUI.stop();
            });
        }
        $scope.commit = function(){
            
        }
        $scope.reviewed = function(){
            
        }
        $scope.goBack = function(){
            $state.go('main.task');
        }


    }; 
})();