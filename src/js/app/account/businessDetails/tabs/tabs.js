(function (window, angular) {
    angular.module('account.businessDetails')
        .directive('tabs',[function(){
            return {
                restrict:'E',
                transclude:true,
                templateUrl:'src/js/app/account/businessDetails/tabs/tabs.tmpl.html',
                controller: 'tabsController as tabsCtrl',
                link:function(scope,el,attrs){

                }
            }
        }])
        .controller('tabsController',['tabsService','$attrs','$scope',function(tabsService,$attrs,$scope){
            var tabsCtrl = this;
            if ($attrs.useService == "true"){

                // need to reset the services tabs or it will keep push duplicate tabs;
                // technically, resetting the array won't destroy scopes because we are only resetting LINKS (references) to tab scopes.
              
               tabsService.tabs[$attrs.moduleName] = [];
                tabsCtrl.tabs =  tabsService.tabs[$attrs.moduleName];
            } else {
                tabsCtrl.tabs = [];
            }

            tabsCtrl.addTab = function(tab){
                if (!tabsCtrl.tabs.length){
                    tab.selected = true;
                }

                tabsCtrl.tabs.push(tab);
            }
     
            tabsCtrl.selectTab = tabsService.selectTab;
        }])    
})(window, window.angular);

// the tabs directive is used in multiple places
// each directive instance will make its own controller instance.
// by setting use-service attribute on the tabs element, we can delegate tabs storage to a service called tabsService, instead of storing the tabs on the controller.
// for now this is used only for the modal for edit product module.
// tabsService allows controllers to switch from tab to tab programmatically without the user having to click on each tab.