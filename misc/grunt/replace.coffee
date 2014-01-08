module.exports = (grunt) ->

  #
  # replace section
  # Replace placeholder with contents
  #
  grunt.config "replace",
    src:
      options:
        pattern: /templateUrl: "([^"]+)"/g
        replace: (match) ->
          filePath     = require("path").join "example/", match[1]
          compiledHtml = grunt.file.read filePath
          compiledHtml = compiledHtml.replace /"/g, "\\\""
          "template: \"#{compiledHtml}\""
      files: [
        expand:  true
        flatten: false
        src:     [
          "lib/*.js"
          "!lib/macgyver.min.js"
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
