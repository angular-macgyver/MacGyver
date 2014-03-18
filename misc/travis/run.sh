#!/bin/bash

set -e

if [ $JOB = "unit" ]; then
  grunt jade
  grunt test:unit
elif [ $JOB = "e2e" ]; then
  grunt test:e2e --sauceUser=$SAUCE_USERNAME \
        --sauceKey=$SAUCE_ACCESS_KEY \
        --capabilities.tunnel-identifier=$TRAVIS_JOB_NUMBER \
        --capabilities.build=$TRAVIS_BUILD_NUMBER \
        --browser=$BROWSER
else
  echo "Unknown job type. Use either JOB=unit or JOB=e2e"
fi
