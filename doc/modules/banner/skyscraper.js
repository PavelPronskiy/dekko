/**
* Version 0.18
* banner element template
**/
window.dekkoModule = function (object) {

	var css = {
		wrap: {
			'display' 				: 'none',
			'width' 				: '120px',
			'height' 				: '600px',
			'background' 			: "__DATAREPLACE__ no-repeat left top",
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

		t.link.on('touchstart click', function() {
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