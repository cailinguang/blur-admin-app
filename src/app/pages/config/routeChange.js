(function() {
  'use strict';

  angular.module('BlurAdmin.pages.config')
    .run(stateChangeStart);

  /** @ngInject */
  function stateChangeStart($rootScope, $state, localStorage) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
      var login = localStorage.getObject('dataUser');
      if (toState.authenticate && login==null) {
        // User isn’t authenticated
        $state.transitionTo("authSignIn");
        event.preventDefault();
      }
    });
  }

})();