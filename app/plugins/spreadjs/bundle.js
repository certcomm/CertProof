/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/plugins/spreadjs/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/plugins/spreadjs/index.js":
/*!***************************************!*\
  !*** ./app/plugins/spreadjs/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var gc = __webpack_require__(/*! @grapecity/spread-sheets */ \"./node_modules/@grapecity/spread-sheets/index.js\");\r\n\r\n// var ssLicense = process.env.npm_package_config_SPREADJS_LICENSE.replace (/(^\")|(\"$)/g, '')\r\n// gc.Spread.Sheets.LicenseKey = ssLicense;\r\n\r\nvar onLoadInitializeSpreadSheet = function (id, data, isLinkClicked, license) {\r\n    gc.Spread.Sheets.LicenseKey = license.replace (/(^\")|(\"$)/g, '');\r\n\r\n    var spread = new gc.Spread.Sheets.Workbook(document.getElementById(id));\r\n    try {\r\n        spread.fromJSON(JSON.parse(data));\r\n        if(!isLinkClicked) spread.getActiveSheet().clearSelection();\r\n        \r\n        setTimeout(() => {\r\n            spread.suspendPaint();\r\n            spread.getActiveSheet().options.isProtected = true;\r\n            spread.getActiveSheet().getRange(0, 0, spread.getActiveSheet().getRowCount(), spread.getActiveSheet().getColumnCount(), gc.Spread.Sheets.SheetArea.viewport).locked(true);\r\n            if(!isLinkClicked) spread.getActiveSheet().clearSelection();\r\n            spread.resumePaint();\r\n        }, 500);\r\n    } catch(e) {\r\n        // \r\n    }\r\n\r\n    if($(\".modal-content-container-span\") && $(\".modal-content-container-span\").hide) $(\".modal-content-container-span\").hide();\r\n}\r\nwindow.onLoadInitializeSpreadSheet = onLoadInitializeSpreadSheet;\n\n//# sourceURL=webpack:///./app/plugins/spreadjs/index.js?");

/***/ }),

/***/ "./node_modules/@grapecity/spread-sheets/dist/gc.spread.sheets.all.min.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@grapecity/spread-sheets/dist/gc.spread.sheets.all.min.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


/***/ }),

/***/ "./node_modules/@grapecity/spread-sheets/index.js":
/*!********************************************************!*\
  !*** ./node_modules/@grapecity/spread-sheets/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./dist/gc.spread.sheets.all.min.js */ \"./node_modules/@grapecity/spread-sheets/dist/gc.spread.sheets.all.min.js\");\n\n//# sourceURL=webpack:///./node_modules/@grapecity/spread-sheets/index.js?");

/***/ })

/******/ });