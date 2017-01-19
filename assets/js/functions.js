require('../index.html');
require('../stylesheets/sass/base.sass');
require('smoothscroll-polyfill').polyfill();
(function(w, doc) {
    let model = {
        header: "an introductory haiku",
        verse1: "greetings, Michael here",
        verse2_1: "an awesom",
        verse2_2: "ll right developer",
        verse3: "let's build together"
    };

    let controller = {
        init: function() {
            view.init();
        }
    };

    let view = {
        topDistance: 0,
        maxHeight: 0,
        title: null,
        ticking: false,
        delay: false,
        greetingElem: null,

        init: function() {
            this.body = doc.body;
            this.title = doc.getElementById('title');
            this.home = doc.getElementById('home');
            this.about = doc.getElementById('about');
            this.aboutWrapper = doc.getElementsByClassName('wrapper')[0];
            this.titleCursor = doc.getElementById("cursor");
            this.maxHeight = doc.getElementById('home').offsetHeight;
            this.greetingElem = doc.getElementById('greeting');
            this.navbar = doc.getElementsByClassName('navbar-list')[0];
            this.initEventListeners();
        },

        initEventListeners: function() {
            w.onbeforeunload = function(event) {
                w.scrollTo(0, 0);
            };
            w.addEventListener('DOMContentLoaded', function(event) {
                setTimeout(view.writeGreeting, 300);
            });
            w.addEventListener("scroll", function(event) {
                // view.topDistance = scrollY;
                // if (view.topDistance < view.maxHeight) {
                //     view.requestTick(view.parallaxTitle);
                // }
            });
            view.initNavigationClickListeners();
        },

        writeGreeting: function() {
            view.body.classList.add('not-scrollable');
            let elem = doc.querySelector('#haiku>header'),
                versesArr = doc.querySelectorAll('.poem>.verse');

            view.writeMessage(elem, model.header, 65, 750).then(() => {
                return view.writeMessage(versesArr[0], model.verse1, 65, 550);
            }).then(() => {
                return view.writeMessage(versesArr[1], model.verse2_1, 65, 450);
            }).then(() => {
                return view.eraseCharactersFromEnd(versesArr[1], 5, 65);
            }).then(() => {
                return view.writeMessage(versesArr[1], model.verse2_2, 65, 550);
            }).then(() => {
                return view.writeMessage(versesArr[2], model.verse3, 65, 200);
            }).then(() => {
                setTimeout(function() {
                    view.body.classList.remove('not-scrollable');
                }, 200);
            });
        },

        writeMessage: function(element, message, speed = 80, resolveDelay = 0) {
            if (!element) {
                return;
            }
            let greetingArr = message.split(""),
                arrLength = view.greetingLength = greetingArr.length,
                i = 0,
                promiseChain = [];

            return new Promise(function(resolve, reject) {
                for (i; i < arrLength; i++) {
                    let prom = view.typeCharacter(element, greetingArr[i], i, speed);
                    promiseChain.push(prom);
                }
                Promise.all(promiseChain).then(() => {
                    //Small delay after finishing writing the message
                    setTimeout(resolve, resolveDelay);
                });
            });
        },

        typeCharacter: function(element, char, index, speed) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    element.innerHTML += char;
                    resolve();
                }, index * speed);
            });
        },

        eraseCharactersFromEnd: function(element, nrOfChars, speed = 100) {
            let i = 0,
                msgLength = element.innerHTML.length,
                promChain = [];

            return new Promise(function(resolve, reject) {
                for (i; i < nrOfChars; i++) {
                    let prom = view.eraseCharacter(element, --msgLength, i, speed);
                    promChain.push(prom);
                }
                Promise.all(promChain).then(resolve);
            });
        },

        eraseCharacter: function(element, msgLength, index, speed) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    element.innerHTML = element.innerHTML.substr(0, msgLength);
                    resolve();
                }, index * speed);
            });
        },

        changeCursorAnimation: function(state) {
            return new Promise(function(resolve, reject) {
                view.titleCursor.style.WebkitAnimationPlayState = state;
                view.titleCursor.style.animationPlayState = state;
                resolve();
            });
        },

        displayMenu: function() {
            let listElems = view.navbar.children,
                i = 0;
            for (i; i < listElems.length; i++) {
                (function(elem, index) {
                    setTimeout(function() {
                        elem.classList.add('visible-menu-item');
                    }, 100 * (index * 3));
                })(listElems[i], i);
            }
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
        },


        initNavigationClickListeners: function() {
            //.wrapper-vertical-nav>ul>li>a'
            let navElems = doc.querySelectorAll('nav>ul>li>a'),
                i = 0,
                length = navElems.length;
            for (i; i < length; i++) {
                let elem = navElems[i];
                elem.onclick = function(event) {
                    event.preventDefault();
                    let to = elem.getAttribute('href');
                    view.updateSelectedNavItem(elem, to);
                    doc.querySelector(to).scrollIntoView({
                        behavior: 'smooth'
                    });
                    //view.changeURLHash(to);
                };
            }
        },

        // initCustomScroll: function() {
        //     view.topDistance = w.pageYOffset || w.scrollTop;
        //     w.scroll = w.onmousewheel = w.onwheel = function(event) {
        //         let st = w.pageYOffset || doc.documentElement.scrollTop;
        //         if (st > view.topDistance) {
        //             //donwscroll code
        //             let currentNavItem = doc.querySelector('nav>ul>.selected-nav-item'),
        //                 nextNavItem = currentNavItem.nextElementSibling;
        //             if (nextNavItem) {
        //                 let anchorElem = nextNavItem.getElementsByTagName('a')[0],
        //                     nextLocation = anchorElem.getAttribute('href');
        //                 view.updateSelectedNavItem(nextNavItem, nextLocation);
        //                 view.ticking = false;
        //                 view.requestTick(function() {
        //                     doc.querySelector(nextLocation).scrollIntoView({
        //                         behavior: 'smooth'
        //                     });
        //                 });
        //             }
        //         } else {
        //             // upscroll code
        //             let currentNavItem = doc.querySelector('nav>ul>.selected-nav-item'),
        //                 prevNavItem = currentNavItem.previousElementSibling;
        //             if (prevNavItem) {
        //                 let anchorElem = prevNavItem.getElementsByTagName('a')[0],
        //                     nextLocation = anchorElem.getAttribute('href');
        //                 view.updateSelectedNavItem(prevNavItem, nextLocation);
        //                 view.ticking = false;
        //                 view.requestTick(function() {
        //                     doc.querySelector(nextLocation).scrollIntoView({
        //                         behavior: 'instant'
        //                     });
        //                 });
        //             }
        //         }
        //         view.topDistance = st;
        //     };
        // },

        updateSelectedNavItem: function(newElem, newLocation) {
            // doc.querySelector('nav>ul>.selected-nav-item').classList.remove('selected-nav-item');
            // if (newElem.tagName === 'LI') {
            //     newElem.classList.add('selected-nav-item');
            // } else {
            //     newElem.parentElement.classList.add('selected-nav-item');
            // }
            view.changeURLHash(newLocation);
        },

        changeURLHash: function(newHash) {
            if (history.pushState) {
                w.history.pushState(null, null, `${newHash}`);
            } else {
                location.hash = newHash;
            }
        }
    };

    controller.init();
})(window, document);

//view.initCustomScroll();
//     w.onmousewheel = w.onwheel = function(event) {
//         view.topDistance = scrollY;
//         event.preventDefault();
//         if (view.delay) {
//             return
//         };
//         view.delay = true;
//         setTimeout(function() {
//             view.delay = false
//         }, 200);
//         let wd = event.wheelDelta || -event.detail;
//         let content = doc.getElementsByClassName('content');
//         if (wd < 0) {
//             for (let i = 0; i < content.length; i++) {
//                 let t = content[i].getClientRects()[0].top;
//                 if (t >= 40) break;
//             }
//         } else {
//             for (let i = content.length - 1; i >= 0; i--) {
//                 let t = content[i].getClientRects()[0].top;
//                 if (t < -20) break;
//             }
//         }
//         //view.requestTick();
//     };
