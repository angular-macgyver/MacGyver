module.exports = function(config) {
  var log4js = require("../node_modules/karma/node_modules/log4js");
  var layouts = require("../node_modules/karma/node_modules/log4js/lib/layouts");

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
      "bower_components/underscore.string/lib/underscore.string.js",
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
    config.transports = ["xhr-polling"];
  }

  // Taken from AngularJS karma-shared.conf.js
  // Terrible hack to workaround inflexibility of log4js:
  // - ignore web-server's 404 warnings,
  var originalConfigure = log4js.configure;
  log4js.configure = function(log4jsConfig) {
    var consoleAppender, layout, originalResult;
    consoleAppender = log4jsConfig.appenders.shift();
    originalResult = originalConfigure.call(log4js, log4jsConfig);
    layout = layouts.layout(consoleAppender.layout.type, consoleAppender.layout);
    log4js.addAppender(function(log) {
      var msg = log.data[0];

      // ignore web server's 404s
      if (log.categoryName === "web-server" && log.level.levelStr === config.LOG_WARN) {
        return;
      }
      console.log(layout(log));
    });
    return originalResult;
  };
};
