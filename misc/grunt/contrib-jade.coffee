module.exports = (grunt) ->

  #
  # Jade section
  # Compile all template jade files into example folder
  #
  grunt.config "jade",
    templates:
      files: [
        expand: true
        cwd:    "src"
        src:    ["**/*.jade"]
        ext:    ".html"
        dest:   "example"
      ]
    docs:
      files: [
        expand: true
        cwd:    "docs"
        src:    ["*.jade"]
        ext:    ".html"
        dest:   "example"
      ]
