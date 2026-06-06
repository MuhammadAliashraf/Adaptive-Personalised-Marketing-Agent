#!/bin/sh
set -e
node ./node_modules/typeorm/cli.js -d dist/config/data-source.js migration:run
