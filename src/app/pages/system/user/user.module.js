/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
  'use strict';

  angular.module('BlurAdmin.pages.system.user', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main.system.user', {
        url: '/user',
        template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
        abstract: true,
        title: '用户管理',
        authenticate: true
      }).state('main.system.user.list', {
        url: '/list',
        templateUrl: 'app/pages/system/user/list.html',
        title:'用户管理',
        authenticate: true
      });
    $urlRouterProvider.when('/main/system/user', '/main/system/user/list');
  }

})();