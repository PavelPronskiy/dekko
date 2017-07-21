# dekko is advert modules loader 

### basic features
  - lua router
  - module templates structure
  - caching advertised modules in to localStorage
  - fast loading advert elements
  - start and stop at specific date defines
  - position loading and animation


### load methods

```
modules: [ modules array ]
modules: /relative/path/to/modules.json
modules: http://domain.tld/path/to/modules.json
```

### modules structure 	&#128690;	&#128690;	&#128690;
![dekko](https://cloud.githubusercontent.com/assets/2042729/13509896/73c77c8c-e1a7-11e5-948c-13083e3c0b31.jpg)

  
### examples
```js
    // lua redis support
	var dekkoCounter = 0,
		dekkoLoader = setInterval(function() {
		if (typeof jQuery.fn.dekko === 'function') {
			jQuery('body').dekko('/sa', {
				type: 'popup',
				cache: true,
				verbose: true
			});

			jQuery('.example-728x90').dekko('/sa', {
				type: 'banner',
				cache: true,
				verbose: true
			});

			clearInterval(dekkoLoader);
		} else {
			if (dekkoCounter > 10)
				clearInterval(dekkoLoader);
			
			dekkoCounter++;
		}
	}, 200);

    // or static modules
	$('body').dekko({
		cache: true, // cache requests and save browser localStorage (optional)
		rotate: false,
		verbose: true,
		type: 'popup',
		revision: 1,
		path: '/assets/dekko/modules', // relative path to element modules (required)
		modules: '/example-data.json',
		[ // require minimum one array element
			{
				'popup-example1' : {
				    mobile: false, // default false (disable view to mobile devices) // false by default
					context: 'магия', // html data (optional)
					revision: 102, // cache versioning incremental option (required if cache enabled)
					url: 'http://ya.ru', // click wrap element (optional)
					delay: 1000, // wait before show (optional)
					closeExpire: 120, // closable element option, specific counting by minutes (required)
					date: {
						start: '2016-02-26 10:00:00', // element more start at (required)
						end: '2016-04-01 23:59:59' // element not started after this date (required)
					},
					effects: {
						easing: ['easeInOutElastic', 'easeOutElastic'], // easing (optional)
						duration: 1000 // easing duration (optional)
					},
					position: {
						left: '15px', // horizontal position (required)
						top: '15px' // vertical position (required)
					}
				}
			},
			{
				'popup-example2' : {
				    mobile: {
				        // params css etc..
				    },
					geoTargeting: [77, 56, 99], // geo targeting by region code support (maxmind database)
					revision: 102, // cache versioning incremental option (required if cache enabled)
					url: 'http://ya.ru', // click wrap element (optional)
					delay: 1000, // wait before show (optional)
					closeExpire: 120, // closable element option, specific counting by minutes (required)
					date: {
						start: '2016-02-26 10:00:00', // element more start at (required)
						end: '2017-12-01 23:59:59' // element not started after this date (required)
					},
					effects: {
						easing: ['easeInOutElastic', 'easeOutElastic'], // easing (optional)
						duration: 1000 // easing duration (optional)
					},
					position: {
						right: '15px', // horizontal position (required)
						top: '15px' // vertical position (required)
					}
				}
			}

		]
	});

```

## nginx configuration
```
lua_package_path "/path/to/lua/5.1/resty/redis.lua;;";

server {

	location / {
	    if ($request_method = OPTIONS) {
        	add_header 'Access-Control-Allow-Origin' '*';
        	add_header 'Access-Control-Allow-Credentials' 'true';
        	add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        	add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
        	add_header Content-Length 0;
        	add_header Content-Type text/plain;
        	return 204;
        }
	}

	location = /sa {
	    if ($request_method = OPTIONS) {
        	add_header 'Access-Control-Allow-Origin' '*';
        	add_header 'Access-Control-Allow-Credentials' 'true';
        	add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        	add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
        	add_header Content-Length 0;
        	add_header Content-Type text/plain;
        	return 204;
        }
		content_by_lua_file '/path/to/dekko.lua';
	}
}

```
## redis configuration
```
cluster redis

```
## Software deps
```
nginx (geo, lua)
lua-cjson >=2.1.0
redis 3
```
### Changelog
    0.2.0 beta - Geotargeting by region support
    0.1.8 beta - Added new param mobile view adv
    0.1.7 beta - Added geo targeting by geoip-db.com and many fixes
    0.1.6 beta - Bug fixes.
    0.1.5 beta - Bug fixes.
    0.1.4 beta - Added new features. Redis, Nginx, Lua.
    0.1.3 beta - Added new get method.
    0.1.2 beta - New bugs and fixes.
    0.1.1 beta - New option revision and jsonp format modules list.
    0.1.0 beta - Fixes.
    0.0.9 beta - Added added new param rotate.
    0.0.8 beta - Added modulesUrl, removed required $.easing() plugin. Changed module template.
    0.0.7 beta - Added new option elements.storeVersion and removed $.cookie() plugin
    0.0.6 beta - init version


