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

npm=`which npm 2>&1`
if [ $? -ne 0 ]; then
  echo "Please install NPM."
  exit 1
fi

bower=`which bower 2>&1`
if [ $? -ne 0 ]; then
  "Installing bower..."
  npm install -g bower
fi

echo "Installing required npm packages..."
npm install

echo "Installing Bower dependencies..."
bower install

echo "Initialized MacGyver dev environment successfully"
