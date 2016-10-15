(function(window,angular){
    angular.module('inquiry.compare',['inquiry.compare.gallery','inquiry.compare.productFeatures','inquiry.compare.supplierDetails'])
        .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
            $stateProvider.state('inquiry.compare',{
               url:'/inquiry/compare',
                views:{
                    'main@':{
                        templateUrl:'src/js/app/inquiry/compare/compare.tmpl.html',
                        controller:'compareController as compCtrl'
                    }
                }
            });

        }])
        .controller('compareController',['$scope',function CompareController($scope){
            $scope.names = {};
            $scope.names['first'] = 'gallery';
            $scope.names['second'] = 'product details';
            $scope.names['third'] = 'supplier details';
        }])
})(window,window.angular);