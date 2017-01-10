require('../index.html');
require('../stylesheets/sass/base.sass');
(function() {
    var model = {
        greeting_p1: "Hi there, I'm Mihai",
        greeting_p2: "chael and I'm an amaz",
        greeting_p3: "ll right developer"
    };

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
        greetingElem: null,

        init: function() {
            this.title = document.getElementById('title');
            this.titleCursor = document.getElementById("cursor");
            this.maxHeight = document.getElementsByClassName('intro')[0].offsetHeight;
            this.greetingElem = document.getElementById('greeting');
            this.initListeners();
        },

        initListeners: function() {
            addEventListener('DOMContentLoaded', function(event) {
                view.writeGreeting();
            });

            // addEventListener("scroll", function(event) {
            //     view.topDistance = scrollY;
            //     if (view.topDistance < view.maxHeight) {
            //         view.requestTick(view.parallaxTitle);
            //     }
            // });
        },

        writeGreeting: function() {
            view.changeCursorAnimation('paused').then(() => {
                return view.writeMessage(model.greeting_p1)
            }).then(() => {
                return view.eraseCharactersFromEnd(3);
            }).then(() => {
                return view.writeMessage(model.greeting_p2);
            }).then(() => {
                return view.eraseCharactersFromEnd(3);
            }).then(() => {
                return view.writeMessage(model.greeting_p3);
            }).then(() => {
                return view.changeCursorAnimation('running');
            });

        },

        writeMessage: function(message) {
            var greetingArr = message.split(""),
                arrLength = view.greetingLength = greetingArr.length,
                i = 0,
                promiseChain = [];

            return new Promise(function(resolve, reject) {
                for (i; i < arrLength; i++) {
                    var prom = view.typeCharacter(greetingArr[i], i);
                    promiseChain.push(prom);
                }
                Promise.all(promiseChain).then(() => {
                    //Small delay after finishing writing the message
                    setTimeout(resolve, 200);
                });
            });
        },

        typeCharacter: function(char, index, speed = 100) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    view.greetingElem.innerHTML += char;
                    resolve();
                }, index * speed);
            });
        },

        eraseCharactersFromEnd: function(nrOfChars) {
            var i = 0,
                msgLength = view.greetingElem.innerHTML.length,
                promChain = [];

            return new Promise(function(resolve, reject) {
                for (i; i < nrOfChars; i++) {
                    var prom = view.eraseCharacter(--msgLength, i);
                    promChain.push(prom);
                }
                Promise.all(promChain).then(resolve);
            });
        },

        eraseCharacter: function(msgLength, index, speed = 110) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    view.greetingElem.innerHTML = view.greetingElem.innerHTML.substr(0, msgLength);
                    resolve();
                }, index * speed);
            });
        },

        changeCursorAnimation: function(state) {
            return new Promise(function(resolve, reject) {
                view.titleCursor.style.WebkitAnimationPlayState = state;
                view.titleCursor.style.animationPlayState = state;
                resolve();
            })
        },

        /**
         *   Performs CSS modifications on the title in order to achieve a parallax & blurr effect
         */
        parallaxTitle: function() {
            view.ticking = false;
            //view.title.style.transform = `translate(0px, ${view.topDistance/2.2}px)`;
            //view.title.style.webkitFilter = `blur(${view.topDistance/300}px)`;
            //  view.title.style.transform = `scale(${1-view.topDistance/2000})`;
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
