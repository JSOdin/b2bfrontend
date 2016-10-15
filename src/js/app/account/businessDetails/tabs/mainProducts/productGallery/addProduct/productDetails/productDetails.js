// Add product box with the plus icon

(function (window, angular) {
    angular.module('account.businessDetails')
        .directive('productDetails', ['options','tokenFactory',function (options,tokenFactory) {
            return {
                restrict: 'E',
                scope:{
                    product:'='
                },
                templateUrl: 'src/js/app/account/businessDetails/tabs/mainProducts/productGallery/addProduct/productDetails/productDetails.tmpl.html',
                link: function (scope, el, attrs) {
                    scope.options = {};
                    // initial setup of form dropdown fields                
                    options.getFields('general','STORAGE').then(function (data){
                        console.log(data);
                        scope.options.storages = data;
                        scope.product.storage = scope.product.storage || scope.options.storages[0];
                    });

                    options.getFields('general','SHELF_LIFE').then(function (data){
                        scope.options.shelf_lifes = data;
                        scope.product.shelf_life = scope.product.shelf_life || scope.options.shelf_lifes[0];
                    });

                    options.getOptions('country').then(function (data){
                        console.log(scope.product.origin);
                        scope.options.origins = data;
                    });

                    // TODO perhaps put this right in the default product model instead of here.
                    scope.product.origin = scope.product.origin || {"id":tokenFactory.getToken().country};

                }
            }
        }])
})(window, window.angular);