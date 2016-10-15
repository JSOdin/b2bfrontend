(function (window, angular) {
    angular.module('account.businessDetails')
        .directive('productSalesDetail', [function () {
            return {
                restrict: 'E',
                scope:{
                  product:'='
                },
                templateUrl: 'src/js/app/account/businessDetails/tabs/mainProducts/productGallery/addProduct/productSalesDetail/productSalesDetail.tmpl.html',
                controller:'productSalesDetailController as productSalesDetailCtrl'
            }
        }])
        .controller('productSalesDetailController',['$scope','options','business','tokenFactory','products',function($scope,options,business,tokenFactory,products){
                // watch for changes in the products currentVariety model
                $scope.options = {};

                // initially
                $scope.variety = products.getCurrentVariety();

                $scope.$watch(function(){return products.getCurrentVariety()},function(newVal){
                    if (newVal){
                        $scope.variety = newVal;
                    }
                });

                options.getFields('general','SELLING_UNIT').then(function (data){
                    $scope.options.selling_units = data;
                    $scope.variety.selling_unit = $scope.product.selling_unit || $scope.options.selling_units[0];
                });

                // currency options
                options.getOptions('country').then(function (data){                   
                    $scope.options.countries = data;
                    $scope.variety.currency = $scope.variety.currency || $scope.options.countries[0];
                });

                business.getBusiness().then(function(data){
                    $scope.tax_codes = data.tax_list;
                    $scope.variety.tax_code = $scope.variety.tax_code || $scope.tax_codes[0];
                });
            
                // make function here that loops through all variations and varieties
                
                
        }])
})(window, window.angular);