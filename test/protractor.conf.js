var config = {
  specs: ["e2e/*.spec.js"],
  baseUrl: "http://localhost:9001",
  framework: "jasmine",

  capabilities: {
    "name": "MacGyver E2E",
    "browserName": process.env.BROWSER || 'chrome'
  },

  onPrepare: function() {
    var disableNgAnimate;
    disableNgAnimate = function() {
      return angular.module('disableNgAnimate', []).run(function($animate) {
        return $animate.enabled(false);
      });
    };
    return browser.addMockModule('disableNgAnimate', disableNgAnimate);
  }
};

if (process.env.VERSION) {
  config.capabilities.version = process.env.VERSION
}

if (process.env.TRAVIS) {
  config.sauceUser = process.env.SAUCE_USERNAME;
  config.sauceKey = process.env.SAUCE_ACCESS_KEY;

  config.capabilities['tunnel-identifier'] = process.env.TRAVIS_JOB_NUMBER
  config.capabilities.build = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER

// Local e2e tests
} else {
  config.seleniumAddress = 'http://localhost:4444/wd/hub';
}

exports.config = config;
