describe('test Token Factory',function(){
    beforeEach(module('authentication.login.tokenFactory'));
    var tokenFactory;
    beforeEach(inject(function(_tokenFactory_){
        tokenFactory = _tokenFactory_;
    }))
    
    it('should set a token in localStorage',function(){
        tokenFactory.setToken('werlkjwelknflkwenkln3l2k4nl32k4l3k2j4lknlfkn23klkln23kl4nkl2');
        expect(tokenFactory.getToken()).toBe('werlkjwelknflkwenkln3l2k4nl32k4l3k2j4lknlfkn23klkln23kl4nkl2')
    })
})