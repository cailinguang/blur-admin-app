/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.standard', [
    ]).config(routeConfig);
  
    /** @ngInject */
    function routeConfig($stateProvider) {
      $stateProvider
        .state('main.standard', {
          url: '/standard',
          template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          abstract: true,
          title: '标准库',
          sidebarMeta: {
            icon: 'ion-folder',
            order: 11,
          },
          authenticate: true
        })
        .state('main.standard.standard',{
          url: '/standard',
          templateUrl: 'app/pages/standard/standard/standardList.html',
          controller: 'StandardListCtrl',
          title: '管理标准库',
          sidebarMeta: {
            order: 200,
          },
          authenticate: true
        })
        .state('main.standard.manage',{
          url:'/manage',
          templateUrl: 'app/pages/standard/standard/standardManage.html',
          params:{'row':null},
          controller: 'StandardManageCtrl',
          title:'管理标准库'
        });

        $stateProvider.state('main.standard.applicability',{
          url:'/applicability',
          templateUrl: 'app/pages/standard/applicability/applicabilityList.html',
          controller: 'ApplicabilityListCtrl',
          title: '适用性VDA管理库',
          sidebarMeta: {
            order: 200,
          },
          authenticate: true
        })
        .state('main.standard.demo',{
          url:'/demo',
          templateUrl: 'app/pages/standard/applicability/demo.html',
          params:{'row':null},
          controller: 'DemoCtrl'
        });
    }
  
  })();
  