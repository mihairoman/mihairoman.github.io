(function() {

    var model = {
        title: null
    };

    var octopus = {
        init: function() {
            model.title = document.getElementById('title');

            view.init();
        },
        getTitle: function() {
            return model.title;
        }
    };

    var view = {
        init: function() {
            addEventListener("scroll", function(event) {
                var title = octopus.getTitle(),
                    distance = document.body.scrollTop;
                title.style.transform = `translate(0px, ${distance/2.2}px)`;
                title.style.webkitFilter = `blur(${distance/300}px)`;
            });
        }
    };

    octopus.init();
})();
