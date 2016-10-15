(function (window, angular) {
    angular.module('account.businessDetails')
        .directive('cropper', ['products','$timeout',function (products,$timeout) {
            return {
                restrict: 'E',
                templateUrl: 'src/js/app/account/businessDetails/tabs/mainProducts/productGallery/addProduct/productImages/tabs/cropper/cropper.tmpl.html',
                link: function (scope, el, attrs,tabsCtrl) {
                    // need to reset cropper every time modal gets launched
                    // https://github.com/fengyuanchen/cropperjs#options
                    var cropWrapper = document.getElementById('cropper'),
                        image = cropWrapper.getElementsByTagName('img').item(0);
                    // remove any remaining crop image set on stage upon modal launch (from previous modal launches)
                    products.removeCropImage();
                    products.cropper = '';                    

                    var options = {
                        viewMode: 1,
                        responsive:true,
                        restore: true
                    };
                    scope.$watch(function(){return products.getCropImage()},function(newVal,oldVal){
                        // this watcher also implicitly re-renders the product images under the images tab, when "products.cropImage" is changed.

                        // clean up the remnant image after cropper instance is destroyed.
                        if (!newVal){
                            scope.cropImage = '';
                        }

                        if (newVal && (newVal.src != oldVal.src)){
                            scope.cropImage = newVal.src;
                            // cropper's "replace" function is very buggy. better to just destroy existing instance and make a new one.

                            if (products.cropper){
                                products.cropper.destroy();
                                products.cropper = '';
                            }

                            $timeout(function(){
                                products.cropper = new Cropper(image, options);
                            });
                        }
                    }, true);

                    scope.resizeCanvas = remakeCropper;
                    scope.reset = reset;
                    scope.removeScopeImage = removeScopeImage;

                    function remakeCropper(){
                        var dataURL = products.cropper.getCroppedCanvas().toDataURL();
                        products.cropper.replace(dataURL);
                        // change the real data.
                        products.getCropImage().src = dataURL;
                    }

                    function reset(){
                        // not a hard reset. only resets the crop box size and position.
                        products.cropper.reset();
                    }

                    function removeScopeImage(){
                        scope.cropImage = '';
                    }
                }
            }
        }])
})(window, window.angular);