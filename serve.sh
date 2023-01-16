#!/bin/bash

# This script is used to serve the ezmeme website locally.

ts-node --project tsconfig.json index.ts fte
ts-node --project tsconfig.json index.ts snip
ts-node --project tsconfig.json index.ts wito

http-server -p 8080 ./out
