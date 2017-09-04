
-- Name: Dekko client side
-- Description: dekko data logic
-- Version: 0.2.8 beta
-- Author:  Pavel Pronskiy
-- Contact: pavel.pronskiy@gmail.com

-- Copyright (c) 2016-2017 Dekko Pavel Pronskiy
-- Last update: 05.09.2017

-- Permission is hereby granted, free of charge, to any person
-- obtaining a copy of this software and associated documentation
-- files (the "dekko"), to deal in the Software without
-- restriction, including without limitation the rights to use,
-- copy, modify, merge, publish, distribute, sublicense, and/or sell
-- copies of the Software, and to permit persons to whom the
-- Software is furnished to do so, subject to the following
-- conditions:
 
-- The above copyright notice and this permission notice shall be
-- included in all copies or substantial portions of the Software.
 
-- THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
-- EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
-- OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
-- NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
-- HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
-- WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
-- FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
-- OTHER DEALINGS IN THE SOFTWARE.

local cjson = require "cjson"
local lang = require "lang"
local redis = require "redis"
-- local args = ngx.req.get_uri_args()
local red = redis:new()
local dekko = {}
dekko.ngx = {}
dekko.ngx.lm = ngx.shared.lastmodified
dekko.ngx.rp = ngx.shared.redisPool
dekko.ngx.modules = ngx.shared.dekkoModules
dekko.debug = {}
dekko.debug.stackTrace = true
dekko.redis = {}
dekko.construct = {}
dekko.exception = {}
dekko.protected = {}
dekko.redis.timeout = 1000
dekko.cacheBrowserAge = 86400

dekko.redis.mapPool = {
	["127.0.0.1"] = 6379,
	["127.0.0.2"] = 6379,
	["127.0.0.3"] = 6379,
	["127.0.0.4"] = 6379,
	["127.0.0.5"] = 6379,
	["127.0.0.7"] = 6379,
	["127.0.0.8"] = 6379
}

dekko.redis.prefix = {
	["redispool"] = "redispool",
	["settings"] = "ss",
	["lastModified"] = ":lastmodified",
	["ETag"] = ":etag",
	["modules"] = "ms",
	["log"] = "lg",
	["clicks"] = "cs",
	["counter"] = "cr",
	["hosts"] = "hs",
	["rev"] = "r"
}

function dekko.ngx.accessControlHeader()
	-- ngx.header["Access-Control-Allow-Origin"] = object.schemeDomain
	ngx.header["Access-Control-Allow-Origin"] = '*'
	ngx.header["Access-Control-Allow-Methods"] = "GET, OPTIONS"
	ngx.header["Access-Control-Allow-Headers"] = "x-requested-with, Content-Type, origin, authorization, accept, client-security-token, If-None-Match, If-Modified-Since, Cache-Control"
	ngx.header["Access-Control-Allow-Credentials"] = "true"
	ngx.header["Access-Control-Max-Age"] = dekko.cacheBrowserAge
end

function dekko.ngx.headers(object)

	local policy = {}
	local k = {}

	    if object.type == 'script'
	  then ngx.header["Content-Type"] = "text/javascript"
	elseif object.type == 'json'
	  then ngx.header["Content-Type"] = "application/json"
	  else ngx.header["Content-Type"] = "application/json"
	   end

	    if object.mhash ~= nil and object.cache == true
	  then k.et = dekko.cacheBrowser('etag', object.mhash .. dekko.redis.prefix.ETag)
		   k.lm = dekko.cacheBrowser('lastmodified', object.mhash .. dekko.redis.prefix.lastModified)
		   ngx.header["ETag"] = k.et
	       ngx.header["Last-modified"] = k.lm
	  else ngx.header["Cache-Control"] = "no-cache"
		   ngx.header["Pragma"] = "no-cache"
		   ngx.header["Expires"] = "0"
	   end

	ngx.status = ngx.HTTP_OK
	ngx.header["Cache-Control"] = "public"
	return dekko.ngx.accessControlHeader()
end

-- split string 127.0.0.1:1234
function dekko.splitHost(s)

	local result = {};
	for match in (s..":"):gmatch("(.-)"..":") do
		table.insert(result, match)
	end
	return result
