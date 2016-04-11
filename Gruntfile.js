module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    bower: grunt.file.readJSON("bower.json"),
    buildConf: grunt.file.readJSON("build.json")
  });

  grunt.loadTasks("misc/grunt");

  require('time-grunt')(grunt);

  grunt.registerTask("compile", [
    "stylus",
    "concat:lib",
    "replace:src"
  ]);

  grunt.registerTask("deploy", "Build and copy to lib/", [
    // bump, generate changelog
    "compile",
    "karma:build",
    "uglify:dist",
    "doc"
  ]);

  grunt.registerTask("run", "Watch src and run test server", [
    "compile",
    "eslint",
    "karma:unit",
    "doc",
    "connect:doc",
    "watch"
  ]);

  grunt.registerTask("test:ci", [
    "eslint",
    "karma:travis",
    "coveralls"
  ]);

  grunt.registerTask("test:e2e", "Compile all source code, run a test server and run the end to end tests", [
    "compile",
    "connect:e2e",
    "protractor:normal"
  ]);

  grunt.registerTask('doc', [
    'jsdoc:doc',
    'copy'
  ])
};
