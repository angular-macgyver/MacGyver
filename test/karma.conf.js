module.exports = function(config) {
  config.set({
    sauceLabs: {
      startConnect: true,
      testName: "MacGyver"
    },
    customLaunchers: {
      SL_Chrome: {
        base: "SauceLabs",
        browserName: "chrome"
      },
      SL_Firefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        version: '26'
      },
      SL_Safari: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.9',
        version: '7'
      },
      SL_IE_9: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 2008',
        version: '9'
      },
      SL_IE_10: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 2012',
        version: '10'
      },
      SL_IE_11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11'
      }
    },

    // base path, that will be used to resolve files and exclude
    basePath: "../",
    frameworks: ["jasmine"],

    // list of files / patterns to load in the browser
    files: [
      // 3rd party libraries
      "node_modules/phantomjs-polyfill/bind-polyfill.js",
      "bower_components/angular/angular.js",

      // Template
      "src/template/*.html",

      // Test Code
      "src/main.js",
      "src/**/*.js",
      "bower_components/angular-mocks/angular-mocks.js",
      "test/vendor/browserTrigger.js",
      "test/unit/**/*.spec.js"
    ],
    reporters: ["dots"],
    logLevel: config.LOG_INFO,
    browsers: ["PhantomJS"],
    preprocessors: {
      "**/*.html": ["ng-html2js"]
    },
    plugins: ["karma-*"]
  });

  if (process.env.TRAVIS) {
    var buildLabel = "TRAVIS #" + process.env.TRAVIS_BUILD_NUMBER + " (" + process.env.TRAVIS_BUILD_ID + ")";
    config.sauceLabs.build = buildLabel;
    config.sauceLabs.startConnect = false;
    config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
  }
};
