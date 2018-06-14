(function() {
  'use strict';

  angular.module('BlurAdmin.pages.config',[])

    .factory('RouteServcie',function(){
      var API_URL = 'http://localhost:8080';
      return {
        api_url: API_URL,
        getUrl: function(url){
            return API_URL+url;
        }
      }
    })

    .directive('routeHref', routeHref)

    .config(routeConfig);

  /** @ngInject */
  function routeConfig($httpProvider, jwtInterceptorProvider) {
    jwtInterceptorProvider.tokenGetter = function() {
      return localStorage.getItem('JWT');
    }
    $httpProvider.interceptors.push('jwtInterceptor');
    $httpProvider.interceptors.push(apiInterceptor);
    $httpProvider.interceptors.push(requestErrorHandler);
    // $httpProvider.defaults.headers.post={'Content-Type':undefined};
    // $httpProvider.defaults.headers.put={'Content-Type':undefined};
    // $httpProvider.defaults.headers.get={'Content-Type':undefined};
  }

   // api url prefix
    function apiInterceptor ($q,RouteServcie) {
      return {
        request: function (config) {
          var url = config.url;

          // ignore template requests
          if (url.substr(url.length - 5) == '.html' || url.startsWith('http')) {
            return config || $q.when(config);
          }

          config.url = RouteServcie.getUrl(config.url);
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
                  toastr.error(response.data.message, '错误');
              }
              else if (response.data.code === 403) {
                toastr.warning(response.data.message, '禁止访问');
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

    /** @ngInject */
    function routeHref(RouteServcie) {
      var link =function($scope, $element, $attrs){
        $attrs.$observe('routeHref', function(routeHref) {
          $element.attr('href', RouteServcie.getUrl(routeHref));
        });
      }
      return {
        restrict: 'A',
        link:link
      };
    }
})();