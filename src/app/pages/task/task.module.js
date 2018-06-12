/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.task', [
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
              icon: 'ion-android-menu',
              order: 11,
            },
            authenticate: true
          })
          .state('main.taskDeal', {
            url: '/deal',
            title: '任务处理',
            templateUrl: 'app/pages/task/taskDeal.html',
            controller: 'TaskDealCtrl',
            params:{'row':null},
            authenticate: true
          });
    }
  
  })();
  