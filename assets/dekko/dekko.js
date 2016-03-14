/**
 *
 * Version: 0.1.2 beta
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

		// localStorage.clear();

		var 
		
		options = {
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
			
			// verbose options
			console: {
				timeModule: 'Module load time ',
				totalTime: 'Total time load '
			},
			
			// static prefix points
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
			
			// callback final
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
			
			// check options and switch request to render
			route: function(o) {
				var self = this, ajax;
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

				
				if (o.verbose)
					self.time(null, o.spm);

				obj.forEach(function(e, i) {
					keyName = Object.keys(e)[0],
					object = e[keyName];

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
						spm			: o.spm,
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
			getModules: function(o) {
				var	self = this, ajax;
				/*stored = (o.cache) ? self.getStore(o.spm) : false;

				if (o.cache && stored) {
					o.modules = stored;
					return self.constructParams(o);
				}*/

				// get modules callback function
				ajax = o.modules.match(/^(https?|\/\/)/)
				? {
					data : {
						domain: window.location.hostname
						|| window.location.host
					},
					crossDomain 	: true,
				}
				: {},

				ajax.url 			= o.modules,
				ajax.cache 			= o.cache,
				ajax.context 		= self,
				ajax.dataType 		= 'json',
				ajax.contentType 	= "application/json",

				ajax.error = function(a,b,c) {
					self.ajaxErrors(o.modules + ' ' + a.status + ' ' + a.statusText);
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
			init: function (e,o) {
				var self = this, c, point, storedModules,
				rev = (typeof o.revision == 'number')
				? o.revision
				: 0;
				
				o.element = e,
				
				point = (typeof o.modules == 'object')
				? e.selector.replace(/(\.|\-)/gi, '')
				: o.modules.replace(/(^(https?)|(\/|\.|\:))/gi, ''),
				
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
				

				// self.time(o.spm);
				
				return $.when(c).done(function() {
					// self.timeEnd(o.spm);
					self.timeEnd(null, o.spm);
					// console.log(o.spm);
				}).fail(function() {
					console.error('when return error');
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

		} catch (e) {
			return console.error(e);
		}
	};
}(jQuery));

// other plugins

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