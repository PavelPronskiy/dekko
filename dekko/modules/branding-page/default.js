
/**
 * updated ver 0.16
 * banner element template
**/

window.dekkoModule = function (object) {

	var css = {
		container: {
			'background'				: 'url(' + object.path + '/body_background_birds.png) repeat left top',
			// 'border'					: '1px solid red',
			'-webkit-box-shadow'	 	: '0px 0px 10px rgba(50, 50, 50, 0.6)',
			'-moz-box-shadow' 			: '0px 0px 10px rgba(50, 50, 50, 0.6)',
			'box-shadow' 				: '0px 0px 10px rgba(50, 50, 50, 0.6)',

		},
		wrap: {
			// 'border'					: '1px solid blue',
			// 'background-color'			: '#ccc',
			// 'background' 			: 'url(' + object.path + '/bg.jpg) no-repeat left top',
		},
		head: {
			// 'position' 					: 'relative',
			'border'					: '1px solid blue',
		},
		item: {
			// 'position' 					: 'relative',
			'border'					: '1px solid red',
		},
		foot: {
			// 'position' 					: 'relative',
			'border'					: '1px solid green',
		}
	},
	t = {},
	self = this;


	try {

		// $('footer').
		
		// $('div.body').wrap('<div class="' + object.name + '-wrap"></div>')

		// $('.' + object.name + '-wrap').css(css.wrap);

		$('div.body').css(css.container);

		(function animate() {
			var a = $('body');
			a.animate({
				backgroundColor: $.Color(a.css('backgroundColor')).hue('+=1')
			}, 1000, animate);
		})();




/*		t.wrap 		= $('<div/>', { id: object.name + '-wrap' }).css(css.wrap);
		t.item 		= $('<div/>').css(css.item);
		t.close 	= $('<div/>').css(css.close.normal).html('&times;');
		t.link 		= $('<a/>', { href: object.item.url, target: '_blank' }).css(css.link);
		t.img 		= $('<img/>', { src: object.path + '/bg.jpg' }).css(css.img);

		t.item.appendTo(t.wrap);
		t.close.appendTo(t.item);
		t.img.appendTo(t.link);
		t.link.appendTo(t.item);
		t.wrap.appendTo(object.append);

		t.wrap.delay(object.item.delay)
			.slideDown(object.item.effects.duration, object.item.effects.easing[0]);

		t.close.hover(function() {
				$(this).css(css.close.hover);
			}, function() {
				$(this).css(css.close.normal);
			}
		).click(function() {
			t.wrap.slideUp(object.item.effects.duration, object.item.effects.easing[1], function() {
				self.setStore(object.closePoint, [true, object.date.now()]);
				t.wrap.remove();
			});
		});
*/
	} catch (e) {
		return console.error(e);
	} finally {
		return self.notice(object);
	}
};