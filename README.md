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


#### code integration

```html

    <!-- dekko advertized platform -->
    <script src="https://dekko.pronskiy.ru/dekko.js" async data-verbose="true" data-cache="false"></script>
    <!--// dekko advertized platform -->

```

## Module advertuzed types ##

 * popup
 * banner
 * bar

## Depends
```
    cjson
    resty/redis
    nginx+luajit
    redis
```


### Module structure example ##

**options example**
```json
// version: 0.3
// type: popup
{
  "geoTargeting":[88,77,32,50,333,334],
  "append": "body",
  "rotate": "true",
  "type": "popup",
  "revision": 109,
  "images": {
    "background": "/examples/images/popup-timer/popup-1.gif",
    "button": "/examples/images/popup-timer/button.png",
    "buttonHover": "/examples/images/popup-timer/button-hover.png",
    "close": "base64 data image",
    "closeHover": "/examples/images/popup-timer/close-hover.png",
    "timer": "/examples/images/popup-timer/timer.png"
  },
  "mobile": {
    "css": {
      "param": "value"
    }
  },
  "url": "http://google.com",
  "delay":                          500,
  "closeExpire":                          2,
  "date": {
    "start": "2017-05-29T12:00:00.000000+04:00",
    "end": "2020-01-01T00:00:00.000000+04:00"
  },
  "effects": {
    "easing": [
      "easeInOutElastic",
      "easeOutElastic"
    ],
    "duration":                          1000
  },
  "position": {
    "left": "15px",
    "bottom": "15px"
  }
}
```

**module function**
```js
(function ($) {
    window.dekkoModule = function (object) {
        ...
    };
}(jQuery));
```

### nginx configuration
```
lua_package_path "/home/dekko/lua/modules/?.lua;;";
lua_shared_dict lastmodified 10m;
lua_shared_dict redisPool 64k;

geo $remote_addr $region {
    ranges;
    default 0;
    include /usr/share/ip2geo/region.txt;
}

geo $remote_addr $countryCode {
    ranges;
    default 0;
    include /usr/share/ip2geo/region.txt;
}

geoip_country /usr/share/GeoIP/GeoIP.dat;


server {
    location = /dekko.json {
        content_by_lua_file '/path/to/dekko.lua';
    }
}

```

### Changelog
## [0.2.3](https://github.com/PavelPronskiy/dekko/tree/0.2.3) (2017-08-08)

- bugfix infinite loop on
- removed deprecated sources and over on dekko.js
- optimizing dekko.js logic
- new style and syntax console.log

## [0.2.2](https://github.com/PavelPronskiy/dekko/tree/0.2.2) (2017-08-01)

- bugfix bug uri '/sa'

## [0.2.1](https://github.com/PavelPronskiy/dekko/tree/0.2.1) (2017-07-26)

**New options JSON structure**

- Param: `object.append` need to bind html element
- New stack error handler `xpcall` in logic.lua
- cjson error pcall
- Added multilang library lang.lua
- Refactoring logic.lua code and dekko.js 

### Old changelog

    0.2.1 beta - Geotargeing by region
    0.2.0 beta - Refactoring dekko.js
    0.1.9 beta - Refactoring lua and migrating to luajit
    0.1.8 beta - Added new param `object.mobile` view adv
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
