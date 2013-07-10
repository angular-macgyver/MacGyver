// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '../example/';

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,

  // Javascript //
  '../test/vendor/jquery.min.js',
  '../vendor/js/underscore.string.js',
  '../vendor/js/jquery-ui.js',
  '../vendor/js/jquery.fileupload.js',
  '../vendor/bower/angular/angular.js',

  // Template //
  "template/*.html",

  // Application Code //
  '../src/*.coffee',
  '../src/**/*.coffee',

  '../test/vendor/angular/angular-mocks.js',

  // Test Code //
  '../test/unit/*.spec.coffee'
];

preprocessors = {
  "../**/*.coffee": "coffee",
  "**/*.html":      "html2js"
};

// list of files to exclude
exclude = [];

// use dots reporter, as travis terminal does not support escaping sequences
// possible values: 'dots', 'progress', 'junit'
// CLI --reporters progress
reporters = ['progress'];

//junitReporter = {
//  // will be resolved to basePath (in the same way as files/exclude patterns)
//  outputFile: 'test/test-results.xml'
//};

// web server port
// CLI --port 3334
port = 3334;

// cli runner port
// CLI --runner-port 9100
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
// CLI --colors --no-colors
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
// CLI --log-level debug
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
// CLI --auto-watch --no-auto-watch
autoWatch = true;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
// CLI --browsers Chrome,Firefox,Safari
browsers = ["Chrome"];

// If browser does not capture in given timeout [ms], kill it
// CLI --capture-timeout 5000
captureTimeout = 30000;
