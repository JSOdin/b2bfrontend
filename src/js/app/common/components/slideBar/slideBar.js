(function (window, angular) {
    angular.module('common.components.slideBar', [])
        .service('slideBar',['$document',function($document){
            /*** a reusable one-way slider ***/

            // TODO convert this into angular-way
            // TODO learn more about https://github.com/skidding/dragdealer/blob/master/src/dragdealer.js

            /*
             1. offsetX : distance from target element left edge to mouse X position (within the element)
             2. clientX : distance from viewport edge to mouse X
             3. btn.getClientRects()[0] : get dimensions of element including relationships to surroundings
             4. btn.getClientRects()[0].left : get distance between left edge of element to viewport left edge
             5. btn.getClientRects()[0].width : get element's width
             6. btn.offsetLeft : get the distance from slidebar left edge to button left edge
             7. element.getBoundingClientRect : get size of element and its position relative to the viewport.
             8. element.scrollLeft : left position of cursor within the element
             
             */
            
             var slideBar= this,
                 mouseX, mouseY;

             // fix for e.clientX not changing on drag in firefox.
             // http://stackoverflow.com/questions/23992091/drag-and-drop-directive-no-e-clientx-or-e-clienty-on-drag-event-in-firefox
             // clientX is available through the document event.
             $document.on("dragover",function(event){
                 mouseX = event.originalEvent.clientX;
                 mouseY = event.originalEvent.clientY;
             })

             slideBar.el = function (options){
                this.options = options || {};
                this.elements = {};
                this.init();
                this.bindCallbacks();
                this.addEventListeners();
            };
            
            slideBar.el.prototype = {
                bind:function(fn,context){
                    return function(){
                        return fn.apply(context,arguments);
                    }
                },
                init:function(){
                    this.handle = this.getElement(this.options.handle);
                    this.colorSpace = this.getElement(this.options.colorSpace);
                    this.wrapper = this.getElement(this.options.wrapper);
                    this.infoBox = this.getElement(this.options.infoBox);
                    this.status = {};
                    this.offset = 0;
                    // enable dragging
                    this.handle.draggable = true;
                    this.scope = this.options.scope;
                },
                getElement:function(elementName){
                    this.elements[elementName] = this.elements[elementName] || document.getElementsByClassName(elementName)[0];
                    return this.elements[elementName];
                },
                bindCallbacks:function(){
                    // absolutely necessary because when passed in as a callback, "this" in onDragStart/onDrag/onDragDropOver is no longer the object instance, but "window".
                    this.onDragStart = this.bind(this.onDragStart,this);
                    this.onDrag = this.bind(this.onDrag,this);
                    this.onDragDropOver = this.bind(this.onDragDropOver,this);
                },
                addEventListener:function(el,ev,handler){
                    el.addEventListener(ev,handler);
                },
                addEventListeners:function(){
                    this.addEventListener(this.handle,'dragstart',this.onDragStart);
                    this.addEventListener(this.handle,'drag',this.onDrag);
                    this.addEventListener(this.handle,'dragover',this.onDragDropOver);
                    this.addEventListener(this.handle,'drop',this.onDragDropOver);

                },
                onDragStart: function(e){
                    // in a drag cycle, mouse will be held down.  this offset value should be kept consistent during the cycle so we cache it once.                  

                    // drag event will not fire without this line in firefox
                    // http://stackoverflow.com/questions/27788991/the-drag-event-not-firing-in-firefox-or-ie
                    e.dataTransfer.setData('application/node type', this);

                    this.offset = e.offsetX;
                },
                onDrag: function(e){         

                    var handle = this.handle;
                    var cs = this.colorSpace;
                    var wrapper = this.wrapper;
                    var infobox = this.infoBox;

                    // if reached the end of the slide bar. width of slidebar minus slide btn width should equal to "left"
                    if (~~handle.offsetLeft  >= ~~(wrapper.getClientRects()[0].width - handle.getClientRects()[0].width)){

                        handle.style.left = wrapper.getClientRects()[0].width -handle.getClientRects()[0].width +'px';
                        cs.style.width = handle.style.left;
                        infobox.innerHTML = 'Verified';
                        infobox.style.color = 'white';
                        this.scope.verification.verified = true;
                        // angular doesn't know about native javascript listeners so we need to $apply() for the digest cycle to take place. "scope" here is same as registrationController's scope
                        this.scope.$apply();
                        handle.removeEventListener('drag', this.onDrag,false);
                        return;
                    }

                    // mouse position - offsetX - distance from viewport left edge to parent left edge

                    // TODO problem spot here. e.clientX not changing in firefox.

                    /*handle.style.left = e.clientX - this.offset-  handle.parentElement.getClientRects()[0].left + 'px';*/

                    // fix for firefox.
                    handle.style.left = mouseX - this.offset-  handle.parentElement.getClientRects()[0].left + 'px';
                    cs.style.width = handle.style.left;

                    // if reached the beginning of slide bar
                    if (handle.offsetLeft <=0) {
                        handle.style.left = 0;
                        cs.style.width = handle.style.left;
                    }
                },
                onDragDropOver:function(e){
                    // preventative measure to stop clientX to reset to 0 for some reason
                    e.preventDefault();
                }
            }
        }])
        
})(window, window.angular);