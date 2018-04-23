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

      $http.post('/login',{ username: vm.user, password: vm.passWord })
      .then(function(response){
        vm.loading = false;

        if(response.data.code==200){
          var token = response.data.data;

          var tokenPayload = jwtHelper.decodeToken(token);
          localStorage.setObject('dataUser', tokenPayload);
          localStorage.setObject('JWT', token);
          $state.go('main.dashboard');
        }else{
          toastr.warning(response.data.message, '登录异常');
        }
        
      },function(response){
          vm.loading = false;
      });

      
    }

  }

})();