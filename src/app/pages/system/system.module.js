/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.system', [
      'BlurAdmin.pages.system.user',
      'BlurAdmin.pages.system.dept',
      'BlurAdmin.pages.system.role'
    ]).config(routeConfig);
  
    /** @ngInject */
    function routeConfig($stateProvider) {
      $stateProvider
        .state('main.system', {
            url: '/system',
            template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
            abstract: true,
            title: 'System Management',
            sidebarMeta: {
              icon: 'ion-gear-a',
              order: 10,
            },
            authenticate: true
          });
    }
  
  })();
  