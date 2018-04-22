(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.system.user')
        .controller('UserListCtrl', UserListCtrl)
        .directive('stRatio',stRatio);
    /** @ngInject */
    function UserListCtrl($http,composeModal, mailMessages) {
        var vm = this;
    
        vm.displayed = [];
        
        vm.callServer = function callServer(tableState) {

            vm.isLoading = true;
        
            var pagination = tableState.pagination;

            $http.post('/user/list',{page:pagination.currentPage,size:pagination.number}).then(function(response){
                if(response.data.code==200){
                    vm.displayed = response.data.data.list;
                }else{
                    vm.displayed = [];
                }
                vm.isLoading = false;
            });

          };

        
    }

    function stRatio(){
            return {
              link:function(scope, element, attr){
                var ratio=+(attr.stRatio);
                
                element.css('width',ratio+'%');
                
              }
            };
        }
  
})();