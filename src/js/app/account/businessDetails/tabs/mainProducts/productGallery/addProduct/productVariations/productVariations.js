(function (window, angular) {
    angular.module('account.businessDetails')
        .directive('productVariations', [function () {
            return {
                restrict: 'E',
                scope:{
                  product:'='  
                },
                templateUrl: 'src/js/app/account/businessDetails/tabs/mainProducts/productGallery/addProduct/productVariations/productVariations.tmpl.html',
                controller: 'productVariationsController as productVariationsCtrl'
            }
        }])
})(window, window.angular);