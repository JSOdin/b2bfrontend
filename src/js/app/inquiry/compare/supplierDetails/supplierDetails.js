(function(window,angular){
    angular.module('inquiry.compare.supplierDetails',[])
        .directive('supplierDetails',[function(){
            return {
                restrict:'E',
                scope:{
                    name:'='
                },
                templateUrl:'src/js/app/inquiry/compare/supplierDetails/supplierDetails.tmpl.html',
                link:function(scope,el,attrs){
                
                }
            }
        }])

})(window,window.angular);