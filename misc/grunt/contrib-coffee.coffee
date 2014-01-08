module.exports = (grunt) ->

  #
  # Coffeescript section
  # Compile all coffeescripts to tmp/app before concatenating
  #
  grunt.config "coffee",
    options:
      bare: true
    appCoffee:
      expand: true
      cwd:    "src"
      src:    ["**/*.coffee"]
      dest:   "tmp/app/"
      ext:    ".js"
