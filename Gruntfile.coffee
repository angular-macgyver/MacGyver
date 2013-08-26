server = require "./server"
path   = require "path"
fs     = require "fs"
wrench = require "wrench"
_      = require "underscore"

# Path variables
examplePath    = "example/"
finalBuildPath = "lib/"
componentFile  = "bower.json"

jqueryui = [
  "vendor/bower/jquery.ui/ui/jquery.ui.core.js"
  "vendor/bower/jquery.ui/ui/jquery.ui.widget.js"
  "vendor/bower/jquery.ui/ui/jquery.ui.mouse.js"
  "vendor/bower/jquery.ui/ui/jquery.ui.position.js"
  "vendor/bower/jquery.ui/ui/jquery.ui.datepicker.js"
  "vendor/bower/jquery.ui/ui/jquery.ui.resizable.js"
  "vendor/bower/jquery.ui/ui/jquery.ui.sortable.js"
]
appFiles = [
  "tmp/app/main.js"
  "tmp/jqueryui.js"
  "vendor/bower/underscore.string/lib/underscore.string.js"
  "vendor/bower/jquery-file-upload/js/jquery.fileupload.js"
  "tmp/app/**/*.js"
]
deployAppFiles = appFiles.slice(0)
deployAppFiles.push "!tmp/app/example_controller/*.js"

