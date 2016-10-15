(function(window,angular){
    angular.module('inquiry.compare.gallery',[])       
        .directive('gallery',[function(){
            return {
                restrict:'E',
                scope:{
                    name:'='
                },
                templateUrl:'src/js/app/inquiry/compare/gallery/gallery.tmpl.html',
                link:function(scope,el,attrs){                  
                }
            }
        }])

})(window,window.angular);