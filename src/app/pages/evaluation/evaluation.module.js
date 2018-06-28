/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.evaluation',['ngTreetable','BlurAdmin.pages.charts.chartJs']).config(routeConfig);
  
    /** @ngInject */
    function routeConfig($stateProvider) {

        $stateProvider.state('main.evaluation',{
          url:'/evaluation',
          templateUrl: 'app/pages/evaluation/evaluationList.html',
          controller: 'EvaluationListCtrl',
          title: 'Project Review Management',
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
          title:'Project Review Management'
        })
        .state('main.evaluationChart',{
          url:'/evaluationChart',
          templateUrl: 'app/pages/evaluation/evaluationChart.html',
          params:{'row':null},
          controller: 'EvaluationChartCtrl',
          title:'Project Review Management'
        });
    }
  
  
  })();
  