/*!
	sdeeplink 1.0.1
	license: MIT
	xxxx/sdeeplink
*/
(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['module', 'exports'], factory);
	} else if (typeof exports !== "undefined") {
		factory(module, exports);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod, mod.exports);
		global.sdeeplink = mod.exports;
	}
})(this, function (module, exports) {
	'use strict';

	var sdeeplink = function sdeeplink(options) {
		options = options || {};
		var screeSize = function screeSize() {
			return {
				'width': window.screen.width * window.devicePixelRatio,
				'height': window.screen.height * window.devicePixelRatio
			};
		};
		// 浏览器语言
		var language = function language() {
			return {
				'userLanguage': window.navigator,
				'systemLanguage': navigator.systemLanguage
			};
		};
		// 屏幕色彩信息
		var colorDepth = function colorDepth() {
			return {
				'colorDepth': screen.colorDepth
			};
		};
		// 格林时间和本地时间的时差
		var dateOffset = function dateOffset() {
			return { 'dateOffset': new Date().getTimezoneOffset() };
		};
		// 获取gpu信息
		var gpuInfo = function gpuInfo() {
			try {
				var canvas = document.createElement('canvas');
				// 等同于 canvas.getContext('experimental-webgl');
				var gl = canvas.getContext('webgl');
				var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
				return {
					'unmasked_vendor_webgl': gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL), // GPU 制造商，e.g., Intel Inc.
					'unmasked_renderer_webgl': gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) // GPU 型号，e.g., Intel Iris OpenGL Engine
				};
			} catch (e) {
				throw new Error('错误内容', e);
			}
		};
		var getPlatform = function getPlatform() {
			var ua = window.navigator.userAgent;
			var platform = '';
			if (ua.indexOf('Windows') > -1) {
				//PC
				platform = ua.slice(ua.indexOf('Windows'), ua.indexOf(')'));
			} else if (ua.indexOf('Linux') > -1) {
				//android
				platform = ua.substr(ua.indexOf('Android'), 13);
			} else if (ua.indexOf('iPhone') > -1) {
				// "iPhone";
				platform = ua.slice(ua.indexOf('iPhone OS'), ua.indexOf('like Mac'));
			} else {
				platform = 'Failed to get platform information';
			}
			return { 'platform': platform };
		};

		// 判断浏览器所在机器操作系统版本
		var getOsVersion = function getOsVersion() {
			var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
			var ua = navigator.userAgent;
			var version = '';
			// 判断是不是移动端
			function isMobile() {
				for (var v = 0; v < Agents.length; v++) {
					if (ua.indexOf(Agents[v]) > 0) {
						return false;
					}
				}
				return true;
			}
			// 判断是不是微信浏览器
			function isWechat() {
				ua = ua.toLowerCase();
				if (ua.match(/MicroMessenger/i) === "micromessenger") {
					return true;
				} else {
					return false;
				}
			}
			if (isMobile() || isWechat()) {
				if (ua.indexOf('Mac OS X') > -1) {
					var regStr_saf = /OS [\d._]*/gi;
					var verinfo = ua.match(regStr_saf);
					version = (verinfo + "").replace(/[^0-9|_.]/ig, '').replace(/_/ig, '.');
				} else if (ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1) {
					version = ua.substr(ua.indexOf('Android') + 8, ua.indexOf(";", ua.indexOf("Android")) - ua.indexOf('Android') - 8);
				} else if (ua.indexOf('BB10') > -1) {
					version = ua.substr(ua.indexOf('BB10') + 5, ua.indexOf(";", ua.indexOf("BB10")) - ua.indexOf('BB10') - 5);
				} else if (ua.indexOf('IEMobile')) {
					version = ua.substr(ua.indexOf('IEMobile') + 9, ua.indexOf(";", ua.indexOf("IEMobile")) - ua.indexOf('IEMobile') - 9);
				}
				return { version: version };
			}
		};
		options = Object.assign(options, screeSize()); // 设备屏幕尺寸
		options = Object.assign(options, language()); // 浏览器语言
		options = Object.assign(options, colorDepth()); // 屏幕色彩信息
		options = Object.assign(options, dateOffset()); // 格林时间和本地时间的时差
		options = Object.assign(options, gpuInfo()); // 获取gpu信息
		options = Object.assign(options, getPlatform()); // 获取平台信息
		options = Object.assign(options, getOsVersion()); // 获取平台信息
		return options;
	};

	exports.default = sdeeplink;
	module.exports = exports['default'];
});