module.exports = (grunt) ->
  grunt.config "coveralls",
    src:
      src: "coverage/lcov.info"
      force: false