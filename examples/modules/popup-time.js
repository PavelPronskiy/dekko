/**
 * updated ver 0.18 with countdown
 * popup element template
**/
(function ($) {

	if (typeof jQuery.fn.countdown !== 'function') {
		$.fn.countdown = function(prop){

			var days	= 24*60*60,
				hours	= 60*60,
				minutes	= 60;
			
			var options = $.extend({
				css			: {},
				name		: '',
				callback	: function(){},
				timestamp	: 0
			},prop);
			
			var left, d, h, m, s, positions;

			init(this, options);
			
			positions = this.find('.position');
			
			(function tick(){
				
				var ts = new Date(options.timestamp).getTime();
				var tn = (new Date() / 1000);
				var left = Math.floor(ts - tn);
				
				if(left < 0){
					left = 0;
				}
				
				d = Math.floor(left / days);
				updateDuo(0, 1, d);
				left -= d*days;
				
				h = Math.floor(left / hours);
				updateDuo(2, 3, h);
				left -= h*hours;
				
				m = Math.floor(left / minutes);
				updateDuo(4, 5, m);
				left -= m*minutes;
				
				s = left;
				updateDuo(6, 7, s);
				
				options.callback(d, h, m, s);
				
				setTimeout(tick, 1000);
			})();


			function init(elem, options){
				$.each(['days', 'hours', 'minutes', 'seconds'], function(i) {
					$('<span id="' + options.name + '-timer-' + this + '">').html('<span class="position" style="float:left;display:block;position:relative;border:0px solid black;overflow:hidden;width:11px;height:22px">' + 
							'<span class="digit static" style="position:absolute;width:10px">0</span>' + 
						'</span>' + 
						'<span class="position" style="display:block;position:relative;border:0px solid black;overflow:hidden;width:11px;height:22px">' + 
							'<span class="digit static" style="position:absolute;width:10px">0</span>' + 
						'</span>').appendTo(elem).css(options.css[this]);


				});
			}

			function updateDuo(minor,major,value){
				switchDigit(positions.eq(minor),Math.floor(value/10)%10);
				switchDigit(positions.eq(major),value%10);
			}
			
			return this;
		};


		function switchDigit(position,number) {
			
			var digit = position.find('.digit');
			
			if(digit.is(':animated')){
				return false;
			}
			
			if(position.data('digit') == number) {
				return false;
			}
			
			position.data('digit', number);
			
			var replacement = $('<span>', {
				'class':'digit',
				css: {
					'font-family'		: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
					'font-size'			: '14pt',
					display				: 'inline-block',
					top 				: '-10px',
					opacity 			: 0
				},
				html:number
			});
			
			digit.before(replacement).animate({top:'10px',opacity:0},'fast',function(){
					return digit.remove();
				});

			replacement.delay(100).animate({top:0,opacity:1},'fast',function(){
					// return replacement.addClass('static');
				});
		}
	}
	
	// dekko example
	window.dekkoModule = function (object) {
		var t = {},
		self = this,
		date = {
			now: function() {
				return Math.round(new Date().getTime() / 1000);
			}
		},
		eventOneStart = true,
		cnt = 0,
		css = {
			wrap: {
				'position' 				: 'fixed',
				'display' 				: 'none',
				'width' 				: '283px',
				'height' 				: '319px',
				'z-index' 				: '999999',
				'cursor' 				: 'default',
				// 'cursor' 				: 'pointer',
				'background' 			: "url('data:image/gif;base64,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
				// 'background' 			: 'url(' + object.path + '/bg.gif) no-repeat left top',
				'-webkit-box-shadow' 	: '0px 0px 10px rgba(50, 50, 50, 0.6)',
				'-moz-box-shadow' 		: '0px 0px 10px rgba(50, 50, 50, 0.6)',
				'box-shadow' 			: '0px 0px 10px rgba(50, 50, 50, 0.6)'
				// 'outline' 			: '1px solid red',
			},
			wrapHover: {
				'cursor'				: 'pointer'
			},
			wrapNormal: {
				'cursor'				: 'default'
			},
			item: {
			},
			head: {
				'height' 				: '25px'
				// 'outline' 				: '1px solid green'
			},
			body: {
				'position' 				: 'relative',
				'width' 				: '100%',
				'height' 				: '290px',
				// 'outline' 				: '1px solid red',
				'padding'				: '0px',
				'margin'				: '0',
				'text-align' 			: 'center',
				'color' 				: '#fff',
				'font-size' 			: '12pt'

			},
			link: {
				normal: {
					'z-index' 			: '0',
					'position'			: 'absolute',
					'display'			: 'block',
					'bottom'			: '5px',
					'left'				: '15px',
					'width' 			: '169px',
					'height' 			: '28px',
					// 'background'		: 'url(' + object.path + '/button-more.png) no-repeat 50% 93%',
					'background'		: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKkAAAAcCAYAAAAa0p/pAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkEyRUE1RTQ0NzhFMTFFN0JBMjc5RTU0NTM1MTk0M0IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkEyRUE1RTU0NzhFMTFFN0JBMjc5RTU0NTM1MTk0M0IiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGQTJFQTVFMjQ3OEUxMUU3QkEyNzlFNTQ1MzUxOTQzQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGQTJFQTVFMzQ3OEUxMUU3QkEyNzlFNTQ1MzUxOTQzQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgSdGoUAAA06SURBVHja7Fx7jJTVFT/fzM5rH8wssICgLIpKUQtYSJo0wvqgam3VvrSJETGSmjZqSRubNqndKtW/2rRp06aNjQbFmGoTW9C2aiu44FuQ3S3u1geyi7xhYQdW9jE78/X3u3vu7N2P2TdrUztnczPf437nnnvu757XN7Oe7/uy1YvJULQk17UIH19EW4o2FY3nYSlSkUZHWbR6tCNoW9D+ujUUr1/idw/5kDcUSAHOFfhYhVZT1G+RJojq0B4Sz1s3KpACnHPw8Tu0q3nes3eftP95vaT/9nfJHD4infUN4mezRfUWaVTkhcOSWLRQIlVTJXnNFyT1leslOmumvf0s2rcB1pZhQQqALsbHn9DOzhw4KPvuXSNHHlpbBGWRJgS0U1fdKjPvrZXIjOm8tAvtBgB126AgVYBu5XH62edl5403Sa6jo6jNIk0ohcrLZe6Tj0vy6ivzttIFasixoGfhYz2PD/7qN/LeNdcVAVqkj4WIM+KNuFNaL75/1ikg1Rh0VvuGZ2TP3T8oaq5IHzsRd8Qfcah47Hf3QC2z+EeZIL190cWSTaeLGivSf4XCyaRcuGO7TahuYdZvLSnLTLL/pw98LACNzqmW8pplUobmpZLifwKV7c4xh/OJnmPpogVmrDg+c//DeiP+iEMXl+Lncpeg+d0trf7WcMJ/U6Jjam1P/cXPZbN+Y81y/1Wcv4H2VqrKz7Qd9XvQtuB8+5zz/PaNm0w/23ra2vzmlav8V/SZtN5n/9eUdzN48lpL7X3+y9rPjkv+vPcKxrL996CfO4bbjoL/S+jTNATPQs3KMFjb7Mh76OG1p8yx3tGL5ZkO6MK2XY5Mhe7vB//XMN/XVccd27YPuH8c529A1685Yw0mtx3rQ9VZY0BOXjumOnt9CJmDei3UGgrooFAjDolH4pL4LAFOP0+wHn38j+MqM+1H0Ft5/bUydfUdcqiuTsrFk9T110kYlvLd++6X47AlUxYukEnY7XseWSe70EphbRb84mcy7+EHZdP6DZJoT+etQBr9J4FHwrFCfC/xEc4qcJ2CJzEe+ZNiOD7xyGNSymfrtkg3xszg+MyVK8w4TTj3cN7V2mp4JAfhORhZGY7UbZbDL242vEizlX87eqRw9ZzaH8lUXDte3yBNax6QJOY8/yf3yPynnpCX535K4phjJMCzGbKRysCH/DodmUgnW1qlBfriWdWly2Q6+nBuH9x2u8x76kljRQ9Af+9hDeauvlNmQu9nQ6f/uvwqow/7atDlY+U/hvl0Sd+rINFxOX6Z06cX7bjRmXeKzLZPZ0CvQT2Za60tRpaE81xBXQOHxOOMH36fp5dzXZYaUPzzhXGZ6Q4IxQnPgILehrIzLbul6jt3mns7H11nJte2/mnZuvizcgALaJRWJ7KrulrOxyKWYDG767bk+VFx5YExqKweZoN6PmXlivy9KoD0EBYghumfoILQOjHqZCwqQVS/5n6j+Jhp3qA8h6ODUHwTeMV18acq/y7lkcT8SZuuuEpy7e1yFOCJYSOds/ouSWCDdkMHJbpIdsEbwI8LNx33CdKgTB8BAI3oQ8B9sEbksp3vyHTMtxl8uem5ITZ/9UYzN65D2bbXZQrHwv0INkW4AB+7IftA06+PHqMTH3/913K6mbMFZI44Gbir16CeRPtG0McbgZ6Pb3rRgnQpec8zFuWdd8dX60I7DEtGOrf2HokwRkLbj0XiDo5DNAqZqW80FrKSlhZtGhbZgBwKzBrljDDAxgLQcnOBjqGdCXDkUimzwJSFykk61jGqoOeYpYGyxqgK0A7vSoe/VTznTCuSAUArcM4+HetNxioV3IiYYXBDlKhs5cqlkGyUn3qbjJYF7wjmGgc/0l4AP6L3Od5RnJs4FfczgXg46vRj4zziw1i2QmRlrnTW0tVrUE9s9AyxEY7V1dRsDy/gWFU84uvOcb09oOuAJeuEu5sJ8MTUDe8CcCNqwcLaZsBaTFl5s8RgRWOwQrv5HICccHbZ0o3PG0WETMaXGuAeSSm1WC2PPmZ2eOWihTJNXb47ludsoohuFBdUxhWjGasKq9OGTbX7e9jBOA4NMs+wWoWow8cLhAZhtSxRx9pYy52Tgd/OsbKVFOBlLBAy3ipYRi745JqlUoG57oOcOWc8q+OIYyV9Y/36rWIKoHX1SqPSBt278/w0wq9cum/uQ4GpxuFDakJo4eq7GmtMA2S9hh1rpJvBwWNVyWktH6Dt+zXiIkyUbv8jAI/KnOQozirPuBBYhJhUoy9BnZJwe3pAn968Evy827HEeLTPimzoAwHGPAPXjkARiWHiS5cOweodgmsKO/Eex92JeC8xDosbKgBg6+LtZksCeLS6w1EKoCS4xIkt30a8W5pM5vkWAlVwvH7gwgoCsOcibvWqZ8uBNQ8MzLBV114gdg7G6L2Ofk44MbQbJvQqn5Ma65bK6L8+x7U8jDaTL/1ZJz0d1jQDa0p31AzAho3Z9wYIRiDRelLws2v7LBkTnGP9bxzkhcuvzFsGxlefcxapRF09XersW1YYa8VjJgwNdPkA+0hByuC+WWMnG+/RIjdAtohawokqUZkYEHKHhtkM7QhntsG6R7REw3POb3LNslGN2d7QaPTKzUejsHznv2U2Eq33MX9rALZjnDZsHOslrs12FeTlro+oFXeJCdoO1WtIgZYYRVBBPNol4rPvEKSxeeePG6RmhwEg3UiaIotSRtCygFu0ViahLs4mS3Rp3U5MyslX6MSCsVqlunpuhAvVVbsJVIe6fG+EG8vGTgYEAA0ToW61AqMFaResHN2qH6hh2sTFZtblCrDDmH94GJBmAEwCp0L1YmX1Wnf3WeRFA8crg+W1cX4koIeo6jWKdaKsDB
					// 'margin-top'		: '5px',
					// 'background-color'	: 'brown',
					'text-shadow'		: 'none',
					'text-decoration'	: 'none',
					// 'border'			: '1px solid green',
					'color'				: '#fff'
				},
				hover: {
					// 'background-color'	: 'black',
					'background'		: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKkAAAAcCAYAAAAa0p/pAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDcwM0UzN0M0NzhGMTFFN0E3NUZEODQ5OUQ1M0Y5NEEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDcwM0UzN0Q0NzhGMTFFN0E3NUZEODQ5OUQ1M0Y5NEEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowNzAzRTM3QTQ3OEYxMUU3QTc1RkQ4NDk5RDUzRjk0QSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowNzAzRTM3QjQ3OEYxMUU3QTc1RkQ4NDk5RDUzRjk0QSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrZPnMkAAA2iSURBVHja7Fx7cJTV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
					'text-shadow'		: 'none',
					'color'				: '#fff',
					'text-decoration'	: 'none'
					// 'border'			: '1px solid green',
				}
			},
			close: {
				normal : {
					'z-index' 			: '1',
					'position' 			: 'absolute',
					'top'	 			: '6px',
					'right' 			: '0px',
					'width' 			: '22px',
					'height' 			: '21px',
					'cursor' 			: 'pointer',
					'text-decoration'	: 'none',
					// 'border'			: '1px solid green',
					'background' 		: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAVCAYAAABCIB6VAAAEDklEQVR42oSUX2hbVRjAv3tvki5ZbNqmNlujpMoI2NZpHsQxKAqyF58mOEEY9MGHVvFh0Jexh2oFGYNRBBmj+FDBoZWAuEntQkEcoU1N2rRC0z9rm9HRhsbQpvl/8+8ev+9wbrg2BQ98nMO93/f7/p3zSXBi7e7uNs7lctnT0tLyvqZpPvFps1QqBXp7e2Ooxzwej0S70R6/8d10ElytVmm7gLARi8UybLVaAeGNf4qi3N3Y2Pg5k8ncx09BAm1vbzP4nyWtrq7eWF9fZ4eHh4wWOmD1ep3VajUudD4+PmYIZ8vLy1+gjZnsDNIMXVxc/CwWizFVVTmUQJVK5VTBknD4/Pz8lyJzJRqNNkP9fn/rwsICKxQKPEoyDvwdZ4nDDMNaN+TXyFOWzhX4mXQjkQibmJjoE5HLetSyTm5vb/+0s7MTbDYbIBSexJ7D7YdL8H3wKaSyJUBn8HjlGXz1Sxh+DG1DXq2ALMvgdDqhu7t72AD+T/MkhF3v6uriDcI64l6DUrEK385uwXoiB07s3+/RZ5CtKVBnJpAkmTsjsNls/tztdo/t7+9ryKJGagpRJycnnXa7/W5fXx+PFssLnhdbobvVCuHNFIQ2jyAaP4JcSYNbH7wFn7zrhTNmiYMp6kQiAQ6H43EwGEwgrk5wHjoqnKedgNgwbkDy3sWXoFUqg5ovgVqRQa2a4cNLPWCWNZ6Zrkd2JpPJJSogN2qcTCaPsRFcicqgyzf+OdjaTUKdylOjfwxu/RCG5FGWB6DrFYtFwOtZaAJPT0+ncrkc4DXj3km++y0C9x5G4Z9sDUauvgn3hy6B22GCn/7cgpuTf0E6rzYyTKfTMDMzsyNuBNNLIc3NzWn5fP7ezs4OV6YoPK42wLrDyEeX4cbVN+D6gAduf/w6dFgluHjhPNjP2niG2DBIpVJ/xOPxkoDypei3At//niRJw16vl4N7zrVBj8sB1955DdpsCs/mVZcdXnZaYfBKP1hkRrMEwuEwyR18hVvIUenlN24FlSQUCmUGBgZewBf1tsvl4h9fOdcKVovMAeSMsvG6HaBgnuSIXhqOAP/4+PgDVKcaF1FqRjCHBwKBoM/nc6GRr6OjgwZO45botSdB57C0tAQY5aPR0dGv0TYrwFUBZo1SiPrIs7OzT/r7+yWs22Xqtt4gipAajLWElZUVWFtbezA2NnYHbXICSjWuiHvcmEb6ZKLrYkE5i+VoHxwcvIav8Qq+rC50IKGD3MHBQXBqaurR3t7ekUg9L6SsR0tycszJBvgZFJvYzYZGayJlVUhJ7HUcRvWhoaFTB70mUlHFuSaiMhkHjABXxP+KgGpGkOmUuawrlAVAEVBd9HTrhkCaVhMYPeuXnNLSDY290CeYUbdp/SvAACU3nByteyGSAAAAAElFTkSuQmCC') no-repeat left top"
					// 'background' 		: 'url(' + object.path + '/button-close.png) no-repeat left top'
				},
				hover : {
					'background' 		: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAYAAADwMZRfAAAC5ElEQVR42nRTXUhTYRh+zjk7+5/b2mZjLmkutZh0EwgRCIlZUXQrC+rKFlQQktVdGHURUUE3FbsSvAq8Kbsw0IuUughjYIKWuimWbXVU3HbW2dl21vsdZmjYCw/nPR/v+3zP+/Nx1WoV2y0ejx+hz03CKYKzdpwmDBOexGKxFP4xbouEkgX6PBYE4brZbIbNZoPBYADP86hUKpBlGblcrmK32wei0ej97SSGbf4zk8kUc7lcYCTkQxRFnYSZ2+1GoVAQJEm6NzY21tLV1XVxK5GvqThnNBpjXq8XBqsD8zIPRuZ0OlFXVwdVMCMlc/D5fAgEAkilUheSyWT/DhKSfZcliGYr3i3LGEpImM/xekkqJ+L1TAZDn9L4pog6UTAYZER3KDXM8oVwONxAsh8yFYLJgvHZNUyvKphdK8FmEjE5u4qhDymIJjsO79+LSIMLpJqRiJFIROM47q2BDlpZAy0Wiy6//4wb/Ogi3nxew62vEqrlIoIeB3o7DiJ6tAn5fB5Wq5UR8YqinCRf4KmJFtZIBnZDgBKunGiGsrkJRdFQLBvR0uBDb2czisUiSqWSHscupclaqZo9PE0hxaZAo9WRLagYeT+HiiKjQgkVjcNSRsbo1JJOwqZFJeixRKQSiZEp+UJEGdYgRnA7Po5Hw1NoCnjw/PIx3DjbiplkBtdeTOLlxIJOQmWgvr7+N/lsySRhcHCwmk6n2U+32WLFilTA8kYJT692o6fjAFr9NKGigp9ZFeePH0LI70Qmk0FjY6NESibYJusbm0gkjFTSHEkMCSYbphY30NPZpssvl8v4LuWwkM7jdHtYJ1BVNRcKhX4QwSXCxN+1p+XZR/I+0or7HQ6HviOapun1M2MlUDJzN/1+v0SxI+T37Xg7NfOur6+/ymaz7URgYKNnxtSQr3o8nl9EXqg9xgGCuhvJlkUpsY9uDpISjRqv1Jo4T3jAStj1Ff/HPIQ2JoYwTcjtFvRHgAEAj4Ms1i+DRJgAAAAASUVORK5CYII=') no-repeat left top"
					// 'background' 		: 'url(' + object.path + '/button-close-hover.png) no-repeat left top'
				}
			},
			timer: {
				bg: {
					'position' 			: 'absolute',
					'bottom' 			: '43px',
					'left' 				: '13px',
					'height' 			: '50px',
					'width' 			: '154px',
					// 'border' 			: '1px solid black',
					// 'background-color'  : '#fff',
					'background'		: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJoAAAAyCAYAAACksMKUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjRGMTZCQzY0NzhFMTFFNzkyOTBDQ0U0REM4MzdCMEMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjRGMTZCQzc0NzhFMTFFNzkyOTBDQ0U0REM4MzdCMEMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyNEYxNkJDNDQ3OEUxMUU3OTI5MENDRTREQzgzN0IwQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyNEYxNkJDNTQ3OEUxMUU3OTI5MENDRTREQzgzN0IwQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pj1smuYAAAoJSURBVHja7F1NbBTJ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
					// 'background' 		: 'url(' + object.path + '/timer.png) no-repeat left top'
				},
				text: {
					'font-family'		: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
					'font-size'			: '16pt',
					'font-weight'		: 'bold',
					'color' 			: '#1d80c2'
				},
				days: {
					'font-family'		: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
					'font-size'			: '16pt',
					'font-weight'		: 'bold',
					'border' 			: '0px solid black',
					'text-align'		: 'center',
					'width'				: '28px',
					'position'			: 'absolute',
					'left'				: '5px',
					'top'				: '18px'
				},
				hours: {
					'font-family'		: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
					'font-size'			: '16pt',
					'font-weight'		: 'bold',
					'border' 			: '0px solid black',
					'text-align'		: 'center',
					'width'				: '28px',
					'position'			: 'absolute',
					'left'				: '45px',
					'top'				: '18px'
				},
				minutes: {
					'font-family'		: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
					'font-size'			: '16pt',
					'font-weight'		: 'bold',
					'border' 			: '0px solid black',
					'text-align'		: 'center',
					'width'				: '28px',
					'position'			: 'absolute',
					'left'				: '84px',
					'top'				: '18px'
				},
				seconds: {
					'font-family'		: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
					'font-size'			: '16pt',
					'font-weight'		: 'bold',
					'border' 			: '0px solid black',
					'text-align'		: 'center',
					'width'				: '28px',
					'position'			: 'absolute',
					'left'				: '125px',
					'top'				: '18px'
				}
			}
		};


	try {

		// console.log(object.date.end + ' ' + date.now());

		t.widthAnim 			= parseInt(css.wrap.width.replace(/px/gi,''), 10);
		t.heightAnim 			= parseInt(css.wrap.height.replace(/px/gi,''), 10);
		t.horizOpts 			= (object.item.position.left) ? parseInt(object.item.position.left.replace(/px/gi,''), 10) : parseInt(object.item.position.right.replace(/px/gi,''), 10);
		t.vertOpts 				= (object.item.position.bottom) ? parseInt(object.item.position.bottom.replace(/px/gi,''), 10) : parseInt(object.item.position.top.replace(/px/gi,''), 10);
		t.posWrapHorizStart 	= (object.item.position.left) ? { 'left': '-' + css.wrap.width } : { 'right': '-' + css.wrap.width };
		t.posWrapVertStart		= (object.item.position.bottom) ? { 'bottom': '-' + css.wrap.height } : { 'top': '-' + css.wrap.height };
		t.posWrapHorizAnimate 	= (object.item.position.left) ? { 'left': '+=' + ( t.widthAnim + t.horizOpts ) + 'px' } : { 'right': '+=' + ( t.widthAnim + t.horizOpts ) + 'px' };
		t.posWrapVertAnimate 	= (object.item.position.bottom) ? { 'bottom': '+=' + ( t.heightAnim + t.vertOpts ) + 'px' } : { 'top': '+=' + ( t.heightAnim + t.vertOpts ) + 'px' };
		t.wrap 					= $('<div/>', { id: object.name + '-wrap' }).css(css.wrap);
		t.item 					= $('<div/>', { id: object.name + '-item' }).css(css.item);
		t.head	 				= $('<div/>', { id: object.name + '-head' }).css(css.head);
		t.body	 				= $('<div/>', { id: object.name + '-body' }).css(css.body); //.html(object.item.context);

		t.link	 				= $('<a/>', { id: object.name + '-link', href: object.item.url, target: '_blank' }).css(css.link.normal);

		t.close		 			= $('<a/>', { id: object.name + '-close' }).css(css.close.normal);
		t.animPosOpts 			= $.extend(t.posWrapVertAnimate, t.posWrapHorizAnimate);
		t.wrapPosOpts 			= $.extend(t.posWrapVertStart, t.posWrapHorizStart);

		// timer countdown
		t.timerBg				= $('<div/>', { id: object.name + '-timer-bg' }).css(css.timer.bg); //.html(object.item.context);
		t.timerText				= $('<div/>', { id: object.name + '-timer-text' }).css(css.timer.text); //.html(object.item.context);
		t.timerBg.appendTo(t.wrap);
		t.timerText.appendTo(t.timerBg);

		t.head.appendTo(t.wrap);
		t.body.appendTo(t.wrap);
		t.close.appendTo(t.head);
		t.link.appendTo(t.body);
		// t.item.appendTo(t.wrap);


		t.wrap.css(t.wrapPosOpts).delay(object.item.delay).show();


		t.close.hover(
			function() { $(this).css(css.close.hover); },
			function() { $(this).css(css.close.normal); }
		).click(function() {
			t.wrap.animate(t.posWrapHorizStart, object.item.effects.duration, object.item.effects.easing[1], function() {
				self.setStore(object.closePoint, [true, object.date.now()]);
				$(this).remove();
			});
		});
		
		
		t.wrap.animate(t.animPosOpts, object.item.effects.duration, object.item.effects.easing[0], function() {
			$(this).css(object.item.position);
		});


		t.link.on('touchstart click', function() {
			return self.clickAdvert(object);
		});

		t.link.hover(
			function() { t.link.css(css.link.hover); },
			function() { t.link.css(css.link.normal); }
		);

		t.timerText.countdown({
			css 		: css.timer,
			name 		: object.name,
			timestamp	: object.date.end,
			callback	: function(days, hours, minutes, seconds){
				var timeNow = new Date().getTime();	

				if (object.date.end < date.now()) {
					if (eventOneStart) {
						eventOneStart = false;
						t.wrap.remove();
					}
				} 


			}
		});

		t.wrap.appendTo(object.append);
	
	} catch (e) {
		return console.error(e);
	} finally {
		return self.notice(object);
	}
};
}(jQuery));
