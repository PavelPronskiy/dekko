
/**
 *
 * Version: 0.0.6 beta
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
	$.fn.extend({
		dekko: function (opts) {
			var urlPath, $thisApp, objDate,
			startDate, endDate, current = 0,
			nowDate, cookieExpire,	eachRow = {},
			globThis = $(this);
			
			var defaults = {
				cache: true,
				scriptName: 'default.js',
				elements: [],
				rotate: false,
				path: '/media/popup',
				cookie: true
			};

			var options = $.extend(defaults, opts);
			
			window.dekko = {
				successInfo: function(objectName) {
					if (options.console)
						return console.info('Element: ' + objectName + ' loaded');
				},
				loader: function(object) {},
				checkCompability: function() {
					try {
						if ($.fn.jquery < '1.0')
							throw new Error('jQuery Version outdate ' + $.fn.jquery);

						if (!$.cookie)
							throw new Error('jQuery cookie plugin required');

						if (!$.easing)
							throw new Error('jQuery easing plugin required');

					} catch (e) {
						return this.errorException(e);
					}

					return true;
				},
				checkBrowser: function() {
					var isMobile = false;
					
					if (typeof window.orientation == 'undefined')
						return isMobile;

					if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
					
					return isMobile;
				},
				getLSObject: function(name) {
					if (options.console)
						console.info('Loading cached element: ' + name);

					return JSON.parse(localStorage.getItem(name));
				},
				setLSObject: function(name, object) {
					if (options.console)
						console.info('Element: ' + name + ' now cached');
						
					return localStorage.setItem(name, JSON.stringify(object));
				},
				dateToUnixTimeStamp: function(date) {
					objDate = new Date(date.split(' ').join('T'));
					return objDate.getTime() / 1000;
				},
				fetch: function (object) {
					$thisApp = this;
					
					try {
						return $.ajax({
							type: 'GET',
							url: object.urlPath,
							dataType: 'script',
							cache: options.cache,
							async: true,
							success: function(xhr) {
								// console.log(object.name);
								$thisApp.setLSObject(object.name, xhr);
								$thisApp.loader(object);
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
					var localCached = $thisApp.getLSObject(object.name);

					if ($.cookie(object.name) == 'false')
						return false;
	
					if (!$.cookie(object.name))
						$.cookie(object.name, true, object.cookieExpire);
	
					if (object.date.now < object.date.start || object.date.now > object.date.end)
						return false;


					if (options.cache == true && localCached)
						return (
							$.globalEval(localCached),
							this.loader(object)
						);
					

					return this.fetch(object);
				},
				render: function() {
					$thisApp = this;

					if (!this.checkCompability())
						return false;

					if (this.checkBrowser() || options.mobile == true)
						return false;
						
					if (options.elements.length < 1)
						return false;

					$.each(options.elements, function(index, object) {
						$.map(object, function (item, name) {
							switch (item.type) {
							case 'popup':
								
								// route popups
								return $thisApp.route({
									name: name,
									item: item,
									urlPath: options.path + '/' + name + '/' + options.scriptName,
									globElement: globThis,
									console: options.console,
									date: {
										now: Math.round(new Date().getTime() / 1000),
										start: $thisApp.dateToUnixTimeStamp(item.date.start),
										end: $thisApp.dateToUnixTimeStamp(item.date.end),
									},
									cookieExpire: {
										expire: new Date().getTime() + (1000*60*60*24*item.cookieExpire)
									}
								});
							}
						});
					});
				},
				errorException: function(e) {
					
					if (e.name)
						console.error('Exception: ' + e.name + '\nException message: ' + e.message + '\nException stack: ' + e.stack);
					else
						console.error(e);
						
						
					return false;
				}
			};

			return window.dekko.render();
		}
	});
}(jQuery));