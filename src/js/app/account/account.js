(function (window, angular) {
    angular.module('account', ['account.businessProfile','account.accountProfile','account.businessDetails','account.taxList'])
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider.state('home.account', {
                url: 'account',
                abstract:true,
                views :{
                    'main@':{
                        templateUrl: 'src/js/app/account/account.tmpl.html',
                        controller: 'accountController as accountCtrl'
                    }
                }
            });
        }])
        .directive('bodyColor',['$state',function($state){
            return function(scope,el,attrs){
                var body = document.getElementsByTagName('body')[0];
                body = angular.element(body);
                if ($state.current.name == 'home.account.businessProfile'){
                    body.css('background-color','#eceef2');
                } else {
                    body.css('background-color','white');
                }
            }
        }])
        .controller('accountController',['$state',function($state){
            var accountCtrl = this;
            accountCtrl.pages = [
                {'_id':'01','display':'Business Profile','state':'home.account.businessProfile','selected':false},
                {'_id':'02','display':'Account Profile','state':'home.account.accountProfile','selected':false},
                {'_id':'03','display':'Business Details','state':'home.account.businessDetails','selected':false},
                {'_id':'04','display':'Tax List','state':'home.account.taxList','selected':false},
                {'_id':'05','display':'Business Certificates','state':'home.account.images','selected':false}
            ];
            
            accountCtrl.$state = $state;

            accountCtrl.highlightAndState = function(page,e){
                e.preventDefault();
                accountCtrl.pages.selected = page;
                $state.go(page.state);
            }
                        
        }])
})(window, window.angular);