(function (window, angular) {
    angular.module('membership.registration')  
        .directive("activateStep", function activateStep() {
            return function(scope,el,attrs){
                // color #2 step green in progress bar          
                var step = document.getElementsByClassName('step')[0];
                angular.element(step).addClass('active');
            }
        })    
})(window, window.angular);