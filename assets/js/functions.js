(function() {

    var model = {};

    var controller = {
        init: function() {
            view.init();
        }
    };

    var view = {
        topDistance: 0,
        maxHeight: 0,
        title: null,
        ticking: false,

        init: function() {
            this.title = document.getElementById('title');
            this.maxHeight = document.getElementsByClassName('intro')[0].offsetHeight;
            this.initListeners();
        },

        initListeners: function() {
            addEventListener("scroll", function(event) {
                view.topDistance = scrollY;
                if (view.topDistance < view.maxHeight) {
                    view.requestTick(view.parallaxTitle);
                }
            });
        },

        /**
         *   Performs CSS modifications on the title in order to achieve a parallax & blurr effect
         */
        parallaxTitle: function() {
            view.ticking = false;
            view.title.style.transform = `translate(0px, ${view.topDistance/2.2}px)`;
            view.title.style.webkitFilter = `blur(${view.topDistance/300}px)`;
        },

        /**
         *   General function for animation optimizations. Passes to {@link requestAnimationFrame} the function
         *   which performs DOM modifications. If a {@link requestAnimationFrame} is already requested, we won't initiate another one.
         *  @param {function} updateFunc - Function which performs the animations
         */
        requestTick: function(updateFunc) {
            if (!view.ticking) {
                requestAnimationFrame(updateFunc);
            }
            view.ticking = true;
        }
    };

    controller.init();
})();
