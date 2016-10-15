(function (window, angular) {
    angular.module('account.businessDetails')
        .directive('productImages',['$http',function ($http) {
            return {
                restrict: 'E',
                templateUrl: 'src/js/app/account/businessDetails/tabs/mainProducts/productGallery/addProduct/productImages/productImages.tmpl.html',
                scope:{
                    product:'=product'
                },
                link: function (scope, el, attrs) {
                    // following this guide http://www.htmlgoodies.com/html5/javascript/drag-files-into-the-browser-from-the-desktop-HTML5.html#fbid=85D2-kSw48J 

                    var dropZone = angular.element(document.getElementsByClassName('drop-zone')[0]);
                    var fileUpload = angular.element(document.getElementById('file-upload'));
                    dropZone.on('load',function(){
                        dropZone.load('dragover',preventDefault);
                        dropZone.load('dragenter',preventDefault);
                    })

                    // prevent browser behavior when file is dragged onto browser http://stackoverflow.com/questions/14674349/why-preventdefault-does-not-work
                    dropZone.on('dragenter dragstart dragend dragleave dragover drag drop',function(e){
                        e.preventDefault();
                    });

                    dropZone.on('drop',function(e){
                        // "jquery does not pass the browser event to you, but the jquery event object. access the untouched original event via
                        // ".originalEvent http://stackoverflow.com/questions/11885900/difference-between-event-originalevent-datatransfer-files-and-event-datatransfer"
                        var data = e.originalEvent.dataTransfer;
                        var files = data.files;

                        // this is to display the new pictures
                        for (var i=0; i<files.length;i++){
                            var file = files[i];
                            var reader = new FileReader();

                            reader.addEventListener('loadend',function(e,file){
                                // "this" equals to reader
                                // bin is the dataURI (picture data and mimetype in text form)
                                // browser appears to recognize dataURI and display as picture but elsewhere its corrupted
                                var bin = this.result;
                                // we test the mimeType to see if its valid image.  image/(png/jpeg/bmp/gif)
                                var parts= bin.split(',');
                                if (!/(image\/png|jpeg|bmp|gif)/.test(parts[0])){
                                    return;
                                }

                                // APICtrl is available anywhere within the modal. APICtrl is made available by addProductInstance.js
                                scope.product.images.push({src:bin,selected:false, didNotCrop:true});
                                scope.$apply();

                            });

                            // this is essential for reading the files as data to display the images in the brwoser, but not for sending server.
                            reader.readAsDataURL(file);

                            /* if (data && file){
                             // below is to send the files to server
                             //
                             // https://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
                             // without transformrequest angualr will try to serialize our for data so we override it with the
                             // identity function to leave the data intact.
                             // we also want to override the default content-type for POST (default is application/json)
                             // by setting it to undefined, the browser sets the Content-Type to multipart/form-data for us.


                             // http://stackoverflow.com/questions/32235039/multer-and-angularjs
                             var fd = new FormData();
                             fd.append('image',file);
                             $http.post('http://localhost:3000/uploadImage',fd,{transformRequest: angular.identity,headers:{'Content-Type':undefined},enctype: 'multipart/form-data'}).then(function successCallback(){

                             })
                             }*/
                        }

                        return false;
                    });

                    fileUpload.on('change',function(e){
                        // "jquery does not pass the browser event to you, but the jquery event object. access the untouched original event via
                        // ".originalEvent http://stackoverflow.com/questions/11885900/difference-between-event-originalevent-datatransfer-files-and-event-datatransfer"

                        var files =  e.target.files;

                        // this is to display the new pictures
                        for (var i=0; i<files.length;i++){
                            var file = files[i];
                            var reader = new FileReader();

                            reader.addEventListener('loadend',function(e,file){
                                // "this" equals to reader
                                // bin is the dataURI (picture data and mimetype in text form)
                                // browser appears to recognize dataURI and display as picture but elsewhere its corrupted
                                var bin = this.result;
                                // we test the mimeType to see if its valid image.  image/(png/jpeg/bmp/gif)
                                var parts= bin.split(',');
                                if (!/(image\/png|jpeg|bmp|gif)/.test(parts[0])){
                                    return;
                                }

                                // APICtrl is available anywhere within the modal. APICtrl is made available by addProductInstance.js

                                scope.product.images.push({src:bin,selected:false});
                                scope.$apply();

                            });

                            // this is essential for reading the files as data to display the images in the brwoser, but not for sending server.
                            reader.readAsDataURL(file);

                            /* if (files && file){
                             // below is to send the files to server
                             //
                             // https://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
                             // without transformrequest angualr will try to serialize our for data so we override it with the
                             // identity function to leave the data intact.
                             // we also want to override the default content-type for POST (default is application/json)
                             // by setting it to undefined, the browser sets the Content-Type to multipart/form-data for us.


                             // http://stackoverflow.com/questions/32235039/multer-and-angularjs
                             var fd = new FormData();
                             fd.append('image',file);
                             $http.post('http://localhost:3000/uploadImage',fd,{transformRequest: angular.identity,headers:{'Content-Type':undefined},enctype: 'multipart/form-data'}).then(function successCallback(){

                             })
                             }*/
                        }

                        return false;
                    })

                    // ES6 implementation
                    // http://stackoverflow.com/questions/32008523/send-an-uploaded-image-to-the-server-and-save-it-in-the-server
                    /* function dataURItoBlob(dataURI){
                     // retrieve only the picture data part of the dataURI, the part after for ex. "data:image/png;base64,"
                     var parts = dataURI.split(',');
                     // atob: Decode a base-64 encoded string:
                     var binary = atob(parts[1]);
                     // only interested in the capturing group match
                     var mimeType = parts[0].match(/(?::)(.*)(?:;)/)[1];

                     return new Blob(binary,{
                     type:mimeType
                     })
                     }*/

                    function preventDefault(e){
                        return e.preventDefault();
                    }
                }
            }
        }])
})(window, window.angular);