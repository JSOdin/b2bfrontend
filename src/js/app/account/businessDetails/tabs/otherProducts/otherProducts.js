(function (window, angular) {
    angular.module('account.businessDetails')
        .directive('otherProducts', [function () {
            return {
                restrict: 'E',
                require:'^tabs',
                templateUrl: 'src/js/app/account/businessDetails/tabs/otherProducts/otherProducts.tmpl.html',
                link: function (scope, el, attrs,tabsCtrl) {

                }
            }
        }])
})(window, window.angular);