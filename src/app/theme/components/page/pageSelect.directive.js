

(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .directive('pageSelect',pageSelect)
    .directive('stRatio',ratio);

  /** @ngInject */
  function pageSelect() {
    return {
      restrict: 'E',
      template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
      link: function(scope, element, attrs) {
        scope.$watch('currentPage', function(c) {
          scope.inputPage = c;
        });
      }
    }
  }
  function ratio(){
    return {
      link:function(scope, element, attr){
        var ratio=+(attr.stRatio);
        
        element.css('width',ratio+'%');
        
      }
    };
  }

})();