module.exports = (grunt) ->
  require('matchdep').filterDev('grunt-*').forEach grunt.loadNpmTasks

  # Internal functions
  spawn = (options, done = ->) ->
    options.grunt ?= true
    options.opts  ?= stdio: "inherit"
    grunt.util.spawn options, done

  grunt.initConfig
    pkg:      grunt.file.readJSON "package.json"
    jqueryUI: grunt.file.readJSON "vendor/bower/jquery.ui/package.json"

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
    # jqueryui    - compile required jquery ui files
    # vendorJs    - compile all the vendor codes from bower
    # appJs       - concat all the application code into MacGyver.js
    # deployAppJs - concat all app code for deployment
    # vendorCss   - compile all vendor css from bower
    # appCss      - concat application css into MacGyver.css
    #
    concat:
      jqueryui:
        dest: "tmp/jqueryui.js"
        src:  jqueryui

      vendorJs:
        dest: "example/js/vendor.js"
        src: [
          "vendor/bower/angular/angular.js"
        ]

      appJs:
        dest: "example/js/<%= pkg.name %>.js"
        src: appFiles

      deployAppJs:
        dest: "lib/<%= pkg.name %>.js"
        src: deployAppFiles

      vendorCss:
        dest: "example/css/vendor.css"
        src:  ["tmp/vendor.css"]

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
          paths:   ["example/css"]
          urlfunc: "url"
          import:  ["nib"]
        files:
          "tmp/app.css": ["src/css/*.styl"]
      vendor:
        options:
          use: ["nib"]
        files:
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
          src:     ["example/css/img/ui-*.png"]
          dest:    "lib/img/"
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
        tasks: ["coffee", "concat:jqueryui", "concat:appJs", "clean", "copy:public"]
        options: interrupt: true
      css:
        files: ["src/css/*.styl"]
        tasks: ["stylus", "concat:appCss", "clean"]
        options: interrupt: true
      vendorCss:
        files: ["vendor/vendor.styl"]
        tasks: ["stylus:vendor", "concat:vendorCss", "clean"]
        options: interrupt: true
      jade:
        files: ["src/**/*.jade"]
        tasks: ["jade", "replace:docs"]
        options: interrupt: true

    #
    # karma section
    # Testing framework
    #
    karma:
      unit:
        configFile: "test/karma.conf.js"
        autoWatch: true
      travis:
        configFile: "test/karma.conf.js"
        autoWatch: false
        singleRun: true

    #
    # chalkboard section
    # Generating documentation from source code
    #
    chalkboard:
      docs:
        files: [
          expand:  true
          flatten: false
          cwd:     "src"
          src:     ["**/*.coffee"]
          dest:    "docs/"
          ext:     ".md"
        ]

    #
    # replace section
    # Replace placeholder with contents
    #
    replace:
      src:
        options:
          pattern: /templateUrl: "([^"]+)"/g
          replace: (match) ->
            filePath     = path.join "example/", match[1]
            compiledHtml = grunt.file.read filePath
            compiledHtml = compiledHtml.replace /"/g, "\\\""
            "template: \"#{compiledHtml}\""
        files:
          "lib/macgyver.js": ["lib/macgyver.js"]
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
      jqueryui:
        options:
          pattern: /@VERSION/g
          replace: "<%= jqueryUI.version %>"
        files: [
          src:  "tmp/jqueryui.js"
          dest: "tmp/jqueryui.js"
        ]

    marked:
      docs:
        files:[
          expand:  true
          flatten: false
          cwd:     "docs"
          src:     "**/*.md"
          dest:    "docs/html"
          ext:     ".html"
        ]

  # Replace templateUrl with actual html
  grunt.registerMultiTask "replace", "Replace placeholder with contents", ->
    options = @options
      separator: ""
      replace:   ""
      pattern:   null

    parse = (code) ->
      templateUrlRegex = options.pattern
      updatedCode      = code

      while match = templateUrlRegex.exec code
        if _(options.replace).isFunction()
          replacement = options.replace match
        else
          replacement = options.replace

        updatedCode = updatedCode.replace match[0], replacement

      return updatedCode

    @files.forEach (file) ->
      src = file.src.filter (filepath) ->
        unless (exists = grunt.file.exists(filepath))
          grunt.log.warn "Source file '#{filepath}' not found"
        return exists
      .map (filepath) ->
        parse grunt.file.read(filepath)
      .join grunt.util.normalizelf(options.separator)

      grunt.file.write file.dest, src
      grunt.log.writeln("Replace placeholder with contents in '#{file.dest}' successfully")

  grunt.registerMultiTask "marked", "Convert markdown to html", ->
    options = @options
      separator: grunt.util.linefeed

    @files.forEach (file) ->
      src = file.src.filter (filepath) ->
        unless (exists = grunt.file.exists(filepath))
          grunt.log.warn "Source file '#{filepath}' not found"
        return exists
      .map (filepath) ->
        marked = require "marked"
        marked grunt.file.read(filepath)
      .join grunt.util.normalizelf(options.separator)

      grunt.file.write file.dest, src
      grunt.log.writeln("Converted '#{file.dest}'")

  # Read all files in build folder and add to component.json
  grunt.registerTask "update:component", "Update bower.json", ->
    fileList = wrench.readdirSyncRecursive finalBuildPath
    done     = @async()

    fs.readFile componentFile, "utf8", (err, data) ->
      throw err if err?

      fileList = _(fileList).map (file) ->
        if file.indexOf(".DS_Store") is -1
          path.join "lib", file
        else
          ""
      fileList = _(fileList).compact()

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
      "concat:jqueryui"
      "replace:jqueryui"
      "concat:vendorJs"
      "concat:appJs"
      "concat:deployAppJs"
      "concat:vendorCss"
      "concat:appCss"
      "clean"
      "copy"
      "replace:src"
      "chalkboard"
      "marked"
      "replace:docs"
      "update:component"
      "uglify"
    ]

  grunt.registerTask "compile", "Compile files", [
    "coffee"
    "stylus"
    "jade"
    "concat:jqueryui"
    "replace:jqueryui"
    "concat:vendorJs"
    "concat:appJs"
    "concat:vendorCss"
    "concat:appCss"
    "clean"
    "chalkboard"
    "marked"
    "replace:docs"
  ]

  grunt.registerTask "run", "Watch src and run test server", ->
    @async()

    spawn args: ["compile"], ->
      spawn args: ["watch"]
      spawn args: ["server"]
      spawn args: ["karma:unit"]

  grunt.registerTask "server", "Run test server", ->
    @async()

    server.startServer 9001, "example"
