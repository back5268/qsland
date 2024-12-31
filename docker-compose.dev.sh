#!/bin/bash

TAG_NAME=$1

sed -i "s/TAG_COMMIT/${TAG_NAME}/g" docker-compose.dev.yml
