(function(window,angular){
    angular.module('authentication.login')
        .factory('authService',['$http','$window',function($http,$window){
            var registrationData = {};
            var store = $window.localStorage;
            var key = 'logged-in-state';

            return {
                clearRegistrationData: clearRegistrationData,
                getRegistrationData:getRegistrationData,
                setRegistrationData:setRegistrationData,
                submitRegistrationData: submitRegistrationData,
                login:login,
                logout: logout,
                validateEmail:validateEmail,
                setLoggedinState:setLoggedinState,
                getLoggedinState:getloggedinState,
                loggedinState: false
            }
            
            function login(userData){               
                return $http.post('http://localhost:3000/login',userData)           // this would be the login endpoint TODO need to implement JWT
            }
            
            function validateEmail(userData){
                console.log(userData);
                return $http.post('http://localhost:3000/validateEmail',userData).then(function(){
                    // cache the email here.

                    // in case of refreshing browser, we keep the registration data. TODO refactor out localstorage
                    var registrationData = store.getItem('registrationCache') || '{}';
                    var registrationObj = JSON.parse(registrationData);
                    registrationObj.email = userData.email;                                        
                })
            }

            function getRegistrationData(key){
                return key ? registrationData[key] : registrationData;
            }

            function setRegistrationData(key,data){
                if (!key){
                    return registrationData;
                }
                return registrationData[key] = data;
            }
            
            function clearRegistrationData(){
                for (var prop in registrationData){
                    if (registrationData.hasOwnProperty(prop)){
                        delete registrationData[prop];
                    }                    
                }
            }

            function submitRegistrationData (){
                console.log(registrationData);
                return $http.post('http://localhost:3000/submitRegistration',registrationData);
            }
            
            function getloggedinState(){
                return this.loggedinState || store.getItem(key);
            }

            function setLoggedinState(state){
                store.setItem(key,state);      
                this.loggedinState = state;
            }
            
            function logout(){
                store.removeItem(key);
                this.loggedinState = false;
            }
        }])
})(window,window.angular);