end

function dekko.gsplit(str,sep)
   local ret={}
   local n=1
   for w in str:gmatch("([^"..sep.."]*)") do
      ret[n] = ret[n] or w -- only set once (so the blank after a string is ignored)
      if w=="" then
         n = n + 1
      end -- step forwards on a blank but not a string
   end
   return ret
end

function dekko.getParams(s)

	local result = {};
	local g = dekko.gsplit(s,'&')
	for i,v in pairs(g) do
		t = dekko.gsplit(v,"=")
		result[t[1]] = t[2]
	end
	return result
end

function dekko.validateArgs(argument)
	local r = false
	  if argument:match('[\";\']') ~= nil
	then r = true
	 end

	return r
end

function dekko.decodeParams(str)
	return (str:gsub('..', function (cc)
		t = tonumber(cc, 16)
		if t ~= nil
		then return string.char(t)
		end
	end))
end

function dekko.redis.hgetall(object)
	local data = {}
	local o = {}

	local hgetall, err = red:hgetall(object.hash)
	  if not hgetall
	then dekko.exception.throw({
			code = 109,
			message = err
		 })
	 end

	  if #hgetall == 0
	then o.type = 'json'
		 dekko.ngx.headers(o)
		 ngx.say('{}')
		 return ngx.exit(ngx.HTTP_OK)
	end

	  if type(hgetall) ~= "table"
	then dekko.exception.throw({
			code = 114
		 })
	 end

	for i, v in pairs(hgetall)
	do if i % 2 == 1
	 then n = v
	 else data[n] = v
	  end
	end

	-- red:close();
	return data
end

-- return date headers by last-modified and etag
function dekko.cacheBrowser(type, hash)

	local b = {}

	if type == 'etag' then
		b.now = ngx.md5(ngx.time())
	elseif type == 'lastmodified' then
		b.now = ngx.time()
	end
	
	b.last = dekko.ngx.lm:get(hash)
	b.date = b.now
	  if b.last == nil
	then dekko.ngx.lm:set(hash, b.now)
		 b.date = b.now
	else b.date = b.last
	end
	
	  if type == 'lastmodified'
	then b.date = ngx.http_time(b.date)
	end
	-- return
	-- return ngx.http_time(b.date)
	return b.date
end

-- finally output data
function dekko.construct.message(o)
	dekko.ngx.headers(o)
	return ngx.print(o.json)
end

-- geotargeting by region integer code
function dekko.geoRegionBoolean(regions)
	
	local bool
	local clientRegion = tonumber(ngx.var.region)

	-- check geotargeting option exist and not empty
	 if regions ~= nil
	and type(regions) == 'table'
	and #regions > 0 then
		for i = 1, #regions do
			if tonumber(regions[i]) ~= nil then
				-- check client region and geotargeting option
				  if clientRegion == regions[i]
				then return true
				else bool = false
				end
			end
		end

	else
		-- geotargeting not defined by options
		bool = true
	end

	return bool
end

-- json arrays syntax protected
function dekko.protected.JSONdecode(o)
	local success, resource = pcall(cjson.decode, o)
	if not success
	then dekko.exception.throw({
		code = 110
		})
	else return resource
	end
end

-- json arrays syntax protected
function dekko.protected.JSONencode(o)
	local success, resource = pcall(cjson.encode, o)
	if not success
	then dekko.exception.throw({
		code = 111
		})
	else return resource
	end
