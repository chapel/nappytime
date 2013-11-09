#!/bin/bash

## make sure jsx is available via:
## `npm install -g react-tools`

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo ${DIR}

DEST="${DIR}/../public/js/react"
SOURCE="${DIR}/src/"

mkdir -p ${DEST}

echo "watching ${SOURCE}, deploying to ${DEST}.."
jsx -x jsx --watch ${SOURCE} ${DEST}