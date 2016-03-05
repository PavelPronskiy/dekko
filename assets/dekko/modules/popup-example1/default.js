/**
 * updated ver 0.15 1
 * popup element template
**/
jQuery(function ($) {

	window.dekko.loader = function (object) {
		var t = {},
			$this = window.dekko,
			animPosOpts = {},
			wrapPosOpts = {};

		try {
			t.css = {
				wrap: {
					'position' 				: 'fixed',
					'display' 				: 'none',
					'width' 				: '100px',
					'height' 				: '100px',
					'z-index' 				: '100',
					// 'background' 		: 'url(' + object.path + '/bg.jpg) no-repeat left top',
					'background-color' 		: 'blue',
					'-webkit-box-shadow' 	: '0px 0px 10px rgba(50, 50, 50, 0.6)',
					'-moz-box-shadow' 		: '0px 0px 10px rgba(50, 50, 50, 0.6)',
					'box-shadow' 			: '0px 0px 10px rgba(50, 50, 50, 0.6)',
					'-webkit-border-radius'	: '5px',
					'-moz-border-radius'	: '5px',
					'border-radius'			: '5px',
					'border-spacing'		: '0'
				},
				layer_wrap: {
					'position' 			: 'relative',
					'width' 			: '100%',
					'height' 			: '100%'
				},
				headWrap: {
					'overflow' 			: 'hidden',
					// 'outline' 			: '1px solid black',
					'width' 			: '100%'
				},
				item_body: {
					// 'outline' 			: '1px solid green',
					'padding-top'		: '25px',
					'padding-left'		: '5px',
					'padding-right'		: '5px',
					'text-align' 		: 'center',
					'color' 			: '#fff',
					'font-size' 		: '12pt'
				},
				title_item: {
					'position' 			: 'absolute',
					'top' 				: '9px',
					'left' 				: '45px',
					'right' 			: '25px',
					'border' 			: '0px solid black',
					'text-align' 		: 'left',
					'color' 			: '#000',
					'font-family' 		: 'Georgia',
					'font-size' 		: '12pt',
					// 'text-shadow' 		: '0px 1px #e3e3e3'
				},
				close: {
					'float' 			: 'right',
					'width' 			: '15px',
					'height' 			: '15px',
					'text-align' 		: 'center',
					'line-height' 		: '15px',
					'font-size' 		: '15px',
					'color'				: '#fff',
					'cursor' 			: 'pointer',
					// 'outline' 			: '1px solid black',
					// 'background' 		: 'url(' + object.path + '/button-close.png) no-repeat left top'
				},
				close_hover: {
					'color'				: '#ff0000',
					// 'border' 			: '1px solid red',
					// 'background' 		: 'url(' + object.path + '/button-close-hover.png) no-repeat left top'
				},
				reg_button_hover: {
					// 'background' 		: 'url(' + object.path + '/zapis-button-hover.jpg) no-repeat left top'
				}
			};
	
			t.wrap = $('<div/>', {
				id: object.name + '-wrap'
			}).css(t.css.wrap);
			
			t.layerWrap = $('<div/>', {
				class: object.name + '-layer-wrap'
			}).css(t.css.layer_wrap);
	
			t.itemHead = $('<div/>', {
				class: object.name + '-head-wrap'
			}).css(t.css.headWrap);
	
			
			t.itemBody = $('<div/>', {
				class: object.name + '-item-body',
				text: object.item.context
			}).css(t.css.item_body);
			
			t.itemClose = $('<div/>', {
				class: object.name + '-close',
				html: '&times;'
			}).css(t.css.close);
			
			t.widthAnim =  parseInt(t.css.wrap.width.replace(/px/gi,''), 10);
			t.heightAnim =  parseInt(t.css.wrap.height.replace(/px/gi,''), 10);
			t.horizOpts = (object.item.position.left) ? parseInt(object.item.position.left.replace(/px/gi,''), 10) : parseInt(object.item.position.right.replace(/px/gi,''), 10);
			t.vertOpts = (object.item.position.bottom) ? parseInt(object.item.position.bottom.replace(/px/gi,''), 10) : parseInt(object.item.position.top.replace(/px/gi,''), 10);
	
			t.posWrapHorizStart = (object.item.position.left) ? { 'left': '-' + t.css.wrap.width } : { 'right': '-' + t.css.wrap.width };
			t.posWrapVertStart = (object.item.position.bottom) ? { 'bottom': '-' + t.css.wrap.height } : { 'top': '-' + t.css.wrap.height };
	
			t.posWrapHorizAnimate = (object.item.position.left) ? { 'left': '+=' + ( t.widthAnim + t.horizOpts ) + 'px' } : { 'right': '+=' + ( t.widthAnim + t.horizOpts ) + 'px' };
			t.posWrapVertAnimate = (object.item.position.bottom) ? { 'bottom': '+=' + ( t.heightAnim + t.vertOpts ) + 'px' } : { 'top': '+=' + ( t.heightAnim + t.vertOpts ) + 'px' };
	
			$.extend(animPosOpts, t.posWrapVertAnimate, t.posWrapHorizAnimate);
			$.extend(wrapPosOpts, t.posWrapVertStart, t.posWrapHorizStart);
	
			t.layerWrap.appendTo(t.wrap);	
			t.itemHead.appendTo(t.layerWrap);
			t.itemClose.appendTo(t.itemHead);
			t.itemBody.appendTo(t.layerWrap);
			// t.itemLink.appendTo(t.layerWrap);
	
			t.wrap.css(t.css.wrap).css(wrapPosOpts)
				.delay(object.item.delay).show();
	
	
			t.itemClose.hover(function() {
					$(this).css(t.css.close_hover);
				}, function() {
					$(this).css(t.css.close);
				}
			);
	
			t.wrap.animate(animPosOpts, object.item.effects.duration, object.item.effects.easing, function() {
				$(this).css(object.item.position);
			}).delay(2000).animate({  borderSpacing: -360 }, {
				    step: function(now,fx) {
				      $(this).css('-webkit-transform','rotate('+now+'deg)'); 
				      $(this).css('-moz-transform','rotate('+now+'deg)');
				      $(this).css('transform','rotate('+now+'deg)');
				    },
				    duration:'slow'
				},'linear').delay(500).animate({  borderSpacing: 360 }, {
				    step: function(now,fx) {
				      $(this).css('-webkit-transform','rotate('+now+'deg)'); 
				      $(this).css('-moz-transform','rotate('+now+'deg)');
				      $(this).css('transform','rotate('+now+'deg)');
				    },
				    duration:'slow'
				},'linear');

	
			t.itemClose.click(function() {
				t.wrap.animate(t.posWrapHorizStart, object.item.effects.duration, object.item.effects.easing, function() {
					$(this).remove();
				});

				return $this.setCookie(object.name, false, object.item.cookieExpire);
			});
	
			return (
				object.globElement.append(t.wrap),
				$this.successInfo(object.name)
			);
		} catch (e) {
			return $this.errorException(e);
		}

	};


}(jQuery));