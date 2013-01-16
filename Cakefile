fs            = require "fs"
path          = require "path"
child_process = require "child_process"
bower         = require "bower"

testacularPath = "./node_modules/.bin/testacular"
brunchPath     = "./node_modules/brunch/bin/brunch"
examplePath    = "example/"
finalBuildPath = "lib/"

spawn = (command, args = [], callback = ->) ->
  ps = child_process.spawn command, args

  addLogging = (obj) ->
    obj.setEncoding "utf8"
    obj.on "data", (data) -> console.log data

  addLogging ps.stdout
  addLogging ps.stderr

  ps.on "exit", callback

updateBowerPaths = ->
  bower.commands.list(paths: true).on "data", (files) ->
    files.chosen = path.join files.chosen, "chosen", "chosen.jquery.js"
    fs.writeFile "bower-paths.json", JSON.stringify(files), "utf8"

task "update:paths", "Update bower paths file", -> updateBowerPaths()

task "test", "Run tests with testacular", ->
  spawn testacularPath, ["start", "test/testacular.conf.js"]

task "build", "Build the latest angular util", ->
  spawn brunchPath, ["build"], ->
    fromFile  = path.join examplePath, "js/angular-util.js"
    writeFile = path.join finalBuildPath, "angular-util.js"
    fs.createReadStream(fromFile).pipe(fs.createWriteStream(writeFile))
    
    console.log "Angular util built successfully"
