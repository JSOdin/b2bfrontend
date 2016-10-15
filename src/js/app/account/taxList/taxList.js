(function (window, angular) {
    angular.module('account.taxList', [])
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider.state('home.account.taxList', {
                url: '/taxList',
                views:{
                    'profile@home.account':{
                        templateUrl:'src/js/app/account/taxList/taxList.tmpl.html',
                        controller: 'taxListController as taxListCtrl'
                    }
                }
            });
        }])
        .controller('taxListController',['business','tokenFactory',function(business,tokenFactory){
            var taxListCtrl = this;
            taxListCtrl.business = {};
            business.getBusiness(tokenFactory.getToken()).then(function(data){
                taxListCtrl.business = data;
            })
        }])
    
})(window, window.angular);