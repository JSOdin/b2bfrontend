(function (window, angular) {
    angular.module('membership.registration', [])
        .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider,$httpProvider) {
            $stateProvider.state('membership.register', {
                url: '/registration',
                abstract:true,
                views:{
                    'main@':{
                        templateUrl:'src/js/app/membership/registration/registration.tmpl.html',
                        controller:'registrationController as registrationCtrl'
                    },
                    'navbar@':{
                        templateUrl:'src/js/app/common/navbar/navlessnav.tmpl.html'
                    }
                }
            });

            $stateProvider.state('membership.register.verifyBusinessEmail',{
                url:'/verifyEmail',
                views :{
                    'form@membership.register':{
                        templateUrl: 'src/js/app/membership/registration/verifyEmail/verifyEmail.tmpl.html'
                    },
                    'progressBar@membership.register':{
                        templateUrl: 'src/js/app/membership/registration/progressBarBusiness.tmpl.html'
                    }
                }
            });

            $stateProvider.state('membership.register.verifyPersonalEmail',{
                url:'/verifyPersonalEmail',
                views :{
                    'form@membership.register':{
                        templateUrl: 'src/js/app/membership/registration/verifyEmail/verifyEmail.tmpl.html'
                    },
                    'progressBar@membership.register':{
                        templateUrl: 'src/js/app/membership/registration/progressBarPersonal.tmpl.html'
                    }
                }
            });

            $stateProvider.state('membership.register.pickRegistrationType',{
                url:'/pickRegistrationType',
                views :{
                    'form@membership.register':{
                        templateUrl: 'src/js/app/membership/registration/pickRegistrationType/pickRegistrationType.tmpl.html'
                    }
                }
            });

            $stateProvider.state('membership.register.businessDetails',{
                url:'/businessDetails',
                views :{
                    'form@membership.register':{
                        templateUrl: 'src/js/app/membership/registration/businessDetails/businessDetails.tmpl.html'
                    },
                    'progressBar@membership.register':{
                        templateUrl: 'src/js/app/membership/registration/progressBarBusiness.tmpl.html'
                    }
                }
            });

            $stateProvider.state('membership.register.personalDetails',{
                url:'/personaDetails',
                views :{
                    'form@membership.register':{
                        templateUrl: 'src/js/app/membership/registration/personalDetails/personalDetails.tmpl.html'
                    },
                    'progressBar@membership.register':{
                        templateUrl: 'src/js/app/membership/registration/progressBarPersonal.tmpl.html'
                    }
                }
            });

        }])    
        .controller('registrationController',['$state','$scope','authService','options','$window',function($state,$scope,authService,options,$window){
            /// TODO refactor all this stuff into their own modules/files
            /// TODO regex email pattern proper
            /// TODO simulate grabbing form options from backend (make json files in file directories

            var registrationCtrl = this;
            
            // select option fills
            options.getOptions('country').then(function successHandler(data){
                // data will be in this format: _id, name           
                registrationCtrl.countries = data;
            })

            options.getFields('general','department').then(function successHandler(data){
                // data will be in this format: _id, name           
                registrationCtrl.departments = data;
            })

            // this line is in case user decides to refresh the page. email field will be blank and we wont have an email to submit.
            var registrationCache = JSON.parse($window.localStorage.getItem('registrationCache'));
            registrationCtrl.email = registrationCache ? registrationCache.email : '';
            
            registrationCtrl.verification = {};
            registrationCtrl.verification.verified = false;
            registrationCtrl.validation = {};
            registrationCtrl.validationMessages = {
                password: 'Password must be 8 or more characters in length. Any character is allowed.',
                confirmPassword: 'Please make sure your passwords match',
                country: 'Please select a country',
                name: 'Please enter your full name',
                business_name: 'Enter your business name',
                office_phone: 'Enter your office phone',
                department: 'Please select a department',
                business_name_duplicate:'There already exists a business with this name'
            };
            var formFields = ['confirmPassword','password','country','first_name','last_name','email','business_name','office_phone','department','representative'];

            var fields;

            // check for duplicate email and go to next registration step if email is ok to use.
            registrationCtrl.validateAndNext = function(e){
                
                e.preventDefault();
                if (!registrationCtrl.email){
                    registrationCtrl.displayError = true;
                    return registrationCtrl.errorMessage = 'Please enter the email that you wish to register with.';
                }
                var userData = {
                    email: registrationCtrl.email
                };
                authService.validateEmail(userData).then(function successHandler(){
                    console.log('success happened')
                    authService.setRegistrationData('email',userData.email);

                    // TODO refactor this into a general localStorage factory
                    var store = $window.localStorage;
                    var cachedRegistration = store.getItem('registrationCache') || '{}';
                    cachedRegistration = JSON.parse(cachedRegistration);
                    cachedRegistration.email = userData.email;
                    store.setItem('registrationCache',JSON.stringify(cachedRegistration));

                    authService.setLoggedinState(true);
                    registrationCtrl.displayError = false;
                    if ($state.current.name == 'membership.register.verifyBusinessEmail'){
                        return $state.go('membership.register.businessDetails');
                    }

                    return $state.go('membership.register.personalDetails');

                },function errorHandler(err){
                    registrationCtrl.displayError = true;
                    if (err.data && err.data.duplicationError){
                        registrationCtrl.errorMessage = 'An account already exists with this email.';
                    } else {
                        registrationCtrl.errorMessage = 'There\'s been a server error. Please try again';
                    }

                    /// DEV PURPOSE ONLY
                 /*   if ($state.current.name == 'membership.register.verifyBusinessEmail'){   // TODO for dev purposes only; delete in production
                        return $state.go('membership.register.businessDetails');
                    }

                    return $state.go('membership.register.personalDetails');*/
                })
            };

            // check if confirm password matches password;
            registrationCtrl.checkConfirmPassword = function(pw,cpw){
                if (pw !== cpw){
                    return registrationCtrl.validation.confirmPassword = true;
                }
                registrationCtrl.validation.confirmPassword = false;
            };

            // check if all fields are filled in (on submission step). if yes, hide validation warnings.
            registrationCtrl.checkFields = function(){
                registrationCtrl.validation.invalid = false;
                // check all fields EXCEPT representative which is an optional field
                if ($state.current.name == 'membership.register.personalDetails'){
                    fields = formFields.slice(0, 6);
                } else {
                    fields = formFields;
                }
                var fieldsToCheck = fields.slice(0,-1);
                for (var i=0; i<fieldsToCheck.length;i++){
                    if (!registrationCtrl[fieldsToCheck[i]]){
                        registrationCtrl.validation.invalid = registrationCtrl.validation.invalid || true;
                        registrationCtrl.validation[fieldsToCheck[i]] = true;
                    } else {
                        registrationCtrl.validation[fieldsToCheck[i]] = false;
                    }
                }
            };

            // check if field is not empty or matches the condition for an acceptable input (for the password) as input is typed in (ng-change invocation)
            registrationCtrl.refreshFieldWarning = function(fieldname){
                if (fieldname == 'password'){
                    return registrationCtrl.validation[fieldname] =  !/^(?=.*\d)(?=.*[a-zA-Z]).{8,}/.test(registrationCtrl[fieldname]);
                }

                if (registrationCtrl[fieldname]){
                    registrationCtrl.validation[fieldname] = false;
                }
            };

            // set the stage for submission
            registrationCtrl.stageFields = function(){
                authService.clearRegistrationData();
                // we do not want to submit "confirmPassword"
                if ($state.current.name == 'membership.register.personalDetails'){
                    fields = formFields.slice(0, 6);
                } else {
                    fields = formFields;
                }

                var fieldsToSubmit = fields.slice(1),
                    l = fieldsToSubmit.length,
                    field;

                for (var i=0; i<l;i++){
                    field = fieldsToSubmit[i];
                    console.log(fieldsToSubmit);
                    authService.setRegistrationData(field,registrationCtrl[field] || false);
                }
            }

            // attempt to submit data to server.
            registrationCtrl.submitData = function(){
                registrationCtrl.checkFields();
                if (!registrationCtrl.validation.invalid){
                    registrationCtrl.stageFields();
                    authService.submitRegistrationData().then(function successHandler(){
                        // go to next state TODO

                        if ($state.current.name == 'membership.register.personalDetails'){
                            return $state.go('home');
                        }

                        return $state.go('home.account.businessProfile');


                    },function errorHandler(err){
                        if (err.data && err.data.duplicationError){
                            registrationCtrl.validation.business_name_duplicate = true;
                        }
                    })
                }
            };
        }])        
})(window, window.angular);