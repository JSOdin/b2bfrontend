(function (window, angular) {
    angular.module('common.selectOptions', [])
        .factory('options',['$http','$q','responseTransformer','$window',function($http,$q,responseTransformer,$window){
            var options = {};
            var urls = {
                'country':'mockdata/country.json',
                'service_area': 'http://localhost:3000/getServiceAreas',
                'category':'mockdata/category.json',
                'general':'mockData/options.json',
                'subcategory': 'http://localhost:3000/getSubCategories',
                'commonname':'http://localhost:3000/getCommonNames'
            };

            // responseTransformers shape raw http response data into something that suits the application. there may be more than these two later.
            var transforms = {
                // country/category/subcategory data will have to be fetched separately from general options from database.
                callName: responseTransformer.trName,

                // these general form options come from harded coded python.
                general: responseTransformer.trGeneral
            }

            return {
                getOptions:getOptions,
                getFields:getFields,
                getData:getData,
                getDBOptionsByID:getDBOptionsByID,
                getDBOptionsByName: getDBOptionsByName,
                getCachedItem: getCachedItem,
                setCachedItem: setCachedItem
            };

            // extract data from the response
            function getData(res){
                return res.data;
            }


            // get the options bundle and cache it (either country or general or category)
            function getOptions(type){
                return !type ? options: options[type] ? $q.when(options[type]) : $http({method:'GET',url:urls[type],transformResponse:(type == 'general' ? transforms[type] : transforms.callName || $http.defaults.transformResponse) }).then(function(res){

                    return options[type] = getData(res);
                })
            }

            // get options from DB (e.g. pass in category ID, get subcategories). complex options
            function getDBOptionsByID(type,ID){
                var requestObj = {method:'GET',params:{id:ID},url:urls[type],transformResponse:(type == 'general' ? transforms[type] : transforms.callName || $http.defaults.transformResponse) };
             /*   if (optionalParams){
                    requestObj.params.optionalParams = optionalParams;
                }*/
                return !type ? options : options[type] && options[type][ID] ? $q.when(options[type][ID]) :  $http(requestObj).then(function(res){
                    options[type] = options[type] || {};
                    return options[type][ID] = getData(res);
                })
            }

            // get options from DB by name param
            function getDBOptionsByName(type,name){
                return $http.get(urls[type],{'params':{name:name}});
            }

            // get individual field options (for general options)
            function getFields(type,key){
                // python code has the keys capitalized
                key = key.toUpperCase();
                return getOptions(type).then(function successHandler(data){
                    return data[key];
                })
            }

            // retrieve items stored in $window.localStorage
            function getCachedItem(key){
                var localStorage = $window.localStorage,
                    val = localStorage.getItem(key) || '{}';
                    return JSON.parse(val);
            }
            
            // set items stored in $window.localStorage
            function setCachedItem(key, data){
                localStorage.setItem(key,data);
            }
        }])
})(window, window.angular);