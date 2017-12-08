#!/bin/sh

/server/docker/template-server.sh &

nginx -g "daemon off;"
