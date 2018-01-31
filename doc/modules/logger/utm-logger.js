/**
 * ver 0.2
 * log all utm clicks
**/

(function ($) {
	window.dekkoModule = function (object) {

		var local = {};
		local.UTM_Counter = 0;
		local.UTM_ClickerClientStoreKey = this.storePoint.name + object.fingerPrint + this.storePoint.p + object.name;
		local.UTM_Collection = ['utm_medium', 'utm_source', 'utm_campaign', 'utm_content', 'utm_term'];
		local.getURI_Args = function(name) {
			var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
			return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
		};

		try {

			for (var i = 0, len = local.UTM_Collection.length; i < len; i++)
				if (local.getURI_Args(local.UTM_Collection[i]))
					local.UTM_Counter++;

			if (local.UTM_Collection.length == local.UTM_Counter) {
				
				local.UTM_ClickerCount = typeof window.dekkoJS.getStore(local.UTM_ClickerClientStoreKey).utm_click == 'number' ? 
					window.dekkoJS.getStore(local.UTM_ClickerClientStoreKey).utm_click : 0;

				local.UTM_ClickerCount = local.UTM_ClickerCount + 1;

				console.log(document.referrer);

				window.dekkoJS.setStore(local.UTM_ClickerClientStoreKey, {
					'utm_click': local.UTM_ClickerCount,
					'referrer': document.referrer
				});				

				return window.dekkoJS.clickAdvert(object);
			}


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