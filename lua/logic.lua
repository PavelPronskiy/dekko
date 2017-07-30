
-- Name: Dekko
-- Description: dekko data logic
-- Version: 0.2.0.1 beta
-- Author:  Pavel Pronskiy
-- Contact: pavel.pronskiy@gmail.com

-- Copyright (c) 2016 Dekko Pavel Pronskiy

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
local args = ngx.req.get_uri_args()
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
	["clicks"] = "cs",
	["counter"] = "cr",
	["hosts"] = "hs",
	["rev"] = "r",
}

function dekko.ngx.PolicyHeaders(object)
	ngx.header["Access-Control-Allow-Origin"] = object.schemeDomain
	ngx.header["Access-Control-Allow-Methods"] = "GET, OPTIONS"
	ngx.header["Access-Control-Allow-Headers"] = "x-requested-with, Content-Type, origin, authorization, accept, client-security-token, If-None-Match, If-Modified-Since, Cache-Control"
	ngx.header["Access-Control-Allow-Credentials"] = "true"
	ngx.header["Access-Control-Max-Age"] = 864000
end

function dekko.ngx.headers(object)

	local policy = {}
	local k = {}
	ngx.status = ngx.HTTP_OK

	    if object.mhash ~= nil
	  then k.et = dekko.cacheBrowser('etag', object.mhash .. dekko.redis.prefix.ETag)
		   k.lm = dekko.cacheBrowser('lastmodified', object.mhash .. dekko.redis.prefix.lastModified)
		   ngx.header["ETag"] = k.et
	       ngx.header["Last-modified"] = k.lm
	   end

	    if object.type == 'script'
	  then ngx.header["Content-Type"] = "text/javascript"
	elseif object.type == 'json'
	  then ngx.header["Content-Type"] = "application/json"
	  else ngx.header["Content-Type"] = "application/json"
	   end

	  if ngx.var.http_x_forwarded_proto ~= nil
	then policy.schemeDomain = ngx.var.http_x_forwarded_proto .. '://' .. object.domain
	else policy.schemeDomain = 'http://' .. object.domain
	end

	ngx.header["Cache-Control"] = "public"
	return dekko.ngx.PolicyHeaders(policy)
end

-- split string 127.0.0.1:1234
function dekko.splitHost(s)

	local result = {};
	for match in (s..":"):gmatch("(.-)"..":") do
		table.insert(result, match)
	end
	return result
end

function dekko.redis.hgetall(object)
	local data = {}
	local hgetall, err = red:hgetall(object.hash)
	  if not hgetall
	then dekko.exception.throw({
			code = 109,
			message = err
		 })
	 end

	  if #hgetall == 0
	then dekko.exception.throw({
			code = 115
		 })
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

	return dekko.construct.message(o)
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

	o.header = object.header
	o.domain = object.domain
	o.json = t.module
	o.mhash = object.mhash .. ':' .. t.hash
	return dekko.construct.message(o)
end

function dekko.construct.counter(object)
	local msg = {}
	msg.header = object.header
	msg.json = '{}'
	msg.mhash = nil

	local res, err = red:hmset(object.hash.hosts, object.hash.hostkey, object.module)
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


	-- ngx.say(target)
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

function dekko.validateArgs(argument)
	local r = false
	  if argument:match('[\";\']') ~= nil
	then r = true
	 end

	return r

end

-- route
function dekko.route()
	local opts = {}
	
	opts.domain = args.d
	opts.fingerprint = tonumber(args.f)
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

	-- get advert options URI: url?f=fingerprint
	    if args.d ~= nil -- domain
	   and args.m == nil -- !module
	   and args.c == nil -- !click
	  then opts.route = 'settings'
		   opts.header = 'json'
		   opts.hash = opts.domain .. ':' .. dekko.redis.prefix.settings

	-- get modules scripts widgets URI: url?f=fingerprint&m=module-name
	elseif args.c == nil -- !click
	   and args.d ~= nil -- domain
	   and args.m ~= nil -- module
	  then opts.route = 'modules'
		   opts.module = args.m
		   opts.header = 'script'
		   opts.hash = opts.domain .. ':' .. dekko.redis.prefix.modules
		   opts.mhash = opts.domain .. ':' .. dekko.redis.prefix.modules .. ':' .. opts.module
			
	-- post click counter URI: url?c=timestamp&f=fingerprint&m=module-name
	elseif opts.timestamp ~= nil -- timestamp click
	   and args.d ~= nil -- domain
	   and args.m ~= nil -- module
	  then opts.hash = {}
		   opts.route = 'counter'
		   opts.module = args.m
		   opts.header = 'json'
		   opts.hash.counter = opts.domain .. ':' .. dekko.redis.prefix.counter .. ':' .. dekko.redis.prefix.clicks
		   opts.hash.hosts = opts.domain .. ':' .. dekko.redis.prefix.counter .. ':' .. dekko.redis.prefix.hosts
		   opts.hash.hostkey = ngx.var.remote_addr .. ':' .. opts.fingerprint .. ':' .. opts.timestamp

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

-- local xx = {}
-- local xt = {}
-- xx.a = 1
-- xx.b = 'fdsdf'

-- xt.a = cjson.encode(xx)

-- dekko.ngx.rp:set('dekko:test', xt.a)

-- xt.b = dekko.ngx.rp:get('dekko:test')

-- return ngx.say(xt.a)

return xpcall(dekko.route, dekko.exception.catch)
-- return ngx.say(ngx.var.uri)
