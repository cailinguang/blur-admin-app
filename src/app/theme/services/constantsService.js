(function () {
    'use strict';
  
    angular.module('BlurAdmin.theme')
        .config(config);
  
    /** @ngInject */
    function config($provide) {

        $provide.factory('Constants', function(){
            return {
                evaluationType:[
                    {label:'自评性质',value:'1'},
                    {label:'内审性质',value:'2'}
                ],
                standardType:[
                    {label:'VDA',value:'vda'}
                ]

            };
        });

    }
  })();
  