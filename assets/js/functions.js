require('../index.html');
require('../stylesheets/sass/base.sass');
require('smoothscroll-polyfill').polyfill();
(function(w, doc) {
    let model = {
        names: ['Michael', 'Mickaël', 'Mihai']
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
            this.nameElem = doc.getElementById('name');
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
            this.initAbout();
        },

        initEventListeners: function() {
            w.onbeforeunload = function(event) {
                w.scrollTo(0, 0);
            };
            w.addEventListener('DOMContentLoaded', function(event) {
                view.initHome();
            });
            w.scroll = w.onmousewheel = w.onwheel = function(event) {
                // view.topDistance = scrollY;
                // if (view.topDistance < view.maxHeight) {
                //     view.requestTick(view.parallaxTitle);
                // }
                view.requestTick(view.changeMenuIconStatus);
            };
            view.navIcon.addEventListener('click', function() {
                let classes = view.navIcon.classList;
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

        /** Checks if element is visible on screen in reference to what percentage of the element is visible
         *** @param {HTMLelement} element - the element to check
         *** @param {Number} percentOfElemVisible - the percentage of the element which represents
         ***                                         the threshold at which the element is considered visible or not (values from 0 to 100)
         **/
        isElemOnScreen: function(element, percentOfElemVisible) {
            let elemHeight = element.offsetHeight,
                distFromTop = element.getBoundingClientRect().top,
                threshold = elemHeight * (percentOfElemVisible / 100);
            return (elemHeight + distFromTop) > threshold;
        },

        changeMenuIconStatus: function() {
            view.ticking = false;
            if (view.about.getBoundingClientRect().top < 0) {
                view.navIcon.classList.add('negative');
            } else {
                view.navIcon.classList.remove('negative');
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

        addAnimationToRandomElem: function(list, animationCls) {
            let rand = Math.floor(Math.random() * list.length);
            list[rand].classList.add(animationCls);
            setTimeout(function() {
                list[rand].classList.remove(animationCls)
            }, 1100);
        },

        initHome: function() {
            view.writeName();
        },

        initAbout: function() {
            let items = doc.querySelectorAll('.detail .items>li');
            setInterval(function() {
                view.addAnimationToRandomElem(items, 'is-emph');
            }, 2500);
        },


        writeName: function() {
            let nameElem = doc.getElementById('name'),
                calledStaus = false;

            setInterval(function() {
                    if (!calledStaus && view.isElemOnScreen(view.home, 40)) {
                        calledStaus = true;
                        (function() {
                            view.eraseCharactersFromEnd(nameElem, view.nameElem.innerHTML.length - 2, 60).then(() => {
                                return view.writeMessage(nameElem, model.names[0], 60, 1300).then(() => {
                                    return view.eraseCharactersFromEnd(nameElem, model.names[0].length, 60).then(() => {
                                        return view.writeMessage(nameElem, model.names[1], 60, 1300).then(() => {
                                            return view.eraseCharactersFromEnd(nameElem, model.names[1].length, 60).then(() => {
                                                return view.writeMessage(nameElem, model.names[2], 60, 1300).then(() => {
                                                    calledStaus = false;
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        })();
                    }
                },
                6000);
            view.navIcon.classList.add('fadeInLeft');
        },

        /**
         *   Writes letter by letter a message to a DOM element. Returns a {Promise}
         *   @param {HTMLelement} element - the DOM element in which the message will be written
         *   @param {String} message - the message
         *   @param {Number} speed - the speed at which to write the characters
         *   @param {Number} resolveDelay - the delay for the callback function
         **/
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

        // displayMenu: function() {
        //     let listElems = view.navbar.children,
        //         i = 0;
        //     for (i; i < listElems.length; i++) {
        //         (function(elem, index) {
        //             setTimeout(function() {
        //                 elem.classList.add('visible-menu-item');
        //             }, 100 * (index * 3));
        //         })(listElems[i], i);
        //     }
        // },

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
