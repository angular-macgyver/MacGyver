module.exports = (grunt) ->

  grunt.config "marked",
    docs:
      files:[
        expand:  true
        flatten: false
        cwd:     "docs"
        src:     "**/*.md"
        dest:    "docs/html"
        ext:     ".html"
      ]
