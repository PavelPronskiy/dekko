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
