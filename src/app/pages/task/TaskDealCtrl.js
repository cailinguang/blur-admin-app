(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.task')
        .controller('TaskDealCtrl', TaskDealCtrl);

    /** @ngInject */
    function TaskDealCtrl($scope,$http,$uibModal,$timeout,$log,Constants,$state,$stateParams,$q,ngTreetableParams,$templateCache,$compile,toastr,localStorage,blockUI) {
        if($stateParams.row){
            $scope.evaluation = $stateParams.row;
        }else{
            $state.go('main.task');
            return;
        }
 
        $scope.severityLevelSelect = Constants.severityLevel;
        $scope.levelApprovedSelect = Constants.levelApproved;
        $scope.complianceLevelSelect = Constants.complianceLevel;

        //role
        $scope.roles = localStorage.getObject('dataRoles');

        var levelContent = null;
        $http.get('levelContent.html', {cache: $templateCache}).then(function(result) {
            levelContent = result.data;
        });

        var levelTree = null;
        $http.get('level_tree.html', {cache: $templateCache}).then(function(result) {
            levelTree = result.data;
        });

        var deferred = $q.defer();
        //查询评审到question级别
        $http.get('/api/task/standardNodes',{params:{evaluationId:$scope.evaluation.id,level:'2'}}).then(function(response){
            deferred.resolve(response.data.data);
            $scope.treeTableEnd = true;
        });
        //评审question treeTable配置
        $scope.expanded_params = new ngTreetableParams({
            getNodes: function(parent) {
                return  parent ? parent.children : deferred.promise;
            },
            getTemplate: function(node) {
                return 'tree_node.html';
            },
            options: {
                initialState: 'expanded',
                indent:30
            }
        });

        //question点击事件，加载level和设置当前选中样式
        var currentTd = $('<i class="ion-arrow-left-b"></i>');
        $scope.lastNode = null;//set other node children is empty
        $scope.questionClick = function(event,node){
            if(node.type!='vda_question'){
                return false;
            }
            if($scope.lastNode){
                $scope.lastNode.children = [];
            }
            $scope.lastNode = node;
            var $tr = $(event.target).closest('tr');
            if(!$tr.hasClass('currentTr')){
                $tr.addClass('currentTr').siblings().removeClass('currentTr');
                $tr.find('td:last').append(currentTd);

                buildLevel(node);
            }
        }
        //触发第一个question点击
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

        //level TreeTable配置
        var levelDeferred = $q.defer();
        $scope.level_table_params = new ngTreetableParams({
            getNodes: function(parent) {
                return  parent ? parent.children : levelDeferred.promise;
            },
            getTemplate: function(node) {
                return 'level_tree_node.html';
            },
            options: {
                initialState: 'expanded',
                indent:30
            }
        });

        //重新加载level panel 和 treeTable
        var childrenScope = $scope.$new();
        var childrenTableScope = $scope.$new();

        var cacheNode = {};
        //build level html
        function buildLevel(node){
            var height = $("#levelContent").height();
            $('#levelContent').empty().append('<p style="height:'+height+'px">Loading...</p>');
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
                            $("#levelTable-"+item.id).empty().append('no control node found！');
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

        //附件
        $scope.openEvidences = function(node){
            $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/task/uploadEvidences.html',
                size:'lg',
                controller:'UploadEvidencesCtrl',
                resolve: {
                    node: function(){return node}
                }
            });
        }
       
        var isCiso = $scope.roles.indexOf('ciso')>-1;
        //保存
        $scope.save = function(){
            operate('save',function(success){
                if(success && !isCiso)$scope.lastNode.status='1';
            });
        }

        //提交
        $scope.commit = function(){
            operate('commit',function(success){
                if(success)$scope.lastNode.status='2';
            });
        }
        //复核
        $scope.reviewed = function(){
            operate('review',function(success){
                if(success)$scope.lastNode.status='3';
            });
        }

        function operate(type,callback){
            $scope.evaluation.selectNodes = $scope.lastNode;
            
            blockUI.start();
            $http.put('/api/task/'+type,$scope.evaluation).then(function(response){
                if(response.data.code==200){
                    toastr.success('操作完成');
                    blockUI.stop();
                    callback(true);
                }else{
                    blockUI.stop();
                    callback(false);
                }
            },function(response){
                blockUI.stop();
                callback(false);
            });
        }

        //取消
        $scope.goBack = function(){
            $state.go('main.task');
        }


    }; 
})();