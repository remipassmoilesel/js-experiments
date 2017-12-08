#!/bin/sh

## TODO: replace with monit
while true; do

   PORT=3000 node /server/build/index.js

   echo
   echo "Error, templating server failed with code: $?"
   echo

done
