server = require "./server"
path   = require "path"
fs     = require "fs"
wrench = require "wrench"
_      = require "underscore"

# Path variables
examplePath    = "example/"
finalBuildPath = "lib/"
componentFile  = "bower.json"

module.exports = (grunt) ->
  require('matchdep').filterDev('grunt-*').forEach grunt.loadNpmTasks

  # Internal functions
  spawn = (options, done = ->) ->
    options.opts ?= stdio: "inherit"
    grunt.util.spawn options, done

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
          "vendor/bower/angular/angular.js"
        ]

      appJs:
        dest: "example/js/<%= pkg.name %>.js"
        src: [
          "tmp/app/main.js"
          "vendor/js/jquery-ui.js"
          "vendor/js/*.js"
          "tmp/app/**/*.js"
        ]

      deployAppJs:
        dest: "lib/<%= pkg.name %>.js"
        src: [
          "tmp/app/main.js"
          "vendor/js/jquery-ui.js"
          "vendor/js/*.js"
          "tmp/app/**/*.js"
          "!tmp/app/example_controller/*.js"
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
          "tmp/vendor.css": "vendor/vendor.styl"

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
          expand:  true
          flatten: true
          src:     ["example/img/**"]
          dest:    "lib/img"
        ]

      public:
        files: [
          expand:  true
          flatten: true
          src:     [
            "example/css/<%= pkg.name %>.css"
          ]
          dest: "lib/"
        ]

    #
    # Clean section
    # Clean up tmp folder used during compiling
    #
    clean: ["tmp"]

    uglify:
      dist:
        files:
          "lib/<%= pkg.name %>.min.js": "lib/<%= pkg.name %>.js"

    #
    # watch section
    # Watch all js, css and jade changes
    #
    watch:
      js:
        files: ["src/**/*.coffee", "src/*.coffee"]
        tasks: ["coffee", "concat:appJs", "clean", "copy:public"]
        options: interrupt: true
      css:
        files: ["src/css/*.styl"]
        tasks: ["stylus", "concat:appCss", "clean"]
        options: interrupt: true
      jade:
        files: ["src/**/*.jade"]
        tasks: ["jade"]
        options: interrupt: true

    karma:
      unit:
        configFile: "test/karma.conf.js"
        autoWatch: true

  # Replace templateUrl with actual html
  grunt.registerTask "embed:html", "Replace templateUrl with actual html", ->
    fromFile         = path.join finalBuildPath, "macgyver.js"
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
  grunt.registerTask "update:component", "Update bower.json", ->
    fileList = wrench.readdirSyncRecursive finalBuildPath
    done     = @async()

    fs.readFile componentFile, "utf8", (err, data) ->
      throw err if err?

      fileList = _(fileList).map (file) -> path.join "lib", file

      newArray = JSON.stringify fileList
      data     = data.replace /"main": \[[^\]]+]/, "\"main\": #{newArray}"
      data     = data.replace /"name": [^,]+/ , "\"name\": \"#{grunt.config.get("pkg").name}\""
      data     = data.replace /"version": [^,]+/, "\"version\": \"#{grunt.config.get("pkg").version}\""

      fs.writeFile componentFile, data, "utf8", (err, data) ->
        grunt.log.writeln "Updated bower.json"
        done()

  grunt.registerTask "deploy", "Build and copy to lib/", [
      "coffee"
      "stylus"
      "jade"
      "concat"
      "clean"
      "copy"
      "embed:html"
      "update:component"
      "uglify"
    ]

  grunt.registerTask "compile", "Compile files", [
    "coffee"
    "stylus"
    "jade"
    "concat:vendorJs"
    "concat:appJs"
    "concat:vendorCss"
    "concat:appCss"
    "clean"
  ]

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
