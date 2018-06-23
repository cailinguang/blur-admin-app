(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.task')
        .controller('TaskLogControlViewCtrl', TaskLogControlViewCtrl);

    /** @ngInject */
    function TaskLogControlViewCtrl($scope,$http,$uibModal,$timeout,$log,Constants,$state,$stateParams,$q,ngTreetableParams,$templateCache,$compile,toastr,localStorage,blockUI,log) {
        var levelTree = '<table tt-table tt-params="level_table_params" id="levelTable{{item.id}}" style="margin-top:0px;">'+
                        '    <thead>'+
                        '    <tr>'+
                        '        <th>Control</th>'+
                        '        <th style="width:200px;">Compliance Level</th>'+
                        '        <th>Evidences</th>'+
                        '    </tr>'+
                        '    </thead>'+
                        '    <tbody></tbody>'+
                        '</table>';

        $scope.levels = eval('('+log.controlStr+')');

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

        var childrenTableScope = $scope.$new();
        $scope.levelSelect = function(item){
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
    }; 
})();