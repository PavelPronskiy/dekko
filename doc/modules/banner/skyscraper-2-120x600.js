/**
* Version 0.18
* banner element template
**/

window.dekkoModule = function (object) {

	if (typeof $.easing.def === 'undefined')
		object.item.effects = ['swing', 'swing'];

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
	t = {};

	try {

		t.append 	= this.shadowCreate(object.append);
		t.wrap 		= $('<div/>', {  'id': object.name + '-wrap', 'css': css.wrap });
		t.item 		= $('<div/>', { 'css': css.item });
		t.close 	= $('<div/>', { 'css': css.close.none, 'html': window.dekkoJS.svg.close(css.close.none) });
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
				window.dekkoJS.setStore(object.closePoint, [true, object.date.now()]);
				t.wrap.remove();
			});
		});

		t.link.click(function() {
			return window.dekkoJS.clickAdvert(object);
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