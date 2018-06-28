/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
  'use strict';

  angular.module('BlurAdmin.pages.system.role', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main.system.role', {
        url: '/role',
        abstract: true,
        template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
        title: 'Role Management',
        sidebarMeta: {
          order: 1,
        },
        authenticate: true
      })
      .state('main.system.role.list', {
        url: '/list',
        templateUrl: 'app/pages/system/role/roleList.html',
        title:'Role Management',
        controller:'RoleListCtrl',
        authenticate: true
      });
    $urlRouterProvider.when('/main/system/role', '/main/system/role/list');

  }

})();