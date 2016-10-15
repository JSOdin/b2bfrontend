(function(window,angular){
    angular.module('authentication',['authentication.login'])
            .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
                $stateProvider.state('authentication',{
                    url:'',
                    abstract:true
                });
                
            }])
})(window,window.angular);