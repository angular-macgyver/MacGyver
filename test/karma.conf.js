module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '../example',

    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // Javascript //
      '../test/vendor/jquery.min.js',
      '../vendor/bower/underscore/underscore.js',
      '../vendor/js/underscore.string.js',
      '../vendor/js/jquery-ui.js',
      '../vendor/js/jquery.fileupload.js',
      '../vendor/bower/angular/angular.js',

      // Template //
      "template/*.html",

      // Application Code //
      {
        "pattern":  '../src/example_controller/*.coffee',
        "watched":  false,
        "included": false,
        "served":   false
      },
      '../src/main.coffee',
      '../src/services/*.coffee',
      '../src/*.coffee',
      '../src/**/*.coffee',

      '../test/vendor/angular/angular-mocks.js',

      // Test Code //
      '../test/unit/*.spec.coffee'
    ],

    // list of files to exclude
    exclude: [],

    // use dots reporter, as travis terminal does not support escaping sequences
    // possible values: 'dots', 'progress'
    // CLI --reporters progress
    reporters: ['progress'],

    // web server port
    port: 9100,

    // enable / disable colors in the output (reporters and logs)
    // CLI --colors --no-colors
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    // CLI --log-level debug
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    // CLI --auto-watch --no-auto-watch
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    // CLI --browsers Chrome,Firefox,Safari
    browsers: [process.env.TRAVIS ? 'PhantomJS' : 'Chrome'],

    // If browser does not capture in given timeout [ms], kill it
    // CLI --capture-timeout 5000
    captureTimeout: 30000,

    // Auto run tests on start (when browsers are captured) and exit
    // CLI --single-run --no-single-run
    singleRun: false,

    // report which specs are slower than 500ms
    // CLI --report-slower-than 500
    reportSlowerThan: 500,

    preprocessors: {
      "../**/*.coffee": "coffee",
      "**/*.html":      "html2js"
    },

    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-ng-html2js-preprocessor',
      'karma-coffee-preprocessor'
    ]
  });
};
