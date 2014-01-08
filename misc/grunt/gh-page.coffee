module.exports = (grunt) ->

  grunt.config "gh-pages",
    options:
      base:    "example"
      message: "docs update"
      push:    false
    src: ["**"]
