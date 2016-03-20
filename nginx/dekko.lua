
-- Name: Dekko
-- Description: dekko redis
-- Version: 0.1.4 beta
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


local redis = require "resty.redis";
local args = ngx.req.get_uri_args();
local red = redis:new();
local dekko = {};
dekko.ngx = {};
dekko.redis = {};
dekko.construct = {};
dekko.redis.timeout = 1000;

dekko.redis.pool = {
	"127.0.0.2:6379:password",
	"127.0.0.1:6379",
	"127.0.0.2:6379",
	"127.0.0.3:6379"
};

dekko.redis.prefixes = {
    ["modules"] = ":modules:",
    ["clicks"] = ":clicks:",
    ["hosts"] = ":hosts:"
};

dekko.redis.codes = {
	[403] = "Redis auth failed",
	[404] = "Not found",
	[400] = "Bad request",
	[502] = "Redis not online"
};

dekko.ngx.headers = function()
	ngx.header["Content-Type"] = "application/json";
	ngx.header["Access-Control-Allow-Origin"] = '*';
	ngx.header["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS, DELETE, PUT";
	ngx.header["Access-Control-Allow-Headers"] = "x-requested-with, Content-Type, origin, authorization, accept, client-security-token";
	ngx.header["Access-Control-Allow-Credentials"] = "true";
end

dekko.ngx.exception = function(c)
    ngx.say('{ status: ' .. c .. ', message: "' .. dekko.redis.codes[c] .. '" }');
    return ngx.exit(c);
end

dekko.splitHost = function(s,d)
	local result = {};
	for match in (s..d):gmatch("(.-)"..d) do
		table.insert(result, match);
	end
	return result;
end

dekko.redis.hgetall = function(hash)
	local hgetall, err = red:hgetall(hash)
		if not hgetall then
		return dekko.ngx.exception(404);
	end

	if #hgetall == 0 then
		return dekko.ngx.exception(404);
	end

	if type(hgetall) ~= "table" then
		return dekko.ngx.exception(400);
	end

	return hgetall;
	
end

-- get keyhash modules
dekko.construct.adverts = function(hash)
	local data = {}, n;

	for i, v in pairs(dekko.redis.hgetall(hash)) do
		if i % 2 == 1 then n = v
		else table.insert(data, ' { "' .. n .. '" : ' .. v .. ' } ') end
	end

	return ngx.say(string.format("[ %s ]", table.concat(data, ', ')))
end

-- route objects
function dekko:router(obj)

    if obj.route == 'adverts' then
        return self.construct.adverts(obj.hash);
    end

end

-- redis connect
function dekko:connect(obj)
	local target = false;

	-- math.randomseed(os.time());
	-- host = split_host(rp[math.random(#rp)], ':');
    -- local hash = arg.domain .. redis_hash_modules_prefix .. arg.type;

	red:set_timeout(dekko.redis.timeout);

	-- check ip port
	for i, host in pairs(dekko.redis.pool) do
		local s = dekko.splitHost(host, ':');
		local con, err = red:connect(s[1], s[2]);
			if con then target = true;
			if s[3] then
				local res, err = red:auth(s[3])
				if not res then
					return dekko.ngx.exception(403);
				end
			end
			return self:router(obj);
		end
	end

	-- host not online
	if not target then
		return dekko.ngx.exception(502);
	end

	red:close();
end



-- check advert params
function dekko:init()
    local objects = {};
    
    dekko.ngx.headers();
    if args.type ~= nil or args.domain ~= nil then
        objects.route = 'adverts';
        objects.hash = args.domain .. dekko.redis.prefixes.modules .. args.type;

        return dekko:connect(objects);
    else
    	return dekko.ngx.exception(400);
    end
end

dekko:init();
