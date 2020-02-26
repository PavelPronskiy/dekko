# Dekko is advertized platform


#### basic features
  - minimal software requirements
  - fastable asynchronous work and minimal server resources yet
  - exceptions handler
  - module templates structure
  - caching revision advertised modules in to localStorage 
  - last-modified and etag on settings and modules
  - fast loading advert elements
  - start and stop at specific date defines
  - position loading and animation
  - ads invisible to adblock


#### code integration

```html

    <!-- dekko advertized platform -->
    <script src="https://example.host/dekko.js" async data-verbose="true" data-cache="false"></script>
    <!--// dekko advertized platform -->

```

## Module ads types ##

 * popup
 * banner
 * bar
 * modal
 * video
 * logger
 * 3rd-party

## Depends
```
    cjson
    resty/redis
    nginx+luajit
    redis3
```


### Module structure example ##

**module.json config example**
```json
[{
  "geoTargeting":[88,77,32,50,333,334],
  "append": "#dekko-popup-thatever",
  "type": "popup",
  "revision": 109,
  "rotate": "true",
  "refresh": 10000,
  "pages": ["/", "/page-1.html", "/page-2.html"],
  "url": "http://google.com",
  "delay": 500,
  "closeExpire": 2,
  "date": {
    "start": "2017-05-29T12:00:00.000000+04:00",
    "end": "2020-01-01T00:00:00.000000+04:00"
  },
  "effects": {
    "easing": [
      "easeInOutElastic",
      "easeOutElastic"
    ],
    "duration": 1000
  },
  "position": {
    "left": "15px",
    "bottom": "15px"
  }
}]
```

**module.js function example**
```js
(function($) {
    window.dekkoModule = function (object) {
      try {


         ...


      } catch (e) {
        return this.exceptionsMessage({
          message: object.name + " " + e,
          status: this.console.dekkothrowError,
          date: (new Date).toISOString()
        });
      } finally {
        return dekkoJS.notice(object);
      }

    };
})(jQuery);
```

**banner.scss style example**
```scss
#module-name {
  .module-style-container {
    
  }
}

```

### Changelog
## [0.3.1] (2019-12-15)

- Stable version.
- Added scss/css module

## [0.3.0.1] (2017-12-18)

- Added new module: modal splash window

## [0.3.0] (2017-09-23)

- New strategy isolation advertized modules - shadow DOM (native only)

## [0.2.9] (2017-09-17)

- Added new options: `videoFile`, `videoPoster`, `scroll`
- Added max refresh option `this.refresh.max: 100`

## [0.2.8] (2017-09-05)

- Refactoring and optimizing memory on dekko.js
- Added max refresh option `this.refresh.max: 100`

## [0.2.7] (2017-08-31)

- Refactoring dekko.js
- Added fingerprint2.js
- Added jQuery easing

## [0.2.6] (2017-08-27)

- Added new module options param: `refresh: seconds`
  This parameter provide online refresh modules. Worked only defined two parameters: `refresh: seconds` and `rotate: "true"`

- Added new module options param: `pages: ["/", "/page2", "/page3", "/etc.."]`
  This param translate modules only path pages defined in array

- Replaced method jQuery `$.ajax` to XMLHTTPRequest
- Refactoring code
- Added new redis incrby: domain.tld:lg 0000-00-00:module-name increment counter
  This parameter count module downloads by day

## [0.2.5] (2017-08-21)

- Added svg close button
- Removed old methods in dekko.js
- Modules popup and banner updates

## [0.2.4] (2017-08-16)

- Support compatible Internet Explorer >=8

## [0.2.3] (2017-08-08)

- bugfix infinite loop if server returned error. This bug fully fixed.
- removed deprecated sources and over on dekko.js
- optimizing dekko.js logic
- new style and syntax console.log

## [0.2.2] (2017-08-01)

- bugfix bug uri '/sa'

## [0.2.1] (2017-07-26)

**New options JSON structure**

- Param: `object.append` need to bind html element
- Geotargeing by region
- New stack error handler `xpcall` in logic.lua
- cjson error pcall
- Added multilang library lang.lua
- Refactoring logic.lua code and dekko.js 

## [0.2.0]

- Refactoring dekko.js

## [0.1.9]

- Refactoring lua and migrating to luajit

## [0.1.8]

- Added new param `object.mobile` view adv

## [0.1.7]

- Added geo targeting by geoip-db.com and many fixes

## [0.1.6]

- Bug fixes.

## [0.1.5]

- Bug fixes.

## [0.1.4]

- Added new features. Redis, Nginx, Lua.

## [0.1.3]

- Added new get method.

## [0.1.2]

- New bugs and fixes.

## [0.1.1]

- New option revision and jsonp format modules list.

## [0.1.0]
- Fixes.

## [0.0.9]

- Added added new param rotate.

## [0.0.8]

- Added modulesUrl, removed required $.easing() plugin. Changed module template.

## [0.0.7]

- Added new option elements.storeVersion and removed $.cookie() plugin

## [0.0.6]

- init version
