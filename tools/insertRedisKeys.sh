#!/bin/bash

REDIS_HOST="localhost"

DOMAIN="$1"
MODULE="$2"
FILE="$3"

KEY_SETTINGS="${DOMAIN}:ss"
KEY_MODULE="${DOMAIN}:ms"

FILE_TYPE=$(echo "${FILE}" | sed 's|[^\.]*\.||g')

case "${FILE_TYPE}" in
	json)
		echo "Inserting settings module ${MODULE} to domain ${DOMAIN}"
		cat ${FILE} | redis-cli -h ${REDIS_HOST} -x HSETNX ${KEY_SETTINGS} ${MODULE}
	;;
	js)
		echo "Inserting javascript module ${MODULE} to domain ${DOMAIN}"
		cat ${FILE} | redis-cli -h ${REDIS_HOST} -x HSETNX ${KEY_MODULE} ${MODULE}
	;;
	*)
	cat << EOF

	USE: $0 domain.tld module-name file.[js|json]
	
	Adding script module:
	$0 domain.tld module-name ../www/doc/modules/banner.js
	
	Adding settings module:
	$0 domain.tld module-name ../www/doc/modules/banner.json

EOF
	;;
esac
