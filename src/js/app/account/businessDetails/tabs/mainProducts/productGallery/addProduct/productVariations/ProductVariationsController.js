(function (window, angular) {
    angular.module('account.businessDetails')
        .controller('productVariationsController',['$scope','tabsService','products', function ProductVariationsController($scope,tabsService,products){
            var productVariationsCtrl = this;
            var defaultVariety = {"id":"",value:'new variety','tax_incursion_price': false,'currency': '','tax_exempt': false,'regular_price': '','active': '','selling_unit': '','open_price': true,'packing': ''};
            var defaultVariation = {"id":"",property:"new variation",varieties:[defaultVariety]};

            productVariationsCtrl.paperFields = []; // governs the flip between data display and input
            // the product variations data taken from outer scope
            productVariationsCtrl.variations = $scope.product.variations;

            // creates an entire group of variation
            productVariationsCtrl.createVariation = function(){
                // TODO if product.id exists, then bring in the variationID sent to by server and assign it to this variety.
                var variationCopy = angular.copy(defaultVariation);
                productVariationsCtrl.variations =  productVariationsCtrl.variations || [];
                if ($scope.product.id){
                    // POST variation to db and receive ID

                    return products.createVariation(variationCopy, function(res){
                        console.log(res.data);
                        if (res.data){
                            variationCopy.id = res.data.id;
                            productVariationsCtrl.variations.push(variationCopy);
                        }
                    })                 
                }
                productVariationsCtrl.variations.push(variationCopy);
            };

            // deletes a single variety
            productVariationsCtrl.deleteVariety = function(index,parentIndex){
                if ($scope.product.id){
                    var variation = $scope.product.variations[parentIndex];
                    var variety = variation.varieties[index];
                    return products.deleteVariety({id:variety.id},function(res){
                        productVariationsCtrl.variations[parentIndex].varieties.splice(index,1);
                    });
                }
                productVariationsCtrl.variations[parentIndex].varieties.splice(index,1)
            }

            // adds a single variety

            productVariationsCtrl.addVariety = function(index){
                // TODO if product.id exists, then bring in the varietyID sent to by server and assign it to this variety.
                var varietyCopy = angular.copy(defaultVariety);
                if ($scope.product.id) {
                    // POST variety to db and receive ID
                    return products.createVariety(varietyCopy,function(res){
                        if (res.data){
                            console.log(res.data.id);
                            varietyCopy.id = res.data.id;
                            productVariationsCtrl.variations[index].varieties.push(varietyCopy);
                            console.log($scope.product.variations);
                        }
                    });
                }
                // if new product, just push to local array.
                productVariationsCtrl.variations[index].varieties.push(varietyCopy);
            }

            // deletes a variation group
            productVariationsCtrl.deleteVariation = function(parentIndex){
                var variation = $scope.product.variations[parentIndex];
                if ($scope.product.id){
                    return products.deleteVariation({id:variation.id},function(){
                        productVariationsCtrl.variations.splice(parentIndex,1);
                        productVariationsCtrl.paperFields.splice(parentIndex,1);
                    })               
                }
                productVariationsCtrl.variations.splice(parentIndex,1);
                productVariationsCtrl.paperFields.splice(parentIndex,1);
            }

            // swap with the first in variation group to make it the default.
            productVariationsCtrl.makeDefault = function(index,parentIndex){
                var varieties = productVariationsCtrl.variations[parentIndex].varieties;
                var cache = varieties[index];
                varieties[index] = varieties[0];
                varieties[0] = cache;
            }

            // go to sales detail page for selected variety.
            // TODO make this index-based not id-based
            /*productVariationsCtrl.goToSalesDetail = function(idObject){
                products.setCurrentVariety(idObject);
                tabsService.selectTab({name:'Sales Detail'});

                console.log(products.currentVariety.variety);
            }*/
            productVariationsCtrl.goToSalesDetail = function(indexObject){
                products.setCurrentVariety(indexObject);
                tabsService.selectTab({name:'Sales Detail'}, 'product');

                console.log(products.currentVariety.variety);
            }
        }])

})(window, window.angular);

// the tabs directive is used in multiple places
// each directive instance will make its own controller instance. 
// by setting use-service attribute on the tabs element, we can delegate tabs storage to a service called tabsService, instead of storing the tabs on the controller.
// for now this is used only for the modal for edit product module. 
// tabsService allows controllers to switch from tab to tab programmatically without the user having to click on each tab.

