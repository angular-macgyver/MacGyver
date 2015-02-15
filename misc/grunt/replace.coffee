module.exports = (grunt) ->

  replaceTemplate = (match) ->
    filePath     = require("path").join "src/", match[1]
    compiledHtml = grunt.file.read filePath
    compiledHtml = compiledHtml.replace /"/g, "\\\""
    compiledHtml = compiledHtml.replace /\n/g, ""
    "template: \"#{compiledHtml.trim()}\""

  #
  # replace section
  # Replace placeholder with contents
  #
  grunt.config "replace",
    src:
      options:
        pattern: /templateUrl: "([^"]+)"/g
        replace: replaceTemplate
      files: [
        expand:  true
        flatten: false
        src:     [
          "lib/*.js"
          "!lib/macgyver.min.js"
        ]
        ext: ".js"
      ]
    bower:
      options:
        pattern: /templateUrl: "([^"]+)"/g
        replace: replaceTemplate
      files: [
        expand:  true
        flatten: false
        src:     [
          "build/**/*.js"
          "!build/**/*.min.js"
        ]
        ext: ".js"
      ]
    docs:
      options:
        pattern: /@@include\("([^"]+)"\)/g
        replace: (match) -> grunt.file.read match[1]
      files: [
        expand:  true
        flatten: false
        cwd:     "example"
        src:     "*.html"
        dest:    "example/"
      ]
    version:
      options:
        pattern: /@@version/g
        replace: "<%= pkg.version %>"
      files: [
        expand:  true
        flatten: false
        cwd:     "example"
        src:     "*.html"
        dest:    "example/"
      ]
