module.exports = (grunt) ->

  #
  # karma section
  # Testing framework
  #
  grunt.config "karma",
    options:
      configFile: "test/karma.conf.coffee"
      ngHtml2JsPreprocessor:
        stripPrefix: "src/"
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
          "bower_components/jquery/jquery.js"
          "bower_components/angular/angular.js"
          "src/template/*.html"
          "lib/macgyver.js"
          "bower_components/angular-mocks/angular-mocks.js"
          "test/vendor/browserTrigger.js"
          "test/unit/*.spec.coffee"
        ]
