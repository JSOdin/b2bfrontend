(function(window,angular){
    angular.module('authentication.login',['authentication.login.formValidation','authentication.login.tokenFactory','authentication.login.authInterceptor'])

        .config(['$stateProvider','$urlRouterProvider','$httpProvider',function($stateProvider,$urlRouterProvider,$httpProvider){
            $stateProvider.state('authentication.login',{
                url:'/auth/login',
                views:{
                    'main@':{
                        templateUrl:'src/js/app/authentication/login/login.tmpl.html',
                        controller: 'loginController as loginCtrl'
                    },
                    'navbar@':{
                        templateUrl:'src/js/app/common/navbar/navlessnav.tmpl.html'
                    }
                }
            });

        }])
        .controller('loginController',['$scope','$http','$timeout','authService','tokenFactory','$state',function($scope,$http,$timeout,authService,tokenFactory,$state){
            var loginCtrl = this;

            // TODO refactor this into its own factory
            // TODO implement JWT
            // JWT is an encoded javascript object digitally signed by the server which the client sends with every request to identify the user
            loginCtrl.stuff = 'jack'

            loginCtrl.login = function(){
                var userData = {
                    email:loginCtrl.user,
                    password:loginCtrl.password
                };
                authService.login(userData).then(function success(res){
                    authService.setLoggedinState(true);
                    if (res.data){
                        console.log(res.data);
                        tokenFactory.setToken(res.data);
                        tokenFactory.periodicRenewal();
                    }
                    $state.go('home');
                },function errCb(res){
                    loginCtrl.displayError = true;
                    loginCtrl.didCallHttp = true;
                    loginCtrl.password = '';
                    if (res.data && res.data){
                        loginCtrl.errorMessage = res.data;
                    }
                    fadeOut();
                })
            }

            loginCtrl.removeError=function(){
                loginCtrl.displayError = false;
            };

            function fadeOut(){
                $timeout(function timer(){
                    loginCtrl.displayError = false;
                },3000);
            }
        }])
})(window,window.angular);