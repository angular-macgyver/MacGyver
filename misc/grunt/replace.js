module.exports = function(grunt) {
  /**
   * Replace section
   * replace placeholder with contents
   */
  grunt.config("replace", {
    src: {
      options: {
        pattern: /templateUrl: ["'](.+)["']/g,
        replace: function (match) {
          var compiledHtml, filePath;
          filePath = require("path").join("src/", match[1]);
          compiledHtml = grunt.file.read(filePath);
          compiledHtml = compiledHtml.replace(/"/g, "\\\"");
          compiledHtml = compiledHtml.replace(/\n/g, "");
          return "template: \"" + (compiledHtml.trim()) + "\"";
        }
      },
      files: [
        {
          expand: true,
          flatten: false,
          src: ["lib/*.js", "!lib/macgyver.min.js"],
          ext: ".js"
        }
      ]
    }
  });
};
