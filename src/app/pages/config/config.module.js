(function() {
  'use strict';

  angular.module('BlurAdmin.pages.config',[])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($httpProvider, jwtInterceptorProvider) {
    jwtInterceptorProvider.tokenGetter = function() {
      return localStorage.getItem('JWT');
    }
    $httpProvider.interceptors.push('jwtInterceptor');
    $httpProvider.interceptors.push(apiInterceptor);
    $httpProvider.defaults.headers.post={'Content-Type':undefined};
  }

   // api url prefix
    var API_URL = 'http://localhost:8080';

    function apiInterceptor ($q) {
      return {
        request: function (config) { 
          var url = config.url;

          // ignore template requests
          if (url.substr(url.length - 5) == '.html') {
            return config || $q.when(config);
          }

          config.url = API_URL + config.url;
          console.info(config)
          return config || $q.when(config);
        }
      }
    }
})();