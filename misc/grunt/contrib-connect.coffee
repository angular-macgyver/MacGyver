fs   = require "fs"
path = require "path"

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
        middleware: (connect, options) ->
          fileHandler = (req, res, next) ->
            if req.method is "POST" and req.url is "/test_upload"
              newPaths = []
              for file in req.files.files
                data    = fs.readFileSync file.path
                newPath = path.join __dirname, "/../../example/uploads/#{file.name}"
                fs.writeFileSync newPath, data
                console.log "Uploaded file to - ", newPath
                newPaths.push newPath
              res.end JSON.stringify newPaths
            else
              next()

          return [
            connect.static(options.base)
            connect.bodyParser()
            fileHandler
          ]

    e2e:
      options:
        port:     9001
        base:     ""
        hostname: "0.0.0.0"
