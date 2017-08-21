/**
 * updated ver 0.20 with countdown
 * popup element template
**/
(function ($) {

	if (typeof jQuery.fn.countdown !== 'function') {
		$.fn.countdown = function(prop){

			var days	= 24*60*60,
				hours	= 60*60,
				minutes	= 60;
			
			var options = $.extend({
				css			: {},
				name		: '',
				callback	: function(){},
				timestamp	: 0
			},prop);
			
			var left, d, h, m, s, positions;

			init(this, options);
			
			positions = this.find('.position');
			
			(function tick(){
				
				var ts = new Date(options.timestamp).getTime();
				var tn = (new Date() / 1000);
				var left = Math.floor(ts - tn);
				
				if(left < 0){
					left = 0;
				}
				
				d = Math.floor(left / days);
				updateDuo(0, 1, d);
				left -= d*days;
				
				h = Math.floor(left / hours);
				updateDuo(2, 3, h);
				left -= h*hours;
				
				m = Math.floor(left / minutes);
				updateDuo(4, 5, m);
				left -= m*minutes;
				
				s = left;
				updateDuo(6, 7, s);
				
				options.callback(d, h, m, s);
				
				setTimeout(tick, 1000);
			})();


			function init(elem, options){
				$.each(['days', 'hours', 'minutes', 'seconds'], function(i) {
					$('<span id="' + options.name + '-timer-' + this + '">').html('<span class="position" style="float:left;display:block;position:relative;border:0px solid black;overflow:hidden;width:11px;height:22px">' + 
							'<span class="digit static" style="position:absolute;width:10px">0</span>' + 
						'</span>' + 
						'<span class="position" style="display:block;position:relative;border:0px solid black;overflow:hidden;width:11px;height:22px">' + 
							'<span class="digit static" style="position:absolute;width:10px">0</span>' + 
						'</span>').appendTo(elem).css(options.css[this]);


				});
			}

			function updateDuo(minor,major,value){
				switchDigit(positions.eq(minor),Math.floor(value/10)%10);
				switchDigit(positions.eq(major),value%10);
			}
			
			return this;
		};


		function switchDigit(position,number) {
			
			var digit = position.find('.digit');
			
			if(digit.is(':animated')){
				return false;
			}
			
			if(position.data('digit') == number) {
				return false;
			}
			
			position.data('digit', number);
			
			var replacement = $('<span>', {
				'class':'digit',
				css: {
					'font-family'		: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
					'font-size'			: '14pt',
					display				: 'inline-block',
					top 				: '-10px',
					opacity 			: 0
				},
				html:number
			});
			
			digit.before(replacement).animate({top:'10px',opacity:0},'fast',function(){
					return digit.remove();
				});

			replacement.delay(100).animate({top:0,opacity:1},'fast',function(){
					// return replacement.addClass('static');
				});
		}
	}
	
	// dekko example
	window.dekkoModule = function (object) {
		var t = {},
		self = this,
		date = {
			now: function() {
				return Math.round(new Date().getTime() / 1000);
			}
		},
		eventOneStart = true,
		cnt = 0,
		css = {
			wrap: {
				'position' 				: 'fixed',
				'display' 				: 'none',
				'width' 				: '283px',
				'height' 				: '319px',
				'z-index' 				: '999999',
				'cursor' 				: 'default',
				// 'cursor' 				: 'pointer',
				// 'background' 			: " no-repeat left top",
				// 'background' 			: 'url(' + object.path + '/bg.gif) no-repeat left top',
				'-webkit-box-shadow' 	: '0px 0px 10px rgba(50, 50, 50, 0.6)',
				'-moz-box-shadow' 		: '0px 0px 10px rgba(50, 50, 50, 0.6)',
				'box-shadow' 			: '0px 0px 10px rgba(50, 50, 50, 0.6)'
				// 'outline' 			: '1px solid red',
			},
			wrapHover: {
				'cursor'				: 'pointer'
			},
			wrapNormal: {
				'cursor'				: 'default'
			},
			item: {
			},
			head: {
				'height' 				: '25px'
				// 'outline' 				: '1px solid green'
			},
			body: {
				'position' 				: 'relative',
				'width' 				: '100%',
				'height' 				: '100%',
				// 'height' 				: '290px',
				// 'outline' 				: '1px solid red',
				'padding'				: '0px',
				'margin'				: '0',
				'text-align' 			: 'center',
				'color' 				: '#fff',
				'-webkit-perspective' 	: '800px',
				'-moz-perspective' 		: '800px',
				'-o-perspective' 		: '800px',
				'perspective' 			: '800px',
				'font-size' 			: '12pt'

			},
			link: {
				normal: {
					'z-index' 			: '0',
					'position'			: 'absolute',
					'display'			: 'block',
					'bottom'			: '5px',
					'left'				: '15px',
					'width' 			: '169px',
					'height' 			: '28px',
					// 'background'		: 'url(' + object.path + '/button-more.png) no-repeat 50% 93%',
					'background'		: "url('" + object.images.button + "') no-repeat 50% 93%",
					// 'margin-top'		: '5px',
					// 'background-color'	: 'brown',
					'text-shadow'		: 'none',
					'text-decoration'	: 'none',
					// 'border'			: '1px solid green',
					'color'				: '#fff'
				},
				hover: {
					// 'background-color'	: 'black',
					'background'		: "url('" + object.images.buttonHover + "') no-repeat 50% 93%",
					'text-shadow'		: 'none',
					'color'				: '#fff',
					'text-decoration'	: 'none'
					// 'border'			: '1px solid green',
				}
			},
			close: {
				normal : {
					'z-index' 			: '1',
					'position' 			: 'absolute',
					'top'	 			: '6px',
					'right' 			: '0px',
					'width' 			: '22px',
					'height' 			: '21px',
					'cursor' 			: 'pointer',
					'text-decoration'	: 'none',
					// 'border'			: '1px solid green',
					'background' 		: "url('" + object.images.close + "') no-repeat left top"
					// 'background' 		: 'url(' + object.path + '/button-close.png) no-repeat left top'
				},
				hover : {
					'background' 		: "url('" + object.images.closeHover + "') no-repeat left top"
					// 'background' 		: 'url(' + object.path + '/button-close-hover.png) no-repeat left top'
				}
			},
			timer: {
				bg: {
					'position' 			: 'absolute',
					'bottom' 			: '43px',
					'left' 				: '13px',
					'height' 			: '50px',
					'width' 			: '154px',
					// 'border' 			: '1px solid black',
					// 'background-color'  : '#fff',
					'background'		: "url('" + object.images.timer + "') no-repeat left top",
					// 'background' 		: 'url(' + object.path + '/timer.png) no-repeat left top'
				},
				text: {
					'font-family'		: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
					'font-size'			: '16pt',
					'font-weight'		: 'bold',
					'color' 			: '#1d80c2'
				},
				days: {
					'font-family'		: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
					'font-size'			: '16pt',
					'font-weight'		: 'bold',
					'border' 			: '0px solid black',
					'text-align'		: 'center',
					'width'				: '28px',
					'position'			: 'absolute',
					'left'				: '5px',
					'top'				: '18px'
				},
				hours: {
					'font-family'		: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
					'font-size'			: '16pt',
					'font-weight'		: 'bold',
					'border' 			: '0px solid black',
					'text-align'		: 'center',
					'width'				: '28px',
					'position'			: 'absolute',
					'left'				: '45px',
					'top'				: '18px'
				},
				minutes: {
					'font-family'		: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
					'font-size'			: '16pt',
					'font-weight'		: 'bold',
					'border' 			: '0px solid black',
					'text-align'		: 'center',
					'width'				: '28px',
					'position'			: 'absolute',
					'left'				: '84px',
					'top'				: '18px'
				},
				seconds: {
					'font-family'		: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
					'font-size'			: '16pt',
					'font-weight'		: 'bold',
					'border' 			: '0px solid black',
					'text-align'		: 'center',
					'width'				: '28px',
					'position'			: 'absolute',
					'left'				: '125px',
					'top'				: '18px'
				}
			}
		};

		self.parse = {
			px: function(o) {
				return parseInt(o.replace(/px/gi,''), 10);
			}
		};


	try {

		// console.log(object.date.end + ' ' + date.now());

		t.width 				= self.parse.px(css.wrap.width);
		t.height 				= self.parse.px(css.wrap.height);

		t.horizOpts 			= (object.item.position.left)
									? self.parse.px(object.item.position.left)
									: self.parse.px(object.item.position.right);

		t.vertOpts 				= (object.item.position.bottom)
									? self.parse.px(object.item.position.bottom)
									: self.parse.px(object.item.position.top);


		t.posWrapHorizStart 	= (object.item.position.left)
									? {
										'left': '-' + t.width + 'px'
									}
									: {
										'right': '-' + t.width + 'px'
									};

		t.posWrapVertStart		= (object.item.position.bottom)
									? {
										'bottom': '-' + t.height + 'px'
									}
									: {
										'top': '-' + t.height + 'px'
									};

		t.posWrapHorizAnimate 	= (object.item.position.left)
									? {
										'left': '+=' + ( t.widthAnim + t.horizOpts ) + 'px'
									}
									: {
										'right': '+=' + ( t.widthAnim + t.horizOpts ) + 'px'
									};

		t.posWrapVertAnimate 	= (object.item.position.bottom)
									? {
										'bottom': '+=' + ( t.heightAnim + t.vertOpts ) + 'px'
									}
									: {
										'top': '+=' + ( t.heightAnim + t.vertOpts ) + 'px'
									};

		t.animPosOpts 			= $.extend(t.posWrapVertAnimate, t.posWrapHorizAnimate);
		t.wrapPosOpts 			= $.extend(t.posWrapVertStart, t.posWrapHorizStart);
		t.wrapCss				= $.extend(css.wrap, t.wrapPosOpts, {'display': 'block'});

		t.wrap 					= $('<div/>', { 'id': object.name + '-wrap', 'css': t.wrapCss });
		t.item 					= $('<div/>', { 'id': object.name + '-item', 'css': css.item });
		t.head	 				= $('<div/>', { 'id': object.name + '-head', 'css': css.head });
		t.body	 				= $('<div/>', { 'id': object.name + '-body', 'css': css.body }); //.html(object.item.context);
		t.link	 				= $('<a/>',   { 'id': object.name + '-link', 'href': object.item.url, 'target': '_blank', 'css': css.link.normal });
		t.close		 			= $('<a/>', { 'id': object.name + '-close', 'css': css.close.normal });

		// timer countdown
		t.timerBg				= $('<div/>', { 'id': object.name + '-timer-bg', 'css': css.timer.bg }); //.html(object.item.context);
		t.timerText				= $('<div/>', { 'id': object.name + '-timer-text', 'css': css.timer.text }); //.html(object.item.context);
		t.timerBg.appendTo(t.wrap);
		t.timerText.appendTo(t.timerBg);

		t.head.appendTo(t.wrap);
		t.body.appendTo(t.wrap);
		t.close.appendTo(t.head);
		t.link.appendTo(t.body);
		// t.item.appendTo(t.wrap);


		// t.wrap.css(t.wrapPosOpts).delay(object.item.delay).show();


		t.close.hover(
			function() { $(this).css(css.close.hover); },
			function() { $(this).css(css.close.normal); }
		).click(function() {
			t.wrap.animate(t.posWrapHorizStart, (object.item.effects.duration/2), object.item.effects.easing[1], function() {
				$(this).remove();
			});
			return self.setStore(object.closePoint, [true, object.date.now()]);
		});
		
		
		t.wrap.delay(object.item.delay).animate(t.animPosOpts, object.item.effects.duration, object.item.effects.easing[0], function() {
			$(this).css(object.item.position);
		});

		// t.wrap.delay(object.item.delay).show();

		t.link.on('touchstart click', function() {
			return self.clickAdvert(object);
		});

		t.link.hover(
			function() { t.link.css(css.link.hover); },
			function() { t.link.css(css.link.normal); }
		);


		t.timerText.countdown({
			css 		: css.timer,
			name 		: object.name,
			timestamp	: object.date.end,
			callback	: function(days, hours, minutes, seconds){
				var timeNow = new Date().getTime();	

				if (object.date.end < date.now()) {
					if (eventOneStart) {
						eventOneStart = false;
						t.wrap.remove();
					}
				} 


			}
		});

		t.wrap.appendTo(object.append);
	
	} catch (e) {
		return console.error(e);
	} finally {
		return self.notice(object);
	}
};
}(jQuery));