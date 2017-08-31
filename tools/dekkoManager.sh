#!/bin/bash

REDIS_HOST="localhost"

METHOD="$1"
DOMAIN="$2"
MODULE="$3"
FILE="$4"

KEY_SETTINGS="${DOMAIN}:ss"
KEY_MODULE="${DOMAIN}:ms"

case "${METHOD}" in

	list)
		if [[ -n "${DOMAIN}" && -z "${MODULE}" ]]
		then
			echo "Listing all modules on ${DOMAIN}"
			redis-cli -h ${REDIS_HOST} HKEYS ${KEY_SETTINGS}
		fi
	;;
	save)
		if [[ -n "${DOMAIN}" && -n "${MODULE}" ]]
		then
			i="0"
			mt=("json" "js")
			for key in ${KEY_SETTINGS} ${KEY_MODULE}
			do
				output_dir=`echo ${4} | sed 's|/$||g'`
				hget=`redis-cli -h ${REDIS_HOST} HGET "${key}" "${MODULE}"`
				name_file="${MODULE}.${mt[$i]}"

				if [[ -n "${hget}" && -n "${output_dir}" && -d "${output_dir}" ]]
				then
					echo "Saving module file: ${output_dir}/${name_file}"
					echo -e "${hget}" | js-beautify > ${output_dir}/${name_file}
				fi

				if [[ -n "${hget}" && -z "${output_dir}" ]]
				then
					echo "Saving module file: ${name_file}"
					echo -e "${hget}" | js-beautify > ${name_file}
				fi

				((i++))
			done
		fi

		if [[ -z "${DOMAIN}" && -z "${MODULE}" ]]
		then
			$0
		fi
	;;
	update)
		if [[ -n "${DOMAIN}" && -n "${MODULE}" ]]
		then
			hget=`redis-cli -h ${REDIS_HOST} HGET "${KEY_SETTINGS}" "${MODULE}"`
			revision=`echo -e "${hget}" | jq '.revision'`
			if [ -n "${revision}" ]
			then

				redis-cli -h ${REDIS_HOST} HDEL ${KEY_SETTINGS} ${MODULE} > /dev/null 2>&1

				revision_prev="${revision}"
				revision=$((${revision} + 1))
				echo -e "${hget}" | jq ".revision=${revision}" \
					| redis-cli \
						-h ${REDIS_HOST} \
						-x HSETNX ${KEY_SETTINGS} ${MODULE} | grep -q '1' && \
						echo "Module settings: ${MODULE} domain: ${DOMAIN} updated revision ${revision_prev} -> ${revision}"

				# echo "${revision}"
			else
				echo "Revision not found in module: ${MODULE} domain: ${DOMAIN}"
			fi
		fi
	;;
	ins|insert)
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
				cat ${FILE} | closure-compiler -O WHITESPACE_ONLY | redis-cli \
					-h ${REDIS_HOST} \
					-x HSETNX ${KEY_MODULE} ${MODULE} \
					| grep -q '1' && \
					echo "Module script: ${MODULE} inserted to domain: ${DOMAIN}"
			;;
		esac
	;;
	del|delete)
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

	Listing modules:
	$0 list domain.tld
		list all module names on domain

	Saving module:
	$0 save domain.tld module-name 
		save module-name.json and module-name.js

	$0 save domain.tld module-name /output/path_dir/to_save
		save module to /path/to/outputdir

	Adding script module:
	$0 insert domain.tld module-name ../www/doc/modules/banner.js
	
	Adding settings module:
	$0 insert domain.tld module-name ../www/doc/modules/banner.json

	Deleting script module:
	$0 delete domain.tld
	$0 delete domain.tld module-name

	Updating settings revision
	$0 update domain.tld module-name

EOF
	;;
esac


