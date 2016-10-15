(function(window,angular){
    angular.module('authentication.login.tokenFactory',[])
        .config(['$httpProvider',function($httpProvider){

            // http://stackoverflow.com/questions/14681654/i-need-two-instances-of-angularjs-http-service-or-what
            // https://github.com/alexcrack/angular-ui-notification/issues/32
            // https://github.com/witoldsz/angular-http-auth/issues/42
            // http://stackoverflow.com/questions/20647483/angularjs-injecting-service-into-a-http-interceptor-circular-dependency
            // $injector cannot correctly inject some services to interceptors
            $httpProvider.interceptors.push(function ($location, $injector) {
                return {
                    'request': function (config) {
                        //injected manually to get around circular dependency problem.
                        var authInterceptor = $injector.get('authInterceptor');
                        return authInterceptor.addToken(config);
                    }
                }});
        }])
        .factory('tokenFactory',['$window','$http','$interval','$state',function tokenFactory($window,$http,$interval,$state){
            var store = $window.localStorage;
            var key = 'authToken';
            var authCache;
            // 1 week in milliseconds;
            var duration = 604800000;
            var timerObj = {};

            return {
                setToken:setToken,
                getToken:getToken,
                checkExpiry:checkExpiry,
                renewToken: renewToken,
                periodicRenewal: periodicRenewal
            }

            function setToken(token){
                if (token){
                    authCache =  deserialize(store.getItem(key));
                    authCache.token = token;
                    setExpiry(authCache,duration);
                    console.log(token);
                    authCache = serialize(authCache);

                    // setItem and getItem should be factored out into $localstorage for modularity sake
                    store.setItem(key, authCache);
                } else{
                    store.removeItem(key);
                }
            }

            function getToken(){
                authCache =  deserialize(store.getItem(key));
                return authCache.token
            }

            function setExpiry(cache, duration){
                // set how long the token should last.
                cache.expiry = new Date(new Date().getTime() + duration);
            }

            // these should be factored out into their own $localstorage factory.
            function serialize(obj){
                return JSON.stringify(obj || {});
            }

            function deserialize(objStr){
                return JSON.parse(objStr || '{}');
            }

            function checkExpiry(){
                return makeDate(deserialize(store.getItem(key)).expiry).getTime() < new Date().getTime();
            }

            function makeDate(dateStr){
                return new Date(dateStr);
            }

            function periodicRenewal(){
                // set an interval whenever you log in , or launch the app and token is alive

                $interval.cancel(timerObj.timer)

                return timerObj.timer = $interval(renewToken,3600000);
            }

            // for refreshing tokens after login.
            function renewToken(){
                $http.get('http://localhost:3000/renewToken').then(function(res){
                    setToken(res.data);
                })
            }
        }])
})(window,window.angular);