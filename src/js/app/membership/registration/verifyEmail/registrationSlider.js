(function (window, angular) {
    angular.module('membership.registration')
        .directive('registrationSlider',['$window','slideBar',function($window,slideBar){
            return {
                scope:{
                    verification:'='
                },
                link:function(scope,el,attrs){
                    var slider = new slideBar.el({
                        handle: 'slider-btn',
                        colorSpace: 'slider-color-section',
                        wrapper: 'slide-element',
                        infoBox: 'slider-info',
                        scope: scope
                    })
                }
            }
 }])})(window, window.angular);