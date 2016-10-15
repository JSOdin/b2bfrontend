(function (window, angular) {
    angular.module('common.tools.editInPlace', [])
        .directive('editInPlace',[function(){
            return {
                restrict:'A',                
                link:function(scope,el,attrs){
                    var inputs = $(el).find('input'); // find all input elements within this directive element
                    var i = angular.element(inputs[inputs.length-1]);        // grab only the last input element
                    var interactiveEl = $(el).find('.click-to-input');       // get the div containing the <p> and <input>

                    scope[attrs.ctrl].paperFields[attrs.variationIndex] = scope[attrs.ctrl].paperFields[attrs.variationIndex] || {};
                    scope[attrs.ctrl].paperFields[attrs.variationIndex][attrs.varietyIndex] = true;

                    interactiveEl.bind('click',function(e){                                          // click on the element (on which the directive resides to give focus to the input
                        scope[attrs.ctrl].paperFields[attrs.variationIndex][attrs.varietyIndex] = false;
                        scope.$apply();
                        i.focus();
                    });

                    i.bind('blur',function(){                            // losing focus
                        scope[attrs.ctrl].paperFields[attrs.variationIndex][attrs.varietyIndex] = true;
                        scope.$apply();
                    });

                    i.bind('keypress',function(e){                        // press enter to finish inputting
                        if ((e.which||e.charCode||e.keyCode) == 13){
                            scope[attrs.ctrl].paperFields[attrs.variationIndex][attrs.varietyIndex] = true;
                            scope.$apply();
                        }
                    })
                }
            }
        }])
})(window, window.angular);

// paperFields is an array, and its contents are objects with numeric keys each of which represent a variety. it keeps track of which variety is being edited.