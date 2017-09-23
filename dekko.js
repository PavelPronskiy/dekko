/**
 *
 * name: Dekko client side
 * description: advertized platform
 * Version: 0.3.0 beta
 * Author:  Pavel Pronskiy
 * Contact: pavel.pronskiy@gmail.com
 *
 * Copyright (c) 2016-2017 Dekko Pavel Pronskiy
 * Last update: 23.09.2017
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "dekko"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 *
 **/

(function(factory) {
	"use strict";
	var options = {};
	factory(options);
})(function (options) {
	"use strict";
	
	var dekkoJS = function() {
		this.refresh = {
			counter: 0,
			max: 100
		};
		this.defaults = {
			// 3rd-party libraries
			libs: {
				jQuery: {
					path: '/dist/jquery.min.js'
				},
				fingerprint: {
					path: '/dist/fingerprint2.min.js',
					options: {
						excludeUserAgent: true
					}
				},
				easingjQuery: {
					path: '/dist/jquery.easing.min.js'
				}
			},
			cache				: true,
			async				: true,
			verbose				: true,
			modules				: [],
			rotate				: false,
			path				: '/sa'
		};
		// verbose options
		this.console = {
			moduleNotFound		: 'Module not found: ',
			moduleAppendNotFound: ' html element not found on this page',
			dekkothrowError 	: 'dekko.js >> [error] ',
			timeModule 			: 'dekko.js >> ',
			timeSeconds			: ', load time',
			easingjQuery		: 'jQuery easing not initialized',
			jQuery				: 'jQuery not initialized',
			ctErr				: 'Content type settings not correct',
			totalTime 			: 'Total time load '
		};
		this.regex = {
			toLocalDate: /^(\d{4}\-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}).*/,
			ie: /Edge|MSIE|Trident/i,
			mobile: /Mobi/
		};
		// static prefix points
		this.storePoint = {
			name 				: 'dekko:',
			closed 				: ':closed',
			module 				: ':module:',
			prev 				: 'rotate:',
			easing 				: 'easing',
			options 			: 'options',
			rev 				: ':r',
			p 					: ':'
		};
		this.easingStoreKey = this.storePoint.name + this.storePoint.easing;
		this.fingerprintStoreKey = this.storePoint.name + this.storePoint.options;
		this.domain = window.location.hostname || window.location.host;
		this.isMobile = this.regex.mobile.test(window.navigator.userAgent) ? true : false;
		this.detectIEBrowser = this.regex.ie.test(window.navigator.userAgent) ? true : false;
		this.refreshModules = [];
		this.xhrParams = {};
	};

	dekkoJS.prototype = {
		dateNow: function() {
			return new Date().getTime();
		},
		setStore: function(n, o) {
			return window.localStorage.setItem(n, JSON.stringify(o));
		},
		getStore: function(o) {
			var x = window.localStorage.getItem(o);
			return (x !== null && typeof x !== 'undefined') ?
				JSON.parse(x) :
				false;
		},
		delStore: function(o) {
			return window.localStorage.removeItem(o);
		},
		// make shadow DOM on module element container
		shadowCreate: function(append) {
			var elementContainer = jQuery(append).get(0);
			if (typeof elementContainer == 'undefined')
				return this.exceptionsMessage({
					message: append + ' ' + this.console.moduleAppendNotFound,
					status: this.console.dekkothrowError,
					date: new Date().toISOString()
				});

			// moduleAppendNotFound
			return typeof elementContainer.shadowRoot === 'undefined' ?
				append : elementContainer.shadowRoot === null ?
					// create shadow-root environment
					elementContainer.attachShadow({
						mode: 'open'
						// return exist shadow-root environment
					}) : elementContainer.shadowRoot;
		},
		exec: function(s) {
			return (window.execScript) ?
				window.execScript(s) :
				new Function(s)();
		},
		mergeOptions: function(destination,source) {
			for (var property in source)
				destination[property] = source[property];
			return destination;
		},
		toLocalDateTime: function(o) {
			return new Date(o.replace(this.regex.toLocalDate, '$1')).getTime();
		},
		// callback final
		render: function(s, o) {
			// capsule
			window.dekkoModule = function(o) {};
			// initialise dekkoModule function
			this.exec(s);
			// put json options to module and start rendering
			window.dekkoModule.call(this, o);
		},
		// request module callback
		notice: function(o) {

			if (typeof o.item.refresh === 'number' && o.rotate === true)
				this.refreshOnModules(o);

			return (o.verbose === true) ?
				this.timeEnd(o.timePoint) :
				false;
		},
		expire: function(o) {
			var a = this.getStore(o.closePoint), b, s = {};

			if (a === false)
				return false;

			b = a[0] === true ?
				Math.floor(((o.date.now() - a[1]) / 1000) / 60)
				: false; // minutes ago

			return b && b > o.date.close ?
				this.delStore(o.closePoint) :
				true;
		},
		checkPage: function(o) {
			var c = o.filter(function(x) {
				if (x === window.location.pathname)
					return true;
			});

			return (c.length > 0) ? false : true;
		},

		xhr: function(o, m) {
			var xhr = ("onload" in new XMLHttpRequest()) ?
				new XMLHttpRequest() :
				new XDomainRequest();

			var url = o.cache ?
				o.url :
				o.url + '&n=' + new Date().getTime();

			xhr.open('GET', url, this.defaults.async);
			xhr.module = m;
			xhr.onload = o.success;
			xhr.send(null);
			xhr = null;
		},
		time: function(o) {
			if (this.detectIEBrowser === false)
				console.time(o);
		},
		timeEnd: function(o) {
			if (this.detectIEBrowser)
				console.log(o);
			else
				console.timeEnd(o);
		},
		// object params build
		constructParams: function(o) {
			var module = {},
				ms = {
					refreshModules: [],
					rotates: [],
					defaults: []
				};
		
			if (o.modules.length === 0)
				return false;

			for (var i = 0; i < o.modules.length; i++) {

				module = {
					spm				: o.spm,
					cache			: o.cache,
					verbose			: o.verbose,
					domain			: this.domain,
					item			: o.modules[i],
					fingerPrint		: o.fingerPrint,
					type			: o.modules[i].type,
					name			: o.modules[i].name,
					delay			: o.modules[i].delay,
					append			: o.modules[i].append,
					ppm 			: this.storePoint.name + this.storePoint.prev,
					mobile			: o.modules[i].mobile === 'true' ? true : false,
					rotate			: o.modules[i].rotate === 'true' ? true : false,
					images			: typeof o.modules[i].images == 'object' ? o.modules[i].images : [],
					timePoint		: this.console.timeModule + o.modules[i].name + this.console.timeSeconds,
					url				: o.url + '?' + 'd=' + this.domain + '&m=' +
										o.modules[i].name + '&f=' + o.fingerPrint,
					storeName		: this.storePoint.name + o.modules[i].type + this.storePoint.p +
										o.modules[i].name + this.storePoint.rev + o.modules[i].revision,
					date: {
						now 		: this.dateNow,
						end			: this.toLocalDateTime(o.modules[i].date.end),
						start		: this.toLocalDateTime(o.modules[i].date.start),
						close		: o.modules[i].closeExpire
					}
				};

				module.closePoint = module.storeName + this.storePoint.closed;

				// check page path
				if (typeof o.modules[i].pages === 'object' &&
					o.modules[i].pages.length > 0 &&
					this.checkPage(o.modules[i].pages))
					continue;

				// check time expire
				if (module.date.now() < module.date.start || module.date.now() > module.date.end)
					continue;

				// check mobile device and mobile params
				if (this.isMobile === true && module.mobile === false)
					continue;
					
				// check closed
				if (this.expire(module) === true)
					continue;

				if (module.rotate === true && typeof o.modules[i].refresh !== 'undefined')
					ms.refreshModules.push(module);

				if (module.rotate === true)
					ms.rotates.push(module);
				else
					ms.defaults.push(module);

			}

			ms.modules = (ms.rotates.length > 0) ?
				this.filterModules(ms.rotates, ms.defaults, o) :
				ms.defaults;

			if (ms.refreshModules.length > 1)
				this.refreshModules = ms.refreshModules;

			return this.getModules(ms.modules);
		},
		// refresh module without page reload
		refreshOnModules: function(module) {
			var t = {};
			t.refresh = '';
			t.append = jQuery(module.append).get(0);

			if (typeof t.append === 'undefined')
				return this.exceptionsMessage({
					message: module.append + ' ' + this.console.moduleAppendNotFound,
					status: this.console.dekkothrowError,
					date: new Date().toISOString()
				});
			
			t.el = (typeof t.append.shadowRoot !== 'undefined' &&
					t.append.shadowRoot.childNodes.length > 0) ?
				jQuery(t.append.shadowRoot.childNodes[0]) :
				jQuery('#' + module.name + '-wrap');
			
			t.fn = function() {
				t.ref = window.dekkoJS.refreshModules.filter(function(c) {
					return c.name !== module.name &&
						module.append == c.append &&
						window.dekkoJS.getStore(c.closePoint) === false;
				});

				if (t.ref.length === 0)
					return clearTimeout(this);

				t.rand = parseInt(Math.floor(Math.random() * t.ref.length), 10);


				t.el.fadeOut((module.item.effects.duration/2), module.item.effects.easing[1], function() {
					jQuery(this).clearQueue().stop(true).remove();
					window.dekkoJS.getModules([t.ref[t.rand]]);
				});
			};
			
			if (this.refreshModules.length > 1) {
				if (this.refresh.counter <= this.refresh.max) {
					t.refresh = setTimeout(t.fn, module.item.refresh);
					t.el.mouseover(function() {
						clearTimeout(t.refresh);
					});
				}

				this.refresh.counter++;
			}
		},
		filterModules: function(rotates, defaults, o) {
			var m = {};
			m.rotates = this.rotateModules(rotates, o);
			m.modules = defaults.concat(m.rotates).filter(function(item, index, array) {
				return array.map(function(m){
					return m.name;
				}).indexOf(item.name) === index;
			});

			return m.modules;
		},
		// get random object
		randomModule: function(options, modules) {
			var k, r, c, j, i = 0, t = true;

			if (modules.length === 0)
				return false;

			k = modules[0].ppm + modules[0].append;

			while (t) {
				c = this.getStore(k) ? this.getStore(k) : 0;
				r = parseInt(Math.floor(Math.random() * modules.length), 10);
				j = typeof this.getStore(modules[r].closePoint)[0] !== 'undefined' ?
					this.getStore(modules[r].closePoint)[0] :
					false;

				t = (r !== c && j !== true) ?
					false :
					true;

				if (i > modules.length * 2) {
					r = c;
					t = false;
				}

				i++;
			}
			
			this.setStore(k, r);
			return modules[r];
		},
		accumulateModulesByAppend: function(o) {
			var z = {};
			for (var i = 0, len = o.length; i < len; i++) {
				z[o[i].append] = (z[o[i].append]||0)+1;
			}
			return z;
		},
		rotateModules: function(modules, options) {
			var t = { g: [], l: [], i: 0 };

			for (var a in this.accumulateModulesByAppend(modules)) {
				for (var i = 0, len = modules.length; i < len; i++)
					if (modules[i].append === a)
						t.g.push(modules[i]);

				t.l[t.i++] = this.randomModule(options, t.g);
				t.g = [];
			}

			return t.l;
		},
		// get object options
		getOptions: function(o) {
			var	d = {};

			this.xhrParams.cache = o.cache;
			o.spm = this.storePoint.name;
			o.ppm = this.storePoint.name + this.storePoint.prev;
			this.xhrParams.url = o.url + '?' + 'd=' + this.domain + '&f=' + o.fingerPrint;

			this.xhrParams.success = function(status) {
				o.modules = JSON.parse(this.responseText);
				o.contentType = this.getResponseHeader('content-type');
				
				if (this.getResponseHeader('content-type') !== 'application/json')
					return window.dekkoJS.exceptionsMessage({
						message: window.dekkoJS.console.ctErr,
						status: 'error',
						date: new Date().toISOString()
					});

				if (window.dekkoJS.exceptionsHandler(o.modules) === true)
					return window.dekkoJS.exceptionsMessage(o.modules);

				// return console.log(o);
				return window.dekkoJS.constructParams(o);
			};

			return this.xhr(this.xhrParams, null);
		},
		// check options and switch request to render
		getModules: function(m) {
			// var ajax = {};

			this.xhrParams.success = function(s) {
				if (this.module.cache && window.dekkoJS.getStore(this.module.storeName) === false)
					window.dekkoJS.setStore(this.module.storeName, this.responseText);

				if (this.module.length < 50)
					return window.dekkoJS.exceptionsMessage({
						message: window.dekkoJS.console.moduleNotFound + this.module.name,
						status: 'warning',
						date: new Date().toISOString()
					});

				return window.dekkoJS.render(this.responseText, this.module);
			};

			for (var i = 0, l = m.length; i < l; i++) {
				this.xhrParams.url = m[i].url;
				this.xhrParams.cache	= m[i].cache;

				if (m[i].verbose)
					this.time(m[i].timePoint);

				if (m[i].cache && this.getStore(m[i].storeName) !== false)
					this.render(this.getStore(m[i].storeName), m[i]);
				else
					this.xhr(this.xhrParams, m[i]);
			}
		},
		exceptionsMessage: function(o) {
			if (typeof o.stack === 'undefined')
				console.log(o.status + ' ' + o.message);
			else
				if (this.detectIEBrowser) {
					console.log(o.status + ' ' + o.message);
					console.log(o.stack);
				} else {
					console.group(o.status + ' ' + o.message);
					console.warn(o.stack);
					console.groupEnd(o.status + ' ' + o.message);
				}
		},
		exceptionsHandler: function(o) {
			var res = false;

			if (typeof o.status === 'undefined')
				res = false;

			switch (o.status) {
				case 'error':
					res = true;
				break;
				default:
					res = false;
				break;
			}

			return res;
		},
		// for module clients click
		clickAdvert: function(o) {
			var	t = {};

			// ajax.cache			= true;
			this.xhrParams.url = o.url + '&c=' + o.date.now();

			this.xhrParams.success = function(status) {
				return true;
			};
			
			return this.xhr(this.xhrParams);
		},
		getFingerprint: function(o) {
			// var ajax = {};

			this.xhrParams.cache = true;
			this.xhrParams.url = o.dekkoURL +
						this.defaults.libs.fingerprint.path;

			this.xhrParams.success = function(status) {
				window.dekkoJS.exec(this.responseText);

				new Fingerprint2(window.dekkoJS.defaults.libs.fingerprint.options).get(function(f) {
					window.dekkoJS.setStore(window.dekkoJS.fingerprintStoreKey, {
						clientid: f
					});

					o.fingerPrint = f;
					return window.dekkoJS.getOptions(o);
				});	
			};

			return this.xhr(this.xhrParams, null);

		},
		getScriptTagParams: function() {
			var t = {}, o = {};

			t.s = document.getElementsByTagName('script');

			for (var i = 0;i < t.s.length;i++)
				if (/dekko\.(min\.)?js$/i.test(t.s[i].src))
					t.d = t.s[i];
			
			/*
			 * Ajax cache and storageCache enabled by default.
			 * If you need to disable caching, please set data-cache="false" on script tag
			 */ 
			o.cache = (t.d.getAttribute('data-cache') === "false") ? false : true;
			/*
			 * Verbose messages on console is enabled by default.
			 * If you need to disable verbose messages, please set data-verbose="false" on script tag
			 */
			o.verbose = (t.d.getAttribute('data-verbose') === "false") ? false : true;

			t.arr = t.d.src.split('/');
			o.dekkoURL = t.arr[0] + '//' + t.arr[2];
			o.url = o.dekkoURL + this.defaults.path;

			return o;
		},
		optionsPrepare: function() {
			var o = this.mergeOptions(this.defaults, this.getScriptTagParams());
			o.fingerPrint = this.getStore(this.fingerprintStoreKey).clientid;
			return (typeof o.fingerPrint === 'undefined') ?
				this.getFingerprint(o) :
				this.getOptions(o);
		},
		loadJQEasing: function() {
			var store = this.getStore(this.easingStoreKey),
				o = this.getScriptTagParams();

			this.xhrParams.cache = true;
			this.xhrParams.url = o.dekkoURL + this.defaults.libs.easingjQuery.path;

			this.xhrParams.success = function(status) {
				window.dekkoJS.exec(this.responseText);

				if (typeof jQuery.easing.def === 'undefined')
					throw new Error(window.dekkoJS.console.easingjQuery);

				window.dekkoJS.setStore(window.dekkoJS.easingStoreKey, this.responseText);
				return window.dekkoJS.optionsPrepare();
			};

			if (store === false)
				return this.xhr(this.xhrParams, null);
			
			this.exec(store);

			if (typeof jQuery.easing.def === 'undefined')
				throw new Error(this.console.easingjQuery);

			return this.optionsPrepare();
		},
		loadJQuery: function() {
			var o = this.getScriptTagParams();

			this.xhrParams.cache = true;
			this.xhrParams.url = o.dekkoURL +
						this.defaults.libs.jQuery.path;

			this.xhrParams.success = function(status) {
				window.dekkoJS.exec(this.responseText);

				if (typeof jQuery === 'undefined')
					throw new Error(window.dekkoJS.console.jQuery);

				if (typeof jQuery.easing.def === 'undefined')
					return window.dekkoJS.loadJQEasing();

				return window.dekkoJS.optionsPrepare();
			};

			return this.xhr(this.xhrParams, null);

		},
		svg: {
			// button element
			close: function(c) {
				return '<svg width="' + c.width + '" height="' + c.height + '"' +
					   'style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality;' +
					   'fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 13547 13547" xml:space="preserve"><g>' +
					   '<polygon fill="' + c.background + '" points="0,0 13547,0 13547,13547 0,13547 "/>' +
					   '<path fill="' + c.color + '" d="M714 12832l12118 0 0 -12117 -12118 0 0 12117zm4188 -2990l1871 -1871 1871 1871 1197 -1197 -1871 -1871 1871 -1871 -1197 -1197 -1871 1871 -1871 -1871 -1197 1197 1871 1871 -1871 1871 1197 1197z"/>' +
					   '</g></svg>';
			}
		}
	};

	try {

		window.dekkoJS = new dekkoJS();

		if (typeof jQuery === 'undefined')
			return window.dekkoJS.loadJQuery();

		if (typeof jQuery.easing.def === 'undefined')
			return window.dekkoJS.loadJQEasing();

		return window.dekkoJS.optionsPrepare();

	} catch (e) {
		return console.log(e);
	}
});