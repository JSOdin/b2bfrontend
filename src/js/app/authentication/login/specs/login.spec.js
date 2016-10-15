describe('loginModule',function(){
    beforeEach(module('ui.router'))
    beforeEach(module('authentication.login'));
    var loginCtrl;
    var scope;
    beforeEach(inject(function($controller, $rootScope){
        scope = $rootScope.$new();
        loginCtrl = $controller('loginController',{
           $scope:scope
        });
       
    }));
    
    describe('test some scope objects',function(){
        it('login.stuff should be jack',function(){
            expect(loginCtrl.stuff).toBe('jack');
        })
    });
    
    describe('display error box',function(){
        it('error box should be hidden at the end of http call',function(){
            loginCtrl.login().then(function(){
                expect(loginCtrl.didCallHttp).toBe(true);
                expect(loginCtrl.displayError).toBe(false);
            });            
        })
    })
})