(function (window, angular) {
    angular.module('dataTransformers.requestTransformer', [])
        .factory('requestTransformer',[function(){
            return {
                trProduct:function(product){
                    
                    // clean up unnecessary "display" keys used for select options matching.
                    /*var cleanUpFields = ["category","industry","shelf_life","storage","sub_category", "common_name"];*/

                    // to delete the "value" and "display" keys which are only used for dropdown selection
                    // need only "id" for these fields because they have their own tables.
                    var cleanUpFields = ["category","sub_category", "common_name","origin"];
                    // for options like storage / shelf_life, only need the value because these dont have their own database tables. but still keep embedded object for uniformity of selectables
                    // we dont need "id" or "display" of these fields.
                    var noTableFields = ["storage","shelf_life","industry"];

                    // TODO change how product data is transformed, as per request in data submission and validation.txt
                    var copy = angular.copy(product),
                        key,
                        variation,
                        variety,
                        selling_unit,
                        images = copy.images;
                    for (var i=0; i<cleanUpFields.length;i++){
                        key = cleanUpFields[i];
                        if (copy[key] && copy[key].display){
                            delete copy[key].display;
                            delete copy[key].value;
                            delete copy[key].name;
                        }
                    }

                    // make images flat structure and clean out unnecessary things
                    for (var o=0; o<images.length;o++){
                        images[o] =  images[o].src;
                    }

                    for (var j=0; j<noTableFields.length;j++){
                        key = noTableFields[j];
                        if (copy[key] && copy[key].display){
                            delete copy[key].display;
                            delete copy[key].id;
                        }
                    }

                    console.log(copy.variations);
                    for (var l=0; l<copy.variations.length;l++){
                        variation = copy.variations[l]
                        for (var m=0; m<variation.varieties.length;m++){
                            variety = variation.varieties[m];
                            selling_unit = variety["selling_unit"];
                             variety["selling_unit"]=  selling_unit.value;

                            // flattening embedded into string. "currency":{currency:"USD"} ==> "currency":"USD"
                            variety["currency"] = variety.currency.currency;
                        }
                    }

                    console.log(copy);
                    copy = JSON.stringify(copy);
                    return copy;
                },
                trBusiness:function(business){

                }
            }
        }])
})(window, window.angular);