module.exports = function(grunt) {
  function replaceTemplate(match) {
    var compiledHtml, filePath;
    filePath = require("path").join("src/", match[1]);
    compiledHtml = grunt.file.read(filePath);
    compiledHtml = compiledHtml.replace(/"/g, "\\\"");
    compiledHtml = compiledHtml.replace(/\n/g, "");
    return "template: \"" + (compiledHtml.trim()) + "\"";
  };

  /**
   * Replace section
   * replace placeholder with contents
   */
  grunt.config("replace", {
    src: {
      options: {
        pattern: /templateUrl: "([^"]+)"/g,
        replace: replaceTemplate
      },
      files: [
        {
          expand: true,
          flatten: false,
          src: ["lib/*.js", "!lib/macgyver.min.js"],
          ext: ".js"
        }
      ]
    },
    bower: {
      options: {
        pattern: /templateUrl: "([^"]+)"/g,
        replace: replaceTemplate
      },
      files: [
        {
          expand: true,
          flatten: false,
          src: ["build/**/*.js", "!build/**/*.min.js"],
          ext: ".js"
        }
      ]
    },
    docs: {
      options: {
        pattern: /@@include\("([^"]+)"\)/g,
        replace: function(match) {
          return grunt.file.read(match[1]);
        }
      },
      files: [
        {
          expand: true,
          flatten: false,
          cwd: "example",
          src: "*.html",
          dest: "example/"
        }
      ]
    },
    version: {
      options: {
        pattern: /@@version/g,
        replace: "<%= pkg.version %>"
      },
      files: [
        {
          expand: true,
          flatten: false,
          cwd: "example",
          src: "*.html",
          dest: "example/"
        }
      ]
    }
  });
};
