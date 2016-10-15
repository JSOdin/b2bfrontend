(function (window, angular) {
    angular.module('account.businessProfile', [])
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider.state('home.account.businessProfile', {
                url: '/businessProfile',
                views:{
                    'profile@home.account':{
                        templateUrl:'src/js/app/account/businessProfile/businessProfile.tmpl.html',
                        controller: 'businessProfileController as businessProfileCtrl'
                    }
                }
            });
        }])
        .controller('businessProfileController',['business','options',function(business,options){
            var businessProfileCtrl = this;
            business.getBusiness().then(function(data){
                businessProfileCtrl.business = data;
            });

            options.getFields('general','INDUSTRY').then(function (data){
                businessProfileCtrl.industryOptions = data;
            });

            options.getFields('general','BUSINESS_CATEGORY').then(function (data){
                businessProfileCtrl.businessCategoriesOptions = data;
            });
        }]);

})(window, window.angular);