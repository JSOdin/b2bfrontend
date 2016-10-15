(function (window, angular) {
    angular.module('account.businessDetails')
        .directive('serviceDetails', [function () {
            return {
                restrict: 'E',
                templateUrl: 'src/js/app/account/businessDetails/tabs/serviceDetails/serviceDetails.tmpl.html',
                controller: 'serviceDetailsController as serviceDetailsCtrl'
            }
        }])
        .controller('serviceDetailsController',['options','business','$scope',function(options,business,$scope){
            var serviceDetailsCtrl=this;
            serviceDetailsCtrl.options ={};
            options.getFields('general','SERVICE_RANGE').then(function (data){          
                serviceDetailsCtrl.options.service_ranges = data;
            });

            business.getBusiness().then(function(data){
                console.log(data);
                serviceDetailsCtrl.business = data;               
            });       

            // sub_categories should change for each category so watch for changes in product.category model
            // 
            $scope.$watch('serviceDetailsCtrl.business.business_detail.service_range',function(newVal,oldVal){
                if (newVal && newVal.id){
                    console.log(newVal.id);
                    getServiceAreas(newVal.id);
                }
            },true)

            function getServiceAreas(id){
                if (id == "0"){
                    return options.getOptions('country').then(function(data){
                        serviceDetailsCtrl.options.service_areas= data;
                        serviceDetailsCtrl.business.service_area = data[0];
                    },function errcb(){
                        serviceDetailsCtrl.options.service_areas= [];
                    });
                }                
          
                return options.getDBOptionsByID('service_area',id).then(function(data){                
                    serviceDetailsCtrl.options.service_areas= data;
                    serviceDetailsCtrl.business.service_area = data[0];                 
                },function errcb(){
                    serviceDetailsCtrl.options.service_areas= [];
                });
            }
        }])
})(window, window.angular);