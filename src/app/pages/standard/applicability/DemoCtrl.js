(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.standard')
        .controller('DemoCtrl', DemoCtrl);

    /** @ngInject */
    function DemoCtrl($scope,$http,$uibModal,$timeout,$log,$state,ngTableTree) {
      $('.tree').treegrid();
        
    }; 
    
    
})();