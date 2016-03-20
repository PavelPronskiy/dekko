/**
 *
 * name: Dekko
 * description: advert loader
 * Version: 0.1.4 beta
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
 
(function ($) {

	$.fn.dekko = function(options) {

		// capsule
		window.dekkoModule = function(o) { try {} catch (e) { return console.error(e) } };

		var settings = {}, constructor;

		// default settings
		settings.app = {
			revision		: 0, 					// this opt require incremental number and cache true (required if cache enabled)
			cache			: true, 				// (optional)
			verbose			: true, 				// (optional)
			templateName	: 'default.js',			// (required)
			modules			: [],					// (required if modulesUrl not defined)
			adType			: '',					// (module advert type)
			rotate			: false,				// (optional)
			path			: '/media/popup',		// (required)
		},

		// default ajax settings
		settings.ajax = {
			async: true,
			type: 'GET',
			status: {
				'404': 'Not found',
				'400': 'Incorrect attempt',
				'401': 'Internal error'
			}
		},
		settings.regex = {
			remote: /(^(https?|\/\/)|(\/|\.|\:))/gi,
			host: /^(https?|\/\/)/
		},

		// chains
		constructor = {
			
			// verbose options
			console: {
				timeModule: 'Module load time ',
				totalTime: 'Total time load '
			},
			
			// static prefix points
			storePoint: {
				closed: 'closed:',
				options: 'options:',
				module: 'module:',
				modules: 'modules:',
				prev: 'rotate:',
				rev: ':r',
				slash: '/'
			},
			advertType: [
				'banner', 'branding', 'popup', 'bar'
			],
			dateToUnixTimeStamp: function(o) {
				var d = new Date(o.split(' ').join('T'));
				d = d.getTime() / 1000;
				return (d) ? d : false;
			},
			setStore: function(n, o) {
				return localStorage.setItem(n, JSON.stringify(o));
			},
			delStore: function(o, p) {
				if (p && localStorage.length > 0) {
					for (var l in localStorage) {
						var regex = new RegExp('^' + p);
						if (l.match(regex))
							this.delStore(l);
					}
					
				} else
					return localStorage.removeItem(o);
			},
			getStore: function(o) {
				var x = localStorage.getItem(o);
				return (x !== null && typeof x !== 'undefined') ? JSON.parse(x) : false;
			},

			// callback final
			render: function(o) {
				
				var stored = this.getStore(o.storeName),
					xhr = (o.xhr) ? o.xhr : stored;
					
				$.globalEval(xhr);
				return window.dekkoModule.call(this, o);
			},
			
			// request module callback
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
			
			// check options and switch request to render
			route: function(o) {
				var self = this, ajax = {};
				o.forEach(function(e) {

					if (e === false)
						return false;

					// check time expire
					if (e.date.now() < e.date.start && e.date.now() > e.date.end)
						return false;

					// check closed
					if (self.expire(e) === true)
						return false;
					
					// check store and return render
					if (e.cache && self.getStore(e.storeName))
						return self.render(e);
	
					ajax.url				= e.path + self.storePoint.slash + e.file,
					ajax.crossDomain 		= false, // needed to jquery ajax crossDomain absolute path
					ajax.cache				= e.cache,
					ajax.dataType			= 'script',

					ajax.error = function(a) {
						return self.ajaxErrors(ajax.url + ' ' + a.status + ' ' + a.statusText);
					},
					ajax.success = function(xhr, status, c) {
						// check data consistent
						if (self.serverExceptions(e.verbose, xhr, ajax))
							return false;
						
						e.xhr = xhr;
						self.delStore(null, self.storePoint.module + e.name);
						self.setStore(e.storeName, e.xhr);
						return self.render(e);
					};

					return self.ajax(ajax);
				});
			},
			
			// get random object
			randModule: function(o, m) {
				var r,c,j,i = 0,t = true, self = this;

				if (self.getStore(o.ppm) === false)
					self.setStore(o.ppm, -1);

				c = self.getStore(o.ppm);
				
				while (t) {
					r = parseInt(Math.floor(Math.random() * m.length), 10);
					j = self.getStore(m[r].closePoint)[0];
					t = (r !== c && !j) ? false : true;

					// exit loop without object 
					if (i++ > m.length)
						return false;
					
				}
				
				self.setStore(o.ppm, r);
				return m[r];
			},
			
			// objects params build
			constructParams: function(o) {
				var obj = [], modules = [], self = this, keyName, object;
				
				obj = (o.modules && o.modules.length > 0)
					? o.modules
					: false;

				if (obj === false)
					return false;

				(o.verbose) && self.time(null, o.spm);

				obj.forEach(function(e, i) {
					keyName = Object.keys(e)[0],
					object = e[keyName],
					modules.push({
						name		: keyName,
						storeName	: self.storePoint.module + keyName + self.storePoint.rev + o.revision + self.storePoint.rev + object.revision,
						path		: o.path + self.storePoint.slash + keyName,
						file		: o.templateName,
						delay		: object.delay,
						item		: object,
						cache		: o.cache,
						verbose		: o.verbose,
						timePoint	: self.console.timeModule + keyName,
						closePoint	: self.storePoint.closed + keyName + self.storePoint.rev + o.revision + self.storePoint.rev + object.revision,
						append		: o.element,
						spm			: o.spm,
						ajaxUrl		: o.ajaxUrl,
						type		: o.type,
						date: {
							now		: function() { return Math.round(new Date().getTime() / 1000) },
							end		: self.dateToUnixTimeStamp(object.date.end),
							start	: self.dateToUnixTimeStamp(object.date.start),
							close	: object.closeExpire,
						}
					});

					if (o.verbose)
						self.time(modules[i].timePoint);
						
				});
	
				return self.route((o.rotate)
					? [self.randModule(o, modules)]
					: modules);
			},
			
			// fetch modules array
			getModules: function(o) {
				var	self = this, ajax = {};

				if (o.modules === '')
					return false;
				
				ajax.url 				= o.modules,
				ajax.cache 				= o.cache,
				ajax.context 			= self,
				ajax.dataType 			= 'json',
				ajax.contentType 		= "application/json",
				ajax.data 				= {},
				ajax.data.domain 		= window.location.hostname || window.location.host,
				ajax.data.type 			= o.type,
				ajax.crossDomain 		= ajax.url.match(settings.regex.host) ? true : false,

				ajax.error = function(a,b,c) {
					return console.warn(ajax.url + ' ' + a.status + ' ' + a.statusText);
				},
				ajax.success = function(data) {

					if (self.serverExceptions(o.verbose, data, ajax))
						return false;
					
					o.modules = data;
					o.ajaxUrl = ajax.url;
					if (self.getStore(o.spm) === false) {
						self.delStore(null, self.storePoint.modules);
						self.setStore(o.spm, data);
					}
					
					self.constructParams(o);
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
					(v) && console.warn(a);
					this.timeEnd(null, a.url);
					return true;
				}
				
				if (typeof o == 'undefined') {
					this.time(null, a.url);
					console.error('Module cannot load: ' + a.url + ' incorrect results');
					(v) && console.warn(a);
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
				return (g)
					? console.group(g)
					: console.time(o);
			},
			timeEnd: function(o, g) {
				return (g)
					? console.groupEnd(g)
					: console.timeEnd(o);
			},
			
			// fetch remote options (bad idea)
			getOptions: function(e) {
				var	self = this, ajax = {}, rev, u,
				storedOptionsPointer, storedOptions,
				url = options.match(settings.regex.host) ? options : false;

				if (url === false) return false;

				ajax.url 			= url,
				ajax.cache 			= settings.app.cache,
				ajax.context 		= self,
				ajax.dataType 		= 'json',
				ajax.contentType 	= "application/json",
				ajax.crossDomain 	= url.match(settings.regex.host) ? true : false,
				ajax.data			= {},
				ajax.data.domain	= window.location.hostname || window.location.host,
				
				
				u = url.replace(settings.regex.remote, ''),

				rev = JSON.parse(u.replace(/^.*\?r=([0-9]+)$/g, '$1')),
				rev = (rev) ? rev : 0,
				storedOptionsPointer = self.storePoint.options + u.replace(/\?.*/g, '') + self.storePoint.rev + rev,
				storedOptions = self.getStore(storedOptionsPointer),
				
				ajax.error = function(a,b,c) {
					return self.ajaxErrors(url + ' ' + a.status + ' ' + a.statusText);
				},
				ajax.success = function(d) {
					d.revision = rev;
					self.delStore(null, self.storePoint.options);
					self.setStore(storedOptionsPointer, d);
					return self.modulesConstructor(e, d);
				};

				return (storedOptions.cache)
					? self.modulesConstructor(e, storedOptions)
					: this.ajax(ajax);
			},
			
			// pre-construct options (once)
			modulesConstructor: function (e, opts) {
				var self = this, c, point,
					storedModules, rev, o = {};

				if (Object.keys(opts).length === 0)
					return false;

				o = $.extend(settings.app, opts),
				rev = (typeof o.revision == 'number')
				? o.revision
				: 0;
				
				o.element = e,
				
				point = (typeof o.modules == 'object')
				? e.selector.replace(/(\.|\-)/gi, '')
				: o.modules.replace(settings.regex.remote, ''),
				
				o.spm = self.storePoint.modules + point + self.storePoint.rev + rev,
				o.ppm = self.storePoint.prev + point + self.storePoint.rev + rev,

				storedModules = (o.cache)
					? self.getStore(o.spm)
					: false,
					
				o.modules = (storedModules !== false)
					? storedModules
					: o.modules;

				if (storedModules !== false)
					c = self.constructParams(o);
				else
					c = (typeof o.modules == 'string')
					? self.getModules(o)
					: self.constructParams(o);

				return $.when(c).done(function() {
						self.timeEnd(null, o.spm);
					}
				);
			},
			// for module clients click
			clickAdvert: function(o) {
				var	self = this, ajax = {}, url;

				ajax.url 				= o.ajaxUrl,
				ajax.cache 				= true,
				ajax.context 			= self,
				ajax.dataType 			= 'json',
				ajax.contentType 		= "application/json",
				ajax.data 				= {},
				ajax.data.domain 		= window.location.hostname || window.location.host,
				ajax.data.type 			= o.type,
				ajax.data.click			= this.fingerprint(),
				ajax.data.module		= o.name,
				ajax.crossDomain 		= false,

				ajax.error = function(a,b,c) {
					console.log(b);
					return self.serverExceptions(o.verbose, a.responseText, ajax);
					// return console.warn(ajax.url + ' ' + a.status + ' ' + a.statusText);
				},
				ajax.success = function(data) {

					if (self.serverExceptions(o.verbose, data, ajax))
						return false;
					
				};
				
				
				// return console.log();
				return this.ajax(ajax);
			},
			fingerprint: function() {
				return $.md5([
					navigator.userAgent,
					[ screen.height, screen.width, screen.colorDepth ].join("x"),
					( new Date() ).getTimezoneOffset(),
					!!window.sessionStorage,
					!!window.localStorage,
					$.map( navigator.plugins, function(p) {
						return [
							p.name,
							p.description,
							$.map( p, function(mt) {
								return [ mt.type, mt.suffixes ].join("~");
							}).join(",")
						].join("::");
					}).join(";")
					].join("###"));
			},
		};

		try {

			$.ajaxSetup(settings.ajax);
			
			if (typeof window.localStorage == 'undefined')
				throw new Error('Browser not support localStorage');

			if (typeof options !== 'object' && typeof options !== 'string')
				return false;

			// $.dekko({ options, modules: []})
			if (typeof options == 'object')
				return constructor.modulesConstructor(this, options);

			// $.dekko('//url/path/to/options.json')
			if (typeof options == 'string' && typeof options.match(settings.regex.remote))
				return constructor.getOptions(this);


		} catch (e) {
			return console.error(e);
		}
	};
}(jQuery));

