(function () {
    'use strict';
  
    angular.module('BlurAdmin.theme')
        .directive('tooltip', tooltip);
  
    /** @ngInject */
    function tooltip($timeout, $parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                element.hover(function(){
                    // on mouseenter
                    element.tooltip('show');
                }, function(){
                    // on mouseleave
                    element.tooltip('hide');
                });
            }
        };
    }
  
  })();