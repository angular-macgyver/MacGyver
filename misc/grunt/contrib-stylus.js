module.exports = function(grunt) {
  /**
   * Stylus section
   * Adding nib to all stylus
   */
  grunt.config("stylus", {
    options: {
      use: ["nib"],
      paths: ["src/css/"],
      "import": ["_variables"]
    },
    dev: {
      files: [
        {
          "lib/macgyver.css": "<%= buildConf.css.core %>",
        }
      ]
    }
  });
};
