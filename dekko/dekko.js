/**
 *
 * name: Dekko
 * description: advert loader
 * Version: 0.1.7 beta
 * Author:  Pavel Pronskiy
 * Contact: pavel.pronskiy@gmail.com
 *
 * Copyright (c) 2016 Dekko Pavel Pronskiy
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
 
;(function ($, window, document) {

	$.fn.dekko = function(url, options) {

		// capsule
		window.dekkoModule = function(o) {};

		var settings = {}, constructor, $this = this;

		// default settings
		settings.app = {
			revision			: 0, 					// this opt require incremental number and cache true (required if cache enabled)
			cache				: true, 				// (optional)
			verbose				: true, 				// (optional)
			templateName		: 'default.js',			// (required)
			modules				: [],					// (required if modulesUrl not defined)
			adType				: '',					// (module advert type)
			rotate				: false,				// (optional)
			path				: '/media/dekko/modules',
			jQueryEasingUrl		: 'https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.js',
			geoTargetingUrl		: 'https://geoip-db.com/jsonp',
			staticWebStore		: '//static.cdn.net'
		};

		// default ajax settings
		settings.ajax = {
			async: true,
			type: 'GET',
			status: {
				'404'			: 'Not found',
				'400'			: 'Incorrect attempt',
				'401'			: 'Internal error'
			}
		};

		settings.fp = {
			excludeFlashFonts: true
		};

		settings.regex = {
			remote 				: /(^(https?|\/\/)|(\/|\.|\:))/gi,
			host 				: /^(https?|\/\/)/,
			dkm 				: /dekkoModule/
		};

		// chains
		constructor = {
			
			// verbose options
			console: {
				timeModule 		: 'Loaded dekko module: ',
				geoTargeting 	: ', geoTargeting: ',
				timeSeconds		: ', execution time',
				totalTime 		: 'Total time load '
			},
			
			// static prefix points
			storePoint: {
				name 			: 'dekko:',
				closed 			: ':closed:',
				options 		: 'options:',
				module 			: ':module:',
				modules 		: ':modules:',
				prev 			: ':rotate:',
				rev 			: ':r',
				geo 			: ':geo',
				p 				: ':',
				slash			: '/'
			},
			advertType: [
				'banner', 'branding', 'popup', 'bar'
			],
			dateNow: function() {
				return Math.round(new Date().getTime() / 1000);
			},
			dateToUnixTimeStamp: function(o) {
				var d = new Date(o.split(' ').join('T'));
				d = d.getTime() / 1000;
				return (d) ? d : false;
			},
			base64encode: function(s) {
				// first we use encodeURIComponent to get percent-encoded UTF-8,
				// then we convert the percent encodings into raw bytes which
				// can be fed into btoa.
				return btoa(encodeURIComponent(s).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
					return String.fromCharCode('0x' + p1);
				}));
			},
			base64decode: function(s) {
				// Going backwards: from bytestream, to percent-encoding, to original string.
				return decodeURIComponent(atob(s).split('').map(function(c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				}).join(''));
			},
			setStore: function(n, o) {
				return window.localStorage.setItem(n, JSON.stringify(o));
			},
			getStore: function(o) {
				var x = window.localStorage.getItem(o);
				return (x !== null && typeof x !== 'undefined') ? JSON.parse(x) : false;
			},
			delStore: function(o) { // deprecated
				return window.localStorage.removeItem(o);
			},
			setCookie: function(key, value) {
				var expires = new Date(), b64value;
				expires.setTime(expires.getTime() + (value * 24 * 60 * 60 * 1000));
				b64value = this.base64encode(JSON.stringify(value));
				document.cookie = key + '=' + b64value + ';expires=' + expires.toUTCString();
			},
			getCookie: function(key) {
				var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
				return keyValue ? JSON.parse(this.base64decode(keyValue[2])) : null;
			},
			gEval: function(xhr, o) {
				$.globalEval(xhr);
				return window.dekkoModule.call(this, o);
			},
			// callback final
			render: function(o) {
				
				var stored = this.getStore(o.storeName),
				xhr = (o.cache && stored !== false) ? stored : (o.xhr) ? o.xhr : false;
					
				if (xhr !== false)
					this.gEval(xhr, o);
				
				return false;
			},
			
			// request module callback
			notice: function(o) {
				return (o.verbose) ?
					this.timeEnd(o.timePoint) :
					false;
			},
			expire: function(o) {
				var a,b;
				a = this.getStore(o.closePoint);
				if (a === false) return false;
				b = (a[0] === true) ? Math.floor((o.date.now() - a[1]) / 60) : false; // minutes ago
				return (b && b > o.date.close) ? this.delStore(o.closePoint) : true;
			},
			
			// check options and switch request to render
			route: function(m, o) {
				var self = this, ajax = {},
					geoTargetingPoint = self.storePoint.name + o.fingerPrint + self.storePoint.geo,
					clientGeoData;

				m.forEach(function(e) {

					if (e === false)
						return false;

					// check time expire
					if (e.date.now() < e.date.start || e.date.now() > e.date.end)
						return false;

					// check closed
					if (self.expire(e) === true)
						return false;

					/**
						-> geo targeting module
						<obj>.cc = country code
						<obj>.cn = country name
						<obj>.cs = city name
					*/
					clientGeoData = self.getCookie(geoTargetingPoint);
					if (e.geoTargeting.length > 0 && typeof clientGeoData.cs != 'undefined')
						if (e.geoTargeting.indexOf(clientGeoData.cs) === -1)
							return false;


					// check store and return render
					if (e.cache && self.getStore(e.storeName))
						return self.render(e);


					ajax.url				= (e.dataStore) ? e.ajaxUrl	: e.url;
					ajax.crossDomain 		= false; // needed to jquery ajax crossDomain absolute path
					ajax.cache				= true;
					ajax.crossOrigin		= true;
					ajax.dataType			= 'script';
					
					if (e.dataStore)
						ajax.data = {
							t: e.type,
							d: e.domain,
							m: e.name,
							f: e.fingerPrint
						};

					ajax.error = function(a) {
						return self.ajaxErrors(ajax.url + ' ' + a.status + ' ' + a.statusText);
					};
					ajax.success = function(xhr) {

						if (!xhr.match(settings.regex.dkm)) // check dekkoModule exists
							return false;

						// check data
						if (self.serverExceptions(e.verbose, xhr, ajax))
							return false;
						
						e.xhr = xhr;
						// self.delStore(null, self.storePoint.module + e.name);
						self.setStore(e.storeName, e.xhr);

						return self.render(e);
					};

					// return console.log(ajax);
					return self.ajax(ajax);
				});
			},
			
			// get random object
			randModule: function(o, m) {
				var r, c, j, i = 0, t = true, self = this;

				if (self.getStore(o.ppm) === false)
					self.setStore(o.ppm, -1);

				c = self.getStore(o.ppm);
				
				while (t) {

					r = parseInt(Math.floor(Math.random() * m.length), 10);
					j = (typeof self.getStore(m[r].closePoint)[0] !== 'undefined') ? self.getStore(m[r].closePoint)[0] : false;
					t = (r !== c && j !== true) ? false : true;

					if (i > m.length * 2) {
						r = c;
						t = false;
					}

					i++;
				}
				
				self.setStore(o.ppm, r);
				return m[r];
			},
			
			// objects params build
			constructParams: function(o) {
				var obj = [],
						modules = [],
						self = this,
						keyName,
						object,
						type,
						objGeoData = {}, 
						objGeoTargeting,
						routeModules,
						geoTargetingPoint = self.storePoint.name + o.fingerPrint + self.storePoint.geo;
	
				try {
				
					obj = (o.modules && o.modules.length > 0) ?
						o.modules :
						false;
	
					if (obj === false)
						return false;
	
					if (o.verbose)
						self.time(null, o.spm);
	
					type = (o.type) ? o.type : '';
					
					obj.forEach(function(e, i) {
						keyName = Object.keys(e)[0];
						object = e[keyName];
						

						modules.push({
							name			: keyName,
							storeName		: self.storePoint.name +
												o.fingerPrint +
												self.storePoint.p +
												type +
												self.storePoint.p +
												keyName +
												self.storePoint.rev +
												object.revision,

							closePoint		: self.storePoint.name +
												o.fingerPrint +
												self.storePoint.p +
												type +
												self.storePoint.closed +
												keyName +
												self.storePoint.rev +
												object.revision,

							path			: o.path +
												self.storePoint.slash +
												keyName,

							url				: o.path +
												self.storePoint.slash +
												keyName +
												self.storePoint.slash +
												o.templateName,

							delay			: object.delay,
							item			: object,
							cache			: o.cache,
							verbose			: o.verbose,
							timePoint		: self.console.timeModule +
												keyName +
												self.console.timeSeconds,

							geoTargeting 	: typeof object.geoTargeting == 'object' ?
												object.geoTargeting :
												[],
							append			: o.element,
							dataStore		: o.dataStore,
							spm				: o.spm,
							
							ajaxUrl			: typeof o.ajaxUrl == 'undefined' ?
												null :
												o.ajaxUrl,

							fingerPrint		: o.fingerPrint,

							images			: typeof object.images == 'object' ?
												object.images :
												[],

							excludes		: typeof object.excludes == 'object' ?
												object.excludes :
												[],

							domain			: window.location.hostname || window.location.host,
							type			: o.type,
							date: {
								now			: function() {
												return Math.round(new Date().getTime() / 1000);
											},

								end			: self.dateToUnixTimeStamp(object.date.end),
								start		: self.dateToUnixTimeStamp(object.date.start),
								close		: object.closeExpire
							}
						});
	

						if (o.verbose)
							self.time(modules[i].timePoint);
							
					});

					routeModules = (o.rotate) ? [self.randModule(o, modules)] : modules;

					objGeoTargeting = $.grep(modules, function (m) {
						return (m.geoTargeting.length > 0) ? true : null; 
					});
					
					if (objGeoTargeting.length > 0)
						if (self.getCookie(geoTargetingPoint) === null)
							self.getGeoLocation(o).success(function(xhr) {

								if (typeof xhr.city == 'undefined') {
									if (o.verbose)
										console.warn('Server GEO result empty object: ' + xhr);

									return self.route(routeModules, o);
								}


								objGeoData.cc = xhr.country_code;
								objGeoData.cn = xhr.country_name;
								objGeoData.cs = xhr.city;

								self.setCookie(geoTargetingPoint, objGeoData);
								return self.route(routeModules, o);

							}).error(function(a,b,c) {
								console.warn(a.status + ' ' + a.statusText);
								return self.route(routeModules, o);
							});
						else
							return self.route(routeModules, o);
					else
						return self.route(routeModules, o);
					

				} catch (e) {
					return console.error(e);
				}
			},
			
			// get object settings and array modules
			getModules: function(e, o) {
				var	self = this, ajax = {}, data = {};
			
				ajax.url 				= o.modules;
				ajax.cache 				= o.cache;
				ajax.context 			= self;
				ajax.dataType 			= 'json';
				ajax.contentType 		= "application/json";
				ajax.data 				= {};
				ajax.data.d		 		= window.location.hostname || window.location.host;
				ajax.data.t 			= o.type;
				ajax.data.f 			= o.fingerPrint;
				ajax.crossDomain 		= false;

				ajax.error = function(a,b,c) {
					return console.warn(ajax.url + ' ' + a.status + ' ' + a.statusText);
				};
				ajax.success = function(d) {

					if (self.serverExceptions(settings.verbose, d, ajax))
						return false;
			
					data.modules 		= d;
					data.ajaxUrl 		= ajax.url;
					data.type 			= o.type;
					data.fingerPrint 	= o.fingerPrint;

					return self.modulesConstructor(e, data);
				};

				return this.ajax(ajax);
			},
			serverExceptions: function(v, o, a) {
				var message;
				// return console.log(o.status);
			
				if (typeof settings.ajax.status[o.status] !== 'undefined') {
					this.time(null, a.url);
					message = (o.message) ? o.message : settings.ajax.status[o.status];
					console.error('status: ' + o.status + ', message: ' + message);
					if (v) console.warn(a);
					this.timeEnd(null, a.url);
					return true;
				}
				
				if (typeof o == 'undefined') {
					this.time(null, a.url);
					console.error('Module cannot load: ' + a.url + ' incorrect results');
					if (v) console.warn(a);
					this.timeEnd(null, a.url);
					return true;
				}

				if (o.length === 0) {
					this.time(null, a.url);
					console.error('Modules empty: ' + a.url);
					if (v) console.warn(a);
					this.timeEnd(null, a.url);
					return true;
				}

				return false;
			},
			ajaxErrors: function(msg) {
				throw new Error(msg);
			},
			ajax: function(o) {
				return $.ajax(o);
			},
			time: function(o, g) {
				return (g) ?
					console.group(g) :
					console.time(o);
			},
			timeEnd: function(o, g) {
				return (g) ?
					console.groupEnd(g) :
					console.timeEnd(o);
			},
			modulesConstructor: function (e, opts) {
				var self = this, c, point, o = {}, optRev;

 				$.ajaxSetup(settings.ajax);

				if (typeof opts.modules == 'string')
					settings.app.path = self.parseUrl(opts.modules).prop('origin') + settings.app.path;
 
				opts.dataStore = typeof url == 'string' && typeof opts == 'object' ? true : false;

				o = $.extend(settings.app, opts);
				o.element = e;
				
				point = (o.ajaxUrl) ?
					o.ajaxUrl.replace(settings.regex.remote, '') :
						typeof o.modules == 'string' ? o.modules.replace(settings.regex.remote, '') :
						e.selector.replace(/(\.|\-)/gi, '');
				
				optRev = (typeof opts.revision == 'number') ?
					self.storePoint.rev + o.revision : '';
					
				o.spm = self.storePoint.name + o.fingerPrint + self.storePoint.p + o.type + self.storePoint.p + point + optRev;
				o.ppm = self.storePoint.name + o.fingerPrint + self.storePoint.p + o.type + self.storePoint.p + self.storePoint.prev + point + optRev;

				c = typeof o.modules == 'string' ? self.getModules(e, o) : self.constructParams(o);

				return $.when(c).done(function() {
						self.timeEnd(null, o.spm);
					}
				);
			},
			// for module clients click
			clickAdvert: function(o) {
				var	self = this, ajax = {};
				ajax.url = o.ajaxUrl;
				ajax.cache = true;
				ajax.context = self;
				ajax.dataType = 'json';
				ajax.contentType = "application/json";

				ajax.error = function(a,b,c) {
					return self.serverExceptions(o.verbose, a.responseText, ajax);
					// return console.warn(ajax.url + ' ' + a.status + ' ' + a.statusText);
				};
				ajax.success = function(data) {

					if (self.serverExceptions(o.verbose, data, ajax))
						return false;
					
					return data;
				};
				
				return this.ajax(ajax);
			},
			setClose: function(o) {
				return this.setStore(o, [true, this.dateNow()]);
			},
			parseUrl: function(u) {
				var a = $('<a>', { href: u });
				return a;
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
			fingerPrintConstructor: function() {
				var keys = [];
				keys.push(navigator.userAgent);
				keys.push(navigator.language);
				keys.push(screen.colorDepth);
				keys.push((screen.height > screen.width) ? [screen.height, screen.width] : [screen.width, screen.height]);
				keys.push(new Date().getTimezoneOffset());
				keys.push(!!window.sessionStorage);
				keys.push(!!window.localStorage);
				keys.push(!!window.indexedDB);
				keys.push(typeof(window.openDatabase));
				keys.push(navigator.cpuClass);
				keys.push(navigator.platform);
				keys.push(navigator.doNotTrack);
				keys.push($.map(navigator.plugins, function (p) {
					var mimeTypes = $.map(p, function(mt){
						return [mt.type, mt.suffixes].join('~');
					}).join(',');
					return [p.name, p.description, mimeTypes].join('::');
				}, this).join(';'));
				
				return this.murmurhash3_32_gc(keys.join('###'), 31);
			},
			checkjQueryEasing: function() {
				if (!jQuery.easing.def)
					return $.getScript(settings.app.jQueryEasingUrl);
				else
					return false;
			},
			getGeoLocation: function(o) {

				var	self = this, ajax = {};
				
				ajax.url 			= settings.app.geoTargetingUrl;
				ajax.cache 			= true;
				ajax.dataType 		= 'jsonp';
				ajax.jsonpCallback 	= 'callback';
				ajax.timeout 		= 3000;
				ajax.contentType 	= "application/json";
				ajax.data 			= {};
				ajax.error 			= function(a,b,c) {
					return self.serverExceptions(o.verbose, a.responseText, ajax);
				};

				return $.ajax(ajax);
			}
		};

		try {

			if (typeof window.localStorage == 'undefined')
				throw new Error('Browser not support localStorage');

			if (typeof url == 'string')
				options.modules = url;

			if (typeof url == 'object')
				options = url;

			if (typeof options !== 'object' && typeof options !== 'string')
				return false;

			if (Object.keys(options).length === 0 || options.modules === '')
				return false;

			options.fingerPrint 	= constructor.fingerPrintConstructor();
			options.local 			= (typeof options.modules == 'object') ? true : false;

			return $.when(constructor.checkjQueryEasing()).done(function() {
				constructor.modulesConstructor($this, options);
			});

		} catch (e) {
			return console.error(e);
		}
	};
})(jQuery, window, document);