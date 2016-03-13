# dekko is advert modules loader 

### basic features
  - module templates structure
  - caching advertised modules in to localStorage
  - fast loading advert elements
  - start and stop at specific date defines
  - position loading and animation


### load methods

```
modules: [ modules array ]
modules: /relative/path/to/modules.json
modules: http://domain.tld/path/to/modules.json?callback=modules
```

### modules structure 	&#128690;	&#128690;	&#128690;
![dekko](https://cloud.githubusercontent.com/assets/2042729/13509896/73c77c8c-e1a7-11e5-948c-13083e3c0b31.jpg)

  
### example preload modules
```js
        	$('body').dekko({
        		cache: true, // cache requests and save browser localStorage (optional)
        		rotate: false,
        		revision: 1,
        		path: '/assets/dekko/modules', // relative path to element modules (required)
        		modules: '/example-data.json',
        		[ // require minimum one array element
        			{
        				'popup-example1' : {
        					context: 'магия', // html data (optional)
        					revision: 102, // cache versioning incremental option (required if cache enabled)
        					url: 'http://ya.ru', // click wrap element (optional)
        					delay: 1000, // wait before show (optional)
        					closeExpire: 2, // closable element option, specific counting by days (required)
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
        			}
        			...
        		]
        	});
```

## modules structure
```
/assets/dekko/modules/module-name1/style_image.jpg
/assets/dekko/modules/module-name1/default.js
/assets/dekko/modules/module-name2/style_image.jpg
/assets/dekko/modules/module-name2/default.js
```

### Changelog
    0.1.1 beta - New option revision and jsonp format modules list.
    0.1.0 beta - Fixes.
    0.0.9 beta - Added added new param rotate.
    0.0.8 beta - Added modulesUrl, removed required $.easing() plugin. Changed module template.
    0.0.7 beta - Added new option elements.storeVersion and removed $.cookie() plugin
    0.0.6 beta - init version


