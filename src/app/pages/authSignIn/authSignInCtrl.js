(function() {
  'use strict';

  angular.module('BlurAdmin.pages.authSignIn')
    .controller('authSignInCtrl', authSignInCtrl);

  /** @ngInject */
  function authSignInCtrl($scope,$http,localStorage, $state,jwtHelper,toastr) {
    var vm = this;

    vm.logar = logar;

    init();

    function init() {
      localStorage.clear();
    }

    function logar() {
      vm.loading = true;

      $http.post('/api/login',{ username: vm.user, password: vm.passWord })
      .then(function(response){
        vm.loading = false;

        if(response.data.code==200){
          var token = response.data.data;
          localStorage.setObject('JWT', token);

          var tokenPayload = jwtHelper.decodeToken(token);

          var roles = [];
          var modules=['main.dashboard'];
          var authorities = tokenPayload.authorities.split(',');
          authorities.forEach(function(element) {
            if(element.startsWith('ROLE_')){
              roles.push(element.substr(5));
            }
            if(element.startsWith('AUTH_')){
              modules.push(element.substr(5));
            }
          });

          localStorage.setObject('dataRoles', roles);
          localStorage.setObject('dataModules', modules);
          $state.go('main.dashboard');
        }
        
      },function(response){
          vm.loading = false;
      });

      
    }

  }

})();