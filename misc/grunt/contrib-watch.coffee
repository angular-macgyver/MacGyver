module.exports = (grunt) ->

  #
  # watch section
  # Watch all js, css and jade changes
  #
  grunt.config "watch",
    js:
      files: ["src/**/*.coffee", "src/*.coffee"]
      tasks: [
        "karma:unit:run"
        "coffee"
        "concat:jqueryui"
        "concat:appJs"
        "clean"
      ]
    test:
      files: ["test/**/*.spec.coffee"]
      tasks: ["karma:unit:run"]
    css:
      files: ["src/css/*.styl", "vendor/vendor.styl"]
      tasks: ["stylus", "concat:css", "clean"]
    jade:
      files: ["src/**/*.jade"]
      tasks: ["jade", "replace:docs"]
