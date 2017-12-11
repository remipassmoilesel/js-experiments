#!/usr/bin/env bash

docker run \
  -e KEYCLOAK_USER=admin \
  -e KEYCLOAK_PASSWORD=admin \
  jboss/keycloak:3.2.1.Final \
  -Djboss.bind.address=0.0.0.0 \
  --server-config=standalone.xml