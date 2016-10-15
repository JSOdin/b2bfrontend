(function (window, angular) {
    angular.module('dataTransformers.responseTransformer', [])
        .factory('responseTransformer',[function(){
            return {
                trName: function (data){
                    if (!isJSON(data)){
                        return false;
                    }
                    if (data && data.length){
                        data = JSON.parse(data);
                        data = data.map(function(ea){
                            var resultObj = {
                                id:ea.id,
                                display: ea.name,
                                value: (ea.name|| '').toLowerCase()
                            };
                            if (ea.currency){
                              resultObj.currency = ea.currency;
                            }

                            return resultObj;
                        })
                    }
                    
                    return data;
                },
                // this is for form options mostly.
                trGeneral: function(data){
                    // if you use custom transformer, you need to manually parse the JSON

                    data = JSON.parse(data);

                    console.log(data)

                    // weird console log "bug" that prints after the for in loop.

                    var arr;

                    // force Object type if data is array
                    if (data instanceof Array){
                        data = data[0];
                    }

                    for (var p in data){
                        arr=[];
                        if (data.hasOwnProperty(p)){
                            for (var i=0; i<data[p].length;i++){
                                arr.push(
                                    {
                                        display: data[p][i].name,
                                        value: data[p][i].name.toLowerCase(),
                                        id: data[p][i].id
                                    }
                                )

                            }
                            data[p] = arr;
                        }
                    }

                    return data;
                },
                // transforms some things to suit the application, like giving display/value structure to selectables
                trProduct:function(data){

                    data = JSON.parse(data);
                    var l = data.length;
                    // these are the dropdown selectable properties. every one of these will have an id property, and each property will be an object
                    var toTransform1 = ["category","sub_category","common_name","industry","origin","shelf_life","storage"];
                    
                    // TODO add more to transform2 array, properties that 
                    // for shallow properties
                   /* var toTransform2 = [];*/
                    // iterate over each product
                    for (var j=0; j<l;j++){
                        var images = data[j].images;
                        // iterate over each product's images
                        for (var i=0; i<images.length;i++){
                            images[i] = {
                                src: images[i].src,
                                id: images[i].id,
                                selected: false
                            }
                        }
                        for (var k=0; k<toTransform1.length;k++){
                            data[j][toTransform1[k]] =generateOptionObj(data[j][toTransform1[k]]);
                        }

                        // process product variations differently

                        var variations = data[j].variations,
                            variety,
                            selling_unit,
                            currency;
                        for (var m=0; m<variations.length;m++){
                            for (var n=0; n<variations[m].varieties.length;n++){
                                variety = variations[m].varieties[n];
                                selling_unit = variety["selling_unit"];
                                currency = variety["currency"];
                                variety["selling_unit"] =  {
                                    display: selling_unit,
                                    value: selling_unit.toLowerCase(),
                                };

                                // embed a flat string value into an object.
                                // why do this redundant thing? product's currency dropdown options are structure like this:
                                // {"id":"34j32lkj3l3k2jk","name":"India","currency":"RM"} from country databse.
                                // since products have a flat currency:"currency unit" structure, and productSalesDetail.tmpl.html ng-repeat
                                // keeps track of values by country.currency, we need to make a standard format.
                                variety["currency"] = {
                                    currency: currency
                                };
                            }
                        }


                      /*  for (var m=0; m<toTransform2.length;m++){
                            data[j][toTransform2[m]] =generateOptionObj(data[j][toTransform2[m]],true);
                        }*/
                    }
                    return data;
                },
                // this is for the single business the account user is associated with
                trBusiness: function(business){
                    business = JSON.parse(business);
                    
                    // properties at the flat level
                    var toTransform1 = ["industry", "business_category"];

                    // properties at the embedded level (business_registrant)
                    var toTransform2 = ["department"];

                    var l = toTransform1.length;
                    var m = toTransform2.length;
                    for (var i = 0; i<l;i++){
                        var p = business[toTransform1[i]];
                        business[toTransform1[i]] = {};
                        business[toTransform1[i]].id = p;
                    }

                    var registrant = business.business_registrant;
                    for (var k=0; k<m; k++){
                        var n = registrant[toTransform2[k]];
                        registrant[toTransform2[k]] = {};
                        registrant[toTransform2[k]].id = n;
                    }

                    var businessDetail = business.business_detail;
                    businessDetail.service_range = {id:businessDetail.service_range};
                    businessDetail.service_area = {id: businessDetail.service_area};

                    console.log(business)
                    return business;
                }
            }

            // for subcategory, category, and any other property with an embedded object and id property within it (non-shallow). if the object is one dimension, then simply
            // create a display/value structure
            // generateOptionObj's purpose is to construct objects like
            // {display:'someName',value:'somename',id:'3kl4j2} from a raw server given obj such as {'id':'3kl4j2', name:'someName'}
            // used primarily to shape product data to fit dropdown option format.

            function generateOptionObj(productProp,isShallow){
                // just return if property doesnt exist
                if (!productProp){
                    return;
                }

                // a shallow property's value is a primitive value that is reconstructed here.
                if (isShallow){
                    console.log(productProp)
                    return  {
                        display:productProp,value:productProp.toLowerCase()
                    };
                }

                // a non-shallow property's value is an object that is reconstructed here.
                return {
                    display: productProp.name,
                    value: (productProp.name || "").toLowerCase(),
                    name: productProp.name,
                    id:productProp.id
                };
            }

            // sometimes the data we get sent back is an error message so we need to check for this. JSON.parsing a non-json strign will create error.
            function isJSON(str) {
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
            }
        }])
})(window, window.angular);