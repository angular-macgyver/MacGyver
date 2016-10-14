module.exports = function(grunt) {
  /**
   * karma section
   * Testing framework
   */
  grunt.config("karma", {
    options: {
      configFile: "test/karma.conf.js",
      ngHtml2JsPreprocessor: {
        stripPrefix: "src/"
      }
    },
    unit: {
      background: true
    },
    travis: {
      browsers: ["SL_Chrome", "SL_Firefox"],
      reporters: ["dots", "coverage", "saucelabs"],
      singleRun: true,
      preprocessors: {
        "src/**/*.js": ["coverage"],
        "**/*.html": ["ng-html2js"]
      },
      coverageReporter: {
        type: "lcov",
        dir: "coverage/",
        subdir: "."
      }
    },
    build: {
      singleRun: true,
      options: {
        files: [
          "node_modules/angular/angular.js",
          "src/template/*.html",
          "lib/macgyver.js",
          "node_modules/angular-mocks/angular-mocks.js",
          "test/vendor/browserTrigger.js",
          "test/unit/*.spec.js"
        ]
      }
    }
  });
};
