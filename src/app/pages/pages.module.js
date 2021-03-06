/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
      'ui.router',
      'ui.select',
      'blockUI',
      'BlurAdmin.pages.services',
      'BlurAdmin.pages.config',
      'BlurAdmin.pages.main',
      'BlurAdmin.pages.dashboard',
      'BlurAdmin.pages.charts',
      'BlurAdmin.pages.profile',
      'BlurAdmin.pages.authSignIn',
      'BlurAdmin.pages.authSignUp',
      'BlurAdmin.pages.system',
      'BlurAdmin.pages.standard',
      'BlurAdmin.pages.applicability',
      'BlurAdmin.pages.evaluation',
      'BlurAdmin.pages.task'
    ])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider,blockUIConfig) {
    $urlRouterProvider.otherwise('/authSignIn');

    /* baSidebarServiceProvider.addStaticItem({
      title: 'Pages',
      icon: 'ion-document',
      subMenu: [{
        title: 'Sign In',
        fixedHref: 'auth.html',
        blank: true
      }, {
        title: 'Sign Up',
        fixedHref: 'reg.html',
        blank: true
      }, {
        title: 'User Profile',
        stateRef: 'profile'
      }, {
        title: '404 Page',
        fixedHref: '404.html',
        blank: true
      }]
    });
    baSidebarServiceProvider.addStaticItem({
      title: 'Menu Level 1',
      icon: 'ion-ios-more',
      subMenu: [{
        title: 'Menu Level 1.1',
        disabled: true
      }, {
        title: 'Menu Level 1.2',
        subMenu: [{
          title: 'Menu Level 1.2.1',
          disabled: true
        }]
      }]
    }); */

    // Disable automatically blocking of the user interface
    blockUIConfig.autoBlock = false;
  }

})();
