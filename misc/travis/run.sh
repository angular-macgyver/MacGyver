#!/bin/bash

set -e

if [ $JOB = "unit" ]; then
  grunt test:ci
elif [ $JOB = "e2e" ]; then
  grunt test:e2e
else
  echo "Unknown job type. Use either JOB=unit or JOB=e2e"
fi
