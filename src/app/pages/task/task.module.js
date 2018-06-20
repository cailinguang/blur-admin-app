/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.task', ['angularFileUpload'
    ]).config(routeConfig);
  
    /** @ngInject */
    function routeConfig($stateProvider) {
      $stateProvider
        .state('main.task', {
            url: '/task',
            title: '任务处理',
            templateUrl: 'app/pages/task/taskList.html',
            controller: 'TaskListCtrl',
            sidebarMeta: {
              icon: 'ion-clipboard',
              order: 30,
            },
            authenticate: true
          })
          .state('main.taskDeal', {
            url: '/deal',
            title: '任务处理-处理',
            templateUrl: 'app/pages/task/taskDeal.html',
            controller: 'TaskDealCtrl',
            params:{'row':null},
            authenticate: true
          })
          .state('main.taskView', {
            url: '/view',
            title: '任务处理-查看任务',
            templateUrl: 'app/pages/task/taskView.html',
            controller: 'TaskViewCtrl',
            params:{'row':null},
            authenticate: true
          })
          .state('main.taskLog',{
            url:'/log',
            templateUrl: 'app/pages/task/taskLog.html',
            params:{'row':null},
            controller: 'TaskLogCtrl',
            title:'任务处理-审计日志'
          });
    }
  
  })();
  