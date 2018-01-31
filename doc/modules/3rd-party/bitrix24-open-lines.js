/**
 * ver 0.1
 * bitrix24-open-lines
**/

(function ($) {
	window.dekkoModule = function (object) {
		try {

			(function(w,d,u){
			var s=d.createElement('script');s.async=1;s.src=u+'?'+(Date.now()/60000|0);
			var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
			})(window,document,object.item.url);

			return window.dekkoJS.clickAdvert(object);

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
}(jQuery));