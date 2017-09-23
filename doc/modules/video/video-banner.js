
/*! flip - v1.1.2 - 2016-10-20
* https://github.com/nnattawat/flip
* Copyright (c) 2016 Nattawat Nonsung; Licensed MIT */

!function(a){var b=function(){var a,b=document.createElement("fakeelement"),c={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(a in c)if(void 0!==b.style[a])return c[a]},c=function(b,c,d){this.setting={axis:"y",reverse:!1,trigger:"click",speed:500,forceHeight:!1,forceWidth:!1,autoSize:!0,front:".front",back:".back"},this.setting=a.extend(this.setting,c),"string"!=typeof c.axis||"x"!==c.axis.toLowerCase()&&"y"!==c.axis.toLowerCase()||(this.setting.axis=c.axis.toLowerCase()),"boolean"==typeof c.reverse&&(this.setting.reverse=c.reverse),"string"==typeof c.trigger&&(this.setting.trigger=c.trigger.toLowerCase());var e=parseInt(c.speed);isNaN(e)||(this.setting.speed=e),"boolean"==typeof c.forceHeight&&(this.setting.forceHeight=c.forceHeight),"boolean"==typeof c.forceWidth&&(this.setting.forceWidth=c.forceWidth),"boolean"==typeof c.autoSize&&(this.setting.autoSize=c.autoSize),("string"==typeof c.front||c.front instanceof a)&&(this.setting.front=c.front),("string"==typeof c.back||c.back instanceof a)&&(this.setting.back=c.back),this.element=b,this.frontElement=this.getFrontElement(),this.backElement=this.getBackElement(),this.isFlipped=!1,this.init(d)};a.extend(c.prototype,{flipDone:function(a){var c=this;c.element.one(b(),function(){c.element.trigger("flip:done"),"function"==typeof a&&a.call(c.element)})},flip:function(a){if(!this.isFlipped){this.isFlipped=!0;var b="rotate"+this.setting.axis;this.frontElement.css({transform:b+(this.setting.reverse?"(-180deg)":"(180deg)"),"z-index":"0"}),this.backElement.css({transform:b+"(0deg)","z-index":"1"}),this.flipDone(a)}},unflip:function(a){if(this.isFlipped){this.isFlipped=!1;var b="rotate"+this.setting.axis;this.frontElement.css({transform:b+"(0deg)","z-index":"1"}),this.backElement.css({transform:b+(this.setting.reverse?"(180deg)":"(-180deg)"),"z-index":"0"}),this.flipDone(a)}},getFrontElement:function(){return this.setting.front instanceof a?this.setting.front:this.element.find(this.setting.front)},getBackElement:function(){return this.setting.back instanceof a?this.setting.back:this.element.find(this.setting.back)},init:function(a){var b=this,c=b.frontElement.add(b.backElement),d="rotate"+b.setting.axis,e=2*b.element["outer"+("rotatex"===d?"Height":"Width")](),f={perspective:e,position:"relative"},g={transform:d+"("+(b.setting.reverse?"180deg":"-180deg")+")","z-index":"0",position:"relative"},h={"backface-visibility":"hidden","transform-style":"preserve-3d",position:"absolute","z-index":"1"};b.setting.forceHeight?c.outerHeight(b.element.height()):b.setting.autoSize&&(h.height="100%"),b.setting.forceWidth?c.outerWidth(b.element.width()):b.setting.autoSize&&(h.width="100%"),(window.chrome||window.Intl&&Intl.v8BreakIterator)&&"CSS"in window&&(f["-webkit-transform-style"]="preserve-3d"),c.css(h).find("*").css({"backface-visibility":"hidden"}),b.element.css(f),b.backElement.css(g),setTimeout(function(){var d=b.setting.speed/1e3||.5;c.css({transition:"all "+d+"s ease-out"}),"function"==typeof a&&a.call(b.element)},20),b.attachEvents()},clickHandler:function(b){b||(b=window.event),this.element.find(a(b.target).closest('button, a, input[type="submit"]')).length||(this.isFlipped?this.unflip():this.flip())},hoverHandler:function(){var b=this;b.element.off("mouseleave.flip"),b.flip(),setTimeout(function(){b.element.on("mouseleave.flip",a.proxy(b.unflip,b)),b.element.is(":hover")||b.unflip()},b.setting.speed+150)},attachEvents:function(){var b=this;"click"===b.setting.trigger?b.element.on(a.fn.tap?"tap.flip":"click.flip",a.proxy(b.clickHandler,b)):"hover"===b.setting.trigger&&(b.element.on("mouseenter.flip",a.proxy(b.hoverHandler,b)),b.element.on("mouseleave.flip",a.proxy(b.unflip,b)))},flipChanged:function(a){this.element.trigger("flip:change"),"function"==typeof a&&a.call(this.element)},changeSettings:function(a,b){var c=this,d=!1;if(void 0!==a.axis&&c.setting.axis!==a.axis.toLowerCase()&&(c.setting.axis=a.axis.toLowerCase(),d=!0),void 0!==a.reverse&&c.setting.reverse!==a.reverse&&(c.setting.reverse=a.reverse,d=!0),d){var e=c.frontElement.add(c.backElement),f=e.css(["transition-property","transition-timing-function","transition-duration","transition-delay"]);e.css({transition:"none"});var g="rotate"+c.setting.axis;c.isFlipped?c.frontElement.css({transform:g+(c.setting.reverse?"(-180deg)":"(180deg)"),"z-index":"0"}):c.backElement.css({transform:g+(c.setting.reverse?"(180deg)":"(-180deg)"),"z-index":"0"}),setTimeout(function(){e.css(f),c.flipChanged(b)},0)}else c.flipChanged(b)}}),a.fn.flip=function(b,d){return"function"==typeof b&&(d=b),"string"==typeof b||"boolean"==typeof b?this.each(function(){var c=a(this).data("flip-model");"toggle"===b&&(b=!c.isFlipped),b?c.flip(d):c.unflip(d)}):this.each(function(){if(a(this).data("flip-model")){var e=a(this).data("flip-model");!b||void 0===b.axis&&void 0===b.reverse||e.changeSettings(b,d)}else a(this).data("flip-model",new c(a(this),b||{},d))}),this}}(jQuery);

/**
 * Version 0.1
 * video element template
**/
window.dekkoModule = function (object) {

	try {

		if ($(object.append).length === 0)
			return false;

		var css = {
			wrap: {
				'width' 				: '640px',
				'height' 				: '360px',
				// 'margin' 				: '15px 5px 15px 5px',
				// 'padding' 				: '3px',
				'display' 				: 'none'
			},
			video: {
				'width' 				: '100%',
				'height' 				: '100%'
			},
			item: {
				'position' 				: 'relative',
				'width' 				: '100%',
				'height' 				: '100%'
			},
			itemAbsolute: {
				'position' 				: 'absolute',
				'z-index'				: '99'
			},
			itemStatic: {
				'position' 				: 'static'
			},
			flip: {
				'width' 				: '640px',
				'height' 				: '360px'
				// 'outline'				: '1px solid #ccc'
			},
			flipBack: {
				'box-shadow' 			: '0px 0px 20px rgba(50, 50, 50, 0.6)',
				'position' 				: 'relative',
				'background'			: 'url(' + object.item.videoPoster + ') no-repeat left top'
			},
			flipFront: {
				'box-shadow' 			: '0px 0px 20px rgba(50, 50, 50, 0.6)',
				'position' 				: 'relative'
			},
			link: {
				'position'				: 'absolute',
				'top' 					: '0px',
				'bottom'				: '0px',
				'left' 					: '0px',
				'right'					: '0px',
				'text-decoration'		: 'none',
				'z-index' 				: '1',
				'display'				: 'block'
			},
			linkBack: {
				'position'				: 'absolute',
				'background-color'		: '#000',
				'opacity' 				: '0.5',
				'top' 					: '0px',
				'bottom'				: '0px',
				'left' 					: '0px',
				'right'					: '0px',
				'text-decoration'		: 'none',
				'z-index' 				: '1',

				'display'				: 'block'
			},
			seekBarContainer: {
				'position'				: 'absolute',
				'bottom'				: '0px',
				'left'					: '0px',
				'width' 				: '100%',
				'height' 				: '3px',
				'background-color'		: 'rgba(255, 255, 255, 0.8)'
			},
			seekBar: {
				// 'border'				: '1px solid red',
				'position'				: 'absolute',
				'bottom'				: '0px',
				'left'					: '0px',
				'width' 				: '0%',
				'height' 				: '3px',
				'background-color'		: 'rgba(255, 236, 0, 0.9)'
			},
			close: {
				icon: {
					'width' 			: '32px',
					'height' 			: '32px',
					'color'				: '#fff',
					'background'		: 'none'
				},
				container: {
					'display' 			: 'none',
					'width' 			: '32px',
					'height' 			: '32px',
					'cursor' 			: 'pointer',
					'position' 			: 'absolute',
					'top' 				: '2px',
					'right' 			: '4px',
					'z-index' 			: '1'
				}
			},
			overlay: {
				'display'				: 'none',
				'background-color'		: 'rgba(50, 50, 50, 0.7)',
				'position'				: 'fixed',
				'top' 					: '0px',
				'bottom'				: '0px',
				'left' 					: '0px',
				'right'					: '0px',
				'z-index' 				: '98'
			},
			scroll: {
				start: {
					'overflow': 'auto',
					'height': 'auto'
				},
				stop: {
					'overflow': 'hidden',
					'height': '100%'
				}
			}
		},
		t = {};

		t.wrap = $('<div/>', {
			'id': object.name + '-wrap',
			'css': css.wrap
		});
		
		t.item = $('<div/>', {
			'id': object.name + '-item',
			'css': css.item
		});

		t.flip = $('<div/>', {
			'id': object.name + '-flip-container',
			'css': css.flip
		});

		t.flipFront = $('<div/>', {
			'id': object.name + '-flip-front',
			'css': css.flipFront
		});

		t.flipBack = $('<div/>', {
			'id': object.name + '-flip-back',
			'css': css.flipBack
		});

		t.video = $('<video/>', {
			'id': object.name + '-video',
			'css': css.video,
			'poster': object.item.videoPoster,
			'src': object.item.videoFile
		});

		t.seekBarContainer = $('<div/>', {
			'css': css.seekBarContainer
		});

		t.seekBar = $('<div/>', {
			'css': css.seekBar
		});

		t.close = $('<div/>', {
			'css': css.close.container,
			'html': window.dekkoJS.svg.close(css.close.icon)
		});

		t.closeBack = $('<div/>', {
			'css': css.close.container,
			'html': window.dekkoJS.svg.close(css.close.icon)
		});

		t.link = $('<a/>', {
			'href': object.item.url,
			'target': '_blank',
			'css': css.link
		});
		t.linkBack = $('<a/>', {
			'href': object.item.url,
			'target': '_blank',
			'css': css.linkBack
		});

		t.append 	= this.shadowCreate(object.append);

		t.item.appendTo(t.wrap);
		t.flip.appendTo(t.item);
		t.flipFront.appendTo(t.flip);
		t.flipBack.appendTo(t.flip);

		t.linkBack.appendTo(t.flipBack);
		t.closeBack.appendTo(t.flipBack);

		t.close.appendTo(t.flipFront);
		t.link.appendTo(t.flipFront);
		t.video.appendTo(t.flipFront);
		t.seekBar.appendTo(t.seekBarContainer);
		t.seekBarContainer.appendTo(t.flipFront);
		t.wrap.appendTo(t.append);

		t.video[0].load();
		t.video[0].volume = 0.2;
		t.video[0].preload = 'auto';
		t.scrollBoolean = true;
		t.appendOffsetTop = $(object.append).offset().top;

		t.flip.flip({
			front: t.flipFront,
			back: t.flipBack,
			axis: 'x',
			speed: object.item.effects.duration,
			trigger: 'manual'
		});

		t.video.on("loadedmetadata", function () {
			var wh = {
				width: (this.videoWidth / 2) + 'px',
				height: (this.videoHeight / 2)  + 'px'
			};

			t.video.css(wh);
		});

		t.video.on('timeupdate', function() {
			t.percentage = 100 * this.currentTime / this.duration;
			t.seekBar.animate({
				'width': t.percentage + '%'
			}, object.item.effects.duration);
		});

		t.video.on('ended', function() {
			// this.load();
			setTimeout(function() {
				t.seekBarContainer.delay(object.item.effects.duration).hide();
				t.flip.flip(true);
				
				$('#' + object.name + '-overlay').fadeOut(object.item.effects.duration, function() {
					$(this).remove();
				});
				
				t.item.css(css.itemStatic);
				$('html').css(css.scroll.start);


			}, object.item.delay);

		});

		t.link.on('mouseover', function() {
			if (t.close.is(':visible') === false)
				t.close.fadeIn(object.item.effects.duration);
		});

		t.linkBack.on('mouseover', function() {
			if (t.closeBack.is(':visible') === false)
				t.closeBack.fadeIn(object.item.effects.duration);
		});

		t.closeClickFunc = function() {
			t.video[0].pause();
			window.dekkoJS.setStore(object.closePoint, [true, object.date.now()]);
			t.wrap.fadeOut((object.item.effects.duration/2), object.item.effects.easing[1], function() {
				t.wrap.remove();
			});
		};

		t.linkFunc = function() {
			// t.wrap.remove();
			return window.dekkoJS.clickAdvert(object);
		};

		t.close.on('touchstart click auxclick', t.closeClickFunc);
		t.closeBack.on('touchstart click auxclick', t.closeClickFunc);

		t.link.on('touchstart click auxclick', t.linkFunc);
		t.linkBack.on('touchstart click auxclick', t.linkFunc);

		t.linkBack.on('mouseover', function() {
			t.linkBack.fadeTo(300, 0);
		}).on('mouseout', function() {
			t.linkBack.fadeTo(300, 0.5);
		});

		$(window).on('scroll touchmove mousewheel', function(event) {
			// t.scrollTop = $(this).scrollTop() - t.wrap.height();
			t.scrollTop = ($(this).scrollTop() + 300);

			if (t.scrollBoolean && t.scrollTop > t.appendOffsetTop) {
				t.scrollBoolean = false;
				$('html').css(css.scroll.stop);
				$('<div/>', {
					'id': object.name + '-overlay',
					'css': css.overlay
				}).appendTo('body').fadeIn(object.item.effects.duration);
				t.item.css(css.itemAbsolute);
				
				t.wrap.fadeIn(object.item.effects.duration, object.item.effects.easing[0], function() {
					setTimeout(function() {
						t.video[0].play();
					}, object.item.delay);
				});
			}
		});

	} catch (e) {
		return this.exceptionsMessage({
			message: object.name + ' ' + e,
			status: this.console.dekkothrowError,
			date: new Date().toISOString()
		});
	} finally {
		return this.notice(object);
	}
};