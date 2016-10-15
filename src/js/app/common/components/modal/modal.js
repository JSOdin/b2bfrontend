(function (window, angular) {
    angular.module('common.components.modal', [])
        .factory('modal',['$uibModal',function($uibModal){
            var map = {
                'writeProduct':{
                    templateUrl: 'src/js/app/account/businessDetails/tabs/mainProducts/productGallery/addProduct/writeProductForm.tmpl.html',
                    controller: 'writeProductInstanceController as WPICtrl'
                }
            }
            return {
                openModal:openModal
            }

            function openModal(size,data, modalType,status){          // made reusable by passing in size, the data you want to pass in, and modalType.
                return $uibModal.open({
                    animation: false,
                    templateUrl: map[modalType].templateUrl,
                    controller: map[modalType].controller,
                    size: size,
                    backdrop:'static',
                    resolve: {
                        product: function(){
                            data = data || {};
                            data.status = status;
                            return data || {};
                        }                     
                    }
                }).result.then(function(selectedItem){
                    return selectedItem;
                })
            }
        }])

})(window, window.angular);