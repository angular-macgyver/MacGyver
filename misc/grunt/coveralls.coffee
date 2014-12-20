module.exports = (grunt) ->
  grunt.config "coveralls",
    options:
      src: "coverage/lcov.info"
      force: false