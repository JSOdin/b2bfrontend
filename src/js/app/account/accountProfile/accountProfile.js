(function (window, angular) {
    angular.module('account.accountProfile', [])
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider.state('home.account.accountProfile', {
                url: '/accountProfile',
                views:{
                    'profile@home.account':{
                        templateUrl:'src/js/app/account/accountProfile/accountProfile.tmpl.html',
                        controller: 'accountProfileController as accountProfileCtrl'
                    }
                }
            });
        }])
        .controller('accountProfileController',['business','options','$q','$http',function(business,options,$q,$http){
            var accountProfileCtrl = this
            var validationMessages = {
                "currentPassword":'Invalid password',
                "matchPassword":"Your passwords don't match.",
                "changePasswordComplete":"Changed SuccessFully"
            };

            accountProfileCtrl.validation = {};

            business.getBusiness().then(function(data){
                console.log(accountProfileCtrl.business);
                accountProfileCtrl.business = data;
                // temporary model for the full name. databse only has firstname and lastname
                accountProfileCtrl.fullname = accountProfileCtrl.business.business_registrant.registrant.first_name + accountProfileCtrl.business.business_registrant.registrant.last_name;
            });

            options.getFields('general','DEPARTMENT').then(function (data){
                accountProfileCtrl.departmentsOptions = data;
            });

            accountProfileCtrl.activateChangePassword = function(){
                accountProfileCtrl.isChangePassword = !accountProfileCtrl.isChangePassword;
            }

            accountProfileCtrl.changePassword = function(){
                // error messages are chained until the end;
                // http://stackoverflow.com/questions/20714460/break-promise-chain-and-call-a-function-based-on-the-step-in-the-chain-where-it
                var validation = accountProfileCtrl.validation;
                clearValidationObj(validation);

                if (!validateMatchingPasswords()){
                    return validation['matchPassword'] = validationMessages["matchPassword"];
                }

                if (!accountProfileCtrl.currentPassword){
                    return validation['currentPassword'] = validationMessages["currentPassword"];
                }

                $http.post('http://localhost:3000/checkCurrentPassword',{password: accountProfileCtrl.currentPassword}).then(function(){
                    clearValidationObj(validation);
                    accountProfileCtrl.activateChangePassword();
                    accountProfileCtrl.validation['changePasswordComplete']= validationMessages['changePasswordComplete'];
                },function(){
                    validation['currentPassword'] = validationMessages["currentPassword"];
                })
            }

            function validateMatchingPasswords() {
                return (accountProfileCtrl.newPassword == accountProfileCtrl.confirmPassword);
            }

            function clearValidationObj(validation){
                for (var prop in validation){
                    if (validation.hasOwnProperty(prop)){
                        validation[prop] = '';
                    }
                }
            }


        }])
})(window, window.angular);