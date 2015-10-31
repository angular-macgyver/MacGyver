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
        src:     ["**/*.js"]
        dest:    "docs/"
        ext:     ".md"
      ]
