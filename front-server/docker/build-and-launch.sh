#!/usr/bin/env bash

# MUST be executed from parent directory

docker rm front-server

docker build . -t front-server

docker run --name front-server front-server
