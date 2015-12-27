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
      reporters: ["dots", "coverage"],
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
          "bower_components/angular/angular.js",
          "src/template/*.html",
          "lib/macgyver.js",
          "bower_components/angular-mocks/angular-mocks.js",
          "test/vendor/browserTrigger.js",
          "test/unit/*.spec.js"
        ]
      }
    }
  });
};
