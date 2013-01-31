express   = require "express"
httpProxy = require "http-proxy"

exports.startServer = (port, publicPath, callback) ->
  server = express()

  server.use express.static publicPath

  # Server routes n' stuff
  server.get("/upload_files")

  server.listen port

  console.log "Macgyver preview server running on port #{port}..."
