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
    $httpProvider.interceptors.push(requestErrorHandler);
    $httpProvider.defaults.headers.post={'Content-Type':undefined};
    $httpProvider.defaults.headers.put={'Content-Type':undefined};
  }

   // api url prefix
    var API_URL = 'http://localhost:8080';

    function apiInterceptor ($q) {
      return {
        request: function (config) { 
          var url = config.url;

          // ignore template requests
          if (url.substr(url.length - 5) == '.html' || url.startsWith('http')) {
            return config || $q.when(config);
          }

          config.url = API_URL + config.url;
          return config || $q.when(config);
        }
      }
    }

    /** @ngInject */
    function requestErrorHandler($rootScope, $q,$injector) {

      return {
          'request': function(config) {
              // console.log('request:' + config);
              return config || $q.when(config);
          },
          'requestError': function(rejection) {
              // console.log('requestError:' + rejection);
              return rejection;
          },
          //success -> don't intercept
          'response': function(response) {
              var toastr = $injector.get('toastr');
              // console.log('response:' + response);
              if(response.data.code === 500){
                  toastr.error(response.data.message, '系统异常');
              }
              else if (response.data.code === 403) {
                  
              }

              return  response || $q.when(response);
          },
          //error -> if 401 save the request and broadcast an event
          'responseError': function(response) {
             var toastr = $injector.get('toastr');
              console.log('responseError:' + response);
              if(response.status < 0){
                toastr.error("请稍后重试或者联系管理员", '网络异常');
              }
              return $q.reject(response);
          }

      };
  }

})();