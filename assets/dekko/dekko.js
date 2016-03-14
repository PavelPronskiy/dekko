/**
 *
 * Version: 0.1.1 beta
 * Author:  Pavel Pronskiy
 * Contact: pavel.pronskiy@gmail.com
 *
 * Copyright (c) 2016 Pavel Pronskiy
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
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
 
(function ($) {

	$.fn.dekko = function(opts) {

		// capsule
		window.dekkoModule = function(o) { try {} catch (e) { return console.error(e) } };


		var options = {
			revision		: 0, 					// this opt require incremental number and cache true (required if cache enabled)
			cache			: false, 				// (optional)
			verbose			: true, 				// (optional)
			templateName	: 'default.js',			// (required)
			modules			: [],					// (required if modulesUrl not defined)
			rotate			: false,				// (optional)
			path			: '/media/popup',		// (required)
		},
		ajaxOptions = {
			async: true,
			cache: options.cache,
			type: 'GET',
			error: function(jqxhr, settings, exception) {
				throw new Error('Ajax returned exception handler: ' + exception);
			}
		},
		constructor = {
			console: {
				timeModule: 'Module load time ',
				totalTime: 'Total time load '
			},
			storePoint: {
				closed: 'closed.',
				modules: 'modules.',
				prev: 'rotate.',
				rev: '.r',
				slash: '/'
			},
			dateToUnixTimeStamp: function(o) {
				var d = new Date(o.split(' ').join('T'));
				d = d.getTime() / 1000;
				return (d) ? d : false;
			},
			setStore: function(n, o) {
				return localStorage.setItem(n, JSON.stringify(o));
			},
			delStore: function(o) {
				return localStorage.removeItem(o);
			},
			getStore: function(o) {
				var x = localStorage.getItem(o);
				return (x !== null) ? JSON.parse(x) : false ;
			},
			render: function(o) {
				var self = this,
				stored = self.getStore(o.storeName),
				xhr = (o.xhr) ? o.xhr : stored;
				$.globalEval(xhr);
				return window.dekkoModule.call(self, o);
			},
			notice: function(o) {
				return (o.verbose)
					? this.timeEnd(o.timePoint)
					: false;
			},
			expire: function(o) {
 				var a,b;
				a = this.getStore(o.closePoint);
				if (a === false) return false;
				b = (a[0] === true) ? Math.floor((o.date.now() - a[1]) / 60) : false; // minutes ago
				return (b && b > o.date.close)
					? this.delStore(o.closePoint)
					: true;
			},
			route: function(o) {
				var self = this, ajax;
				o.forEach(function(e) {

					// check time expire
					if (e.date.now() < e.date.start && e.date.now() > e.date.end)
						return false;

					// check closed
					if (self.expire(e) === true)
						return false;
					
					// check store and return render
					if (e.cache && self.getStore(e.storeName))
						return self.render(e);
	
					ajax = {
						url			: e.path + self.storePoint.slash + e.file,
						cache		: e.cache,
						dataType	: 'script',
					},
					ajax.success = function(xhr) {
						e.xhr = xhr;
						self.setStore(e.storeName, e.xhr);
						return self.render(e);
					};

					return self.ajax(ajax);
				});
			},
			randModule: function(o, m) {
				var r,c,j,t = true, self = this;

				if (self.getStore(o.ppm) === false)
					self.setStore(o.ppm, -1);

				c = self.getStore(o.ppm);
				
				while (t) {
					r = parseInt(Math.floor(Math.random() * m.length), 10);
					j = self.getStore(m[r].closePoint)[0];
					t = (r !== c && !j) ? false : true;
				}
				
				self.setStore(o.ppm, r);
				return m[r];
			},
			constructParams: function(o) {
				var obj = [], modules = [], self = this, keyName, object;
				
				obj = (o.modules && o.modules.length > 0)
					? o.modules
					: false;

				if (obj === false)
					return false;

				obj.forEach(function(e, i) {
					keyName = Object.keys(e)[0],
					object = e[keyName],
					
					modules.push({
						name		: keyName,
						storeName	: keyName + self.storePoint.rev + o.revision + self.storePoint.rev + object.revision,
						path		: o.path + self.storePoint.slash + keyName,
						file		: o.templateName,
						delay		: object.delay,
						item		: object,
						cache		: o.cache,
						verbose		: o.verbose,
						timePoint	: self.console.timeModule + keyName,
						closePoint	: self.storePoint.closed + keyName + self.storePoint.rev + o.revision + self.storePoint.rev + object.revision,
						append		: o.element,
						date: {
							now		: function() { return Math.round(new Date().getTime() / 1000) },
							end		: self.dateToUnixTimeStamp(object.date.end),
							start	: self.dateToUnixTimeStamp(object.date.start),
							close	: object.closeExpire,
						}
					});

					(o.verbose) && self.time(modules[i].timePoint);
				});
	
				return self.route((o.rotate)
					? [self.randModule(o, modules)]
					: modules);
			},
			getModules: function(o) {
				var	self 	= this, ajax,
				stored = self.getStore(o.spm);

				if (stored && o.cache)
					return o.modules = stored
					,	self.constructParams(o);


				// get modules callback function
				ajax = o.modules.match(/(^(https?|\/\/)|jsonp)/)
				?
				{
					crossDomain 	: true,
					dataType 		: 'json',
					contentType 	: "application/json",
					data : {
						domain: window.location.hostname
						|| window.location.host
					}
				}
				:
				{
					dataType 		: 'json'
				},

				ajax.context = self,
				ajax.cache = o.cache,
				ajax.url = o.modules,

				ajax.error = function(a,b,c) {
					self.ajaxErrors(ajax.url + ' ' + a.status + ' ' + a.statusText);
				},
				ajax.success = function(data) {
					o.modules = data;
					if (self.getStore(o.spm) === false)
						self.setStore(o.spm, data);
					
					self.constructParams(o);
				};

				// return;


				return this.ajax(ajax);
			},
			ajaxErrors: function(msg) {
				throw new Error(msg);
			},
			ajax: function(o) {
				return $.ajax(o);
			},
			time: function(o) {
				return console.time(o);
			},
			timeEnd: function(o) {
				return console.timeEnd(o);
			},
			init: function (e,o) {
				var self = this, c, point,
				
				rev = (typeof o.revision == 'number')
				? o.revision
				: 0;
				
				o.element = e,
				
				point = (typeof o.modules == 'object')
				? e.selector.replace(/(\.|\-)/gi, '')
				: o.modules.replace(/(^(https?)|(\/|\.|\:))/gi, ''),
				
				o.spm = self.storePoint.modules + point + self.storePoint.rev + rev,
				o.ppm = self.storePoint.prev + point + self.storePoint.rev + rev,
				
				c = (typeof o.modules == 'string')
				? self.getModules(o)
				: self.constructParams(o);
				
				// self.time(self.console.totalTime);
				
				return $.when(c).done(function() {
					// self.timeEnd(self.console.totalTime);
				}).fail(function() {
					// self.timeEnd(self.console.totalTime);
				});
			}
		};

		try {

			$.extend(options, opts || {});
			$.ajaxSetup(ajaxOptions);

			if (typeof window.localStorage == 'undefined')
				throw new Error('Browser not support localStorage');

			

			// main call
			return constructor.init(this, options);
			/*$.when(
					constructor.time(),
					constructor.init(this, options)
				).done(function(d) {
					// all objects
					// console.log(d);
				}).fail(function() {
					console.warn('load fully fail');
				});*/

		} catch (e) {
			return console.error(e);
		}
	};
	
	if (typeof $.easing.easeInQuad == 'undefined') { // load easing if not exist
		$.extend($.easing, {
			easeInQuad: function (x, t, b, c, d) { return c*(t/=d)*t + b; },
			easeOutQuad: function (x, t, b, c, d) { return -c *(t/=d)*(t-2) + b; },
			easeInOutQuad: function (x, t, b, c, d) { if ((t/=d/2) < 1) return c/2*t*t + b; return -c/2 * ((--t)*(t-2) - 1) + b; },
			easeInCubic: function (x, t, b, c, d) { return c*(t/=d)*t*t + b; },
			easeOutCubic: function (x, t, b, c, d) { return c*((t=t/d-1)*t*t + 1) + b; },
			easeInOutCubic: function (x, t, b, c, d) { if ((t/=d/2) < 1) return c/2*t*t*t + b; return c/2*((t-=2)*t*t + 2) + b; },
			easeInQuart: function (x, t, b, c, d) { return c*(t/=d)*t*t*t + b; },
			easeOutQuart: function (x, t, b, c, d) { return -c * ((t=t/d-1)*t*t*t - 1) + b; },
			easeInOutQuart: function (x, t, b, c, d) { if ((t/=d/2) < 1) return c/2*t*t*t*t + b; return -c/2 * ((t-=2)*t*t*t - 2) + b; },
			easeInQuint: function (x, t, b, c, d) { return c*(t/=d)*t*t*t*t + b; }, 
			easeOutQuint: function (x, t, b, c, d) { return c*((t=t/d-1)*t*t*t*t + 1) + b; },
			easeInOutQuint: function (x, t, b, c, d) { if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b; return c/2*((t-=2)*t*t*t*t + 2) + b; },
			easeInSine: function (x, t, b, c, d) { return -c * Math.cos(t/d * (Math.PI/2)) + c + b; },
			easeOutSine: function (x, t, b, c, d) { return c * Math.sin(t/d * (Math.PI/2)) + b; },
			easeInOutSine: function (x, t, b, c, d) { return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b; },
			easeInExpo: function (x, t, b, c, d) { return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b; },
			easeOutExpo: function (x, t, b, c, d) { return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b; },
			easeInOutExpo: function (x, t, b, c, d) { if (t==0) return b; if (t==d) return b+c; if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b; return c/2 * (-Math.pow(2, -10 * --t) + 2) + b; },
			easeInCirc: function (x, t, b, c, d) { return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b; },
			easeOutCirc: function (x, t, b, c, d) { return c * Math.sqrt(1 - (t=t/d-1)*t) + b; },
			easeInOutCirc: function (x, t, b, c, d) { if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b; return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b; },
			easeInElastic: function (x, t, b, c, d) { var s=1.70158;var p=0;var a=c; if (t==0) return b; if ((t/=d)==1) return b+c; if (!p) p=d*.3; if (a < Math.abs(c)) { a=c; var s=p/4; } else var s = p/(2*Math.PI) * Math.asin (c/a);return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;},
			easeOutElastic: function (x, t, b, c, d) { var s=1.70158;var p=0;var a=c; if (t==0) return b; if ((t/=d)==1) return b+c; if (!p) p=d*.3; if (a < Math.abs(c)) { a=c; var s=p/4; } else var s = p/(2*Math.PI) * Math.asin (c/a); return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b; },
			easeInOutElastic: function (x, t, b, c, d) { var s=1.70158;var p=0;var a=c; if (t==0) return b; if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5); if (a < Math.abs(c)) { a=c; var s=p/4; } else var s = p/(2*Math.PI) * Math.asin (c/a); if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;	return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b; },
			easeInBack: function (x, t, b, c, d, s) { if (s == undefined) s = 1.70158; return c*(t/=d)*t*((s+1)*t - s) + b; },
			easeOutBack: function (x, t, b, c, d, s) { if (s == undefined) s = 1.70158;	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b; },
			easeInOutBack: function (x, t, b, c, d, s) { if (s == undefined) s = 1.70158; if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b; return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;},
			easeInBounce: function (x, t, b, c, d) { return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b; },
			easeOutBounce: function (x, t, b, c, d) { if ((t/=d) < (1/2.75)) { return c*(7.5625*t*t) + b; } else if (t < (2/2.75)) { return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;} else if (t < (2.5/2.75)) { return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;} else { return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;}},
			easeInOutBounce: function (x, t, b, c, d) { if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b; return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;}
		});
	}

}(jQuery));