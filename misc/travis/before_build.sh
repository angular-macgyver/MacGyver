#!/bin/bash

set -e

mkdir -p $LOGS_DIR

./misc/saucelabs/start_tunnel.sh

npm install -g bower grunt-cli

bower install

echo "wait_for_browser_provider"
./misc/travis/wait_for_browser_provider.sh
