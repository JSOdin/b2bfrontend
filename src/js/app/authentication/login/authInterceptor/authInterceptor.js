(function(window,angular){
    angular.module('authentication.login.authInterceptor',[])           
            .factory('authInterceptor',['tokenFactory',function(tokenFactory){
                    return {
                        addToken: addToken
                    }
                
                    function addToken(config){
                        var token = tokenFactory.getToken();
                        if (token){
                            config.headers = config.headers || {};
                            config.headers.Authorization = 'Bearer' + token;
                        }
                        
                        return config;
                    }
            }])
       
})(window,window.angular);