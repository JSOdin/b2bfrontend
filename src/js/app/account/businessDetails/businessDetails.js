(function (window, angular) {
    angular.module('account.businessDetails', [])
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider.state('home.account.businessDetails', {
                url: '/businessDetails',
                views:{
                    'profile@home.account':{
                        templateUrl:'src/js/app/account/businessDetails/businessDetails.tmpl.html'
                    }
                }
            });
        }]);
})(window, window.angular);