end
-- get keyhash modules settings
function dekko.construct.settings(object)

	local o = {}
	local msg = {}
	o.opts = {}
	o.revs = {}

	for i, s in pairs(dekko.redis.hgetall(object))
	do
		if   type(s) ~= 'string'
		then dekko.exception.throw({
				code = 113
			})
		end

		o.decode = dekko.protected.JSONdecode(s)
		o.continue = false
		o.decode.images = {}

		if 	 tonumber(o.decode.revision) ~= nil
		then o.decode.revision = tonumber(o.decode.revision)
		else o.decode.revision = 1000
		end

		if 	 o.decode.name ~= nil
		then o.decode.name = o.decode.name
		else o.decode.name = i
		end

		if   o.decode.geoTargeting ~= nil
		and  dekko.geoRegionBoolean(o.decode.geoTargeting) == true
		then o.continue = true
		end

		if   o.decode.geoTargeting == nil
		then o.continue = true
		end
		
		if   o.continue == true
		then table.insert(o.opts, o.decode)
			 table.insert(o.revs, o.decode.revision)
		end
	end

	o.revs 		= string.format("%s", table.concat(o.revs, ':'))
	o.revHash 	= ngx.crc32_short(o.revs)
	o.json 		= dekko.protected.JSONencode(o.opts)
	o.header 	= object.header
	o.domain 	= object.domain
	o.mhash 	= object.hash .. ':' .. o.revHash
	o.cache 	= object.cache

	return dekko.construct.message(o)
end
-- 
function dekko.countViews(object)

	local t = {}

	t.today = ngx.today()
	t.key = object.domain .. ':' .. dekko.redis.prefix.log
	t.hey = t.today .. ':' .. object.module

	return red:hincrby(t.key, t.hey, 1)
end
-- get keyhash modules
function dekko.construct.modules(object)

	local o = {}
	local t = {}
	
	t.module, err = red:hmget(object.hash, object.module)
	t.module = t.module[1]
	t.module = tostring(t.module)


	  if (string.len(t.module) <= 14) -- length 14 is empty data of redis
	then dekko.exception.throw({
			code = 112,
			type = 'script'

		 })
	end

	t.hash = ngx.crc32_short(string.len(t.module))

	o.type = object.header
	o.domain = object.domain
	o.json = t.module
	o.mhash = object.mhash .. ':' .. t.hash
	o.module = object.module
	o.cache = object.cache

	dekko.countViews(o)

	return dekko.construct.message(o)
end

function dekko.construct.counter(object)
	local msg = {}
	local t = {}
	msg.header = object.header
	msg.json = '{}'
	msg.mhash = nil

	t.name = object.module

	  if (type(ngx.var.http_referer) ~= nil)
	then t.referer = ngx.var.http_referer
	else t.referer = ''
	end

	  if (type(ngx.var.http_user_agent) ~= nil)
	then t.userAgent = ngx.var.http_user_agent
	else t.userAgent = ''
	end

	t.geo = {}
	t.geo.country = {}
	t.geo.country.code = object.lang
	t.geo.region = tonumber(ngx.var.region)
	t.geo.clientIP = ngx.var.remote_addr

	local res, err = red:hmset(object.hash.hosts, object.hash.hostkey, cjson.encode(t))
	if not res
	then dekko.exception.throw({
			code = 109
		})
	end

	-- red:close();
	return dekko.construct.message(msg)
end

-- route objects
function dekko.router(object)

	if object.route == 'settings' then
		return dekko.construct.settings(object)
	end

	if object.route == 'modules' then
		return dekko.construct.modules(object)
	end

	if object.route == 'counter' then
		return dekko.construct.counter(object)
	end
end

-- redis connect
function dekko.combine(o)
	local target = false
	local msg = {}
	local rs = {}

	rs.ord = {}
	rs.hp = {}
	rs.lastRedisHost = dekko.ngx.rp:get(dekko.redis.prefix.redispool)

	red:set_timeout(dekko.redis.timeout)

	 for host, port in pairs(dekko.redis.mapPool)
	  do table.insert(rs.ord, host)
	 end

	  if #rs.ord == 0
	then dekko.exception.throw({
			code = 116
		 })
	end

	  if rs.lastRedisHost ~= nil
	then rs.lastRedisConnection = dekko.splitHost(rs.lastRedisHost)
		 rs.hp.host = rs.lastRedisConnection[1]
		 rs.hp.port = rs.lastRedisConnection[2]
		 local status, err = red:connect(rs.hp.host, rs.hp.port)
		   if status
		 then target = true
		 else target = false
		  end
	end

	  if target == false
	then for host, port in pairs(dekko.redis.mapPool)
		  do local status, err = red:connect(host, port)
		   		if status
			  then rs.hostOnline = host .. ':' .. port
			       target = true
				   return dekko.ngx.rp:set(dekko.redis.prefix.redispool, rs.hostOnline)
			   end
		 end
	end

	 if target == true
   then dekko.router(o)
   else dekko.exception.throw({
			code = 108
		})
	end

	-- return red:close();
