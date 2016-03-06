
/**
 *
 * Version: 0.0.8 beta
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
 
(function ($, window) {
	$.fn.extend({
		dekko: function (opts) {
			var $thisApp, objDate,
			globThis = $(this),
			defaults = {
				cache: true,
				scriptName: 'default.js',
				modules: [],
				rotate: false,
				path: '/media/popup',
				cookie: true
			},
			options = $.extend(defaults, opts);

			window.dekko = {
				setCookie: function(key, value, expire) {
					var d = new Date();
					d.setTime(d.getTime() + (expire*24*60*60*1000));
					var expires = "expires=" + d.toGMTString();
					return document.cookie = key+"="+value+"; "+expires;
				},
				getCookie: function(key) {
					var start = document.cookie.indexOf(key + "=");
					var len = start + key.length + 1;

					if ((!start) && (key != document.cookie.substring(0, key.length))) {
						return null;
					}
					
					if (start == -1) return null;
					var end = document.cookie.indexOf(';', len);
					if (end == -1) end = document.cookie.length;
					return unescape(document.cookie.substring(len, end));
				},
				console: function(type, message) {
					
					if (!options.console)
						return false;
					
					
					switch(type) {
						case 'error':
							// console.error('Exception: ' + message.name + '\nException message: ' + message.message + '\nException stack: ' + message.stack);
							console.error(message);
							break;
						case 'info':
							console.info(message);
							break;
						default:
							console.log(message);
					}
				},
				errorException: function(e) {
					return this.console('error', e);
				},
				loader: function(object) {},
				checkBrowser: function() {
					var isMobile = false;
					
					if (typeof window.orientation == 'undefined')
						return isMobile;

					if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
					
					return isMobile;
				},
				getLSObject: function(key) {
					return JSON.parse(localStorage.getItem(key));
				},
				removeLSDecrementObject: function(object) {
					var storeVersionNumber = parseInt(object.storeName.replace(/^(.*)-([0-9]+)$/gi, '$2'), 10);
					if ((typeof storeVersionNumber === 'number') && (storeVersionNumber % 1 === 0)) {
						var storePreviousVersionNumber = object.name + '-' + (storeVersionNumber - 1);
						if (this.getLSObject(storePreviousVersionNumber)) {
							if (options.console)
								console.info('Element: ' + storePreviousVersionNumber + ' removed in localStorage');

							return localStorage.removeItem(storePreviousVersionNumber);
						}
						
					} else {
						throw new Error('storeVersion required incremental number');
					}
				},
				setLSObject: function(object, xhr) {

					if (options.console)
						console.info('Element: ' + object.name + ' cached');

					return localStorage.setItem(object.storeName, JSON.stringify(xhr));
				},
				dateToUnixTimeStamp: function(date) {
					objDate = new Date(date.split(' ').join('T'));
					return objDate.getTime() / 1000;
				},
				fetchModules: function (object) {
					$thisApp = this;
					
					try {
						$.ajax({
							type: 'GET',
							url: object.urlPath,
							dataType: 'script',
							cache: options.cache,
							async: true,
							success: function(xhr) {
								return (
										$thisApp.setLSObject(object, xhr)
									,	$thisApp.removeLSDecrementObject(object)
									,	$thisApp.loader(object)
								);
							},
							error: function( jqxhr, settings, exception ) {
								throw new Error('Unable to load popup element: ' + object.name + '\nException handler returned: ' + exception + '\nFile: ' + object.urlPath);
							}
						});
					} catch (e) {
						return this.errorException(e);
					}
				},
				route: function(object) {
					if (this.getCookie(object.name) === null)
						this.setCookie(object.name, true, object.item.cookieExpire);

					if (this.getCookie(object.name) == 'false')
						return false;
	
					if (object.date.now < object.date.start || object.date.now > object.date.end)
						return false;

					if (options.cache == true && this.getLSObject(object.storeName))
						return (
							$.globalEval(this.getLSObject(object.storeName)),
							this.loader(object)
						);
					
					return this.fetchModules(object);
				},
				construct: function (objects) {
					$thisApp = this;
					
					return $.each(objects, function(index, object) {
						$.map(object, function (item, name) {
							switch (item.type) {
							case 'popup':
								// route popups
								return $thisApp.route({
									name: name,
									item: item,
									globElement: globThis,
									console: options.console,
									storeName: name + '-' + item.storeVersion,
									urlPath: options.path + '/' + name + '/' + options.scriptName,
									date: {
										now: Math.round(new Date().getTime() / 1000),
										start: $thisApp.dateToUnixTimeStamp(item.date.start),
										end: $thisApp.dateToUnixTimeStamp(item.date.end)
									}
								});
							}
						});
					});
				},
				fetchModulesOptions: function(dataUrl) {
					$thisApp = this;
					try {
						$.ajax({
							type: 'GET',
							url: dataUrl,
							dataType: 'json',
							cache: options.cache,
							async: true,
							success: function(data) {
								return $thisApp.construct(data);
							},
							error: function( jqxhr, settings, exception ) {
								throw new Error('Unable to load ' + dataUrl);
							}
						});
					} catch (e) {
						return this.errorException(e);
					}
				},
				render: function() {
					try {
						if (this.checkBrowser() || options.mobile == true)
							return false;
							
						if (typeof window.localStorage == 'undefined')
							return false;
							
							// check remote elements options
						if (typeof options.modulesUrl !== 'undefined')
							return this.fetchModulesOptions(options.modulesUrl);
						
						if ((options.modules.length > 0))
							return this.construct(options.modules);
						else
							throw new Error('Dekko loaded, but modules not defined');
	
					} catch (e) {
						return this.errorException(e);
					}
				}
			};


			if (typeof $.easing.easeInQuad == 'undefined') {
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

			return window.dekko.render();

		} // dekko
	});
}(jQuery, window));