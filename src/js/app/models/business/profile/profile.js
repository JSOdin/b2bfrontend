(function (window, angular) {
    angular.module('models.business.profile', [])
        .factory('business',['$http','$q','responseTransformer','requestTransformer','$window','tokenFactory',function($http,$q,responseTransformer,requestTransformer,$window,tokenFactory){
            var data={};

            return {
                getBusiness: getBusiness
            }

            function getBusiness(){
                var busID = tokenFactory.getToken().id;

                console.log(busID);
                return data.business ? $q.when(data.business): $http({method:'get',url:'http://localhost:3000/getBusiness',params:{id:busID}, transformResponse:(responseTransformer.trBusiness || $http.defaults.transformResponse)}).then(function(res){
                    if (res.data){
                        console.log(res.data);
                        data.business = res.data;
                        return data.business;
                    }
                })
            }
        }])

})(window, window.angular);