end

-- route
function dekko.route()

	   if ngx.var.args == nil
	 then dekko.exception.throw({
			code = 103
		  })
	  end
	
	local ngxargs = ngx.req.get_uri_args()

	if   ngxargs.d ~= nil
	then args = ngxargs
	else params = dekko.decodeParams(ngx.var.args)
		 args = dekko.getParams(params)
	end

	local opts = {}
	-- local params = dekko.decodeParams(ngx.var.args)
	-- local args = dekko.getParams(params)

	
	opts.domain = args.d
	opts.fingerprint = args.f
	opts.timestamp = tonumber(args.c)

	    if type(ngx.var.geoip_country_code) == 'string'
	  then opts.lang = ngx.var.geoip_country_code
	  else opts.lang = 'EN'
	   end
	   
	    if opts.fingerprint == nil
	  then dekko.exception.throw({ code = 107 }) 
	   end

	    if opts.domain == nil
	  then dekko.exception.throw({ code = 107 }) 
	   end

	    if args.n == nil
	  then opts.cache = true
	  else opts.cache = false
	   end

	-- get advert options URI: url?f=fingerprint
	    if args.d ~= nil 		-- domain
	   and args.m == nil 		-- !module
	   and args.c == nil 		-- !click
	  then opts.route = 'settings'
		   opts.header = 'json'
		   opts.hash = opts.domain .. ':' .. dekko.redis.prefix.settings

	-- get modules scripts widgets URI: url?f=fingerprint&m=module-name
	elseif args.c == nil 		-- !click
	   and args.d ~= nil 		-- domain
	   and args.m ~= nil 		-- module
	  then opts.route = 'modules'
		   opts.module = args.m
		   opts.header = 'script'
		   opts.hash = opts.domain .. ':' .. dekko.redis.prefix.modules
		   opts.mhash = opts.domain .. ':' .. dekko.redis.prefix.modules .. ':' .. opts.module
			
	-- post click counter URI: url?c=timestamp&f=fingerprint&m=module-name
	elseif opts.timestamp ~= nil -- timestamp click
	   and args.d ~= nil 		 -- domain
	   and args.m ~= nil 		 -- module
	  then opts.hash = {}
		   opts.route = 'counter'
		   opts.module = args.m
		   opts.header = 'json'
		   opts.hash.counter = opts.domain .. ':' .. dekko.redis.prefix.counter .. ':' .. dekko.redis.prefix.clicks
		   opts.hash.hosts = opts.domain .. ':' .. dekko.redis.prefix.counter
		   opts.hash.hostkey = opts.fingerprint .. ':' .. opts.timestamp

	-- exception bad request
	  else dekko.exception.throw({ code = 107 }) 
	   end


	-- pool connect
	return dekko.combine(opts)
end

function dekko.exception.throw(o)
	exception = {}
	exception.status = o.status
	exception.country = ngx.var.geoip_country_code
	exception.code = o.code
	exception.sourceMessage = o.message
	exception.type = o.type
	exception.domain = o.domain
	exception.stacktrace = debug.traceback()
	exception.langMessage = lang:message(exception)
	return error()
end

function dekko.exception.message(object)

	local o = {}
	local r = {}
	local t = {}

	  if type(object.status) == 'string'
	then o.status = object.status
	else o.status = 'error'
	 end

	  if object.type == 'script'
	then r = 'var message = "' .. object.langMessage .. '";'
	else t.date = ngx.http_time(ngx.time())
		 t.status = o.status
		 t.message = object.langMessage
		 t.country = object.country
		 t.code = object.code

		  if dekko.debug.stackTrace == true
		then t.stack = object.stacktrace
		 end

		 r = cjson.encode(t)
	end

	object.domain = ngx.var.host
	dekko.ngx.headers(object)
	ngx.print(r)
	return ngx.exit(ngx.HTTP_OK)
end

-- return exception error
function dekko.exception.catch()
	return dekko.exception.message(exception)
end

return xpcall(dekko.route, dekko.exception.catch)
