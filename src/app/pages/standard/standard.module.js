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
        .state('main.standard.standardManage',{
          url:'/manage',
          templateUrl: 'app/pages/standard/standard/standardManage.html',
          params:{'row':null},
          controller: 'StandardManageCtrl',
          title:'管理标准库'
        })
        
        .state('main.standard.applicability',{
          url:'/applicability',
          templateUrl: 'app/pages/standard/applicability/applicabilityList.html',
          controller: 'ApplicabilityListCtrl',
          title: '适用性VDA管理库',
          sidebarMeta: {
            order: 200,
          },
          authenticate: true
        })
        .state('main.standard.applicabilityManage',{
          url:'/applicabilityManage',
          templateUrl: 'app/pages/standard/applicability/applicabilityManage.html',
          params:{'row':null},
          controller: 'ApplicabilityManageCtrl',
          title:'适用性VDA管理库'
        });

        $stateProvider.state('main.standard.evaluation',{
          url:'/evaluation',
          templateUrl: 'app/pages/standard/evaluation/evaluationList.html',
          controller: 'EvaluationListCtrl',
          title: '项目评审管理',
          sidebarMeta: {
            order: 200,
          },
          authenticate: true
        })
        .state('main.standard.evaluationManage',{
          url:'/evaluationManage',
          templateUrl: 'app/pages/standard/evaluation/evaluationManage.html',
          params:{'row':null},
          controller: 'EvaluationManageCtrl',
          title:'项目评审管理'
        });
    }
  
  })();
  