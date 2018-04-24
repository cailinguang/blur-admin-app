/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
  'use strict';

  angular.module('BlurAdmin.pages.system.dept', [])
    .config(routeConfig)
    .config(function() {
      $.jstree.defaults.core.themes.url = true;
      $.jstree.defaults.core.themes.dir = "assets/img/theme/vendor/jstree/dist/themes";
    });

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main.system.dept', {
        url: '/dept',
        abstract: true,
        template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
        title: '部门管理',
        sidebarMeta: {
          order: 0,
        },
        authenticate: true
      })
      .state('main.system.dept.list', {
        url: '/list',
        templateUrl: 'app/pages/system/dept/deptList.html',
        title:'部门管理',
        controller:'DeptListCtrl',
        controllerAs:'deptCtrl',
        authenticate: true
      });
    $urlRouterProvider.when('/main/system/dept', '/main/system/dept/list');

  }

})();