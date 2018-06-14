/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.evaluation',['ngTreetable']).config(routeConfig);
  
    /** @ngInject */
    function routeConfig($stateProvider) {

        $stateProvider.state('main.evaluation',{
          url:'/evaluation',
          templateUrl: 'app/pages/evaluation/evaluationList.html',
          controller: 'EvaluationListCtrl',
          title: '项目评审管理',
          sidebarMeta: {
            icon: 'ion-android-checkbox-outline',
            order: 22
          },
          authenticate: true
        })
        .state('main.evaluationManage',{
          url:'/evaluationManage',
          templateUrl: 'app/pages/evaluation/evaluationManage.html',
          params:{'row':null},
          controller: 'EvaluationManageCtrl',
          title:'项目评审管理'
        });
    }
  
  })();
  