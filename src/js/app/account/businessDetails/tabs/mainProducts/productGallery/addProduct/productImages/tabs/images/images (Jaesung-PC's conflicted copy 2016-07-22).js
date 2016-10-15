(function (window, angular) {
    angular.module('account.businessDetails')
        .directive('images', ['tabsService','products',function (tabsService, products) {
            return {
                restrict: 'E',
                scope:{
                  product:'=product'
                },
                templateUrl: 'src/js/app/account/businessDetails/tabs/mainProducts/productGallery/addProduct/productImages/tabs/images/images.tmpl.html',
                link: function (scope, el, attrs,tabsCtrl) {
                    scope.selectAll = function(images){
                        var l = images.length;
                        for (var i=0; i<l; i++){
                            images[i].selected = true;
                        }
                    }

                    scope.unselectAll =  function(images){
                        var l = images.length;
                        for (var i=0; i<l; i++){
                            images[i].selected = false;
                        }
                    }

                    scope.deleteSelected = function(images){
                        var l = images.length;
                        for (var i=l-1; i>=0; i--){
                            if (images[i].selected){
                                if (products.getCropImage().id == images[i].id){
                                    console.log('truth be told');
                                    products.removeCropImage()
                                    products.removeCropper();
                                }
                                images.splice(i,1);
                            }
                        }

                    }

                    scope.deleteOne = function(image, images){
                        var l = (images || []).length;
                        for (var i=0; i<l; i++) {
                            if (images[i].id == image.id) {
                                if (products.getCropImage().id == image.id){
                                    products.removeCropImage()
                                    products.removeCropper();
                                }

                                return images.splice(i, 1);
                            }
                        }
                    }

                    scope.goToCrop = function($index, image){
                        tabsService.selectTab({name:'cropper'},'productImages');
                        // set current Crop image here. for a service.
                        
                        products.setCropImage(image, $index);
                    }
                }
            }
        }])
})(window, window.angular);