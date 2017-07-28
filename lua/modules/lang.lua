
-- Name: Dekko languages library
-- Description: dekko data languages
-- Version: 0.2.0.1 beta

-- dekko.redis.prefix = {
-- 	["settings"] = "ss",
-- 	["lastModified"] = ":lastmodified",
-- 	["ETag"] = ":etag",
-- 	["modules"] = "ms",
-- 	["clicks"] = "cs",
-- 	["counter"] = "cr",
-- 	["hosts"] = "hs",
-- 	["rev"] = "r",
-- }

-- dekko.redis.codes = {
-- 	[200] = "OK",
-- 	[204] = "Nothing else",
-- 	[403] = "Auth failed",
-- 	[404] = "Not found",
-- 	[400] = "Bad request",
-- 	[502] = "Data store pool offline",
-- }


local _M = {}

local lang = {}

lang.RU = {
	[100] = "Модуль",
	[101] = "Пустой ответ",
	[102] = "Не найдено",
	[103] = "Кривой запрос",
	[104] = "Невозможно получить данные из redis",
	[105] = "Ошибка в lang dekko",
	[106] = "Аргумент domain имеет недопустимое значение",
	[107] = "Недопустимые аргументы",
	[108] = "Все сервисы Redis недоступны",
	[109] = "Сервис Redis вернул ошибку",
	[110] = "Ошибка синтаксиса при выполнении cjson.decode",
	[111] = "Ошибка синтаксиса при выполнении cjson.encode",
	[112] = "Модуль не найден",
	[113] = "Сервис Redis вернул неправильный тип настроек",
	[114] = "Сервис Redis вернул неправильный тип из hgetall",
	[115] = "Сервис Redis вернул пустой результат",
	[116] = "Список pool Redis пустой",
}

lang.EN = {
	[100] = "Module",
	[101] = "Empty result",
	[102] = "Not found",
	[103] = "Incorect request",
	[104] = "Unable to get data redis",
	[105] = "Internal lang dekko error",
	[106] = "Domain arg invalid argument",
	[107] = "Invalid args",
	[108] = "All Redis offline",
	[109] = "Redis return error",
	[110] = "Error syntax reported cjson.decode",
	[111] = "Error syntax reported cjson.encode",
	[112] = "Module not found",
	[113] = "Redis result invalid type of data settings",
	[114] = "Redis return invalid type table of hgetall",
	[115] = "Redis return empty result",
	[116] = "Pool Redis is empty",
}

function _M:message(object)

	local e = {}

	    if object.country == nil
	  then e.country = 'EN'
	  else e.country = object.country
	   end

	    if object.code == nil
	  then e.code = 105
	  else e.code = object.code
	   end

	    if object.sourceMessage == nil
	  then e.sourceMessage = ""
	  else e.sourceMessage = ': ' .. object.sourceMessage
	   end

	    if type(lang[e.country]) ~= 'table'
	  then e.message = lang.EN[e.code] .. e.sourceMessage
	  else e.message = lang[e.country][e.code] .. e.sourceMessage
	   end

	return e.message
end

return _M