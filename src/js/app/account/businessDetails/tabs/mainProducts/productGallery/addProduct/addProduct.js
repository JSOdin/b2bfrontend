(function (window, angular) {
    angular.module('account.businessDetails')
        .directive('addProduct', ['modal','products',function (modal,products) {
            return {
                restrict: 'E',
                transclude: true,
                require:'^tabs',
                templateUrl: 'src/js/app/account/businessDetails/tabs/mainProducts/productGallery/addProduct/addProduct.tmpl.html',
                link: function (scope, el, attrs, tabsCtrl) {
                    /*var defaultData = products.defaultProduct;*/

                    // let server know if any id fields are empty, it should create a new record.                   
                    scope.openModal = function(){
                        modal.openModal('m',products.data.creationModel,'writeProduct');
                    }
                }
            }
        }])
})(window, window.angular);