(function (window, angular) {
    angular.module('account.businessDetails')
        .directive('cropper', ['products','$timeout',function (products,$timeout) {
            return {
                restrict: 'E',
                templateUrl: 'src/js/app/account/businessDetails/tabs/mainProducts/productGallery/addProduct/productImages/tabs/cropper/cropper.tmpl.html',
                link: function (scope, el, attrs,tabsCtrl) {
                    // need to reset cropper every time modal gets launched
                    var cropWrapper = document.getElementById('cropper'),
                        image = cropWrapper.getElementsByTagName('img').item(0);
                    // remove any remaining crop image set on stage upon modal launch (from previous modal launches)
                    products.removeCropImage();
                    products.cropper = '';

                    var options = {
                        viewMode: 2,
                        responsive:true,
                        crop: function(e) {
                            // whenever crop area is changed or resized, this fires
                        }
                    };
                    scope.$watch(function(){return products.getCropImage()},function(newVal){
                        if (newVal && newVal.src){
                            scope.cropImage = newVal.src;
                            if (products.cropper){
                                // if we are just swapping images, there is already a cropper initiated. so only need to replace the image
                                products.cropper.replace(scope.cropImage);
                            } else {
                                // allow time for image to load, then initiate the cropper module.
                                // https://github.com/koorgoo/ngCropper/issues/33
                                $timeout(function(){
                                    products.cropper = new Cropper(image, options);
                                });
                            }
                        }
                    }, true);

                    scope.resizeCanvas = remakeCropper;
                    scope.reset = reset;

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
                }
            }
        }])
})(window, window.angular);