// addition plugins

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/
!function(n){"undefined"==typeof n.easing.easeInQuad&&n.extend(n.easing,{easeInQuad:function(n,t,e,u,a){return u*(t/=a)*t+e},easeOutQuad:function(n,t,e,u,a){return-u*(t/=a)*(t-2)+e},easeInOutQuad:function(n,t,e,u,a){return(t/=a/2)<1?u/2*t*t+e:-u/2*(--t*(t-2)-1)+e},easeInCubic:function(n,t,e,u,a){return u*(t/=a)*t*t+e},easeOutCubic:function(n,t,e,u,a){return u*((t=t/a-1)*t*t+1)+e},easeInOutCubic:function(n,t,e,u,a){return(t/=a/2)<1?u/2*t*t*t+e:u/2*((t-=2)*t*t+2)+e},easeInQuart:function(n,t,e,u,a){return u*(t/=a)*t*t*t+e},easeOutQuart:function(n,t,e,u,a){return-u*((t=t/a-1)*t*t*t-1)+e},easeInOutQuart:function(n,t,e,u,a){return(t/=a/2)<1?u/2*t*t*t*t+e:-u/2*((t-=2)*t*t*t-2)+e},easeInQuint:function(n,t,e,u,a){return u*(t/=a)*t*t*t*t+e},easeOutQuint:function(n,t,e,u,a){return u*((t=t/a-1)*t*t*t*t+1)+e},easeInOutQuint:function(n,t,e,u,a){return(t/=a/2)<1?u/2*t*t*t*t*t+e:u/2*((t-=2)*t*t*t*t+2)+e},easeInSine:function(n,t,e,u,a){return-u*Math.cos(t/a*(Math.PI/2))+u+e},easeOutSine:function(n,t,e,u,a){return u*Math.sin(t/a*(Math.PI/2))+e},easeInOutSine:function(n,t,e,u,a){return-u/2*(Math.cos(Math.PI*t/a)-1)+e},easeInExpo:function(n,t,e,u,a){return 0==t?e:u*Math.pow(2,10*(t/a-1))+e},easeOutExpo:function(n,t,e,u,a){return t==a?e+u:u*(-Math.pow(2,-10*t/a)+1)+e},easeInOutExpo:function(n,t,e,u,a){return 0==t?e:t==a?e+u:(t/=a/2)<1?u/2*Math.pow(2,10*(t-1))+e:u/2*(-Math.pow(2,-10*--t)+2)+e},easeInCirc:function(n,t,e,u,a){return-u*(Math.sqrt(1-(t/=a)*t)-1)+e},easeOutCirc:function(n,t,e,u,a){return u*Math.sqrt(1-(t=t/a-1)*t)+e},easeInOutCirc:function(n,t,e,u,a){return(t/=a/2)<1?-u/2*(Math.sqrt(1-t*t)-1)+e:u/2*(Math.sqrt(1-(t-=2)*t)+1)+e},easeInElastic:function(n,t,e,u,a){var r=1.70158,i=0,s=u;if(0==t)return e;if(1==(t/=a))return e+u;if(i||(i=.3*a),s<Math.abs(u)){s=u;var r=i/4}else var r=i/(2*Math.PI)*Math.asin(u/s);return-(s*Math.pow(2,10*(t-=1))*Math.sin((t*a-r)*(2*Math.PI)/i))+e},easeOutElastic:function(n,t,e,u,a){var r=1.70158,i=0,s=u;if(0==t)return e;if(1==(t/=a))return e+u;if(i||(i=.3*a),s<Math.abs(u)){s=u;var r=i/4}else var r=i/(2*Math.PI)*Math.asin(u/s);return s*Math.pow(2,-10*t)*Math.sin((t*a-r)*(2*Math.PI)/i)+u+e},easeInOutElastic:function(n,t,e,u,a){var r=1.70158,i=0,s=u;if(0==t)return e;if(2==(t/=a/2))return e+u;if(i||(i=a*(.3*1.5)),s<Math.abs(u)){s=u;var r=i/4}else var r=i/(2*Math.PI)*Math.asin(u/s);return 1>t?-.5*(s*Math.pow(2,10*(t-=1))*Math.sin((t*a-r)*(2*Math.PI)/i))+e:s*Math.pow(2,-10*(t-=1))*Math.sin((t*a-r)*(2*Math.PI)/i)*.5+u+e},easeInBack:function(n,t,e,u,a,r){return void 0==r&&(r=1.70158),u*(t/=a)*t*((r+1)*t-r)+e},easeOutBack:function(n,t,e,u,a,r){return void 0==r&&(r=1.70158),u*((t=t/a-1)*t*((r+1)*t+r)+1)+e},easeInOutBack:function(n,t,e,u,a,r){return void 0==r&&(r=1.70158),(t/=a/2)<1?u/2*(t*t*(((r*=1.525)+1)*t-r))+e:u/2*((t-=2)*t*(((r*=1.525)+1)*t+r)+2)+e},easeInBounce:function(n,t,e,u,a){return u-jQuery.easing.easeOutBounce(n,a-t,0,u,a)+e},easeOutBounce:function(n,t,e,u,a){return(t/=a)<1/2.75?u*(7.5625*t*t)+e:2/2.75>t?u*(7.5625*(t-=1.5/2.75)*t+.75)+e:2.5/2.75>t?u*(7.5625*(t-=2.25/2.75)*t+.9375)+e:u*(7.5625*(t-=2.625/2.75)*t+.984375)+e},easeInOutBounce:function(n,t,e,u,a){return a/2>t?.5*jQuery.easing.easeInBounce(n,2*t,0,u,a)+e:.5*jQuery.easing.easeOutBounce(n,2*t-a,0,u,a)+.5*u+e}})}(jQuery);



