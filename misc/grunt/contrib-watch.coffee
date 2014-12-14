module.exports = (grunt) ->

  #
  # watch section
  # Watch all js, css and jade changes
  #
  grunt.config "watch",
    options:
      livereload: true
    js:
      files: [
        "src/**/*.coffee"
        "src/*.coffee"
        "src/**/*.js"
      ]
      tasks: [
        "karma:unit:run"
        "coffee"
        "copy:src"
        "concat:example"
        "clean"
      ]
    doc:
      files: ["docs/doc.coffee"]
      tasks: ["coffee:doc"]
    test:
      files: ["test/**/*.spec.coffee"]
      tasks: ["karma:unit:run"]
    css:
      files: ["src/css/*.styl", "vendor/vendor.styl"]
      tasks: ["stylus:dev"]
    jade:
      files: ["docs/*.jade"]
      tasks: ["jade", "replace:docs"]
    template:
      files: ["src/template/*.html"]
      tasks: ["copy:template"]
