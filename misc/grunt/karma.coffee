module.exports = (grunt) ->

  #
  # karma section
  # Testing framework
  #
  grunt.config "karma",
    options:
      configFile: "test/karma.conf.js"
    unit:
      background: true
    travis:
      autoWatch: false
      singleRun: true
    build:
      options:
        files: [
          "../vendor/bower/jquery/jquery.js"
          "../vendor/bower/angular/angular.js"
          "template/*.html"
          "../lib/macgyver-*.js"
          "../vendor/bower/angular-mocks/angular-mocks.js"
          "../test/vendor/browserTrigger.js"
          "../test/unit/*.spec.coffee"
        ]
      autoWatch: false
      singleRun: true
