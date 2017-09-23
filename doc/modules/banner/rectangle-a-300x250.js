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