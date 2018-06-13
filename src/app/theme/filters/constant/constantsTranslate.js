/**
 * @author a.demeshko
 * created on 23.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
    .filter('translate', ['Constants',translate]);

  /** @ngInject */
  function translate(Constants) {
    return function(value,constantsName) {
      var ary = Constants[constantsName];
      for(var i in ary){
          if(ary[i].value==value) return ary[i].label;
      }
      return value;
    };
  }

})();
