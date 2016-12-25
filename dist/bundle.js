/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(2);
	__webpack_require__(3);
	(function () {
	    var model = {};

	    var controller = {
	        init: function init() {
	            view.init();
	        }
	    };

	    var view = {
	        topDistance: 0,
	        maxHeight: 0,
	        title: null,
	        ticking: false,

	        init: function init() {
	            this.title = document.getElementById('title');
	            this.maxHeight = document.getElementsByClassName('intro')[0].offsetHeight;
	            this.initListeners();
	        },

	        initListeners: function initListeners() {
	            addEventListener("scroll", function (event) {
	                view.topDistance = scrollY;
	                if (view.topDistance < view.maxHeight) {
	                    view.requestTick(view.parallaxTitle);
	                }
	            });
	        },

	        /**
	         *   Performs CSS modifications on the title in order to achieve a parallax & blurr effect
	         */
	        parallaxTitle: function parallaxTitle() {
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
	        requestTick: function requestTick(updateFunc) {
	            if (!view.ticking) {
	                requestAnimationFrame(updateFunc);
	            }
	            view.ticking = true;
	        }
	    };

	    controller.init();
	})();

/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "index.html";

/***/ },
/* 3 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);