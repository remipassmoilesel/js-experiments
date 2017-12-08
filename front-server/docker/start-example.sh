#!/bin/sh

cd docker/node-nginx && ./build-base-image.sh

cd ../..

npm run docker-launch
