module.exports = (grunt) ->

  #
  # chalkboard section
  # Generating documentation from source code
  #
  grunt.config "chalkboard",
    docs:
      files: [
        expand:  true
        flatten: false
        cwd:     "src"
        src:     ["**/*.coffee"]
        dest:    "docs/"
        ext:     ".md"
      ]
