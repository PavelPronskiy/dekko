
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

local redis_pool = {
	"127.0.0.1:6379:password";
	"127.0.0.2:6379";
	"127.0.0.2:6379";
	"127.0.0.3:6379";
};

-- code exceptions
local codes = {
	[403] = "Redis auth failed";
	[404] = "Not found";
	[400] = "Bad request";
	[502] = "Redis not online";
};

ngx.header["Content-Type"] = "application/json";
ngx.header["Access-Control-Allow-Origin"] = '*';
ngx.header["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS, DELETE, PUT";
ngx.header["Access-Control-Allow-Headers"] = "x-requested-with, Content-Type, origin, authorization, accept, client-security-token";
ngx.header["Access-Control-Allow-Credentials"] = "true";

-- code exceptions construct
local error_code = function(code)
	local view = function(t)
		ngx.say('{ status: '..code..', message: "' .. codes[code] .. '" }');
		return ngx.exit(code);
	end
	return view(code);
end

-- check url vars
if args.type == nil or args.domain == nil then
	return error_code(400);
end

-- get keyhash modules
local adverts = function(arg)
	local data = {};
	local n;
	local hash = arg.domain .. ":" .. arg.type;

	local hgetall, err = red:hgetall(hash)
		if not hgetall then
		return error_code(404);
	end

	if #hgetall == 0 then
		return error_code(404);
	end

	if type(hgetall) ~= "table" then
		return error_code(400);
	end

	for i,v in pairs(hgetall) do
		if i % 2 == 1 then n = v
		else table.insert(data, ' { "' .. n .. '" : ' .. v .. ' } ') end
	end

	return ngx.say(string.format("[ %s ]", table.concat(data, ', ')))
end

local redis_cluster = function(rp)
	local target = false;
	red:set_timeout(1000);
	
	-- math.randomseed(os.time());
	-- host = split_host(rp[math.random(#rp)], ':');
	
	-- split ip and port
	function split_host(s, d)
		result = {};
		for match in (s..d):gmatch("(.-)"..d) do
			table.insert(result, match);
		end
		return result;
	end

	-- check ip port
	for i, host in pairs(rp) do
		local s = split_host(host, ':');
		local con, err = red:connect(s[1], s[2]);
			if con then target = true;

			if s[3] then
				local res, err = red:auth(s[3])
				if not res then
					return error_code(403);
				end
			end

			return adverts(args);
		end
	end

	-- host not online
	if not target then
		return rcodes(error_code);
	end

	red:close();
end

redis_cluster(redis_pool);
-- storing array
