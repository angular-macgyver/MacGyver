#!/bin/bash

set -e

mkdir -p $LOGS_DIR

npm install -g bower grunt-cli

bower install
