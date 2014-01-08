module.exports = (grunt) ->
  require('matchdep').filterDev('grunt-*').forEach grunt.loadNpmTasks

  grunt.initConfig
    pkg:       grunt.file.readJSON "package.json"
    jqueryUI:  grunt.file.readJSON "vendor/bower/jquery.ui/package.json"
    buildConf: grunt.file.readJSON "build.json"

  grunt.loadTasks "misc/grunt"

  grunt.registerTask "prepare", "Prepare for deploying", ["bump", "changelog"]
  grunt.registerTask "concatDeploy", [
    "concat:jqueryui"
    "concat:appJs"
    "concat:deployAppJs"
    "concat:modulesJs"
    "concat:css"
  ]

  grunt.registerTask "deploy", "Build and copy to lib/", [
      "coffee"
      "stylus"
      "jade"
      "concatDeploy"
      "clean"
      "replace:src"
      "chalkboard"
      "marked"
      "replace:docs"
      "replace:version"
      "karma:build"
      "update:component"
      "copy:images"
      "copy:public"
      "uglify:dist"
      "tag"
    ]

  grunt.registerTask "compile", "Compile files", [
    "coffee"
    "stylus"
    "jade"
    "concat:jqueryui"
    "concat:appJs"
    "concat:css"
    "clean"
    "chalkboard"
    "marked"
    "replace:docs"
  ]

  grunt.registerTask "deploy-bower", "Updated all bower repositories", [
    "copy:bower"
    "uglify:bower"
    "stylus:compile"
    "concat:moduleCss"
    "clean"
    "updatebuild"
  ]

  grunt.registerTask "dev", "Watch src and run test server", [
    "compile"
    "karma:unit"
    "server"
    "watch"
  ]
