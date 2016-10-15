(function (window, angular) {
    angular.module('account.businessDetails')
        .directive('tab', [function () {
            return {
                restrict: 'E',
                require:'^tabs',
                scope :{
                  name:'@'                
                },
                transclude: true,
                template:'<div ng-show="selected" ng-transclude></div>',
                link: function (scope, el, attrs,tabsCtrl) {
                    tabsCtrl.addTab(scope);
                 /*   el.bind('click',function(){
                        console.log('rwerelwkrjlwe')
                        tabsCtrl.selectTab(scope);
                    })*/
                }
            }
        }])
})(window, window.angular);