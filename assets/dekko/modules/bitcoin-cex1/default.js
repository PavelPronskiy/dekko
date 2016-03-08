/**
 * updated ver 0.16
 * banner element template
**/

window.dekkoModule = function (object) {

	var css = {
		wrap: {
			'display' 					: 'none',
			'width' 					: '728px',
			'height' 					: '90px',
			// 'background' 			: 'url(' + object.path + '/bg.jpg) no-repeat left top',
			'-webkit-box-shadow'	 	: '0px 0px 10px rgba(50, 50, 50, 0.6)',
			'-moz-box-shadow' 			: '0px 0px 10px rgba(50, 50, 50, 0.6)',
			'box-shadow' 				: '0px 0px 10px rgba(50, 50, 50, 0.6)',
		},
		item: {
			'position' 					: 'relative',
			// 'border'					: '1px solid green',

		},
		link: {
			// 'border'					: '1px solid red',
			'text-decoration'			: 'none',
			'display'					: 'inline-block'
		},
		img: {
			
		},
		close: {
			normal: {
				'border'				: '1px solid #fff',
				'position' 				: 'absolute',
				'padding' 				: '0px 0px 0px 0px',
				'top' 					: '2px',
				'right' 				: '2px',
				'z-index' 				: '1px',
				'text-align' 			: 'center',
				'line-height' 			: '8px',
				'height' 				: '11px',
				'color'					: '#fff',
				'cursor' 				: 'pointer',
				'font-family'			: 'verdana, sans-serif',
				'font-size'				: '12px',
			},
			hover: {
				'color'					: '#000',
				'border'				: '1px solid #000'
			}
		}
	},
	t = {},
	$this = this;


	try {

		t.wrap = $('<div/>', { id: object.name + '-wrap' }).css(css.wrap);
		t.item = $('<div/>').css(css.item);
		t.close = $('<div/>').css(css.close.normal).html('&times;');
		t.link = $('<a/>', { href: object.item.url, target: '_blank' }).css(css.link);
		t.img = $('<img/>', { src: object.path + '/bg.gif' }).css(css.img);

		t.item.appendTo(t.wrap);
		t.close.appendTo(t.item);
		t.img.appendTo(t.link);
		t.link.appendTo(t.item);
		t.wrap.appendTo(object.globElement);

		t.wrap.delay(object.item.delay)
		.slideDown(object.item.effects.duration, object.item.effects.easing[0], function() {
				// console.log(this);
		});

		t.close.hover(function() {
				$(this).css(css.close.hover);
			}, function() {
				$(this).css(css.close.normal);
			}
		).click(function() {
			t.wrap.slideUp(object.item.effects.duration, object.item.effects.easing[1], function() {
				// $this.setCookie(object.name, false);
				t.wrap.remove();
			});
		});

		$this.console('info', 'Element: ' + object.name + ' 1 loaded');

	} catch (e) {
		return $this.errorException(e); // return callback exception
	}
	
};
