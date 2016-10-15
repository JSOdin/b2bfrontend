(function (window, angular) {
    angular.module('account.businessDetails')
        .directive('productProfile', ['options','products','$http','$timeout','$window',function (options,products,$http,$timeout,$window) {
            return {
                restrict: 'E',
                scope:{
                  product:'=',
                  validation:'='
                },
                templateUrl: 'src/js/app/account/businessDetails/tabs/mainProducts/productGallery/addProduct/productProfile/productProfile.tmpl.html',
                link: function (scope, el, attrs) {
                    scope.options = {};
                    scope.doNotFetchSubCategories = false;

                    // this is for new product add. we call for a fresh list of categories and subcategories
                    if (!scope.product.category.id){
                        getCategories().then(function(){
                            getSubCategories(scope.options.categories[0].id);
                        })

                    // if we are editing an existing product. then the select element will be disabled.
                    } else {
                        scope.options.categories = [scope.product.category];
                        scope.options.sub_categories = [scope.product.sub_category];
                    }

                    // initial setup of form dropdown field (industry)
                    // for "general" can use either getFields or getOptions. getFields just looks more expressive.
                    options.getFields('general','INDUSTRY').then(function (data){
                        scope.options.industries = data;
                        scope.product.industry = scope.product.industry || scope.options.industries[0];
                    });

                    // TODO make algorithm for checking product object for any changes and returning only changed keys

                    // autocomplete implementation
                    // set the typeahead template url
                    scope.template = {};
                    scope.template.url = 'src/js/app/account/businessDetails/tabs/mainProducts/productGallery/addProduct/productProfile/productProfile.tmpl.html';                 

                    // to save the ng-model typed input because it gets lost if we select a typeahead item.
                    scope.inputCache = '';

                    // called when typeahead item is selected.
                    scope.setModels = function(item, model, label, event,product){

                        // override the default behavior of ui-typeahead. instead of setting ng-model to selected value, we set it to the inputcache (which is what we type in)
                        scope.product.name = scope.inputCache;

                        // fetched common name objects have category and sub_category properties. {name: 'Dairy', sub_category:{}, category: {}}. if we select a common name, we already have the category and sub_category.
                        // prevent fetching the list of categories and sub categories because we dont need it.
                        scope.doNotFetchSubCategories = true;

                        // {name:'Dairy', sub_category:{}, category: {}} the selected item
                        scope.product.category = item.category;
                        scope.product.sub_category = item.sub_category;
                        scope.product.common_name = {"display": item.name, "value":item.name.toLowerCase(),"name":item.name,"id":item.id};

                        // categories options reduces to just one item because we chose a common name (which has a category property.)
                        scope.options.categories = [item.category];
                        scope.options.sub_categories = [item.sub_category];

                        // set donotFetchSubcategories to false after one second
                        // some hacky solution to prevent fetching of subcategories when we've selected a suggested a common name.
                        // subcategories should be fetched only when user inputs a custom common name.

                        $timeout(function(){
                            scope.doNotFetchSubCategories=false;
                        },1000);
                    };

                    scope.getCommonNames = function(inputValue){
                        // workaround for ui-typeahead not storing typed input values and auto-assigning ng-model to the selected dropdown item (which we dont want, we want to keep the input value.
                        scope.inputCache = inputValue;
                        // require more than two letters as input
                        if (inputValue && inputValue.length > 2){
                            inputValue = inputValue.toLowerCase();

                            var commonNameCache = options.getCachedItem('commonNameCache');

                            // delete the expired cache for common names.
                            for (var prop in commonNameCache){
                                if (commonNameCache.hasOwnProperty(prop) && cacheExpired(commonNameCache, prop)){
                                    delete commonNameCache[prop];
                                }
                            }

                            return options.getDBOptionsByName('commonname',inputValue).then(function(res){
                                if (commonNameCache && commonNameCache[inputValue]){
                                    return commonNameCache[inputValue].data;
                                }

                                // TODO refactor into its own transformer (maybe not?)
                                var data = (res.data || []).map(function(ea){
                                    return {
                                        name:ea.name,
                                        sub_category: {
                                            display: ea.sub_category.name,
                                            value: ea.sub_category.name.toLowerCase(),
                                            id:ea.sub_category.id
                                        },
                                        category: {
                                            display: ea.category.name,
                                            value: ea.category.name.toLowerCase(),
                                            id:ea.category.id
                                        },
                                        id: ea.id
                                    }
                                });

                                // cache common names. set expiry to 1minute so on expire
                                commonNameCache[inputValue] = {};
                                commonNameCache[inputValue].expiry = new Date(new Date().getTime() + 60000);
                                commonNameCache[inputValue].data = data;
                                options.setCachedItem('commonNameCache',JSON.stringify(commonNameCache));

                                return data;
                            })
                        }
                    }

                    var commonNameInput = angular.element($('.common-name')[0]);

                    // show all categories when typing; meant for user custom input
                    commonNameInput.bind('keypress',function(e){
                        // resetting category. why? because you want to be able to edit a product into one that does not have common name.
                        // not resetting takes away the option of choosing a cat/sub-cat as you are always stuck with a single one.
                        //
                        getCategories().then(function(){
                            // resetting sub category
                            getSubCategories(scope.options.categories[0].id);
                        })

                        // resetting food common name field
                        scope.product.common_name = {};
                        scope.product.category = {};
                        scope.product.sub_category = {};
                    });

                    function getCategories(){
                        return options.getOptions('category').then(function(data){

                            scope.options.categories = data;
                            scope.product.category = data[0];
                        });
                    }

                    // separate call
                    // category.id is a mandatory selection for all item creation. will not be allowed to create new item if category is not selected.

                    function getSubCategories(id){
                        return options.getDBOptionsByID('subcategory',id).then(function(data){
                            scope.options.sub_categories = data;
                            scope.product.sub_category = data[0];
                        },function errcb(){
                            scope.options.sub_categories = [];
                        });
                    }


                    // sub_categories should change for each category so watch for changes in product.category model
                    // 
                    scope.$watch('product.category',function(newVal,oldVal){
                        if (newVal && oldVal && !scope.doNotFetchSubCategories && (newVal.id != (oldVal.id))){
                            getSubCategories(newVal.id);
                        }
                    })

                    function cacheExpired(cache, prop){
                        return !cache[prop] || new Date(cache[prop].expiry).getTime() <= new Date().getTime();
                    }
                }
            }
        }])
})(window, window.angular);
