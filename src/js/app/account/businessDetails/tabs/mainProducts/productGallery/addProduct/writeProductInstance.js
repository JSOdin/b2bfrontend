(function (window, angular) {

    // refer to "modal.js"
    // shared by adding and editing product
    angular.module('account.businessDetails')
        // "products" is the model and "product" is the data passed in by the modal
        .controller('writeProductInstanceController',['product','products','$http','$scope','$window','$uibModalInstance','tabsService',function(product,products,$http,$scope,$window,$uibModalInstance,tabsService){
            // TODO make a $window.localStorage service. DRY
            var WPICtrl = this;

            var validationMessages={
                code: 'Enter an item code',
                industry: 'Select an industry',
                name: 'Enter a product name',
                category: 'Select a category',
                sub_category: 'Select a sub category'
            }

            // product.images will be empty if we are making a new product
            // base the product model off of products.defaultProduct (injected as "product" via modal). we will always copy the defaultProduct but never refer directly to it.
            // but if we are editing, "product" will equal the current editing product.
            /*if (!product.id){
                // TODO, persist new product data.
                WPICtrl.product = angular.copy(product);
            } else {
                WPICtrl.product = product;
            }*/

            console.log(product);
            WPICtrl.product= product;

            // if there is no product id, then we are creating a new product. in that case, the modal passed in "product" should be the default product with all empty fields and a default variety.
            // but the code is the same for any case.

            products.currentVariety.variety = WPICtrl.product.variations[0].varieties[0];

            /*WPICtrl.config = {animation: 100, forceFallback: true};    */

            // use the same function with different conditionals for editing and saving.
            WPICtrl.save = function (){
                var prod = WPICtrl.product,
                    cachedProducts;
                // validationMessage will contain all the various form error messages
                WPICtrl.validationMessage = {};
                var flatFields = ["code","name"];
                var nestedFields = ["industry","category","sub_category"];

                if (validateForm(prod,flatFields, nestedFields, WPICtrl.validationMessage)){
                    return;
                }

                // TODO refactor out the localStorage stuff.
                // when we are editing. when we are not, we save teh whole of WPICtrl.product
                if (prod.id){
                    // retrieve the cached products
                    cachedProducts = JSON.parse(products.getCacheItem('cachedProducts'));

                    /*    // get the single cached product.
                     cachedProduct = cachedProducts[prod.id];*/

                    // checks and removes unchanged keys. also tweak cachedProducts to update. function returns the cleaned up fields to save

                    prod = angular.copy(prod);
                    var toCacheProduct = angular.copy(prod);

                    // TODO need to modify a bit so that we can insert the changed product.

                    /*prod = products.checkForChanges(prod, toCacheProduct, cachedProduct, cachedProducts);*/

                    cachedProducts[prod.id] = toCacheProduct;

                    products.setCacheItem('cachedProducts', JSON.stringify(cachedProducts));
                }

                console.log(prod);

                products.saveProduct(prod).then(function(res){
                    // reset our model to blank product (products.defaultProduct) only if we are creating new product. resetting to original product would be troublesome if we are editing.
                    if (!prod.id){

                        // we need to receive the newly made product ID from server. TODO placeholderID is just temporary for dev purpose.
                        prod.id= res.data.id || 'placeholderID';
                        products.insertProduct(prod);
                        cachedProducts = JSON.parse(products.getCacheItem('cachedProducts')|| '{}');
                        cachedProducts[prod.id] = prod;
                        products.setCacheItem('cachedProducts', JSON.stringify(cachedProducts));
                        WPICtrl.reset();
                    }

                    $uibModalInstance.close();
                },function errCB(err){
                    // status of -1 means request aborted by angular
                    // TODO issue concening test product saving + posting.
                    if (err.status != -1){
                        WPICtrl.validationMessage.duplication = 'Item code already exists with this account.';
                    }
                })
            };

            WPICtrl.close = function(){
                $uibModalInstance.close();
            }

            WPICtrl.reset = function(){
                console.log('trashcan')
                products.resetCreationModel();
                WPICtrl.product = products.data.creationModel;
            }

            // check if a product's field is empty. if it is, prevent POST data.
            function validateForm(product,flatFields, nestedFields, form){
                var haltFormSubmission=false;
                for (var i=0; i<flatFields.length;i++){
                    if (!product[flatFields[i]]){
                        form[flatFields[i]] = validationMessages[flatFields[i]];
                        haltFormSubmission = true;
                    }
                }

                for (var j=0; j<nestedFields.length;j++){
                    if (!product[nestedFields[j]].id){
                        form[nestedFields[j]] = validationMessages[nestedFields[j]];
                        haltFormSubmission = true;
                    }
                }

                return haltFormSubmission;
            }
        }])
})(window, window.angular);

