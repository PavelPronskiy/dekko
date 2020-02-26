#!/bin/bash

VER="0.3.0.1 beta"

REDIS_HOST="192.168.100.1"
# REDIS_HOST="127.0.0.1"

PRG=$(basename $0)
METHOD="$1"
DOMAIN="$2"
MODULE="$3"
FILE="$4"

C_CLEAR='\033[0m'
C_YELLOW='\033[1;33m'
C_GREEN='\033[1;32m'
C_RED='\033[1;31m'


KEY_SETTINGS="${DOMAIN}:ss"
KEY_MODULE="${DOMAIN}:ms"
KEY_STYLES="${DOMAIN}:st"

CSS_PREFIX="min.css"
JS_PREFIX="min.js"
JSON_PREFIX="json"

function __warn_msg() {
	echo -e "[${C_YELLOW}!${C_CLEAR}] ${@}"
}

function __error_msg() {
	echo -e "[${C_RED}!${C_CLEAR}] ${@}"
}

function __succ_msg() {
	echo -e "[${C_GREEN}*${C_CLEAR}] ${@}"
}

function __insert_module() {
	FILE_TYPE=$(echo "${1}" | sed 's|[^\.]*\.||g')
	case "${FILE_TYPE}" in
		json)
			if [ -f "${1}" ]
			then cat ${1} | \
				redis-cli -h ${REDIS_HOST} -x HSETNX ${KEY_SETTINGS} ${MODULE} \
				| grep -q '1' \
					&& __succ_msg "Module settings: ${MODULE} inserted to domain: ${DOMAIN}" \
					|| __warn_msg "Exist module settings: ${MODULE} on domain: ${DOMAIN}"
			else 
				__error_msg "File json: ${1} not found"
			fi
		;;
		js)
			# closure-compiler -O WHITESPACE_ONLY 2>/dev/null | \
			if [ -f "${1}" ]
			then cat ${1} | \
				redis-cli -h ${REDIS_HOST} -x HSETNX ${KEY_MODULE} ${MODULE} \
				| grep -q '1' \
					&& __succ_msg "Module script: ${MODULE} inserted to domain: ${DOMAIN}" \
					|| __warn_msg "Exist module script: ${MODULE} on domain: ${DOMAIN}"
			else
				__error_msg "File js: ${1} not found"
			fi
		;;
		css)
			if [ -f "${1}" ]
			then cat ${1} | \
				redis-cli -h ${REDIS_HOST} -x HSETNX ${KEY_STYLES} ${MODULE} \
				| grep -q '1' \
					&& __succ_msg "Module style: ${MODULE} inserted to domain: ${DOMAIN}" \
					|| __warn_msg "Exist module style: ${MODULE} on domain: ${DOMAIN}"
			else
				__error_msg "File css: ${1} not found"
			fi
		;;
	esac
}

__delete_module() {
	if [ -n "${1}" ]
	then

		for m in ${KEY_MODULE} ${KEY_SETTINGS} ${KEY_STYLES}
		do redis-cli -h ${REDIS_HOST} HDEL ${m} ${1} \
			| grep -q '1' \
				&& __succ_msg "Deleted module: ${m} domain: ${DOMAIN}" \
				|| __warn_msg "Not found module: ${m} domain: ${DOMAIN}"
		done
	else
		for m in ${KEY_MODULE} ${KEY_SETTINGS} ${KEY_STYLES}
		do redis-cli -h ${REDIS_HOST} DEL ${m} \
			| grep -q '1' \
				&& __succ_msg "Deleted domain: ${DOMAIN} module: ${m}" \
				|| __warn_msg "Not found domain: ${DOMAIN} module: ${m}"
		done
	fi
}

