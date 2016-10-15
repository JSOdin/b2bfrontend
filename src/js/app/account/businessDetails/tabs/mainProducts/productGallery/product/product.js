(function (window, angular) {
    angular.module('account.businessDetails')
        .directive('product', ['modal','tabsService',function (modal,tabsService) {
            return {
                restrict: 'E',
                transclude: true,
                scope:{
                  product:'='  
                },
                templateUrl: 'src/js/app/account/businessDetails/tabs/mainProducts/productGallery/product/product.tmpl.html',
                link: function (scope, el, attrs) {
                    scope.openModal = function(data){
                        modal.openModal('m',data,'writeProduct');
                    }

                    scope.openModalImages = function(data){
                        tabsService.selectTab({"name":"Images"});
                        console.log(tabsService.tabs);
                        modal.openModal('m',data,'writeProduct','images');
                    }
                }
            }
        }])
})(window, window.angular);