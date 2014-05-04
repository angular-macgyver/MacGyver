module.exports = (grunt) ->
  grunt.config "gh-pages",
    'doc':
      options:
        base:    'example'
        push:    false
        message: "v<%= pkg.version %> docs update"
      src: ['**']