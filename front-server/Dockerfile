FROM node6-12-nginx1-12:1.0

RUN mkdir -p /server
RUN mkdir -p /logs
COPY . /server

RUN apk update \
      && apk add vim

ENTRYPOINT /server/docker/entrypoint.sh
