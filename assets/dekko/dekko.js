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

		// localStorage.clear();

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

!function(r,n){"function"==typeof define&&define.amd?define(["jquery"],n):"object"==typeof exports?module.exports=n(require("jquery")):n(r.jQuery)}(this,function(r,n){function t(r,n,t){var e=c[n.type]||{};return null==r?t||!n.def?null:n.def:(r=e.floor?~~r:parseFloat(r),isNaN(r)?n.def:e.mod?(r+e.mod)%e.mod:0>r?0:e.max<r?e.max:r)}function e(n){var t=l(),e=t._rgba=[];return n=n.toLowerCase(),h(u,function(r,o){var a,i=o.re.exec(n),s=i&&o.parse(i),u=o.space||"rgba";return s?(a=t[u](s),t[f[u].cache]=a[f[u].cache],e=t._rgba=a._rgba,!1):void 0}),e.length?("0,0,0,0"===e.join()&&r.extend(e,a.transparent),t):a[n]}function o(r,n,t){return t=(t+1)%1,1>6*t?r+(n-r)*t*6:1>2*t?n:2>3*t?r+(n-r)*(2/3-t)*6:r}var a,i="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",s=/^([\-+])=\s*(\d+\.?\d*)/,u=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(r){return[r[1],r[2],r[3],r[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(r){return[2.55*r[1],2.55*r[2],2.55*r[3],r[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(r){return[parseInt(r[1],16),parseInt(r[2],16),parseInt(r[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(r){return[parseInt(r[1]+r[1],16),parseInt(r[2]+r[2],16),parseInt(r[3]+r[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(r){return[r[1],r[2]/100,r[3]/100,r[4]]}}],l=r.Color=function(n,t,e,o){return new r.Color.fn.parse(n,t,e,o)},f={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},c={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},p=l.support={},d=r("<p>")[0],h=r.each;d.style.cssText="background-color:rgba(1,1,1,.5)",p.rgba=d.style.backgroundColor.indexOf("rgba")>-1,h(f,function(r,n){n.cache="_"+r,n.props.alpha={idx:3,type:"percent",def:1}}),l.fn=r.extend(l.prototype,{parse:function(o,i,s,u){if(o===n)return this._rgba=[null,null,null,null],this;(o.jquery||o.nodeType)&&(o=r(o).css(i),i=n);var c=this,p=r.type(o),d=this._rgba=[];return i!==n&&(o=[o,i,s,u],p="array"),"string"===p?this.parse(e(o)||a._default):"array"===p?(h(f.rgba.props,function(r,n){d[n.idx]=t(o[n.idx],n)}),this):"object"===p?(o instanceof l?h(f,function(r,n){o[n.cache]&&(c[n.cache]=o[n.cache].slice())}):h(f,function(n,e){var a=e.cache;h(e.props,function(r,n){if(!c[a]&&e.to){if("alpha"===r||null==o[r])return;c[a]=e.to(c._rgba)}c[a][n.idx]=t(o[r],n,!0)}),c[a]&&r.inArray(null,c[a].slice(0,3))<0&&(c[a][3]=1,e.from&&(c._rgba=e.from(c[a])))}),this):void 0},is:function(r){var n=l(r),t=!0,e=this;return h(f,function(r,o){var a,i=n[o.cache];return i&&(a=e[o.cache]||o.to&&o.to(e._rgba)||[],h(o.props,function(r,n){return null!=i[n.idx]?t=i[n.idx]===a[n.idx]:void 0})),t}),t},_space:function(){var r=[],n=this;return h(f,function(t,e){n[e.cache]&&r.push(t)}),r.pop()},transition:function(r,n){var e=l(r),o=e._space(),a=f[o],i=0===this.alpha()?l("transparent"):this,s=i[a.cache]||a.to(i._rgba),u=s.slice();return e=e[a.cache],h(a.props,function(r,o){var a=o.idx,i=s[a],l=e[a],f=c[o.type]||{};null!==l&&(null===i?u[a]=l:(f.mod&&(l-i>f.mod/2?i+=f.mod:i-l>f.mod/2&&(i-=f.mod)),u[a]=t((l-i)*n+i,o)))}),this[o](u)},blend:function(n){if(1===this._rgba[3])return this;var t=this._rgba.slice(),e=t.pop(),o=l(n)._rgba;return l(r.map(t,function(r,n){return(1-e)*o[n]+e*r}))},toRgbaString:function(){var n="rgba(",t=r.map(this._rgba,function(r,n){return null==r?n>2?1:0:r});return 1===t[3]&&(t.pop(),n="rgb("),n+t.join()+")"},toHslaString:function(){var n="hsla(",t=r.map(this.hsla(),function(r,n){return null==r&&(r=n>2?1:0),n&&3>n&&(r=Math.round(100*r)+"%"),r});return 1===t[3]&&(t.pop(),n="hsl("),n+t.join()+")"},toHexString:function(n){var t=this._rgba.slice(),e=t.pop();return n&&t.push(~~(255*e)),"#"+r.map(t,function(r){return r=(r||0).toString(16),1===r.length?"0"+r:r}).join("")},toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}}),l.fn.parse.prototype=l.fn,f.hsla.to=function(r){if(null==r[0]||null==r[1]||null==r[2])return[null,null,null,r[3]];var n,t,e=r[0]/255,o=r[1]/255,a=r[2]/255,i=r[3],s=Math.max(e,o,a),u=Math.min(e,o,a),l=s-u,f=s+u,c=.5*f;return n=u===s?0:e===s?60*(o-a)/l+360:o===s?60*(a-e)/l+120:60*(e-o)/l+240,t=0===l?0:.5>=c?l/f:l/(2-f),[Math.round(n)%360,t,c,null==i?1:i]},f.hsla.from=function(r){if(null==r[0]||null==r[1]||null==r[2])return[null,null,null,r[3]];var n=r[0]/360,t=r[1],e=r[2],a=r[3],i=.5>=e?e*(1+t):e+t-e*t,s=2*e-i;return[Math.round(255*o(s,i,n+1/3)),Math.round(255*o(s,i,n)),Math.round(255*o(s,i,n-1/3)),a]},h(f,function(e,o){var a=o.props,i=o.cache,u=o.to,f=o.from;l.fn[e]=function(e){if(u&&!this[i]&&(this[i]=u(this._rgba)),e===n)return this[i].slice();var o,s=r.type(e),c="array"===s||"object"===s?e:arguments,p=this[i].slice();return h(a,function(r,n){var e=c["object"===s?r:n.idx];null==e&&(e=p[n.idx]),p[n.idx]=t(e,n)}),f?(o=l(f(p)),o[i]=p,o):l(p)},h(a,function(n,t){l.fn[n]||(l.fn[n]=function(o){var a,i=r.type(o),u="alpha"===n?this._hsla?"hsla":"rgba":e,l=this[u](),f=l[t.idx];return"undefined"===i?f:("function"===i&&(o=o.call(this,f),i=r.type(o)),null==o&&t.empty?this:("string"===i&&(a=s.exec(o),a&&(o=f+parseFloat(a[2])*("+"===a[1]?1:-1))),l[t.idx]=o,this[u](l)))})})}),l.hook=function(n){var t=n.split(" ");h(t,function(n,t){r.cssHooks[t]={set:function(n,o){var a,i,s="";if("transparent"!==o&&("string"!==r.type(o)||(a=e(o)))){if(o=l(a||o),!p.rgba&&1!==o._rgba[3]){for(i="backgroundColor"===t?n.parentNode:n;(""===s||"transparent"===s)&&i&&i.style;)try{s=r.css(i,"backgroundColor"),i=i.parentNode}catch(u){}o=o.blend(s&&"transparent"!==s?s:"_default")}o=o.toRgbaString()}try{n.style[t]=o}catch(u){}}},r.fx.step[t]=function(n){n.colorInit||(n.start=l(n.elem,t),n.end=l(n.end),n.colorInit=!0),r.cssHooks[t].set(n.elem,n.start.transition(n.end,n.pos))}})},l.hook(i),r.cssHooks.borderColor={expand:function(r){var n={};return h(["Top","Right","Bottom","Left"],function(t,e){n["border"+e+"Color"]=r}),n}},a=r.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}});