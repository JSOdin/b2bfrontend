(function(window,angular){
    angular.module('inquiry.compare.productFeatures',[])
        .directive('productFeatures',[function(){
            return {
                restrict:'E',
                scope:{
                    name:'='
                },
                templateUrl:'src/js/app/inquiry/compare/productFeatures/productFeatures.tmpl.html',
                link:function(scope,el,attrs){                  
                }
            }
        }])

})(window,window.angular);