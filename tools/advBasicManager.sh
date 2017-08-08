#!/bin/bash

REDIS_HOST="localhost"

METHOD="$1"
DOMAIN="$2"
MODULE="$3"
FILE="$4"

KEY_SETTINGS="${DOMAIN}:ss"
KEY_MODULE="${DOMAIN}:ms"

case "${METHOD}" in
	insert)
		FILE_TYPE=$(echo "${FILE}" | sed 's|[^\.]*\.||g')
		case "${FILE_TYPE}" in
			json)
				cat ${FILE} | redis-cli \
					-h ${REDIS_HOST} \
					-x HSETNX ${KEY_SETTINGS} ${MODULE} \
					| grep -q '1' && \
					echo "Module settings: ${MODULE} inserted to domain: ${DOMAIN}"
			;;
			js)
				cat ${FILE} | redis-cli \
					-h ${REDIS_HOST} \
					-x HSETNX ${KEY_MODULE} ${MODULE} \
					| grep -q '1' && \
					echo "Module script: ${MODULE} inserted to domain: ${DOMAIN}"
			;;
		esac
	;;
	delete)
		if [ -n "${MODULE}" ]
		then
			redis-cli -h ${REDIS_HOST} HDEL ${KEY_MODULE} ${MODULE} \
				| grep -q '1' && \
				echo "Deleted module script: ${MODULE}"

			redis-cli -h ${REDIS_HOST} HDEL ${KEY_SETTINGS} ${MODULE} \
				| grep -q '1' && \
				echo "Deleted module settings: ${MODULE}"
		else
			redis-cli -h ${REDIS_HOST} DEL ${KEY_MODULE} \
				| grep -q '1' && \
				echo "Deleted domain settings: ${DOMAIN}"

			redis-cli -h ${REDIS_HOST} DEL ${KEY_SETTINGS} \
				| grep -q '1' && \
				echo "Deleted domain scripts: ${DOMAIN}"
		fi
	
	;;
	*)
	cat << EOF

	USE: $0 domain.tld module-name file.[js|json]
	
	Adding script module:
	$0 insert domain.tld module-name ../www/doc/modules/banner.js
	
	Adding settings module:
	$0 insert domain.tld module-name ../www/doc/modules/banner.json

	Deleting script module:
	$0 delete domain.tld
	$0 delete domain.tld module-name

EOF
	;;
esac


