/**
 *
 * name: Dekko
 * description: advert loader
 * Version: 0.2.1 beta
 * Author:  Pavel Pronskiy
 * Contact: pavel.pronskiy@gmail.com
 *
 * Copyright (c) 2016 Dekko Pavel Pronskiy
 * Last update: 24.07.2017
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

	var $;

	try {
		if (typeof jQuery === 'undefined') {
			console.error('Dekko need jQuery library');
			return false;
		} else {
			$ = jQuery;
		}

	} catch(e) {}

	$.fn.dekko = function(url, options) {

		// capsule
		w.dekkoModule = function(o) {};

		var settings = {},
			dekkoConstructor,
			$this = this;

		// default settings
		settings.app = {
			revision			: 0, 					// this opt require incremental number and cache true (required if cache enabled)
			cache				: true, 				// (optional)
			verbose				: true, 				// (optional)
			templateName		: 'default.js',			// (required)
			modules				: [],					// (required if modulesUrl not defined)
			adType				: '',					// (module advert type)
			rotate				: false,				// (optional)
			path				: ''
		};

		// default ajax settings
		settings.ajax = {
			async				: true,
			type				: 'GET',
			contentType 		: "application/json",
			dataType			: 'json',
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
		dekkoConstructor = {
			
			// verbose options
			console: {
				timeModule 		: 'module: ',
				timeSeconds		: ', time',
				totalTime 		: 'Total time load '
			},
			
			// static prefix points
			storePoint: {
				name 			: 'dekko:',
				closed 			: ':closed',
				module 			: ':module:',
				prev 			: ':rotate:',
				rev 			: ':r',
				p 				: ':',
				s				: '/'
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
			setStore: function(n, o) {
				return w.localStorage.setItem(n, JSON.stringify(o));
			},
			getStore: function(o) {
				var x = w.localStorage.getItem(o);
				return (x !== null && typeof x !== 'undefined')
					? JSON.parse(x)
					: false;
			},
			delStore: function(o) { // deprecated
				return w.localStorage.removeItem(o);
			},
			setCookie: function(key, value) {
				var expires = new Date(); // b64value
				expires.setTime(expires.getTime() + (value * 24 * 60 * 60 * 1000));
				document.cookie = key + '=' + JSON.stringify(value) + ';expires=' + expires.toUTCString();
			},
			getCookie: function(key) {
				var mc = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
				return mc
					? mc[2]
					: false;
			},
			decodeHex: function(o) {
			    var s = '';
			    for (var i = 0; i < o.length; i+=2) {
			        s += String.fromCharCode(parseInt(o.substr(i, 2), 16));
			    }
			    return decodeURIComponent(escape(s));
			},
			encodeHex: function(o) {
				var h = '';
				for(var i=0; i<o.length; i++) {
					h += ''+o.charCodeAt(i).toString(16);
				}
				return h;
			},
			isMobile: function() {
				return (/Mobi/.test(w.navigator.userAgent))
					? true
					: false;
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
			// callback final
			render: function(s, o) {
				// initialise dekkoModule function
				(w.execScript)
					? w.execScript(s)
					: (new Function(s))();

				// put json options to module and start rendering
				return w.dekkoModule.call(this, o);
			},
			// request module callback
			notice: function(o) {
				return (o.verbose)
					? this.timeEnd(o.timePoint)
					: false;
			},
			expire: function(o) {
				var a, b;
				a = this.getStore(o.closePoint);

				if (a === false)
					return false;

				b = (a[0] === true)
					? Math.floor((o.date.now() - a[1]) / 60)
					: false; // minutes ago

				return (b && b > o.date.close)
					? this.delStore(o.closePoint)
					: true;
			},
			
			// check options and switch request to render
			getModules: function(m, o) {
				var self = this,
					ajax = settings.ajax;
				self.each(m, function(e, i) {

					// check false
					if (e === false)
						return false;

					// check time expire
					if (e.date.now() < e.date.start || e.date.now() > e.date.end)
						return false;

					// check mobile device and mobile params
					if (self.isMobile() === true && e.mobile === false)
						return false;
						
					// check closed
					if (self.expire(e) === true)
						return false;

					// check store and return render
					var localStore = self.getStore(e.storeName);
					if (e.cache && localStore !== false)
						return self.render(localStore, e);

					ajax.url = (e.dataStore)
						? e.ajaxUrl
						: e.url;

					ajax.crossDomain 		= false; // needed to jquery ajax crossDomain absolute path
					ajax.crossOrigin		= true;
					ajax.cache				= true;
					ajax.dataType			= 'script';

					if (e.dataStore)
						ajax.data = {
							d: e.domain,
							// t: e.type,
							m: e.name,
							f: e.fingerPrint
						};

					ajax.error = function(a) {
						return self.ajaxErrors(ajax.url + ' ' + a.status + ' ' + a.statusText);
					};
					ajax.success = function(script,status,xhr) {

						// check response mimetype
						if (xhr.getResponseHeader('Content-Type') !== 'text/javascript')
							return false;


						// self.delStore(null, self.storePoint.module + e.name);
						if (self.getStore(e.storeName) === false)
							self.setStore(e.storeName, script);

						return self.render(script, e);
					};

					// return console.log(ajax);
					return self.ajax(ajax);
				});
			},
			// object params build
			constructParams: function(o) {
				var self = this,
					module = {},
					modules = [],
					rotateModules = [],
					routeModules,
					ms = {},	
			
					object = (o.modules && o.modules.length > 0)
						? o.modules
						: false;
	
					
				if (object === false)
					return false;

				if (o.verbose)
					self.time(null, o.spm);

				ms.rotates = [];
				ms.defaults = [];
				self.each(object, function(e, i) {

					module = {
						item			: e,
						name			: e.name,
						delay			: e.delay,
						cache			: o.cache,
						verbose			: o.verbose,
						rotate			: typeof e.rotate === 'string'
											? JSON.parse(e.rotate)
											: false,
						storeName		: self.storePoint.name +
											o.fingerPrint +
											self.storePoint.p +
											e.type +
											self.storePoint.p +
											e.name +
											self.storePoint.rev +
											e.revision,

						timePoint		: self.console.timeModule +
											e.name +
											self.console.timeSeconds,

						append			: typeof e.append !== 'undefined'
											? typeof e.append === 'string'
												? jQuery(e.append)
												: e.append
											: jQuery('body'),

						dataStore		: o.dataStore,
						spm				: o.spm,
						
						ajaxUrl			: typeof o.ajaxUrl == 'undefined'
											? null
											: o.ajaxUrl,

						fingerPrint		: o.fingerPrint,

						images			: typeof e.images == 'object'
											? e.images
											: [],

						excludes		: typeof e.excludes == 'object'
											? e.excludes
											: [],

						domain			: w.location.hostname || w.location.host,

						mobile			: typeof e.mobile == 'object'
											? e.mobile
											: typeof e.mobile == 'boolean'
												? e.mobile
												: false,

						type			: e.type,
						date: {
							now			: self.dateNow,
							end			: self.dateToUnixTimeStamp(e.date.end),
							start		: self.dateToUnixTimeStamp(e.date.start),
							close		: e.closeExpire
						}
					};

					module.closePoint = module.storeName +
										self.storePoint.closed;

					if (o.verbose)
						self.time(module.timePoint, null);


					if (module.rotate === true) {
						ms.rotates.push(module);
					
					} else {
						ms.defaults.push(module);
					}

						
				});

				ms.randomize = self.rotateModules(ms.rotates, o);
				ms.uniq = (ms.randomize.length > 0) ?
					ms.defaults.concat(ms.randomize).filter(
						function(item, index, array) {
							// console.log(item);
							return array.map(function(m){
								return m['name'];
							}).indexOf(item['name']) === index;
				}) : ms.defaults;

				// console.log(ms.uniq);
				return self.getModules(ms.uniq, o);
			},
			// get random object
			randModule: function(options, modules) {
				var r, c, j,
					skey = options.ppm +
						modules[0].append.selector,

					i = 0,
					t = true,
					self = this;

				while (t) {

					c = self.getStore(skey) ? self.getStore(skey) : 0;
					r = parseInt(Math.floor(Math.random() * modules.length), 10);
					j = (typeof self.getStore(modules[r].closePoint)[0] !== 'undefined')
						? self.getStore(modules[r].closePoint)[0]
						: false;

					t = (r !== c && j !== true)
						? false
						: true;

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
					c = {},
					i = 0,
					l = [],
					rl = [];
	
				self.each(modules, function(a,i) {
					c[a.append.selector] = (c[a.append.selector]||0)+1;
				});
				
				self.each(c, function(p,e) {
					l[i] = [];
					self.each(modules, function(m,k) {
						if (e === m.append.selector)
							l[i].push(m);
					});
						
					i++;
				});

				self.each(l, function(z,x) {
					return rl.push(self.randModule(options, z));
				});

				return rl;
			},
			err: function(o) {
				console.log('err');
			},
			// get object options
			getOptions: function(e, o) {
				var	self = this,
					ajax = settings.ajax,
					data = {};
			
				ajax.url 				= o.modules;
				ajax.cache 				= o.cache;
				ajax.context 			= self;
				ajax.data 				= {};
				ajax.data.d		 		= w.location.hostname || w.location.host;
				// ajax.data.t 			= o.type;
				ajax.data.f 			= o.fingerPrint;
				ajax.crossDomain 		= false;


				ajax.error = function(a,b,c) {

					return console.warn(ajax.url + ' ' + a.status + ' ' + a.statusText);
				};
				ajax.success = function(objects,status,xhr) {


					if (self.exceptionsHandler(objects) === true)
						return self.exceptionsMessage(objects)


					data.modules 		= objects;
					data.ajaxUrl 		= ajax.url;
					// data.type 		= o.type;
					data.fingerPrint 	= o.fingerPrint;
					return self.modulesdekkoConstructor(e, data);
				};

				return self.ajax(ajax);
			},
			exceptionsMessage: function(o) {
				var message = '[' + o.date + '] ' + this.storePoint.name + ' ' + o.message;
				
				switch (o.status) {
					case 'error':
						console.group(message);
						console.log(o.stack);
					break;
					default:
					break;
				}
				return console.groupEnd(message);

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
			ajaxErrors: function(msg) {
				throw new Error(msg);
			},
			ajax: function(o) {
				return $.ajax(o);
			},
			time: function(o, g) {
				return (g)
					? console.group(g)
					: console.time(o);
			},
			timeEnd: function(o, g) {
				return (g)
					? console.groupEnd(g)
					: console.timeEnd(o);
			},
			modulesdekkoConstructor: function (e, opts) {
				var self = this,
					c,
					point,
					o = {},
					optRev;

				if (typeof opts.modules == 'string')
					settings.app.path = self.parseUrl(opts.modules).prop('origin') + settings.app.path;
 
				opts.dataStore = (typeof url == 'string' && typeof opts == 'object')
					? true
					: false;

				o = $.extend(settings.app, opts);
				// o.element = e;
				
				point = (o.ajaxUrl)
					? o.ajaxUrl.replace(settings.regex.remote, '')
					: typeof o.modules == 'string'
						? o.modules.replace(settings.regex.remote, '')
						: e.selector.replace(/(\.|\-)/gi, '');
				
				optRev = (typeof o.revision == 'number')
						? self.storePoint.rev + o.revision
						: '';
					
				o.spm = self.storePoint.name +
						o.fingerPrint;

				o.ppm = self.storePoint.name +
						o.fingerPrint +
						self.storePoint.prev;


				return (typeof o.modules == 'string')
					? self.getOptions(e, o)
					: self.constructParams(o);
			
			},
			// for module clients click
			clickAdvert: function(o) {
				var	self = this, ajax = settings.ajax;

				ajax.url			= o.ajaxUrl;
				ajax.cache			= true;
				ajax.context		= self;
				ajax.data 			= {
					c: o.date.now(),
					// d: w.location.hostname || w.location.host,
					m: o.name,
					f: o.fingerPrint
				};

				ajax.error = function(a,b,c) {
					return console.warn(ajax.url + ' ' + a.status + ' ' + a.statusText);
				};
				ajax.success = function(data) {
					return data;
				};
				
				return self.ajax(ajax);
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
			fingerPrint: function() {
				var self = this, k = [
					w.navigator.userAgent,
					w.navigator.language,
					screen.colorDepth,
					(screen.height > screen.width)
						? [screen.height, screen.width]
						: [screen.width, screen.height],

					new Date().getTimezoneOffset(),
					!!w.sessionStorage,
					!!w.localStorage,
					!!w.indexedDB,
					typeof(w.openDatabase),
					w.navigator.cpuClass,
					w.navigator.platform,
					w.navigator.doNotTrack,
					self.map(w.navigator.plugins, function (p) {
						var mimeTypes = self.map(p, function(mt) {
							return [mt.type, mt.suffixes].join('~');
						}).join(',');
						return [p.name, p.description, mimeTypes].join('::');
					}, this).join(';')
				],
				hash = self.murmurhash3_32_gc(k.join('###'), 31);
				return hash;
			},
			log: function(e) {
				console.info(e);
				console.info('123');
			}
		};

		try {

			if (typeof w.navigator === 'undefined')
				throw new Error('Browser not support variable navigator');

			if (typeof w.localStorage == 'undefined')
				throw new Error('Browser not support localStorage');

			if (typeof url == 'string')
				options.modules = url;

			if (typeof url == 'object')
				options = url;

			if (typeof options !== 'object' && typeof options !== 'string')
				return false;

			if (Object.keys(options).length === 0 || options.modules === '')
				return false;

			options.fingerPrint 	= dekkoConstructor.fingerPrint();
			options.local 			= (typeof options.modules == 'object') ? true : false;

			return dekkoConstructor.modulesdekkoConstructor($this, options);

		} catch (e) {
			return dekkoConstructor.log(e);
		}
	};

	if (!$.easing.def) {
		$.easing['jswing'] = $.easing['swing'];
		$.extend( $.easing,
		{
			def: 'easeOutQuad',
			swing: function (x, t, b, c, d) {
				//alert(jQuery.easing.default);
				return $.easing[$.easing.def](x, t, b, c, d);
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
				return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
			},
			easeOutExpo: function (x, t, b, c, d) {
				return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
			},
			easeInOutExpo: function (x, t, b, c, d) {
				if (t==0) return b;
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
				if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
				if (a < Math.abs(c)) { a=c; var s=p/4; }
				else var s = p/(2*Math.PI) * Math.asin (c/a);
				return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			},
			easeOutElastic: function (x, t, b, c, d) {
				var s=1.70158;var p=0;var a=c;
				if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
				if (a < Math.abs(c)) { a=c; var s=p/4; }
				else var s = p/(2*Math.PI) * Math.asin (c/a);
				return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
			},
			easeInOutElastic: function (x, t, b, c, d) {
				var s=1.70158;var p=0;var a=c;
				if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
				if (a < Math.abs(c)) { a=c; var s=p/4; }
				else var s = p/(2*Math.PI) * Math.asin (c/a);
				if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
				return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
			},
			easeInBack: function (x, t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				return c*(t/=d)*t*((s+1)*t - s) + b;
			},
			easeOutBack: function (x, t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
			},
			easeInOutBack: function (x, t, b, c, d, s) {
				if (s == undefined) s = 1.70158; 
				if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
				return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
			},
			easeInBounce: function (x, t, b, c, d) {
				return c - $.easing.easeOutBounce (x, d-t, 0, c, d) + b;
			},
			easeOutBounce: function (x, t, b, c, d) {
				if ((t/=d) < (1/2.75)) {
					return c*(7.5625*t*t) + b;
				} else if (t < (2/2.75)) {
					return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
				} else if (t < (2.5/2.75)) {
					return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
				} else {
					return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
				}
			},
			easeInOutBounce: function (x, t, b, c, d) {
				if (t < d/2) return $.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
				return $.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
			}
		});
	}

	// initialization and rendering
	return $.fn.dekko('/sa', {
		cache: (typeof doc.currentScript.dataset.cache !== 'undefined')
			? doc.currentScript.dataset.cache
			: false,
		verbose: (typeof doc.currentScript.dataset.verbose !== 'undefined')
			? doc.currentScript.dataset.verbose
			: false
	});

})(window, document);