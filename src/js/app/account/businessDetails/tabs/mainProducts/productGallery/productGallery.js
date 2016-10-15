(function (window, angular) {
    angular.module('account.businessDetails')
        .directive('productGallery', ['products',function (products) {
            return {
                restrict: 'E',
                transclude: true,
                template: '<div ng-transclude class="row"></div>',
                link: function (scope, el, attrs) {
                    products.getProducts().then(function successCallback(data){
                        scope.products = data;
                    })
                }
            }
        }])
})(window, window.angular);