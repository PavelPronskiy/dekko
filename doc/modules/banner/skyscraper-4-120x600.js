/**
 * Version 0.18
 * banner element template
**/
(function($) {
	window.dekkoModule = function (object) {

		var css = {
			wrap: {
				'display' 				: 'none',
				'width' 				: '120px',
				'height' 				: '600px',
				'background' 			: "url('data:image/png;base64,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') no-repeat left top",
				'-webkit-box-shadow'	: '0px 0px 10px rgba(50, 50, 50, 0.6)',
				'-moz-box-shadow' 		: '0px 0px 10px rgba(50, 50, 50, 0.6)',
				'box-shadow' 			: '0px 0px 10px rgba(50, 50, 50, 0.6)'
			},
			item: {
				'position' 				: 'relative',
				'width' 				: '100%',
				'height' 				: '100%',
				// 'border'				: '1px solid green',

			},
			link: {
				'width' 				: '100%',
				'height' 				: '100%',
				// 'border'				: '1px solid red',
				'text-decoration'		: 'none',
				'display'				: 'block'
			},
			close: {
				none: {
					'display' 			: 'none',
					'width' 			: '16px',
					'height' 			: '16px',
					'position' 			: 'absolute',
					'padding' 			: '0px',
					'top' 				: '2px',
					'right' 			: '2px',
					'cursor' 			: 'pointer',
					'color'				: '#fff',
					'background'		: 'none',
					'z-index' 			: '1px'
				},
				normal: {
					'text-align' 		: 'center',
					'color'				: '#fff'
				},
				hover: {
					'color'				: '#000',
					'border'			: '1px solid #000'
				}
			}
		},
		t = {},
		self = this;

		try {

			t.wrap 		= $('<div/>', {  'id': object.name + '-wrap', 'css': css.wrap });
			t.item 		= $('<div/>', { 'css': css.item });
			t.close 	= $('<div/>', { 'css': css.close.none, 'html': self.svg.close(css.close.none) });
			t.link 		= $('<a/>', { href: object.item.url, target: '_blank', 'css': css.link });

			t.item.appendTo(t.wrap);
			t.close.appendTo(t.item);
			t.link.appendTo(t.item);
			t.wrap.appendTo(object.append);

			t.wrap.delay(object.item.delay)
				.fadeIn(object.item.effects.duration, object.item.effects.easing[0]);

			t.link.mouseover(function() {
				if (t.close.is(':visible') === false)
					return t.close.delay(object.item.effects.duration).fadeIn(600);
			});

			t.close.click(function() {
				t.wrap.fadeOut((object.item.effects.duration/2), object.item.effects.easing[1], function() {
					self.setStore(object.closePoint, [true, object.date.now()]);
					t.wrap.remove();
				});
			});

			t.link.on('auxclick touchstart click', function() {
				return self.clickAdvert(object);
			});

		} catch (e) {
			return console.error(e);
		} finally {
			return self.notice(object);
		}
	};

})(jQuery);
