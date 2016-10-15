(function (window, angular) {
    angular.module('account.businessDetails')
        .directive('mainProducts', [function () {
            return {
                restrict: 'E',
                templateUrl: 'src/js/app/account/businessDetails/tabs/mainProducts/mainProducts.tmpl.html',
                link: function (scope, el, attrs,tabsCtrl) {
                    
                }
            }
        }])
})(window, window.angular);