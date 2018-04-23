(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.system.user')
        .controller('UserListCtrl', UserListCtrl);

    /** @ngInject */
    function UserListCtrl($http) {
        var vm = this;
        
        vm.isLoading = true;
        vm.displayed = [];
        
        $http.get('/user').then(function(response){
            vm.isLoading = false;
            vm.displayed = response.data.data.list;
        },function(){
            vm.isLoading = false;
        });
        
        
        
    }; 
    
})();