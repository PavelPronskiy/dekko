#!/bin/bash

TIMESTAMP=$(date +%s)
TIMESTAMP_FINGERPRINT="${TIMESTAMP}"

DEKKO_DOMAIN="$1"
ADV_DOMAIN="$2"
MODULE_NAME="$3"

if [ -z "${DEKKO_DOMAIN}" ]
then
	echo "DEKKO_DOMAIN not defined"
	exit 1
fi

if [ -z "${MODULE_NAME}" ]
then
	echo "MODULE_NAME not defined"
	exit 1
fi

if [ -z "${ADV_DOMAIN}" ]
then
	echo "ADV_DOMAIN not defined"
	exit 1
fi


URL_TYPES=(
	"${DEKKO_DOMAIN}/sa?d=${ADV_DOMAIN}&f=${TIMESTAMP_FINGERPRINT}" # get adv domain settings
	"${DEKKO_DOMAIN}/sa?d=${ADV_DOMAIN}&f=${TIMESTAMP_FINGERPRINT}&m=${MODULE_NAME}" # get adv domain settings
	"${DEKKO_DOMAIN}/sa?d=${ADV_DOMAIN}&c=${TIMESTAMP}&f=${TIMESTAMP_FINGERPRINT}&m=${MODULE_NAME}" # get adv domain settings
)



function __check_urls() {

	for uri in ${URL_TYPES[*]}
	do
		echo "Checking: ${uri}"
		curl -4sI "${uri}"
	done
}

__check_urls