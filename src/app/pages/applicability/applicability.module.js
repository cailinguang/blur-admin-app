/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.applicability',['ngTreetable']).config(routeConfig);
  
    /** @ngInject */
    function routeConfig($stateProvider) {
      $stateProvider
        .state('main.applicability',{
          url:'/applicability',
          templateUrl: 'app/pages/applicability/applicabilityList.html',
          controller: 'ApplicabilityListCtrl',
          title: '适用性VDA管理库',
          sidebarMeta: {
            icon: 'ion-arrow-expand',
            order: 21
          },
          authenticate: true
        })
        .state('main.applicabilityManage',{
          url:'/applicabilityManage',
          templateUrl: 'app/pages/applicability/applicabilityManage.html',
          params:{'row':null},
          controller: 'ApplicabilityManageCtrl',
          title:'适用性VDA管理库'
        });

        
    }
  
  })();
  