(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.standard')
        .controller('ApplicabilityManageCtrl', ApplicabilityManageCtrl);

    /** @ngInject */
    function ApplicabilityManageCtrl($scope,$http,$uibModal,$timeout,$log,$state,$q, ngTreetableParams) {
        $scope.typeSelect = [
            {label:'VDA',value:'vda'}
        ];

        $scope.applicability = {
            standardType: 'vda'
        };

        var deferred = $q.defer();
        //search vda libary
        var vadLibary = null;
        $http.get('/api/isms/standard',{params:{isEvaluation:'0'}}).then(function(response) {
            vadLibary = response.data.data.list[0];

            //query libary nodes
            $http.get('/api/isms/standard/standardNodes',{params:{standardId:vadLibary.standardId}}).then(function(response){
                var list = response.data.data;
                setText(list);
                
                deferred.resolve(list);
                
            });
        });
        
        $scope.expanded_params = new ngTreetableParams({
            getNodes: function(parent) {
                return deferred.promise;
            },
            getTemplate: function(node) {
                return 'tree_node.html';
            },
            options: {
                initialState: 'expanded'
            }
        });


        var allowNodeType = ['vda_chapter','vda_question'];
        function setText(list){
            if(list&&list.length>0)
            angular.forEach(list,function(o){
                o.text=o.properties['name'].value;
                setText(o.children);
            });
        }

        

       

        

        
    }; 
    
    
})();