# dekko is advert modules loader 

jQuery plugins required:
  - jquery 
  - easing (not yet or deprecated in the  future)
  - cookie (deprecated in the future)

### basic features
  - module templates structure
  - caching advertised modules in to localStorage
  - fast loading advert elements
  - start and stop at specific date defines
  - position loading and animation
  
### modules structure 	&#128690;	&#128690;	&#128690;
![dekko](https://cloud.githubusercontent.com/assets/2042729/13509896/73c77c8c-e1a7-11e5-948c-13083e3c0b31.jpg)

  
### example preload modules
```js
        	$('body').dekko({
        		mobile: false, // mobile is off (optional)
        		cache: true, // cache requests and save browser localStorage (optional)
        		console: true, // show notices (optional)
        		path: '/assets/dekko/modules', // relative path to element modules (required)
        // 		elementsUrl: '/example-data.json' // get data elements json
        		elements: [ // require minimum one array element
        			{
        				'popup-example1' : {
        				    type: 'popup', // type of method element (required)
        					context: 'магия', // html data (optional)
        					storeVersion: 8, // cache versioning incremental option (required if cache enabled)
        					url: '/3321/12321.html', // click wrap element (optional)
        					delay: 1000, // wait before show (optional)
        					cookieExpire: 2, // closable element option, specific counting by days (required)
        					date: {
        						start: '2016-02-26 10:00:00', // element more start at (required)
        						end: '2016-04-01 23:59:59' // element not started after this date (required)
        					},
        					effects: {
        						easing: 'easeInOutElastic', // easing (optional)
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
        				    type: 'popup', // type of method element (required)
        					context: 'попап', // html data (optional)
        					storeVersion: 3, // cache versioning incremental option (required if cache enabled)
        					url: '/3321/12321.html', // click wrap element (optional)
        					delay: 5000, // wait before show (optional)
        					cookieExpire: 2, // closable element option, specific counting by days (required)
        					date: {
        						start: '2016-02-26 10:00:00', // element more start at (required)
        						end: '2016-04-01 23:59:59' // element not started after this date (required)
        					},
        					effects: {
        						easing: 'easeInOutElastic', // easing (optional)
        						duration: 700 // easing duration (optional)
        					},
        					position: {
        						left: '15px', // horizontal position (required)
        						bottom: '15px' // vertical position (required)
        					}
        				}
        			},
        			{
        				'popup-example3' : {
        				    type: 'popup', // type of method element (required)
        					context: 'весна', // html data (optional)
        					storeVersion: 1, // cache versioning incremental option (required if cache enabled)
        					url: '/3321/12321.html', // click wrap element (optional)
        					delay: 2000, // wait before show (optional)
        					cookieExpire: 2, // closable element option, specific counting by days (required)
        					date: {
        						start: '2016-02-26 10:00:00', // element more start at (required)
        						end: '2016-04-01 23:59:59' // element not started after this date (required)
        					},
        					effects: {
        						easing: 'easeInOutElastic', // easing (optional)
        						duration: 2000 // easing duration (optional)
        					},
        					position: {
        						right: '15px', // horizontal position (required)
        						bottom: '15px' // vertical position (required)
        					}
        				}
        			},
        			{
        				'popup-example4' : {
        				    type: 'popup', // type of method element (required)
        					context: 'девид блейн', // html data (optional)
        					storeVersion: 1, // cache versioning incremental option (required if cache enabled)
        					url: '/3321/12321.html', // click wrap element (optional)
        					delay: 1000, // wait before show (optional)
        					cookieExpire: 2, // closable element option, specific counting by days (required)
        					date: {
        						start: '2016-02-26 10:00:00', // element more start at (required)
        						end: '2016-04-01 23:59:59' // element not started after this date (required)
        					},
        					effects: {
        						easing: 'easeInOutElastic', // easing (optional)
        						duration: 2000 // easing duration (optional)
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

## modules structure
```
/assets/dekko/modules/module-name1/style_image.jpg
/assets/dekko/modules/module-name1/default.js
/assets/dekko/modules/module-name2/style_image.jpg
/assets/dekko/modules/module-name2/default.js
```

### Changelog
    0.0.8 beta - Added elementsUrl, removed required $.easing() plugin. Changed module template.
    0.0.7 beta - Added new option elements.storeVersion and removed $.cookie() plugin
    0.0.6 beta - init version


