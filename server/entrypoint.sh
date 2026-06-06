#!/bin/sh
set -e

echo "Running migrations..."

node ./node_modules/typeorm/cli.js \
  -d dist/config/data-source.js \
  migration:run

echo "Starting application..."

exec "$@"
