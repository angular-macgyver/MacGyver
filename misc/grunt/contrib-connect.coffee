module.exports = (grunt) ->

  #
  # Connect section
  # Creates a temporary server for display example page
  #
  grunt.config "connect",
    example:
      options:
        port:       9001
        hostname:   "0.0.0.0"
        base:       "example"
        middleware: (connect, options, middlewares) ->
          return [connect.static("example")]

    e2e:
      options:
        port:     9001
        base:     ""
        hostname: "0.0.0.0"
