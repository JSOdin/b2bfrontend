(function (window, angular) {
    angular.module('account.businessDetails')
        .factory('tabsService',[function(){
            var tabs = {};

            return {
                tabs:tabs,
                selectTab:function(tab, moduleName){
                    var tabsCollection
                    // moduleName will be specified if use-service is true on the template. else we use the cont
                    
                    if (moduleName){                        
                        tabsCollection = tabs[moduleName];
                    } else {
                        tabsCollection = this.tabs;
                    }

                    angular.forEach(tabsCollection,function(ea){
                        ea.selected = (tab.name == ea.name);
                    });
                }
            }
        }])
})(window, window.angular);

// the tabs directive is used in multiple places
// each directive instance will make its own controller instance. 
// by setting use-service attribute on the tabs element, we can delegate tabs storage to a service called tabsService, instead of storing the tabs on the controller.
// for now this is used only for the modal for edit product module. 
// tabsService allows controllers to switch from tab to tab programmatically without the user having to click on each tab.