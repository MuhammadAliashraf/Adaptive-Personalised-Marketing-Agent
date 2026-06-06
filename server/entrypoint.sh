#!/bin/sh
set -e

<<<<<<< Updated upstream
until node ./node_modules/typeorm/cli.js -d dist/config/data-source.js migration:run; do
  echo >&2 "Migration failed — retrying in 3s..."
  sleep 3
done

exec "$@"
=======
echo "Running migrations..."

node ./node_modules/typeorm/cli.js \
  -d dist/config/data-source.js \
  migration:run

echo "Starting application..."

exec "$@"
>>>>>>> Stashed changes
