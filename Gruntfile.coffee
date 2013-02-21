server = require './server'

module.exports = (grunt) ->
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-stylus"
  grunt.loadNpmTasks "grunt-contrib-jade"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-watch"

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

    coffee:
      options:
        bare: true
      appCoffee:
        expand: true
        cwd:    "src"
        src:    ["**/*.coffee"]
        dest:   "tmp/app/"
        ext:    ".js"

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
        ]

      appCss:
        dest: "example/css/<%= pkg.name %>.css"
        src: [
          "vendor/css/*.css"
          "tmp/app.css"
        ]

    stylus:
      compile:
        options:
          use: [require "nib"]
        files:
          "tmp/app.css":    ["src/css/*.styl"]
          "example/css/vendor.css": "vendor/bower/vendor.styl"

    jade:
      files:
        expand: true
        cwd:    "src"
        src:    ["**/*.jade"]
        ext:    ".html"
        dest:   "example"

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

    clean: ["tmp"]

    uglify
      dist:
        files:
          "lib/<%= pkg.name %>.min.js": "lib/<%= pkg.name %>.js"

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

  grunt.registerTask "deploy", "Build and copy to lib/",
    ["compile", "copy:public"]

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
