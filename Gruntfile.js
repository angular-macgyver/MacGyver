module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    bower: grunt.file.readJSON("bower.json"),
    buildConf: grunt.file.readJSON("build.json")
  });

  grunt.loadTasks("misc/grunt");

  require('time-grunt')(grunt);

  grunt.registerTask("concatDeploy", [
    "concat:example",
    "concat:lib"
  ]);

  grunt.registerTask("deploy", "Build and copy to lib/", ["copy:doc",
    "stylus",
    "jade",
    "concatDeploy",
    "replace:src",
    "chalkboard",
    "marked",
    "replace:docs",
    "replace:version",
    "karma:build",
    "copy:public",
    "uglify:dist",
    "tag"
  ]);

  grunt.registerTask("compile", "Compile files", [
    "copy:doc",
    "stylus:dev",
    "jade",
    "concat:example",
    "chalkboard",
    "marked",
    "replace:docs"
  ]);

  grunt.registerTask("deploy-bower", "Updated all bower repositories", [
    "copy:doc",
    "concat:bower",
    "replace:bower",
    "uglify:bower",
    "stylus:module",
    "updatebuild"
  ]);

  grunt.registerTask("dev", "Watch src and run test server", ["compile",
    "copy:data",
    "copy:template",
    "karma:unit",
    "connect:example",
    "watch"
  ]);

  grunt.registerTask("test:ci", [
    "karma:travis",
    "coveralls"
  ]);

  grunt.registerTask("test:unit", "Alias for karma:travis", [
    "karma:travis"
  ]);

  grunt.registerTask("test:e2e", "Compile all source code, run a test server and run the end to end tests", [
    "copy:doc",
    "stylus:dev",
    "jade",
    "copy:data",
    "copy:template",
    "concat:lib",
    "replace:src",
    "connect:e2e",
    "protractor:normal"
  ]);
};
