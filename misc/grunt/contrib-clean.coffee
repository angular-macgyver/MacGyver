module.exports = (grunt) ->

  #
  # Clean section
  # Clean up tmp folder used during compiling
  #
  grunt.config "clean",
    tmp: ["tmp"]
