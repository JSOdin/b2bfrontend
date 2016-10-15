(function (window, angular) {
    angular.module('membership', ['membership.registration'])
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider.state('membership', {
                url:'',
                abstract:true
            });
        }]);
})(window, window.angular);