(function(w, doc) {
    const zenscroll = require('zenscroll');
    require('../index.html');
    require('../stylesheets/sass/base.sass');
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
        currentHash: '#home',

        init: function() {
            this.body = doc.body;
            this.title = doc.querySelector('.text');
            this.home = doc.getElementById('home');
            this.experience = doc.getElementById('experience');
            this.contact = doc.getElementById('contact');
            this.nameElem = doc.getElementById('name');
            this.about = doc.getElementById('about');
            this.timeline = document.querySelector('.timeline-line');
            this.timelineElems = document.querySelectorAll('#experience .timeline>.row:not(.end)');
            this.aboutWrapper = doc.getElementsByClassName('wrapper')[0];
            this.maxHeight = doc.getElementById('home').offsetHeight;
            this.verticalNav = doc.getElementById('vertical-nav');
            this.navIcon = document.getElementById('nav-icon');
            this.sections = document.getElementsByClassName('content');
            this.menuMin = doc.querySelector('.menu-min-wrapper');
            this.initEventListeners();
            this.initHome();
            this.initAbout();
            this.initExperience();
        },

        initEventListeners: function() {
            w.addEventListener('DOMContentLoaded', function(event) {
                w.location.hash = "";
                w.onbeforeunload = function(event) {
                    w.scrollTo(0, 0);
                    w.location.hash = "";
                };
                view.navIcon.addEventListener('click', function() {
                    let classes = view.navIcon.classList;
                    view.toggleClass(view.navIcon, 'open');
                    view.toggleClass(view.menuMin, 'collapsed');
                });
                w.scroll = w.onmousewheel = w.onwheel = function(event) {
                    // view.topDistance = scrollY;
                    // if (view.topDistance < view.maxHeight) {
                    //     view.requestTick(view.parallaxTitle);
                    // }
                    if (view.experience.getBoundingClientRect().top < (view.experience.offsetHeight * 0.8)) {
                        view.revealTimeline();
                    }
                    if (view.experience.getBoundingClientRect().top < -20) {
                        view.requestTick(view.initContact);
                    }

                };
                view.initNavigationClickListeners();
            });
        },

        changeBlurStatus: function() {
            for (let item of view.sections) {
                view.toggleClass(item, 'blurred');
            }
        },

        initExperience: function() {
            let timelineList = view.experience.querySelectorAll('.row'),
                i = timelineList.length;
            for (i; i--;) {
                timelineList[i].addEventListener('click', function(event) {
                    if (event.target.tagName.toLowerCase() === "li") {
                        let classes = event.target.classList.toString(),
                            linkNr = classes.match(/linked-[0-9]/),
                            matchedEndRow = view.experience.querySelector(`.end.${linkNr}`);
                        view.toggleClass(matchedEndRow, 'revealed');
                    }
                }, true);
            }
        },

        revealTimeline: function() {
            view.timeline.classList.add('revealed');
            view.addClassToListElems(view.timelineElems, 'revealed', 150);
        },

        revealVerticalNav: function() {
            let verticalNavElems = view.verticalNav.querySelectorAll('li');
            view.addClassToListElems(verticalNavElems, 'revealed', 150);
        },

        initContact: function() {
            let contactList = view.contact.querySelectorAll('li'),
                contactTitle = view.contact.querySelector('.content-title'),
                i = contactList.length;
            contactTitle.classList.add('revealed');
            for (i; i--;) {
                setTimeout((function(index) {
                    return function() {
                        contactList[index].classList.add('revealed');
                        contactList[index].addEventListener('click', function(event) {
                            event.preventDefault();
                            let link = event.target.parentElement.getAttribute('href');
                            w.open(link, '_blank');
                        });
                    }
                })(i), 100 * i);
            }
        },

        /** Checks if element is visible on screen in reference to what percentage of the element is visible
         *** @param {HTMLelement} element - the element to check
         *** @param {Number} percentOfElemVisible - the percentage of the element which represents
         *** the threshold at which the element is considered visible or not (values from 0 to 100)
         **/
        isElemOnScreen: function(element, percentOfElemVisible) {
            let elemHeight = element.offsetHeight,
                distFromTop = element.getBoundingClientRect().top,
                threshold = elemHeight * (percentOfElemVisible / 100);
            return (elemHeight + distFromTop) > threshold;
        },

        changeMenuIconColor: function() {
            let aboutHeight = view.about.offsetHeight,
                aboutTopOffset = view.about.getBoundingClientRect().top;
            console.log(aboutHeight, aboutTopOffset);
            view.ticking = false;
            if (aboutTopOffset < 100 && (aboutHeight + aboutTopOffset) > 0) {
                if (!view.navIcon.classList.contains('negative')) {
                    view.navIcon.classList.add('negative');
                }
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

        addClassToListElems: function(list, newClass, delay) {
            if (list && list.length) {
                let i = 0,
                    n = list.length;
                for (i; i < n; i++) {
                    setTimeout((function(index) {
                        return function() {
                            list[index].classList.add(newClass);
                        }
                    })(i), delay * i);
                }
            }
        },

        addAnimationToRandomElem: function(list, animationCls) {
            let rand = Math.floor(Math.random() * list.length);
            list[rand].classList.add(animationCls);
            setTimeout(function() {
                list[rand].classList.remove(animationCls);
            }, 1100);
        },

        initHome: function() {
            setTimeout(view.writeName, 1000);
            view.navIcon.classList.add('fadeInLeft');
            view.home.classList.add('minified');
            view.title.classList.add('revealed');
            setTimeout(view.revealVerticalNav, 1000);
        },

        initAbout: function() {
            let details = doc.querySelectorAll('#about .detail'),
                i = details.length,
                items = doc.querySelectorAll('.detail .items>li');
            for (i; i--;) {
                details[i].classList.add('revealed');
            }
            setInterval(function() {
                if ((view.about.getBoundingClientRect().top + view.about.offsetHeight) > 100) {
                    view.addAnimationToRandomElem(items, 'is-emph');
                }
            }, 2500);
        },

        /*
         * TODO: clean up this callback hell
         */
        writeName: function() {
            let nameElem = doc.getElementById('name'),
                calledStaus = false;
            setInterval(function writeStuff() {
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
                    return writeStuff;
                }(),
                6000);
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
            let navElems = doc.querySelectorAll('nav>ul>li>a'),
                i = navElems.length;
            for (i; i--;) {
                let elem = navElems[i];
                elem.addEventListener('click', view.navLinkClick);
            }
        },

        navLinkClick: function(e) {
            e.preventDefault();
            let elem = e.target,
                to = elem.getAttribute('href');
            view.toggleClass(view.navIcon, 'open');
            view.toggleClass(view.menuMin, 'collapsed');
            zenscroll.intoView(doc.querySelector(to), 100);
            if (to === "#contact") {
                view.initContact();
                view.revealTimeline();
            } else if (to === "#experience") {
                view.revealTimeline();
            }
            return false;
        },

        updateSelectedNavItem: function(newElem, newLocation) {
            doc.querySelector('nav>ul>.selected-nav-item').classList.remove('selected-nav-item');
            if (newElem.tagName === 'LI') {
                newElem.classList.add('selected-nav-item');
            } else {
                newElem.parentElement.classList.add('selected-nav-item');
            }
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
