/**
 *
 * Version: 0.1.0 beta
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
			cache			: false, 				// (optional)
			console			: true, 				// (optional)
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
		dekkoConstructor = {
			storePoint: {
				closed: 'closed.',
				prev: 'rotate.',
				rev: '.r',
				slash: '/'
			},
			dateToUnixTimeStamp: function(date) {
				var objDate = new Date(date.split(' ').join('T'));
				return objDate.getTime() / 1000;
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
				xhr = (o.xhr) ? o.xhr : self.getStore(o.storeName);
				return $.globalEval(xhr), window.dekkoModule.call(self, o);
			},
			notice: function(o) {
				return console.info('Module: ' + o.name + ' loaded');
			},
			expire: function(o) {
 				var a,b;
				a = this.getStore(o.closePoint);
				if (a === false) return false;
				b = (a[0] === true) ? Math.floor((o.date.now - a[1]) / 60) : false; // minutes ago
				return (b && b > o.date.close)
					? this.delStore(o.closePoint)
					: true;
			},
			route: function(o) {
				var self = this;
				o.forEach(function(e) {
	
					// check time expire
					if (e.date.now < e.date.start || e.date.now > e.date.end)
						return false;
					
					// check closed
					if (self.expire(e) === true)
						return false;
	
					// check store and return render
					if (e.cache && self.getStore(e.storeName))
						return self.render(e);
	
					$.ajax({
						url			: e.path + self.storePoint.slash + e.file,
						dataType	: 'script',
						success		: function(xhr) {
							return e.xhr = xhr
							,	self.setStore(e.storeName, e.xhr)
							,	self.render(e);
						}
					});
				});
			},
			randModule: function(e, o) {
				var r,c,j,t = true, self = this, p;
				p = (e.context.cookie)
					? self.storePoint.prev + e.context.cookie
					: self.storePoint.prev + e.selector.replace(/ /gi, '');

				if (self.getStore(p) === false)
					self.setStore(p, -1);

				c = self.getStore(p);
				
				while (t) {
					r = parseInt(Math.floor(Math.random() * o.length), 10);
					j = self.getStore(o[r].closePoint)[0];
					t = (r !== c && !j) ? false : true;
				}
				
				self.setStore(p, r);
				return o[r];
			},
			constructParams: function(o) {
				var obj = [], modules = [], self = this, k;
				obj = (o.modules && o.modules.length > 0) ? o.modules : o;
				obj.forEach(function(e) {
					k = Object.keys(e)[0];
					modules.push({
						name		: k,
						storeName	: k + self.storePoint.rev + e[k].revision,
						path		: o.path + self.storePoint.slash + k,
						file		: o.templateName,
						delay		: e[k].delay,
						item		: e[k],
						closePoint	: self.storePoint.closed + k + self.storePoint.rev + e[k].revision,
						append		: o.element,
						date: {
							now		: Math.round(new Date().getTime() / 1000),
							end		: self.dateToUnixTimeStamp(e[k].date.end),
							start	: self.dateToUnixTimeStamp(e[k].date.start),
							close	: e[k].closeExpire,
						}
					});
				});
	
				return self.route((o.rotate)
					? [self.randModule(o.element, modules)]
					: modules);
			},
			init: function (e,o) {
				var self = this;
				o.element = e;
	
				// type to get modules
				return (
					typeof o.modules == 'string' &&
					o.modules.match(/\//gi)
				)
				? $.getJSON(o.modules, function(x) {
					o.modules = x;
					return self.constructParams(o)})
				: self.constructParams(o);
			}
		};

		try {

			$.extend(options, opts || {});
			$.ajaxSetup(ajaxOptions);

			if (typeof window.localStorage == 'undefined')
				throw new Error('Browser not support localStorage');


			// main call
			return dekkoConstructor.init(this, options);

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