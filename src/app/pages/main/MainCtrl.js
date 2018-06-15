(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.main')
        .controller('MainCtrl', MainCtrl);

    /** @ngInject */
    function MainCtrl($scope,localStorage) {
        $scope.nickName = localStorage.getObject('nickName');
    }; 
})();