(function(window,angular){
    angular.module('app',['ui.router','ui.bootstrap',
        'authentication','inquiry','membership','common','dataTransformers','account','models'])
        .config(['$stateProvider','$urlRouterProvider','$compileProvider','$logProvider','$httpProvider',function($stateProvider,$urlRouterProvider,$compileProvider,$logProvider,$httpProvider){
            $stateProvider.state('home',{
                url:'/',
                views:{
                  'main@':{
                      templateUrl: 'src/js/app/home.tmpl.html'
                  },
                  'navbar@':{
                      templateUrl:'src/js/app/common/navbar/navbar.tmpl.html',
                      controller: 'navController as navCtrl'
                  }
                }
            });

            // "common" adds CSRF token to all request headers 
            // "post" adds it to post only.

            // toggle on/off if on firefox.
            $httpProvider.defaults.headers.common["X-CSRFToken"] = window.csrf_token;

            // DISREGARD
            /*$httpProvider.defaults.headers.post["X-CSRFToken"] = window.csrf_token;*/
            /*$httpProvider.defaults.xsrfCookieName = 'csrftoken';
            $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';*/
            $urlRouterProvider.otherwise('/')
            $logProvider.debugEnabled(false);
            $compileProvider.debugInfoEnabled(false);
        }])
        .controller('navController',['authService','tokenFactory',function(authService,tokenFactory){
            var navCtrl = this;

            if (tokenFactory.getToken() && !tokenFactory.checkExpiry()){
                tokenFactory.periodicRenewal();
            }

            navCtrl.isLoggedIn = authService.getLoggedinState();
            navCtrl.logout = function(){
                authService.logout();
                navCtrl.isLoggedIn = authService.getLoggedinState();
            }
        }])
})(window,window.angular);