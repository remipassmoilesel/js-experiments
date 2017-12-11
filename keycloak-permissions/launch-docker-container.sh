#!/usr/bin/env bash

KEYCLOAK_IMAGE=jboss/keycloak-ha-postgres:3.2.1.Final
IP_ADDRESS=172.17.0.3

docker stop -t 0 postgres keycloak
docker rm postgres keycloak

docker run --name postgres \
      -e POSTGRES_DB=keycloak \
      -e POSTGRES_USER=keycloak \
      -e POSTGRES_PASSWORD=password \
      -d postgres

docker run --name keycloak --link postgres:postgres \
    -e KEYCLOAK_USER=keycloak \
    -e KEYCLOAK_PASSWORD=keycloak \
    jboss/keycloak
