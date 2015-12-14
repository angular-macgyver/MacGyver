module.exports = function(grunt) {
  /**
   * watch section
   * Watch all js, css and jade changes
   */

  grunt.config("watch", {
    options: {
      livereload: true
    },
    js: {
      files: ["src/**/*.js"],
      tasks: ["karma:unit:run", "concat:example"]
    },
    doc: {
      files: ["docs/doc.js"],
      tasks: ["copy:doc"]
    },
    test: {
      files: ["test/**/*.spec.js"],
      tasks: ["karma:unit:run"]
    },
    css: {
      files: ["src/css/*.styl", "vendor/vendor.styl"],
      tasks: ["stylus:dev"]
    },
    jade: {
      files: ["docs/*.jade"],
      tasks: ["jade", "replace:docs"]
    },
    template: {
      files: ["src/template/*.html"],
      tasks: ["copy:template"]
    }
  });
};
