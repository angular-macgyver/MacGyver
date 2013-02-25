server = require "./server"
path   = require "path"
fs     = require "fs"
wrench = require "wrench"

# Path variables
examplePath    = "example/"
finalBuildPath = "lib/"
componentFile  = "component.json"

module.exports = (grunt) ->
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-stylus"
  grunt.loadNpmTasks "grunt-contrib-jade"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-uglify"

  # Internal functions
  setupStream = (stream) ->
    stream.setEncoding "utf8"
    stream.on "data", (data) -> console.log data

  spawn = (options, done = ->) ->
    fork = grunt.util.spawn options, done
    setupStream fork.stdout
    setupStream fork.stderr

  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"

    #
    # Coffeescript section
    # Compile all coffeescripts to tmp/app before concatenating
    #
    coffee:
      options:
        bare: true
      appCoffee:
        expand: true
        cwd:    "src"
        src:    ["**/*.coffee"]
        dest:   "tmp/app/"
        ext:    ".js"

    #
    # Concat section
    # vendorJs  - compile all the vendor codes from bower
    # appJs     - concat all the application code into MacGyver.js
    # vendorCss - compile all vendor css from bower
    # appCss    - concat application css into MacGyver.css
    #
    concat:
      vendorJs:
        dest: "example/js/vendor.js"
        src: [
          "vendor/bower/**/*.js"
        ]

      appJs:
        dest: "example/js/<%= pkg.name %>.js"
        src: [
          "tmp/app/main.js"
          "vendor/js/*.js"
          "tmp/app/**/*.js"
        ]

      vendorCss:
        dest: "example/css/vendor.css"
        src: [
          "vendor/bower/*.css"
          "vendor/bower/**/*.css"
          "tmp/vendor.css"
        ]

      appCss:
        dest: "example/css/<%= pkg.name %>.css"
        src: [
          "vendor/css/*.css"
          "tmp/app.css"
        ]

    #
    # Stylus section
    # Adding nib to all stylus
    # Compile app css into tmp/app.css temporarily
    # Compile vendor stylus, e.g. example css into tmp/vendor.css
    #
    stylus:
      compile:
        options:
          use: [require "nib"]
        files:
          "tmp/app.css":    ["src/css/*.styl"]
          "tmp/vendor.css": "vendor/bower/vendor.styl"

    #
    # Jade section
    # Compile all template jade files into example folder
    #
    jade:
      files:
        expand: true
        cwd:    "src"
        src:    ["**/*.jade"]
        ext:    ".html"
        dest:   "example"

    #
    # Copy section
    # Currently used for copying images, MacGyver.js and MacGyver.css
    # when deploying code
    #
    copy:
      images:
        files: [
          expand: true
          src: ["example/img/**"]
          dest: "lib/"
        ]

      public:
        files: [
          expand: true
          src: [
            "example/css/<%= pkg.name %>.css"
            "example/js/<%= pkg.name %>.js"
          ]
          dest: "lib/"
        ]

    #
    # Clean section
    # Clean up tmp folder used during compiling
    #
    clean: ["tmp"]

    ###
    uglify
      dist:
        files:
          "lib/<%= pkg.name %>.min.js": "lib/<%= pkg.name %>.js"
    ###

    #
    # watch section
    # Watch all js, css and jade changes
    #
    watch:
      js:
        files: ["src/**/*.coffee", "src/*.coffee"]
        tasks: ["coffee", "concat:appJs", "clean"]
        options: interrupt: true
      css:
        files: ["src/css/*.styl"]
        tasks: ["stylus", "concat:appCss", "clean"]
        options: interrupt: true
      jade:
        files: ["src/**/*.jade"]
        tasks: ["jade"]
        options: interrupt: true

  # Replace templateUrl with actual html
  grunt.registerTask "embed:html", "Replace templateUrl with actual html", ->
    fromFile         = path.join examplePath, "js/macgyver.js"
    writeFile        = path.join finalBuildPath, "macgyver.js"
    templateUrlRegex = /templateUrl: "([^"]+)"/g
    done             = @async()

    fs.readFile fromFile, "utf8", (err, data) ->
      throw err if err?

      updatedCode = data

      while match = templateUrlRegex.exec data
        toReplace    = match[0]
        filePath     = path.join examplePath, match[1]
        compiledHtml = fs.readFileSync filePath, "utf8"
        compiledHtml = compiledHtml.replace /"/g, "\\\""
        updatedCode  = updatedCode.replace toReplace, "template: \"#{compiledHtml}\""

      fs.writeFile writeFile, updatedCode, "utf8", (err, data) ->
        grunt.log.writeln "Embeded html successfully"
        done()

  # Read all files in build folder and add to component.json
  grunt.registerTask "update:component", "Update component.json for bower", ->
    fileList = wrench.readdirSyncRecursive finalBuildPath
    done     = @async()

    fs.readFile componentFile, "utf8", (err, data) ->
      throw err if err?

      fileList = _(fileList).map (file) -> path.join "lib", file

      newArray = JSON.stringify fileList
      data     = data.replace /"main": \[[^\]]+]/, "\"main\": #{newArray}"

      fs.writeFile componentFile, data, "utf8", (err, data) ->
        grunt.log.writeln "Updated component.json"
        done()

  grunt.registerTask "deploy", "Build and copy to lib/",
    ["compile", "copy", "embed:html", "update:component"]

  grunt.registerTask "compile", "Compile files",[
    "coffee"
    "stylus"
    "jade"
    "concat"
    "clean"
  ]

  grunt.registerTask "test", "Run testacular for unit tests", ->
    @async()

    spawn
      cmd:  "./node_modules/.bin/testacular"
      args: ["start", "test/testacular.conf.js"]

  grunt.registerTask "run", "Watch src and run test server", ->
    @async()

    grunt.util.spawn
      grunt: true
      args: ["compile"]
    , ->
      spawn
        grunt: true
        args: ["watch"]
      spawn
        grunt: true
        args: ["server"]

  grunt.registerTask "server", "Run test server", ->
    @async()

    server.startServer 9001, "example"
