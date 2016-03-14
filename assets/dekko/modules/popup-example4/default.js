/**
 * updated ver 0.17
 * popup element template
**/

window.dekkoModule = function (object) {
		var t = {},
		self = this,
		css = {
			wrap: {
				'position' 				: 'fixed',
				'display' 				: 'none',
				'width' 				: '120px',
				'height' 				: '120px',
				'z-index' 				: '999999',
				// 'background' 		: 'url(' + object.path + '/bg.jpg) no-repeat left top',
				'background-color' 		: 'blue',
				'-webkit-box-shadow' 	: '0px 0px 10px rgba(50, 50, 50, 0.6)',
				'-moz-box-shadow' 		: '0px 0px 10px rgba(50, 50, 50, 0.6)',
				'box-shadow' 			: '0px 0px 10px rgba(50, 50, 50, 0.6)',
			},
			item: {
				'position' 				: 'relative',
				'width' 				: '100%',
				'height' 				: '100%'
			},
			head: {
				'overflow' 				: 'hidden',
				// 'outline' 			: '1px solid black',
				'width' 				: '100%'
			},
			body: {
				// 'outline' 			: '1px solid green',
				'padding-top'			: '15px',
				// 'padding-bottom'		: '15px',
				'padding-left'			: '5px',
				'padding-right'			: '5px',
				'text-align' 			: 'center',
				'color' 				: '#fff',
				'font-size' 			: '12pt'

			},
			link: {
				normal: {
					'display'			: 'block',
					'margin-top'		: '5px',
					'background-color'	: 'brown',
					'text-shadow'		: 'none',
					'text-decoration'	: 'none',
					'color'				: '#fff',
					// 'border'			: '1px solid green',
				},
				hover: {
					'background-color'	: 'black',
					'text-shadow'		: 'none',
					'color'				: '#fff',
					'text-decoration'	: 'none',
					// 'border'			: '1px solid green',
				}
			},
			close: {
				normal : {
					'float' 			: 'right',
					'width' 			: '15px',
					'height' 			: '15px',
					'text-align' 		: 'center',
					'line-height' 		: '15px',
					'font-size' 		: '15px',
					'color'				: '#fff',
					'cursor' 			: 'pointer',
					'text-decoration'	: 'none',
					'background-color'	: 'transparent',
					// 'outline' 			: '1px solid black',
					// 'background' 		: 'url(' + object.path + '/button-close.png) no-repeat left top'
				},
				hover : {
					'color'				: '#ff0000',
					'text-decoration'	: 'none',
					'background-color'	: '#000'
				}
			}
		};


	try {


		t.widthAnim 			= parseInt(css.wrap.width.replace(/px/gi,''), 10);
		t.heightAnim 			= parseInt(css.wrap.height.replace(/px/gi,''), 10);
		t.horizOpts 			= (object.item.position.left) ? parseInt(object.item.position.left.replace(/px/gi,''), 10) : parseInt(object.item.position.right.replace(/px/gi,''), 10);
		t.vertOpts 				= (object.item.position.bottom) ? parseInt(object.item.position.bottom.replace(/px/gi,''), 10) : parseInt(object.item.position.top.replace(/px/gi,''), 10);
		t.posWrapHorizStart 	= (object.item.position.left) ? { 'left': '-' + css.wrap.width } : { 'right': '-' + css.wrap.width };
		t.posWrapVertStart		= (object.item.position.bottom) ? { 'bottom': '-' + css.wrap.height } : { 'top': '-' + css.wrap.height };
		t.posWrapHorizAnimate 	= (object.item.position.left) ? { 'left': '+=' + ( t.widthAnim + t.horizOpts ) + 'px' } : { 'right': '+=' + ( t.widthAnim + t.horizOpts ) + 'px' };
		t.posWrapVertAnimate 	= (object.item.position.bottom) ? { 'bottom': '+=' + ( t.heightAnim + t.vertOpts ) + 'px' } : { 'top': '+=' + ( t.heightAnim + t.vertOpts ) + 'px' };
		t.wrap 					= $('<div/>', { id: object.name + '-wrap' }).css(css.wrap);
		t.item 					= $('<div/>').css(css.item);
		t.head	 				= $('<div/>').css(css.head);
		t.body	 				= $('<div/>').css(css.body).html(object.item.context);
		t.link	 				= $('<a/>', { href: object.item.url, target: '_blank', text: 'клик' }).css(css.link.normal);
		t.close		 			= $('<div/>').css(css.close.normal).html('&times;');
		t.animPosOpts 			= $.extend(t.posWrapVertAnimate, t.posWrapHorizAnimate);
		t.wrapPosOpts 			= $.extend(t.posWrapVertStart, t.posWrapHorizStart);

		t.item.appendTo(t.wrap);
		t.head.appendTo(t.item);
		t.close.appendTo(t.head);
		t.body.appendTo(t.item);
		t.link.appendTo(t.body);


		t.wrap.css(t.wrapPosOpts)
			.delay(object.item.delay).show();


		t.close.hover(
			function() { $(this).css(css.close.hover) },
			function() { $(this).css(css.close.normal) }
		).click(function() {
			t.wrap.animate(t.posWrapHorizStart, object.item.effects.duration, object.item.effects.easing[1], function() {
				self.setStore(object.closePoint, [true, object.date.now()]);
				$(this).remove();
			});
		});
		
		t.link.hover(
			function() { $(this).css(css.link.hover) },
			function() { $(this).css(css.link.normal) }
		);


		t.wrap.animate(t.animPosOpts, object.item.effects.duration, object.item.effects.easing[0], function() {
			$(this).css(object.item.position);
		});

		(function animate() {
			t.wrap.animate({
				backgroundColor: $.Color(t.wrap.css('backgroundColor')).hue('+=179')
			}, 20000, animate);
		})();

		t.wrap.appendTo(object.append);
		
	} catch (e) {
		return console.error(e);
	} finally {
		return self.notice(object);
	}
};
