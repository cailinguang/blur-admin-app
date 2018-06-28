/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.standard',['ngTreetable']).config(routeConfig);
  
    /** @ngInject */
    function routeConfig($stateProvider) {
      $stateProvider
        .state('main.standard',{
          url: '/standard',
          templateUrl: 'app/pages/standard/standardList.html',
          controller: 'StandardListCtrl',
          title: 'Management Standard Library',
          sidebarMeta: {
            icon: 'ion-briefcase',
            order: 20
          },
          authenticate: true
        })
        .state('main.standardManage',{
          url:'/manage',
          templateUrl: 'app/pages/standard/standardManage.html',
          params:{'row':null},
          controller: 'StandardManageCtrl',
          title:'Management Standard Library'
        });
    }
  
  })();
  