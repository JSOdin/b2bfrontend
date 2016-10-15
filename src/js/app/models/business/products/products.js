(function (window, angular) {
    angular.module('models.business.products', [])
        .factory('products',['$http','$q','responseTransformer','requestTransformer','$window',function($http,$q,responseTransformer,requestTransformer,$window){
            var data = {};

            var defaultProduct = {"id":"","business":"","industry":"","category":{"id":"","name":""},"sub_category":{"id":"","name":""},"code":"",
                "name":"","active":true,"brand":"","origin":"","organic":false,"storage":"","shelf_life":"",
                "ingredient":"",
                "description":"",
                "allergy_alert":"","draft":false,
                "images":
                    [
                    ],
                "variations":
                    [
                        {
                            "id":"","property":"Default","varieties":
                            [
                                {"id":"","value":"Default Product","active":"","packing":"","selling_unit":"","currency":"","regular_price":"","tax_incursion_price":false,"open_price":false,"tax_exempt":false}
                            ]
                        }
                    ]
            };

            data.creationModel = angular.copy(defaultProduct);

            // used exclusively for Sales Detail page of product modal.
            var currentVariety= {};

            var endpoint = {
                products:'mockData/products.json',
                product: 'mockData/product/',
                saveProduct:'http://localhost:3000/saveProduct',
                createVariation: 'http://localhost:3000/createVariation',
                createVariety: 'http://localhost:3000/createVariety',
                deleteVariety: 'http://localhost:3000/deleteVariety',
                deleteVariation: 'http://localhost:3000/deleteVariation'
            };

            return {
                data:data,
                getProducts:getProducts,
                getProduct: getProduct,
                currentVariety: currentVariety,
                setCurrentVariety: setCurrentVariety,
                getCurrentVariety: getCurrentVariety,
                defaultProduct: defaultProduct,        
                resetCreationModel: resetCreationModel,
                saveProduct: saveProduct,
                /*checkForChanges: checkForChanges,*/
                getCacheItem:getCacheItem,
                setCacheItem: setCacheItem,
                insertProduct:insertProduct,
                createVariation: createVariation,
                createVariety: createVariety,
                deleteVariety:deleteVariety,
                deleteVariation: deleteVariation,
                setCropImage: setCropImage,
                getCropImage: getCropImage,
                removeCropImage: removeCropImage,
                cropper: '',
                removeCropper: removeCropper
            }

            // get a single product
            function getProduct(id){
                if (data.products && id){
                    for (var i=0; i<data.products.length;i++){
                        if (data.products[i].id == id){
                            return $q.when(data.products[i]);
                        }
                    }
                    var url = endpoint.product+id;
                    return doPromise($http.get(url), productCB);
                }
                return getProducts();
            }

            // get all products
            function getProducts(){
                return data.products ? $q.when(data.products) : doPromise($http({method:'GET',url:endpoint.products,transformResponse:(responseTransformer.trProduct || $http.defaults.transformResponse)}),productsCB)
            }

            function insertProduct(product){
                data.products = data.products || [];
                data.products.push(product);
            }

            // extract the data from response
            function getData(res){
                return res.data;
            }

            // generic promise wrapper
            function doPromise(promise,successCallback){
                if (promise){
                    return promise.then(successCallback);
                }
                throw Error('promise was not passed in');
            }

            // what to do after products call
            function productsCB(res){
                var products = getData(res);
                data.products = products;
                /*     var variation = data.products[0].variations[0];
                 var obj = {
                 variationID: variation.id,
                 varietyID: variation.varieties[0].id
                 }
                 setCurrentSalesDetail(obj)*/

                // TODO transform products array (our response) into an object to cache it.
                var productsCache = {},
                    l = products.length;

                for (var i=0 ; i< l; i++){
                    productsCache[products[i].id] = products[i];
                }

                setCacheItem('cachedProducts',JSON.stringify(productsCache));
                return data.products;
            }

            // what to do after a product call
            function productCB(res){
                var product = getData(res);
                data.products.push(product);
                return product;
            }

            // grab a product's current sales detail
            function getCurrentVariety(){
                return !currentVariety.hasOwnProperty('variety') ? (currentVariety.variety = data.products[0].variations[0].varieties[0]) : currentVariety.variety;
            }

            // reset the new product creation model.
            function resetCreationModel(){
                console.log('resetting....');
                console.log(defaultProduct);
                data.creationModel = angular.copy(defaultProduct);
            }

            // set a product's current sales detail
            function setCurrentVariety(indexObject){

                // TODO This needs some attention. we should not loop over all the existing products if we are creating new product and new variety.
                // pts is products list if we are editing an existing product. pts is the single stage product when we are making new product
                var pts, variations;

                if (indexObject.product.id){
                    pts = data.products;
                    for (var i=0; i<pts.length;i++){
                        if (pts[i].id == indexObject.product.id){
                            variations = pts[i].variations;
                            for (var j=0; j< variations.length;j++){
                                if (j == indexObject.variationIndex){
                                    for (var k=0; k<variations[j].varieties.length;k++){
                                        if (k== indexObject.varietyIndex){

                                            console.log(j,k);
                                            console.log(variations[j].varieties[k]);
                                            return currentVariety.variety = variations[j].varieties[k];
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    pts = indexObject.product;
                    variations = pts.variations;
                    for (var j=0; j< variations.length;j++){
                        if (j == indexObject.variationIndex){
                            for (var k=0; k<variations[j].varieties.length;k++){
                                if (k== indexObject.varietyIndex){
                                    console.log('we hit this block')
                                    return currentVariety.variety = variations[j].varieties[k];
                                }
                            }
                        }
                    }
                }

                console.log(indexObject);

                // we need to check for product.id and index.
                // the problem with this logic is that for new product + new variations there is no variation ID or variety IDs. need to be index based instead TODO how ?
                /*   if (!idObject.variationIndex){
                 return currentVariety.variety = defaultProduct.variations[0].varieties[0];
                 }
                 */
                // TODO my solution is to loop differently if product id exists.
            }

            /*function setCurrentVariety(idObject){
             var pts = data.products,
             variations;

             console.log(idObject);

             // if idobject.variationID is not provided, it means we are creating a new product.
             // the problem with this logic is that for new product + new variations there is no variation ID or variety IDs. need to be index based instead TODO how ?
             if (!idObject.variationID){
             return currentVariety.variety = defaultProduct.variations[0].varieties[0];
             }

             for (var i=0; i<pts.length;i++){
             variations = pts[i].variations;
             for (var j=0; j< variations.length;j++){
             if (variations[j].id == idObject.variationID){
             for (var k=0; k<variations[j].varieties.length;k++){
             if (variations[j].varieties[k].id == idObject.varietyID){
             return currentVariety.variety = variations[j].varieties[k];
             }
             }
             }
             }
             }
             }*/

            // save new product or modify existing product
            // python only accepts valid stringified JSON
            function saveProduct(product){
                // requesttransformer will clean up some fields and turn product into JSON string

                return doPromise($http({method:'POST', headers: {"Content-Type": "application/json"},data:product,url:endpoint.saveProduct,transformRequest:(requestTransformer.trProduct || $http.defaults.transformRequest)}))
            }

            // algorithm for checking data changes
            /*function checkForChanges(product,toCacheProduct, cachedProduct, cachedProducts){
             var idCache = product.id;
             recursiveChecker(product,toCacheProduct,cachedProduct);
             cachedProducts[idCache] = toCacheProduct;
             product.id = idCache;                 
             return product;
             }

             function recursiveChecker(product,toCacheProduct, cachedProduct){
             var prop;
             if (product instanceof Object){
             for (prop in product){
             console.log(prop)
             if (product.hasOwnProperty(prop) && product[prop] instanceof Object){
             recursiveChecker(product[prop], toCacheProduct[prop], cachedProduct[prop]);
             // recursiveChecker recursively cleans out duplicate fields. then below cleans out further by removing empty objects
             // TODO
             if (!Object.keys(product[prop]).length && !(product[prop] instanceof Array)){
             delete product[prop];
             } else if (product[prop] instanceof Array){
             // added this part because the delete product[prop] seems to also go through Array indices (which count as object properties) and deleting Array parts, leaving some positions undefined.

             // TODO cleanup varieties key that have empty objects only.
             // TODO cleanup varieties by splicing them.

             }
             } else {
             if (product[prop] == cachedProduct[prop]){                         

             delete product[prop];
             } else {
             toCacheProduct[prop] = product[prop];
             }
             }
             }
             }
             }
             */
            function setCacheItem(key,item){
                $window.localStorage.setItem(key,item);
            }

            function getCacheItem(key){
                return $window.localStorage.getItem(key);
            }


            // TODO maybe refactor these into a reusable component
            function createVariation(variation, successCB){
                $http.post(endpoint.createVariation,variation).then(successCB);
            }

            function createVariety(variety, successCB){
                $http.post(endpoint.createVariety,variety).then(successCB);
            }

            function deleteVariety(idObj,successCB){
                $http.post(endpoint.deleteVariety,idObj).then(successCB);
            }

            function deleteVariation(idObj, successCB){
                $http.post(endpoint.deleteVariation, idObj).then(successCB);
            }

            function setCropImage(image, $index){
                // this is connected to the real products data.
                console.log(image);
                data['cropImage'] = image;
            }

            function removeCropImage(){
                data['cropImage'] = '';
            }

            function removeCropper(){
                this.cropper.destroy();
            }

            function getCropImage(){
                console.log('getting image...');
                return data['cropImage'];
            }
        }])
})(window, window.angular);

