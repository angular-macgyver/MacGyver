module.exports = (grunt) ->

  #
  # Jade section
  # Compile all template jade files into example folder
  #
  grunt.config "jade",
    files:
      expand: true
      cwd:    "src"
      src:    ["**/*.jade"]
      ext:    ".html"
      dest:   "example"
