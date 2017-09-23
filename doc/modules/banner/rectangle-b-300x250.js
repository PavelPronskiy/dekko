/**
* Version 0.18
* banner element template
**/
window.dekkoModule = function (object) {

	var css = {
		wrap: {
			'display' 				: 'none',
			'width' 				: '300px',
			'height' 				: '250px',
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
		
		t.append 	= this.shadowCreate(object.append);
		t.wrap 		= $('<div/>', {  'id': object.name + '-wrap', 'css': css.wrap });
		t.item 		= $('<div/>', { 'css': css.item });
		t.close 	= $('<div/>', { 'css': css.close.none, 'html': self.svg.close(css.close.none) });
		t.link 		= $('<a/>', { href: object.item.url, target: '_blank', 'css': css.link });

		t.item.appendTo(t.wrap);
		t.close.appendTo(t.item);
		t.link.appendTo(t.item);
		t.wrap.appendTo(t.append);

		t.wrap.delay(object.item.delay)
			.fadeIn(object.item.effects.duration, object.item.effects.easing[0], function() {
				$(this).stop(true);
			});


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
		return this.exceptionsMessage({
			message: object.name + ' ' + e,
			status: this.console.dekkothrowError,
			date: new Date().toISOString()
		});
	} finally {
		return this.notice(object);
	}
};