/*!
 * jQuery Color Animations v@VERSION
 * https://github.com/jquery/jquery-color
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Date: @DATE
 */
!function(r,n){"function"==typeof define&&define.amd?define(["jquery"],n):"object"==typeof exports?module.exports=n(require("jquery")):n(r.jQuery)}(this,function(r,n){function t(r,n,t){var e=c[n.type]||{};return null==r?t||!n.def?null:n.def:(r=e.floor?~~r:parseFloat(r),isNaN(r)?n.def:e.mod?(r+e.mod)%e.mod:0>r?0:e.max<r?e.max:r)}function e(n){var t=l(),e=t._rgba=[];return n=n.toLowerCase(),h(u,function(r,o){var a,i=o.re.exec(n),s=i&&o.parse(i),u=o.space||"rgba";return s?(a=t[u](s),t[f[u].cache]=a[f[u].cache],e=t._rgba=a._rgba,!1):void 0}),e.length?("0,0,0,0"===e.join()&&r.extend(e,a.transparent),t):a[n]}function o(r,n,t){return t=(t+1)%1,1>6*t?r+(n-r)*t*6:1>2*t?n:2>3*t?r+(n-r)*(2/3-t)*6:r}var a,i="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",s=/^([\-+])=\s*(\d+\.?\d*)/,u=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(r){return[r[1],r[2],r[3],r[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(r){return[2.55*r[1],2.55*r[2],2.55*r[3],r[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(r){return[parseInt(r[1],16),parseInt(r[2],16),parseInt(r[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(r){return[parseInt(r[1]+r[1],16),parseInt(r[2]+r[2],16),parseInt(r[3]+r[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(r){return[r[1],r[2]/100,r[3]/100,r[4]]}}],l=r.Color=function(n,t,e,o){return new r.Color.fn.parse(n,t,e,o)},f={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},c={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},p=l.support={},d=r("<p>")[0],h=r.each;d.style.cssText="background-color:rgba(1,1,1,.5)",p.rgba=d.style.backgroundColor.indexOf("rgba")>-1,h(f,function(r,n){n.cache="_"+r,n.props.alpha={idx:3,type:"percent",def:1}}),l.fn=r.extend(l.prototype,{parse:function(o,i,s,u){if(o===n)return this._rgba=[null,null,null,null],this;(o.jquery||o.nodeType)&&(o=r(o).css(i),i=n);var c=this,p=r.type(o),d=this._rgba=[];return i!==n&&(o=[o,i,s,u],p="array"),"string"===p?this.parse(e(o)||a._default):"array"===p?(h(f.rgba.props,function(r,n){d[n.idx]=t(o[n.idx],n)}),this):"object"===p?(o instanceof l?h(f,function(r,n){o[n.cache]&&(c[n.cache]=o[n.cache].slice())}):h(f,function(n,e){var a=e.cache;h(e.props,function(r,n){if(!c[a]&&e.to){if("alpha"===r||null==o[r])return;c[a]=e.to(c._rgba)}c[a][n.idx]=t(o[r],n,!0)}),c[a]&&r.inArray(null,c[a].slice(0,3))<0&&(c[a][3]=1,e.from&&(c._rgba=e.from(c[a])))}),this):void 0},is:function(r){var n=l(r),t=!0,e=this;return h(f,function(r,o){var a,i=n[o.cache];return i&&(a=e[o.cache]||o.to&&o.to(e._rgba)||[],h(o.props,function(r,n){return null!=i[n.idx]?t=i[n.idx]===a[n.idx]:void 0})),t}),t},_space:function(){var r=[],n=this;return h(f,function(t,e){n[e.cache]&&r.push(t)}),r.pop()},transition:function(r,n){var e=l(r),o=e._space(),a=f[o],i=0===this.alpha()?l("transparent"):this,s=i[a.cache]||a.to(i._rgba),u=s.slice();return e=e[a.cache],h(a.props,function(r,o){var a=o.idx,i=s[a],l=e[a],f=c[o.type]||{};null!==l&&(null===i?u[a]=l:(f.mod&&(l-i>f.mod/2?i+=f.mod:i-l>f.mod/2&&(i-=f.mod)),u[a]=t((l-i)*n+i,o)))}),this[o](u)},blend:function(n){if(1===this._rgba[3])return this;var t=this._rgba.slice(),e=t.pop(),o=l(n)._rgba;return l(r.map(t,function(r,n){return(1-e)*o[n]+e*r}))},toRgbaString:function(){var n="rgba(",t=r.map(this._rgba,function(r,n){return null==r?n>2?1:0:r});return 1===t[3]&&(t.pop(),n="rgb("),n+t.join()+")"},toHslaString:function(){var n="hsla(",t=r.map(this.hsla(),function(r,n){return null==r&&(r=n>2?1:0),n&&3>n&&(r=Math.round(100*r)+"%"),r});return 1===t[3]&&(t.pop(),n="hsl("),n+t.join()+")"},toHexString:function(n){var t=this._rgba.slice(),e=t.pop();return n&&t.push(~~(255*e)),"#"+r.map(t,function(r){return r=(r||0).toString(16),1===r.length?"0"+r:r}).join("")},toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}}),l.fn.parse.prototype=l.fn,f.hsla.to=function(r){if(null==r[0]||null==r[1]||null==r[2])return[null,null,null,r[3]];var n,t,e=r[0]/255,o=r[1]/255,a=r[2]/255,i=r[3],s=Math.max(e,o,a),u=Math.min(e,o,a),l=s-u,f=s+u,c=.5*f;return n=u===s?0:e===s?60*(o-a)/l+360:o===s?60*(a-e)/l+120:60*(e-o)/l+240,t=0===l?0:.5>=c?l/f:l/(2-f),[Math.round(n)%360,t,c,null==i?1:i]},f.hsla.from=function(r){if(null==r[0]||null==r[1]||null==r[2])return[null,null,null,r[3]];var n=r[0]/360,t=r[1],e=r[2],a=r[3],i=.5>=e?e*(1+t):e+t-e*t,s=2*e-i;return[Math.round(255*o(s,i,n+1/3)),Math.round(255*o(s,i,n)),Math.round(255*o(s,i,n-1/3)),a]},h(f,function(e,o){var a=o.props,i=o.cache,u=o.to,f=o.from;l.fn[e]=function(e){if(u&&!this[i]&&(this[i]=u(this._rgba)),e===n)return this[i].slice();var o,s=r.type(e),c="array"===s||"object"===s?e:arguments,p=this[i].slice();return h(a,function(r,n){var e=c["object"===s?r:n.idx];null==e&&(e=p[n.idx]),p[n.idx]=t(e,n)}),f?(o=l(f(p)),o[i]=p,o):l(p)},h(a,function(n,t){l.fn[n]||(l.fn[n]=function(o){var a,i=r.type(o),u="alpha"===n?this._hsla?"hsla":"rgba":e,l=this[u](),f=l[t.idx];return"undefined"===i?f:("function"===i&&(o=o.call(this,f),i=r.type(o)),null==o&&t.empty?this:("string"===i&&(a=s.exec(o),a&&(o=f+parseFloat(a[2])*("+"===a[1]?1:-1))),l[t.idx]=o,this[u](l)))})})}),l.hook=function(n){var t=n.split(" ");h(t,function(n,t){r.cssHooks[t]={set:function(n,o){var a,i,s="";if("transparent"!==o&&("string"!==r.type(o)||(a=e(o)))){if(o=l(a||o),!p.rgba&&1!==o._rgba[3]){for(i="backgroundColor"===t?n.parentNode:n;(""===s||"transparent"===s)&&i&&i.style;)try{s=r.css(i,"backgroundColor"),i=i.parentNode}catch(u){}o=o.blend(s&&"transparent"!==s?s:"_default")}o=o.toRgbaString()}try{n.style[t]=o}catch(u){}}},r.fx.step[t]=function(n){n.colorInit||(n.start=l(n.elem,t),n.end=l(n.end),n.colorInit=!0),r.cssHooks[t].set(n.elem,n.start.transition(n.end,n.pos))}})},l.hook(i),r.cssHooks.borderColor={expand:function(r){var n={};return h(["Top","Right","Bottom","Left"],function(t,e){n["border"+e+"Color"]=r}),n}},a=r.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}});



/*
 * jQuery MD5 Plugin 1.2.1
 * https://github.com/blueimp/jQuery-MD5
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://creativecommons.org/licenses/MIT/
 * 
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
!function(n){"use strict";function t(n,t){var r=(65535&n)+(65535&t),u=(n>>16)+(t>>16)+(r>>16);return u<<16|65535&r}function r(n,t){return n<<t|n>>>32-t}function u(n,u,e,o,c,f){return t(r(t(t(u,n),t(o,f)),c),e)}function e(n,t,r,e,o,c,f){return u(t&r|~t&e,n,t,o,c,f)}function o(n,t,r,e,o,c,f){return u(t&e|r&~e,n,t,o,c,f)}function c(n,t,r,e,o,c,f){return u(t^r^e,n,t,o,c,f)}function f(n,t,r,e,o,c,f){return u(r^(t|~e),n,t,o,c,f)}function i(n,r){n[r>>5]|=128<<r%32,n[(r+64>>>9<<4)+14]=r;var u,i,h,a,g,l=1732584193,d=-271733879,v=-1732584194,C=271733878;for(u=0;u<n.length;u+=16)i=l,h=d,a=v,g=C,l=e(l,d,v,C,n[u],7,-680876936),C=e(C,l,d,v,n[u+1],12,-389564586),v=e(v,C,l,d,n[u+2],17,606105819),d=e(d,v,C,l,n[u+3],22,-1044525330),l=e(l,d,v,C,n[u+4],7,-176418897),C=e(C,l,d,v,n[u+5],12,1200080426),v=e(v,C,l,d,n[u+6],17,-1473231341),d=e(d,v,C,l,n[u+7],22,-45705983),l=e(l,d,v,C,n[u+8],7,1770035416),C=e(C,l,d,v,n[u+9],12,-1958414417),v=e(v,C,l,d,n[u+10],17,-42063),d=e(d,v,C,l,n[u+11],22,-1990404162),l=e(l,d,v,C,n[u+12],7,1804603682),C=e(C,l,d,v,n[u+13],12,-40341101),v=e(v,C,l,d,n[u+14],17,-1502002290),d=e(d,v,C,l,n[u+15],22,1236535329),l=o(l,d,v,C,n[u+1],5,-165796510),C=o(C,l,d,v,n[u+6],9,-1069501632),v=o(v,C,l,d,n[u+11],14,643717713),d=o(d,v,C,l,n[u],20,-373897302),l=o(l,d,v,C,n[u+5],5,-701558691),C=o(C,l,d,v,n[u+10],9,38016083),v=o(v,C,l,d,n[u+15],14,-660478335),d=o(d,v,C,l,n[u+4],20,-405537848),l=o(l,d,v,C,n[u+9],5,568446438),C=o(C,l,d,v,n[u+14],9,-1019803690),v=o(v,C,l,d,n[u+3],14,-187363961),d=o(d,v,C,l,n[u+8],20,1163531501),l=o(l,d,v,C,n[u+13],5,-1444681467),C=o(C,l,d,v,n[u+2],9,-51403784),v=o(v,C,l,d,n[u+7],14,1735328473),d=o(d,v,C,l,n[u+12],20,-1926607734),l=c(l,d,v,C,n[u+5],4,-378558),C=c(C,l,d,v,n[u+8],11,-2022574463),v=c(v,C,l,d,n[u+11],16,1839030562),d=c(d,v,C,l,n[u+14],23,-35309556),l=c(l,d,v,C,n[u+1],4,-1530992060),C=c(C,l,d,v,n[u+4],11,1272893353),v=c(v,C,l,d,n[u+7],16,-155497632),d=c(d,v,C,l,n[u+10],23,-1094730640),l=c(l,d,v,C,n[u+13],4,681279174),C=c(C,l,d,v,n[u],11,-358537222),v=c(v,C,l,d,n[u+3],16,-722521979),d=c(d,v,C,l,n[u+6],23,76029189),l=c(l,d,v,C,n[u+9],4,-640364487),C=c(C,l,d,v,n[u+12],11,-421815835),v=c(v,C,l,d,n[u+15],16,530742520),d=c(d,v,C,l,n[u+2],23,-995338651),l=f(l,d,v,C,n[u],6,-198630844),C=f(C,l,d,v,n[u+7],10,1126891415),v=f(v,C,l,d,n[u+14],15,-1416354905),d=f(d,v,C,l,n[u+5],21,-57434055),l=f(l,d,v,C,n[u+12],6,1700485571),C=f(C,l,d,v,n[u+3],10,-1894986606),v=f(v,C,l,d,n[u+10],15,-1051523),d=f(d,v,C,l,n[u+1],21,-2054922799),l=f(l,d,v,C,n[u+8],6,1873313359),C=f(C,l,d,v,n[u+15],10,-30611744),v=f(v,C,l,d,n[u+6],15,-1560198380),d=f(d,v,C,l,n[u+13],21,1309151649),l=f(l,d,v,C,n[u+4],6,-145523070),C=f(C,l,d,v,n[u+11],10,-1120210379),v=f(v,C,l,d,n[u+2],15,718787259),d=f(d,v,C,l,n[u+9],21,-343485551),l=t(l,i),d=t(d,h),v=t(v,a),C=t(C,g);return[l,d,v,C]}function h(n){var t,r="";for(t=0;t<32*n.length;t+=8)r+=String.fromCharCode(n[t>>5]>>>t%32&255);return r}function a(n){var t,r=[];for(r[(n.length>>2)-1]=void 0,t=0;t<r.length;t+=1)r[t]=0;for(t=0;t<8*n.length;t+=8)r[t>>5]|=(255&n.charCodeAt(t/8))<<t%32;return r}function g(n){return h(i(a(n),8*n.length))}function l(n,t){var r,u,e=a(n),o=[],c=[];for(o[15]=c[15]=void 0,e.length>16&&(e=i(e,8*n.length)),r=0;16>r;r+=1)o[r]=909522486^e[r],c[r]=1549556828^e[r];return u=i(o.concat(a(t)),512+8*t.length),h(i(c.concat(u),640))}function d(n){var t,r,u="0123456789abcdef",e="";for(r=0;r<n.length;r+=1)t=n.charCodeAt(r),e+=u.charAt(t>>>4&15)+u.charAt(15&t);return e}function v(n){return unescape(encodeURIComponent(n))}function C(n){return g(v(n))}function s(n){return d(C(n))}function A(n,t){return l(v(n),v(t))}function m(n,t){return d(A(n,t))}n.md5=function(n,t,r){return t?r?A(t,n):m(t,n):r?C(n):s(n)}}("function"==typeof jQuery?jQuery:this);