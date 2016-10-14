#!/usr/bin/env bash
#
# - install required node packages
# - install required bower dependencies

node=`which node 2>&1`
if [ $? -ne 0 ]; then
  echo "Please install NodeJS."
  echo "http://nodejs.org/"
  exit 1
fi

npm=`which yarn 2>&1`
if [ $? -ne 0 ]; then
  echo "Please install Yarn."
  exit 1
fi

echo "Installing required npm packages..."
yarn

echo "Initialized MacGyver dev environment successfully"
