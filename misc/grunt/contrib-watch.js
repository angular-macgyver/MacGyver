module.exports = function(grunt) {
  /**
   * watch section
   * Watch all js and css changes
   */

  grunt.config("watch", {
    options: {
      livereload: true
    },
    js: {
      files: ["src/**/*.js"],
      tasks: [
        "eslint:src",
        "karma:unit:run",
        "concat:lib",
        "replace:src",
        "copy:doc"
      ]
    },
    test: {
      files: ["test/**/*.spec.js"],
      tasks: ["eslint:test", "eslint:e2e", "karma:unit:run"]
    },
    css: {
      files: ["src/css/*.styl"],
      tasks: ["stylus"]
    }
  });
};