__update_module_rev() {
	# $1 -- domain
	# $2 -- module
	local domain="$1"
	local module="$2"
	# 
	if [[ -n "${domain}" && -n "${module}" && -f ${module}.${JSON_PREFIX} ]]
	then
		local rev=$(jq -r '.revision' ${module}.${JSON_PREFIX})
		
		if [ -n "${rev}" ]
		then
			new_rev=$(($rev + 1))
			# echo $new_rev
			jq ".revision = ${new_rev}" ${module}.${JSON_PREFIX} > $$
			mv $$ ${module}.${JSON_PREFIX}
			__succ_msg "Changed module ${MODULE} revision ${rev} -> ${new_rev}"
		else
			__error_msg "revision variable not found in: ${module}.${JSON_PREFIX}"
		fi


		# sed 's|"revision":.*|revision: |g' ${module}.${JSON_PREFIX}
	else
		__error_msg "Require defines"
	fi

}

case "${METHOD}" in

	list-modules)
		if [[ -n "${DOMAIN}" ]]
		then
			# echo "Listing all modules on ${DOMAIN}"
			result=$(redis-cli -h ${REDIS_HOST} HKEYS ${KEY_SETTINGS})
			echo -e "${result}" | grep -q 'empty list or set' \
				&& __succ_msg "No modules found on domain: ${DOMAIN}" \
				|| echo -e "${result}"
		fi
	;;
	list-domains)
		#echo "Listing all domains"
		echo 'keys *:ss' | redis-cli -h ${REDIS_HOST} | awk '{print $1}' | sed 's|:ss$||g'
	;;
	save)
		if [[ -n "${DOMAIN}" && -n "${MODULE}" ]]
		then
			i="0"
			mt=("json" "js" "css")
			for key in ${KEY_SETTINGS} ${KEY_MODULE}
			do
				output_dir=`echo ${4} | sed 's|/$||g'`
				hget=`redis-cli -h ${REDIS_HOST} HGET "${key}" "${MODULE}"`
				name_file="${MODULE}.${mt[$i]}"

				if [[ -n "${hget}" && -n "${output_dir}" && -d "${output_dir}" ]]
				then
					echo "Saving module file: ${output_dir}/${name_file}"
					echo -e "${hget}" > ${output_dir}/${name_file}
				fi

				if [[ -n "${hget}" && -z "${output_dir}" ]]
				then
					echo "Saving module file: ${name_file}"
					echo -e "${hget}" > ${name_file}
				fi

				((i++))
			done
		fi

		if [[ -z "${DOMAIN}" && -z "${MODULE}" ]]
		then
			$0
		fi
	;;
	add)

		for f in ${MODULE}.${CSS_PREFIX} ${MODULE}.${JS_PREFIX} ${MODULE}.${JSON_PREFIX}
		do
			if [ ! -f "${f}" ]
			then
				echo "File: ${f} not found"
				exit 1
			fi
		done

		for f in ${MODULE}.${CSS_PREFIX} ${MODULE}.${JS_PREFIX} ${MODULE}.${JSON_PREFIX}
		do
			__insert_module $f
		done

	;;
	update)
		if [ -n "${MODULE}" ]
		then
			$0 del ${DOMAIN} ${MODULE}
			$0 rev ${DOMAIN} ${MODULE}
			$0 add ${DOMAIN} ${MODULE}
		else
			__warn_msg "No module defined"
			exit 1
		fi

		__succ_msg "Module updated: ${DOMAIN} -> ${MODULE}"

	;;
	del) __delete_module ${MODULE} ;;
	rev) __update_module_rev ${DOMAIN} ${MODULE} ;;
	*)
	cat << EOF

# Manager for advert modules
# Version: ${VER}
# All params required!

  List domain modules:
    ${PRG} list-domains
    ${PRG} list-modules domain.tld

  Add new module:
    ${PRG} add domain.tld module-name

  Delete module:
    ${PRG} del domain.tld -- all modules
    ${PRG} del domain.tld module-name -- specific module

  Update module:
    ${PRG} update domain.tld module-name

EOF
	;;
esac


