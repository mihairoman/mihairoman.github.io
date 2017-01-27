require('../index.html');
require('../stylesheets/sass/base.sass');
require('smoothscroll-polyfill').polyfill();
(function(w, doc) {
    let model = {
        header: "greetings",
        line1: "I'm Michael",
        line2_1: "an awesom",
        line2_2: "ll right ",
        line2_3: "web developer",
        line3: "let's create something together"
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
        currentHash: '#home',

        init: function() {
            this.body = doc.body;
            this.title = doc.getElementById('title');
            this.home = doc.getElementById('home');
            this.about = doc.getElementById('about');
            this.aboutWrapper = doc.getElementsByClassName('wrapper')[0];
            this.maxHeight = doc.getElementById('home').offsetHeight;
            this.greetingElem = doc.getElementById('greeting');
            this.navbar = doc.getElementsByClassName('navbar-list')[0];
            this.navIcon = document.getElementById('nav-icon');
            this.sections = document.getElementsByClassName('content');
            this.menuMin = doc.querySelector('.menu-min-wrapper');
            this.tldrBtn = doc.querySelector('.flat-button');
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
            view.navIcon.addEventListener('click', function() {
                let classes = view.navIcon.classList;
                view.changeBlurStatus();
                view.toggleClass(view.navIcon, 'open');
                view.toggleClass(view.menuMin, 'collapsed');
            });
            view.initNavigationClickListeners();
        },

        changeBlurStatus: function() {
            for (let item of view.sections) {
                view.toggleClass(item, 'blurred');
            }
        },

        toggleClass: function(elem, clsName) {
            if (elem && elem.classList) {
                if (elem.classList.contains(clsName)) {
                    elem.classList.remove(clsName);
                } else {
                    elem.classList.add(clsName);
                }
            }
        },

        writeGreeting: function() {
            view.toggleClass(doc.body, 'not-scrollable');
            let textArr = doc.querySelectorAll('#greeting>.text>.line'),
                highlight = doc.querySelector('.line-composed + .highlight');

            view.writeMessage(textArr[0], model.header, 55, 450).then(() => {
                return view.writeMessage(textArr[1], model.line1, 55, 250);
            }).then(() => {
                return view.writeMessage(textArr[2], model.line2_1, 55, 500);
            }).then(() => {
                return view.eraseCharactersFromEnd(textArr[2], 5, 55);
            }).then(() => {
                return view.writeMessage(textArr[2], model.line2_2, 55, 250);
            }).then(() => {
                return view.writeMessage(highlight, model.line2_3, 55, 250);
            }).then(() => {
                return view.writeMessage(textArr[3], model.line3, 55, 200);
            }).then(() => {
                setTimeout(function() {
                    view.toggleClass(doc.body, 'not-scrollable');
                }, 200);
                doc.querySelector('.arrow-down').classList.add('fadeInUp');
                view.navIcon.classList.add('fadeInLeft');
            });
        },

        writeMessage: function(element, message, speed = 60, resolveDelay = 0) {
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
            view.currentHash = newHash;
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
