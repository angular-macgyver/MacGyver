module.exports = (grunt) ->

  #
  # karma section
  # Testing framework
  #
  grunt.config "karma",
    options:
      configFile: "test/karma.conf.coffee"
    unit:
      background: true
    travis:
      browsers: ["SL_Chrome", "SL_Firefox", "SL_Safari"]
      reporters: ["dots"]
      singleRun: true
    build:
      singleRun: true
      options:
        files: [
          "../vendor/bower/jquery/jquery.js"
          "../vendor/bower/angular/angular.js"
          "template/*.html"
          "../lib/macgyver.js"
          "../vendor/bower/angular-mocks/angular-mocks.js"
          "../test/vendor/browserTrigger.js"
          "../test/unit/*.spec.coffee"
        ]
