(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.system.user')
        .controller('UserListCtrl', UserListCtrl);

    /** @ngInject */
    function UserListCtrl($scope,$http) {
        $scope.isLoading = true;
        $http.get('/user').then(function(response) {
            $scope.isLoading = false;
	        $scope.rowCollection = response.data.data.list;
	    },function(response){
            $scope.isLoading = false;
        });
        
        
        
    }; 
    
})();