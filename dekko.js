/**
 *
 * name: Dekko
 * description: advertized platform
 * Version: 0.2.6 beta
 * Author:  Pavel Pronskiy
 * Contact: pavel.pronskiy@gmail.com
 *
 * Copyright (c) 2016-2017 Dekko Pavel Pronskiy
 * Last update: 27.08.2017
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

	// capsule
	w.dekkoModule = function(o) {};
	
	w.dekko = function() {

		// default settings
		var defaults = {
			revision			: 0, 					// this opt require incremental number and cache true (required if cache enabled)
			cache				: true, 				// (optional)
			async				: true, 				// (optional)
			verbose				: true, 				// (optional)
			modules				: [],					// (required if modulesUrl not defined)
			rotate				: false,				// (optional)
			path				: '/sa'
		};

		// construction methods
		this.dekkoConstructor = {
			// verbose options
			console: {
				moduleName		: 'Module: ',
				moduleNotFound	: 'Module not found: ',
				moduleAppendNotFound	: ' html element not found on this page',
				timeSettings	: 'dekko.js >> settings loaded',
				timeModule 		: 'dekko.js >> module: ',
				timeSeconds		: ', load time',
				totalTime 		: 'Total time load '
			},
			regex: {
				iso8601: /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(\.\d+)?([+-]\d{2})\:(\d{2})$/,
				ie: /Edge|MSIE|Trident/i,
				mobile: /Mobi/
			},
			// static prefix points
			storePoint: {
				name 			: 'dekko:',
				closed 			: ':closed',
				module 			: ':module:',
				prev 			: ':rotate:',
				rev 			: ':r',
				p 				: ':'
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
				return (x !== null && typeof x !== 'undefined') ? JSON.parse(x) : false;
			},
			delStore: function(o) { // deprecated
				return w.localStorage.removeItem(o);
			},
			isMobile: function() {
				return (this.regex.mobile.test(w.navigator.userAgent)) ? true : false;
			},
			each: function (obj, iterator, context) {
				var nativeForEach = Array.prototype.forEach;
				
				if (obj === null)
					return;
				
				if (nativeForEach && obj.forEach === nativeForEach) {
					obj.forEach(iterator, context);
				} else if (obj.length === +obj.length) {
					for (var i = 0, l = obj.length; i < l; i++) {
						if (iterator.call(context, obj[i], i, obj) === {}) return;
					}
				} else {
					for (var key in obj) {
						if (obj.hasOwnProperty(key)) {
							if (iterator.call(context, obj[key], key, obj) === {}) return;
						}
					}
				}
			},
			map: function(obj, iterator, context) {
				var results = [], self = this,
				nativeMap = Array.prototype.map;
				if (obj === null) return results;
				if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
				self.each(obj, function(value, index, list) {
					results[results.length] = iterator.call(context, value, index, list);
				});
				return results;
			},
			mergeOptions: function(destination,source) {
				for (var property in source)
					destination[property] = source[property];
				return destination;
			},
			// callback final
			render: function(s, o) {
				// initialise dekkoModule function
				(w.execScript) ? w.execScript(s) : new Function(s)();

				// put json options to module and start rendering
				return w.dekkoModule.call(this, o);
			},
			// request module callback
			notice: function(o) {

				if (typeof o.item.refresh === 'number' && o.rotate === true)
					this.refreshOnModules(o);

				return (o.verbose === true) ? this.timeEnd(o.timePoint) : false;
			},
			expire: function(o) {
				var a, b;
				a = this.getStore(o.closePoint);

				if (a === false)
					return false;

				b = (a[0] === true) ? Math.floor((o.date.now() - a[1]) / 60) : false; // minutes ago
				return (b && b > o.date.close) ? this.delStore(o.closePoint) : true;
			},
			checkPage: function(o) {
				var c = o.filter(function(x) {
					if (x === w.location.pathname)
						return true;
				});

				return (c.length > 0) ? false : true;
			},
			xhr: function(o) {
				var self = this, x = {};
				x.request = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
				x.r = new x.request();
				o.cache = (typeof o.cache == 'boolean') ? o.cache : defaults.cache;
				x.url = (o.cache === false) ? o.url + '&n=' + new Date().getTime() : o.url;
				x.r.open('GET', x.url, defaults.async);
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

				self.each(o.modules, function(e, i) {

					module = {
						item			: e,
						spm				: o.spm,
						type			: e.type,
						name			: e.name,
						delay			: e.delay,
						cache			: o.cache,
						domain			: o.domain,
						verbose			: o.verbose,
						fingerPrint		: o.fingerPrint,
						url				: o.settingsUrl + '&m=' + e.name,
						mobile			: e.mobile === 'true' ? true : false,
						rotate			: e.rotate === "true" ? true : false,
						images			: typeof e.images == 'object' ? e.images : [],
						excludes		: typeof e.excludes == 'object' ? e.excludes : [],
						append			: e.append,
						// append			: (jQuery(e.append).length > 0) ? jQuery(e.append) : false,
						// append			: self.appendModule(e.append),
						ppm 			: self.storePoint.name + o.fingerPrint + self.storePoint.prev,
						timePoint		: self.console.timeModule + e.name + self.console.timeSeconds,
						storeName		: self.storePoint.name + o.fingerPrint + self.storePoint.p + e.type +
										  self.storePoint.p + e.name + self.storePoint.rev + e.revision,
						date: {
							now			: self.dateNow,
							end			: self.dateToUnixTimeStamp(e.date.end),
							start		: self.dateToUnixTimeStamp(e.date.start),
							close		: e.closeExpire
						}
					};

					module.closePoint = module.storeName + self.storePoint.closed;

					// check page path
					if (typeof e.pages === 'object' && e.pages.length > 0 && self.checkPage(e.pages))
						return false;

					// check time expire
					if (module.date.now() < module.date.start || module.date.now() > module.date.end)
						return false;

					// check mobile device and mobile params
					if (self.isMobile() === true && module.mobile === false)
						return false;
						
					// check closed
					if (self.expire(module) === true)
						return false;

					if (module.rotate === true && typeof e.refresh !== 'undefined')
						ms.refreshModules.push(module);

					if (module.rotate === true)
						ms.rotates.push(module);
					else
						ms.defaults.push(module);

				});

				ms.modules = (ms.rotates.length > 1) ? self.filterModules(ms.rotates, ms.defaults, o) : ms.defaults;

				if (ms.refreshModules.length > 1)
					this.refreshModules = ms.refreshModules;

				return self.getModules(ms.modules);
			},
			refreshOnModules: function(module) {
				var t = {}, self = this;

				t.el = $('#' + module.name + '-wrap');

				t.fn = function(){
					t.ref = self.refreshModules.filter(function(c) {
						return c.name !== module.name &&
							   module.append == c.append &&
							   self.getStore(c.closePoint) === false;
					});

					if (t.ref.length === 0)
						return clearTimeout(this);

					// console.log(t.ref.length);
					t.rand = parseInt(Math.floor(Math.random() * t.ref.length), 10);
					t.el.fadeOut((module.item.effects.duration/2), module.item.effects.easing[1], function() {
						$(this).remove();
						return self.getModules([t.ref[t.rand]]);
					});
				};

				if (self.refreshModules.length > 1) {
					t.refresh = w.setTimeout(t.fn, module.item.refresh);
					t.el.mouseover(function() {
						clearTimeout(t.refresh);
					});
				}
			},
			filterModules: function(rotates, defaults, o) {
				var m = {};
				m.rotates = this.rotateModules(rotates, o);
				m.modules = defaults.concat(m.rotates).filter(function(item, index, array) {
					// console.log(item);
					return array.map(function(m){
						return m.name;
					}).indexOf(item.name) === index;
				});

				return m.modules;
			},
			// get random object
			randomModule: function(options, modules) {

				if (modules.length === 0)
					return false;

				var r, c, j,
					skey = modules[0].ppm +
						modules[0].append,

					i = 0,
					t = true,
					self = this;

				while (t) {

					c = self.getStore(skey) ? self.getStore(skey) : 0;
					r = parseInt(Math.floor(Math.random() * modules.length), 10);
					j = (typeof self.getStore(modules[r].closePoint)[0] !== 'undefined') ? self.getStore(modules[r].closePoint)[0] : false;

					t = (r !== c && j !== true) ? false : true;

					if (i > modules.length * 2) {
						r = c;
						t = false;
					}

					i++;
				}
				
				self.setStore(skey, r);
				return modules[r];
			},
			rotateModules: function(modules, options) {
				var self = this,
					t = { c: {}, l: [], r: [], i: 0 };

				self.each(modules, function(a,i) {
					t.c[a.append] = (t.c[a.append]||0)+1;
				});

				self.each(t.c, function(p,e) {
					t.l[t.i] = [];
					self.each(modules, function(m,k) {
						if (e === m.append)
							t.l[t.i].push(m);
					});
						
					t.i++;
				});

				self.each(t.l, function(z,x) {
					return t.r.push(self.randomModule(options, z));
				});

				return t.r;
			},
			// get object options
			getOptions: function() {
				var	self = this, d = {}, o,
					ajax = {};

				o = this.mergeOptions(defaults, this.getDekkoParams());
				o.spm = this.storePoint.name + o.fingerPrint;
				o.ppm = this.storePoint.name + o.fingerPrint + this.storePoint.prev;

				ajax.cache = o.cache;
				ajax.url = o.settingsUrl;

				if (o.verbose)
					self.time(self.console.timeSettings);

				ajax.success = function(status) {
					o.modules = JSON.parse(this.responseText);
					o.contentType = this.getResponseHeader('content-type');

					if (o.verbose)
						self.timeEnd(self.console.timeSettings);

					if (this.getResponseHeader('content-type') !== 'application/json')
						return self.exceptionsMessage({
							message: 'Content type settings not correct',
							status: 'error',
							date: self.dateNowISO()
						});

					if (self.exceptionsHandler(o.modules) === true)
						return self.exceptionsMessage(o.modules);

					// return console.log(o);
					return self.constructParams(o);
				};

				return self.xhr(ajax);
			},
			// check options and switch request to render
			getModules: function(m) {
				var self = this, ajax = {};
				

				self.each(m, function(e, i) {
					ajax.url = e.url;
					ajax.cache	= e.cache;

					if (e.verbose)
						self.time(e.timePoint);

					if (self.appendModule(e.append) === false)
						return self.exceptionsMessage({
							message: self.console.moduleName + e.name + self.console.moduleAppendNotFound,
							status: 'warning',
							date: self.dateNowISO()
						});

					// check store and return render
					if (e.cache && self.getStore(e.storeName) !== false)
						return self.render(self.getStore(e.storeName), e);

					ajax.success = function(status) {

						// check module length
						if (this.responseText.length < 50)
							return self.exceptionsMessage({
								message: self.console.moduleNotFound + e.name,
								status: 'warning',
								date: self.dateNowISO()
							});

						if (e.cache && self.getStore(e.storeName) === false)
							self.setStore(e.storeName, this.responseText);

						return self.render(this.responseText, e);
					};

					return self.xhr(ajax);
				});
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
				ajax.url			= o.url + '&c=' + o.date.now();

				ajax.success = function(status) {
					return true;
				};
				
				return self.xhr(ajax);
			},
			murmurhash3_32_gc: function(key, seed) {
				var remainder, bytes, h1, h1b, c1, c2, k1, i;

				remainder = key.length & 3; // key.length % 4
				bytes = key.length - remainder;
				h1 = seed;
				c1 = 0xcc9e2d51;
				c2 = 0x1b873593;
				i = 0;

				while (i < bytes) {
					k1 = ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(++i) & 0xff) << 8) | ((key.charCodeAt(++i) & 0xff) << 16) | ((key.charCodeAt(++i) & 0xff) << 24);
					++i;

					k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
					k1 = (k1 << 15) | (k1 >>> 17);
					k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;
					h1 ^= k1;
					h1 = (h1 << 13) | (h1 >>> 19);
					h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
					h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
				}

				k1 = 0;

				switch (remainder) {
					case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
					case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
					case 1: k1 ^= (key.charCodeAt(i) & 0xff);
					k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
					k1 = (k1 << 15) | (k1 >>> 17);
					k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
					h1 ^= k1;
				}

				h1 ^= key.length;

				h1 ^= h1 >>> 16;
				h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
				h1 ^= h1 >>> 13;
				h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
				h1 ^= h1 >>> 16;

				return h1 >>> 0;
			},
			fingerPrint: function() {
				var self = this;
				return this.murmurhash3_32_gc([
					w.navigator.userAgent,
					w.navigator.language,
					screen.colorDepth,
					(screen.height > screen.width) ? [screen.height, screen.width] : [screen.width, screen.height],
					new Date().getTimezoneOffset(),
					!!w.sessionStorage,
					!!w.localStorage,
					!!w.indexedDB,
					typeof(w.openDatabase),
					w.navigator.cpuClass,
					w.navigator.platform,
					w.navigator.doNotTrack,
					this.map(w.navigator.plugins, function (p) {
						var mimeTypes = self.map(p, function(mt) {
							return [mt.type, mt.suffixes].join('~');
						}).join(',');
						return [p.name, p.description, mimeTypes].join('::');
					}, this).join(';')
				].join('###'), 31);
			},
			getDekkoParams: function() {
				var t = {},
					o = {};

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
				o.url = typeof t.arr[2] == 'string' ? t.arr[0] + '//' + t.arr[2] + defaults.path : defaults.path;
				o.domain = w.location.hostname || w.location.host;
				o.fingerPrint = this.fingerPrint();
				o.settingsUrl = o.url + '?d=' + o.domain + '&f=' + o.fingerPrint;
				this.detectIEBrowser = this.regex.ie.test(w.navigator.userAgent) ? true : false;
				return o;

			},

			svg: {
				close: function(c) {
					return '<svg width="' + c.width + '" height="' + c.height + '"' +
						   'style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality;' +
						   'fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 13547 13547" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Ebene_x0020_1">' +
						   '<polygon fill="' + c.background + '" points="0,0 13547,0 13547,13547 0,13547 "/><path fill="' + c.color + '" d="M714 12832l12118 0 0 -12117 -12118 0 0 12117zm4188 -2990l1871 -1871 1871 1871 1197 -1197 -1871 -1871 1871 -1871 -1197 -1197 -1871 1871 -1871 -1871 -1197 1197 1871 1871 -1871 1871 1197 1197z"/>' +
						   '</g></svg>';
				}
			}

		};

		try {

			return this.dekkoConstructor.getOptions();

		} catch (e) {
			return console.log(e);
		}
	};


	return w.dekko();

})(window, document);

(function (jQuery) {
	if (!jQuery.easing.def) {
		jQuery.extend( jQuery.easing, {
			def: 'easeOutQuad',
			swing: function (x, t, b, c, d) {
				return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
			},
			easeInQuad: function (x, t, b, c, d) {
				return c*(t/=d)*t + b;
			},
			easeOutQuad: function (x, t, b, c, d) {
				return -c *(t/=d)*(t-2) + b;
			},
			easeInOutQuad: function (x, t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t + b;
				return -c/2 * ((--t)*(t-2) - 1) + b;
			},
			easeInCubic: function (x, t, b, c, d) {
				return c*(t/=d)*t*t + b;
			},
			easeOutCubic: function (x, t, b, c, d) {
				return c*((t=t/d-1)*t*t + 1) + b;
			},
			easeInOutCubic: function (x, t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t*t + b;
				return c/2*((t-=2)*t*t + 2) + b;
			},
			easeInQuart: function (x, t, b, c, d) {
				return c*(t/=d)*t*t*t + b;
			},
			easeOutQuart: function (x, t, b, c, d) {
				return -c * ((t=t/d-1)*t*t*t - 1) + b;
			},
			easeInOutQuart: function (x, t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
				return -c/2 * ((t-=2)*t*t*t - 2) + b;
			},
			easeInQuint: function (x, t, b, c, d) {
				return c*(t/=d)*t*t*t*t + b;
			},
			easeOutQuint: function (x, t, b, c, d) {
				return c*((t=t/d-1)*t*t*t*t + 1) + b;
			},
			easeInOutQuint: function (x, t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
				return c/2*((t-=2)*t*t*t*t + 2) + b;
			},
			easeInSine: function (x, t, b, c, d) {
				return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
			},
			easeOutSine: function (x, t, b, c, d) {
				return c * Math.sin(t/d * (Math.PI/2)) + b;
			},
			easeInOutSine: function (x, t, b, c, d) {
				return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
			},
			easeInExpo: function (x, t, b, c, d) {
				return (t===0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
			},
			easeOutExpo: function (x, t, b, c, d) {
				return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
			},
			easeInOutExpo: function (x, t, b, c, d) {
				if (t===0) return b;
				if (t==d) return b+c;
				if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
				return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
			},
			easeInCirc: function (x, t, b, c, d) {
				return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
			},
			easeOutCirc: function (x, t, b, c, d) {
				return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
			},
			easeInOutCirc: function (x, t, b, c, d) {
				if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
				return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
			},
			easeInElastic: function (x, t, b, c, d) {
				var s=1.70158;var p=0;var a=c;
				if (t===0) return b;
				if ((t/=d)==1) return b+c;
				if (!p) p=d*0.3;
				if (a < Math.abs(c)) { a=c; s=p/4; }
				else s = p/(2*Math.PI) * Math.asin (c/a);
				return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			},
			easeOutElastic: function (x, t, b, c, d) {
				var s=1.70158;var p=0;var a=c;
				if (t===0) return b;
				if ((t/=d)==1) return b+c;
				if (!p) p=d*0.3;
				if (a < Math.abs(c)) { a=c; s=p/4; }
				else s = p/(2*Math.PI) * Math.asin (c/a);
				return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
			},
			easeInOutElastic: function (x, t, b, c, d) {
				var s=1.70158;var p=0;var a=c;
				if (t===0) return b;
				if ((t/=d/2)==2) return b+c;
				if (!p) p=d*(0.3*1.5);
				if (a < Math.abs(c)) { a=c; s=p/4; }
				else s = p/(2*Math.PI) * Math.asin (c/a);
				if (t < 1) return -0.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
				return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
			},
			easeInBack: function (x, t, b, c, d, s) {
				if (s === undefined) s = 1.70158;
				return c*(t/=d)*t*((s+1)*t - s) + b;
			},
			easeOutBack: function (x, t, b, c, d, s) {
				if (s === undefined) s = 1.70158;
				return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
			},
			easeInOutBack: function (x, t, b, c, d, s) {
				if (s === undefined) s = 1.70158; 
				if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
				return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
			},
			easeInBounce: function (x, t, b, c, d) {
				return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
			},
			easeOutBounce: function (x, t, b, c, d) {
				if ((t/=d) < (1/2.75)) {
					return c*(7.5625*t*t) + b;
				} else if (t < (2/2.75)) {
					return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
				} else if (t < (2.5/2.75)) {
					return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
				} else {
					return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
				}
			},
			easeInOutBounce: function (x, t, b, c, d) {
				if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * 0.5 + b;
				return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
			}
		});
	}
})(jQuery);
