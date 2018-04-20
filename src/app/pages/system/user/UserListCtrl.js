(function () {
    'use strict';
  
    angular.module('BlurAdmin.pages.system.user')
        .controller('UserListCtrl', UserListCtrl)
        .directive('stRatio',stRatio);
    /** @ngInject */
    function UserListCtrl($http,composeModal, mailMessages) {
        var vm = this;
        var nameList = ['Pierre', 'Pol', 'Jacques', 'Robert', 'Elisa'],
          familyName = ['Dupont', 'Germain', 'Delcourt', 'bjip', 'Menez'];

        function createRandomItem() {
            var
                firstName = nameList[Math.floor(Math.random() * 4)],
                lastName = familyName[Math.floor(Math.random() * 4)],
                age = Math.floor(Math.random() * 100),
                email = firstName + lastName + '@whatever.com',
                balance = Math.random() * 3000;

            return{
                firstName: firstName,
                lastName: lastName,
                age: age,
                email: email,
                balance: balance
            };
        }

        $http.post('/user/list').then(function(response){
            console.info(response);
        });


        vm.displayed = [];
        for (var j = 0; j < 500; j++) {
            vm.displayed.push(createRandomItem());
        }
    }

    function stRatio(){
        return {
          link:function(scope, element, attr){
            var ratio=+(attr.stRatio);
            
            element.css('width',ratio+'%');
            
          }
        };
    }
  
})();