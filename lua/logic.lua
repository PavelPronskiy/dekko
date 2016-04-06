
-- Name: Dekko
-- Description: dekko data logic
-- Version: 0.1.5 beta
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

local redis = require "resty.redis"
local args = ngx.req.get_uri_args()
local red = redis:new()
local dekko = {}
dekko.ngx = {}
dekko.redis = {}
dekko.construct = {}
dekko.redis.timeout = 1000

-- local xxh32 = require("luaxxhash")
-- math.randomseed(os.time());
-- host = split_host(rp[math.random(#rp)], ':');
-- local hash = arg.domain .. redis_hash_modules_prefix .. arg.type;


dekko.redis.pool = {
	"127.0.0.1:6379:passwd",
	-- "127.0.0.2:6379:passwd",
	-- "127.0.0.3:6379",
	-- "127.0.0.4:6379",
}

dekko.redis.prefix = {
	["settings"] = "ss",
	["modules"] = "ms",
	["clicks"] = "cs",
	["counter"] = "cr",
	["hosts"] = "hs",
}

dekko.redis.codes = {
	[200] = "OK",
	[403] = "Auth failed",
	[404] = "Not found",
	[400] = "Bad request",
	[502] = "Data store pool offline",
}

function dekko.ngx.headers(type)
	if type == 'json' then
		ngx.header["Content-Type"] = "application/json"
	end

	if type == 'script' then
		ngx.header["Content-Type"] = "text/javascript"
	end
end

function dekko.ngx.exception(c)
	ngx.status = c
	ngx.say('{ "status": ' .. c .. ', "message": "' .. dekko.redis.codes[c] .. '" }')
	return ngx.exit(c)
end

function dekko.splitHost(s,d)

	local result = {};
	for match in (s..d):gmatch("(.-)"..d) do
		table.insert(result, match)
	end

	return result
end

function dekko.redis.hgetall(hash)
	
	local hgetall, err = red:hgetall(hash)
		if not hgetall then
		return dekko.ngx.exception(404)
	end

	if #hgetall == 0 then
		return dekko.ngx.exception(404)
	end

	if type(hgetall) ~= "table" then
		return dekko.ngx.exception(400)
	end

	local data = {};
	for i, v in pairs(hgetall) do
		if i % 2 == 1 then
			n = v
		else
			data[n] = v
		end
	end

	return data
end

function dekko.redis.hmget(hash, name)

	local hmget, err = red:hmget(hash, name)
		if not hmget and type(hmget[1]) ~= 'string' then
		return dekko.ngx.exception(404)
	end

	return hmget
end


-- get keyhash module settings
function dekko.construct.settings(obj)

	dekko.ngx.headers(obj.header)

	local data = {};
	for i, v in pairs(dekko.redis.hgetall(obj.hash)) do
		table.insert(data, '{"' .. i .. '":' .. v .. '}')
	end

	return ngx.say(string.format("[%s]", table.concat(data, ',')))
end

-- get keyhash modules
function dekko.construct.modules(obj)
	local data = {}, n;
	dekko.ngx.headers(obj.header)
	local hmget = dekko.redis.hmget(obj.hash, obj.module);
	return ngx.say(hmget)
end

function dekko.construct.counter(obj)
	dekko.ngx.headers(obj.header)

	red:init_pipeline()
	
	red:hincrby(obj.hash.counter, obj.module, 1)
	red:hmset(obj.hash.hosts, obj.hash.hostkey, obj.module)

	local results, err = red:commit_pipeline()
	if not results then
		return dekko.ngx.exception(400)
	end

	return dekko.ngx.exception(200)
end

-- route objects
function dekko.router(obj)

	if obj.route == 'settings' then
		return dekko.construct.settings(obj)
	end

	if obj.route == 'modules' then
		return dekko.construct.modules(obj)
	end

	if obj.route == 'counter' then
		return dekko.construct.counter(obj)
	end
end

-- redis connect
function dekko.connect(obj)
	local target = false;

	red:set_timeout(dekko.redis.timeout)

	-- check ip port
	for i, host in pairs(dekko.redis.pool) do
		local s = dekko.splitHost(host, ':')
		local con, err = red:connect(s[1], s[2])
			if con then target = true;
			if s[3] then
				local res, err = red:auth(s[3])
				if not res then
					return dekko.ngx.exception(403)
				end
			end
			return dekko.router(obj)
		end
	end

	-- host not online
	if not target then
		return dekko.ngx.exception(502)
	end

	red:set_keepalive(10000, 100)

	-- red:close();
end

function dekko.init()
	local obj = {}
	
	-- args:
	-- t -> type (method: settings,modules)
	-- c -> timestamp (click counter)
	-- d -> domain name (method: settings,modules,counter)
	-- m -> module name (method: settings,modules,counter)
	-- f -> fingerprint (method: settings,modules,counter)


	-- url?t=popup&d=domain.name&f=fingerprint
	if
		args.t ~= nil and -- type
		args.d ~= nil and -- domain
		args.f ~= nil and -- fingerprint
		args.m == nil and -- !module
		args.c == nil 	  -- !click
	then
		obj.route = 'settings'
		obj.header = 'json'
		obj.hash = args.d .. ':' .. dekko.redis.prefix.settings .. ':' .. args.t
	
	-- click counter
	-- url?c=timestamp&d=domain.name&f=fingerprint&m=module-name
	elseif
		args.t == nil and -- !type
		args.c ~= nil and -- click
		args.d ~= nil and -- domain
		args.m ~= nil and -- module
		args.f ~= nil     -- fingerprint
	then
		obj.hash = {}
		obj.route = 'counter'
		obj.module = args.m
		obj.header = 'json'
		obj.hash.counter = args.d .. ':' .. dekko.redis.prefix.counter .. ':' .. dekko.redis.prefix.clicks
		obj.hash.hosts = args.d .. ':' .. dekko.redis.prefix.counter .. ':' .. dekko.redis.prefix.hosts
		obj.hash.hostkey = ngx.var.remote_addr .. ':' .. args.f .. args.c
	
	-- modules scripts widgets
	-- url?t=popup&d=domain.name&f=fingerprint&m=module-name
	elseif
		args.t ~= nil and -- type
		args.d ~= nil and -- domain
		args.f ~= nil and -- fingerprint
		args.c == nil and -- !click
		args.m ~= nil     -- module
	then
		obj.route = 'modules'
		obj.module = args.m
		obj.header = 'script'
		obj.hash = args.d .. ':' .. dekko.redis.prefix.modules .. ':' .. args.t
	
	-- exception bad request
	else
		return dekko.ngx.exception(400)
	end
	
	-- pool connect
	return dekko.connect(obj)
end

-- initial
dekko.init()