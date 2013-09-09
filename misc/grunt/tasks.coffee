# Path variables
finalBuildPath = "lib/"
componentFile  = "bower.json"

module.exports = (grunt) ->

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
        if grunt.util._(options.replace).isFunction()
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
    fileList = []
    grunt.file.recurse finalBuildPath, (path, root, sub, filename) ->
      fileList.push path if filename.indexOf(".DS_Store") is -1

    data     = grunt.file.read componentFile, encoding: "utf8"
    newArray = JSON.stringify fileList
    data     = data.replace /"main": \[[^\]]+]/, "\"main\": #{newArray}"
    data     = data.replace /"name": [^,]+/ , "\"name\": \"#{grunt.config.get("pkg").name}\""
    data     = data.replace /"version": [^,]+/, "\"version\": \"#{grunt.config.get("pkg").version}\""

    grunt.file.write componentFile, data, encoding: "utf8"
    grunt.log.writeln "Updated bower.json"
