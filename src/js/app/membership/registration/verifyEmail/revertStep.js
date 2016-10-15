(function (window, angular) {
    angular.module('membership.registration')       
        .directive("revertStep", function revertStep() {
            return function(scope,el,attrs){
                // add the active state on the progress bar. better solution than $rooteScope.$on('$stateChangeSuccess)
                var step = document.getElementsByClassName('step')[0];
                angular.element(step).removeClass('active');
            }
        })
})(window, window.angular);