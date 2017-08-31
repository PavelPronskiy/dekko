/**
 *
 * name: Dekko
 * description: advertized platform
 * Version: 0.2.7 beta
 * Author:  Pavel Pronskiy
 * Contact: pavel.pronskiy@gmail.com
 *
 * Copyright (c) 2016-2017 Dekko Pavel Pronskiy
 * Last update: 31.08.2017
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

(function (w, doc) {
	"use strict";

	var dekkoJS = function() {
		this.easingStoreKey = this.storePoint.name + this.storePoint.easing;
		this.fingerprintStoreKey = this.storePoint.name + this.storePoint.options;
		this.domain = w.location.hostname || w.location.host;
		this.isMobile = this.regex.mobile.test(w.navigator.userAgent) ? true : false;
		this.detectIEBrowser = this.regex.ie.test(w.navigator.userAgent) ? true : false;
	};

	dekkoJS.prototype = {
		defaults: {
			// 3rd-party libraries
			libs: {
				// fingerprint2 client identification
				fingerprint: {
					path: '/dist/fingerprint2.min.js',
					options: {
						excludeUserAgent: true
					}
				},
				// easing jquery
				easingjQuery: {
					path: '/dist/easing.min.js'
				}
			},
			cache				: true,
			async				: true,
			verbose				: true,
			modules				: [],
			rotate				: false,
			path				: '/sa'
		},
		// verbose options
		console: {
			moduleName			: 'Module: ',
			moduleNotFound		: 'Module not found: ',
			moduleAppendNotFound: ' html element not found on this page',
			timeSettings		: 'dekko.js >> settings loaded',
			timeModule 			: 'dekko.js >> module: ',
			timeSeconds			: ', load time',
			easingjQuery		: 'jQuery easing not initialized',
			ctErr				: 'Content type settings not correct',
			totalTime 			: 'Total time load '
		},
		regex: {
			iso8601: /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(\.\d+)?([+-]\d{2})\:(\d{2})$/,
			ie: /Edge|MSIE|Trident/i,
			mobile: /Mobi/
		},
		// static prefix points
		storePoint: {
			name 				: 'dekko:',
			closed 				: ':closed',
			module 				: ':module:',
			prev 				: ':rotate:',
			easing 				: 'easing',
			options 			: 'options',
			rev 				: ':r',
			p 					: ':'
		},
		dateNow: function() {
			return Math.round(new Date().getTime() / 1000);
		},
		dateNowISO: function() {
			var date = new Date(this.dateNow()*1000);
			return date.toISOString().match(/(\d{2}:\d{2}:\d{2})/);
		},
		dateToUnixTimeStamp: function(o) {
			var t = {};
			t.p = new Date(o.replace(this.regex.iso8601, '$1'));
			t.d = t.p.getTime() / 1000;
			return (t.d) ? t.d : false;
		},
		setStore: function(n, o) {
			return w.localStorage.setItem(n, JSON.stringify(o));
		},
		getStore: function(o) {
			var x = w.localStorage.getItem(o);
			return (x !== null && typeof x !== 'undefined') ?
				JSON.parse(x) :
				false;
		},
		delStore: function(o) { // deprecated
			return w.localStorage.removeItem(o);
		},
		exec: function(s) {
			return (w.execScript) ?
				w.execScript(s) :
				new Function(s)();
		},
		mergeOptions: function(destination,source) {
			for (var property in source)
				destination[property] = source[property];
			return destination;
		},
		// callback final
		render: function(s, o) {

			// capsule
			w.dekkoModule = function(o) {};
			// initialise dekkoModule function
			this.exec(s);
			// put json options to module and start rendering
			w.dekkoModule.call(this, o);
			delete w.dekkoModule;
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
			var a, b;
			a = this.getStore(o.closePoint);

			if (a === false)
				return false;

			b = (a[0] === true) ? Math.floor((o.date.now() - a[1]) / 60) : false; // minutes ago
			return (b && b > o.date.close) ?
				this.delStore(o.closePoint) :
				true;
		},
		checkPage: function(o) {
			var c = o.filter(function(x) {
				if (x === w.location.pathname)
					return true;
			});

			return (c.length > 0) ? false : true;
		},
		xhr: function(o, m) {
			var self = this, x = {};
			x.request = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
			x.r = new x.request();
			o.cache = (typeof o.cache == 'boolean') ? o.cache : this.defaults.cache;
			x.url = (o.cache === false) ? o.url + '&n=' + new Date().getTime() : o.url;
			x.r.open('GET', x.url, this.defaults.async);
			x.r.onreadystatechange = function() {
				if (x.r.readyState != 4) return;
				x.r.module = m;
				x.r = null;
			};
			x.r.onload = o.success;

			x.r.onerror = function() {
				return console.log(this);
				// throw new Error(msg);
			  // return self.ajaxErrors(this);
			};

			return x.r.send();
		},
		ajax: function(o) {
			return this.xhr(o);
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
		appendModule: function(e) {

			var t = {};
			t.id = /^\#/i;
			t.tag = /^[a-z]+$/i;

			if (t.id.test(e) === true && t.tag.test(e) === false)
				t.el = doc.getElementById(e.replace(t.id, ''));
			else if (t.id.test(e) === false && t.tag.test(e) === true)
				t.el = doc.getElementsByTagName(e)[0];
			else
				t.el = false;
				
			return t.el;
		},
		// object params build
		constructParams: function(o) {
			var self = this,
				module = {},
				ms = {
					refreshModules: [],
					rotates: [],
					defaults: []
				};
		
			if (o.modules.length === 0)
				return false;

			// self.each(o.modules, function(e, i) {
			for (var i = 0, l = o.modules.length; i < l; i++) {
				module = {
					item			: o.modules[i],
					spm				: o.spm,
					type			: o.modules[i].type,
					name			: o.modules[i].name,
					delay			: o.modules[i].delay,
					cache			: o.cache,
					domain			: this.domain,
					verbose			: o.verbose,
					fingerPrint		: o.fingerPrint,
					url				: o.url + '?d=' + this.domain + '&m=' + o.modules[i].name + '&f=' + o.fingerPrint,
					mobile			: o.modules[i].mobile === 'true' ? true : false,
					rotate			: o.modules[i].rotate === "true" ? true : false,
					images			: typeof o.modules[i].images == 'object' ? o.modules[i].images : [],
					append			: o.modules[i].append,
					ppm 			: self.storePoint.name + o.fingerPrint + self.storePoint.prev,
					timePoint		: self.console.timeModule + o.modules[i].name + self.console.timeSeconds,
					storeName		: self.storePoint.name + o.fingerPrint + self.storePoint.p + o.modules[i].type +
									  self.storePoint.p + o.modules[i].name + self.storePoint.rev + o.modules[i].revision,
					date: {
						now			: self.dateNow,
						end			: self.dateToUnixTimeStamp(o.modules[i].date.end),
						start		: self.dateToUnixTimeStamp(o.modules[i].date.start),
						close		: o.modules[i].closeExpire
					}
				};

				module.closePoint = module.storeName + self.storePoint.closed;

				// check page path
				if (typeof o.modules[i].pages === 'object' &&
					o.modules[i].pages.length > 0 &&
					self.checkPage(o.modules[i].pages))
					continue;

				// check time expire
				if (module.date.now() < module.date.start || module.date.now() > module.date.end)
					continue;

				// check mobile device and mobile params
				if (self.isMobile === true && module.mobile === false)
					continue;
					
				// check closed
				if (self.expire(module) === true)
					continue;

				if (module.rotate === true && typeof o.modules[i].refresh !== 'undefined')
					ms.refreshModules.push(module);

				if (module.rotate === true)
					ms.rotates.push(module);
				else
					ms.defaults.push(module);

			}

			ms.modules = (ms.rotates.length > 1) ?
				self.filterModules(ms.rotates, ms.defaults, o) :
				ms.defaults;

			if (ms.refreshModules.length > 1)
				this.refreshModules = ms.refreshModules;

			return self.getModules(ms.modules);
		},
		refreshOnModules: function(module) {
			var t = {}, self = this;
			t.el = jQuery('#' + module.name + '-wrap');

			t.fn = function(){
				t.ref = self.refreshModules.filter(function(c) {
					return c.name !== module.name &&
						   module.append == c.append &&
						   self.getStore(c.closePoint) === false;
				});

				if (t.ref.length === 0)
					return w.clearTimeout(this);

				t.rand = parseInt(Math.floor(Math.random() * t.ref.length), 10);
				t.el.fadeOut((module.item.effects.duration/2), module.item.effects.easing[1], function() {
					jQuery(this).stop(true).remove();
					self.getModules([t.ref[t.rand]]);
					delete t.ref;
				});
			};

			if (self.refreshModules.length > 1) {
				t.refresh = w.setTimeout(t.fn, module.item.refresh);
				t.el.mouseover(function() {
					w.clearTimeout(t.refresh);
				});
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
			var k, r, c, j, i = 0, t = true, self = this;

			if (modules.length === 0)
				return false;

			k = modules[0].ppm + modules[0].append;

			while (t) {
				c = this.getStore(k) ?
					this.getStore(k) :
					0;
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
			
			self.setStore(k, r);
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
			var self = this,
				t = { g: [], l: [], i: 0 };

			for (var a in self.accumulateModulesByAppend(modules)) {
				for (var i = 0, len = modules.length; i < len; i++)
					if (modules[i].append === a)
						t.g.push(modules[i]);

				t.l[t.i++] = self.randomModule(options, t.g);
				t.g = [];
			}

			return t.l;
		},
		// get object options
		getOptions: function(o) {
			var	self = this,
				d = {}, ajax = {};

			o.spm = this.storePoint.name +
						o.fingerPrint;

			o.ppm = this.storePoint.name +
						o.fingerPrint +
						this.storePoint.prev;

			ajax.cache = o.cache;
			ajax.url = o.url + '?d=' + this.domain + '&f=' + o.fingerPrint;

			if (o.verbose)
				self.time(self.console.timeSettings);

			ajax.success = function(status) {
				o.modules = JSON.parse(this.responseText);
				o.contentType = this.getResponseHeader('content-type');

				if (o.verbose)
					self.timeEnd(self.console.timeSettings);

				if (this.getResponseHeader('content-type') !== 'application/json')
					return self.exceptionsMessage({
						message: self.console.ctErr,
						status: 'error',
						date: self.dateNowISO()
					});

				if (self.exceptionsHandler(o.modules) === true)
					return self.exceptionsMessage(o.modules);

				// return console.log(o);
				return self.constructParams(o);
			};

			return self.xhr(ajax, null);
		},
		// check options and switch request to render
		getModules: function(m) {
			var self = this, ajax = {};

			ajax.success = function(s) {

				if (this.module.cache && self.getStore(this.module.storeName) === false)
					self.setStore(this.module.storeName, this.responseText);


				if (this.module.length < 50)
					return self.exceptionsMessage({
						message: self.console.moduleNotFound + this.module.name,
						status: 'warning',
						date: self.dateNowISO()
					});
				
				return self.render(this.responseText, this.module);
			};

			for (var i = 0, l = m.length; i < l; i++) {
				ajax.url = m[i].url;
				ajax.cache	= m[i].cache;

				if (m[i].verbose)
					self.time(m[i].timePoint);

				if (m[i].cache && self.getStore(m[i].storeName) !== false) {
					self.render(self.getStore(m[i].storeName), m[i]);
				} else {
					self.xhr(ajax, m[i]);
				}
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
			var	self = this, ajax = {}, t = {};

			// ajax.cache			= true;
			ajax.url = o.url + '&c=' + o.date.now();

			ajax.success = function(status) {
				return true;
			};
			
			return self.xhr(ajax);
		},
		getFingerprint: function(o) {
			var self = this, ajax = {};

			ajax.cache = true;
			ajax.url = o.dekkoURL +
						this.defaults.libs.fingerprint.path;

			ajax.success = function(status) {
				self.exec(this.responseText);

				new Fingerprint2(self.defaults.libs.fingerprint.options).get(function(f) {
					self.setStore(self.fingerprintStoreKey, {
						clientid: f
					});

					o.fingerPrint = f;
					return self.getOptions(o);
				});	
			};

			return self.xhr(ajax, null);

		},
		getScriptTagParams: function() {
			var t = {}, o = {};

			t.s = doc.getElementsByTagName('script');

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
			var self = this, ajax = {},
				store = this.getStore(this.easingStoreKey),
				o = this.getScriptTagParams();

			ajax.cache = true;
			ajax.url = o.dekkoURL +
						this.defaults.libs.easingjQuery.path;

			ajax.success = function(status) {
				self.exec(this.responseText);

				if (typeof jQuery.easing.def === 'undefined')
					throw new Error(self.console.easingjQuery);

				self.setStore(self.easingStoreKey, this.responseText);
				return self.optionsPrepare();
			};

			if (store === false)
				return self.xhr(ajax, null);
			
			this.exec(store);

			if (typeof jQuery.easing.def === 'undefined')
				throw new Error(self.console.easingjQuery);
			
			return self.optionsPrepare();
		},
		svg: {
			close: function(c) {
				return '<svg width="' + c.width + '" height="' + c.height + '"' +
					   'style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality;' +
					   'fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 13547 13547" xml:space="preserve"><g id="Ebene_x0020_1">' +
					   '<polygon fill="' + c.background + '" points="0,0 13547,0 13547,13547 0,13547 "/>' +
					   '<path fill="' + c.color + '" d="M714 12832l12118 0 0 -12117 -12118 0 0 12117zm4188 -2990l1871 -1871 1871 1871 1197 -1197 -1871 -1871 1871 -1871 -1197 -1197 -1871 1871 -1871 -1871 -1197 1197 1871 1871 -1871 1871 1197 1197z"/>' +
					   '</g></svg>';
			}
		}

	};

	try {
		
		w.dekkoJS = new dekkoJS();

		if (typeof jQuery.easing.def === 'undefined')
			return w.dekkoJS.loadJQEasing();

		return w.dekkoJS.optionsPrepare();

	} catch (e) {
		return console.log(e);
	}

})(window, document);