module.exports = (grunt) ->

  grunt.config "updatebuild",
    app:
      files: [
        expand:  true
        flatten: false
        cwd:     "build"
        src:     "**/bower.json"
        dest:    "build"
      ]
