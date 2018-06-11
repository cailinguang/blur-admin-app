(function() {
  'use strict';

  angular.module('BlurAdmin.pages.config')
    .run(stateChangeStart);

  /** @ngInject */
  function stateChangeStart($rootScope, $state, localStorage,jwtHelper) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
      var token = localStorage.getObject('JWT');
      if (toState.authenticate && ( !angular.isString(token) || jwtHelper.isTokenExpired(token) ) ) {
        // User isn’t authenticated
        $state.transitionTo("authSignIn");
        event.preventDefault();
      }
    });
  }

})();