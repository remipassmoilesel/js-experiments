#!/usr/bin/env bash
mongoimport --db test --collection restaurants --drop --file primer-dataset.json
mongoimport --db test --collection restaurants2 --drop --file primer-dataset.json