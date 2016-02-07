module.exports = function(grunt) {
  /**
   * Copy section
   */
  grunt.config("copy", {
    doc: {
      files: [
        {
          src: "lib/macgyver.js",
          dest: "out/scripts/macgyver.js"
        },
        {
          src: "lib/macgyver.css",
          dest: "out/styles/macgyver.css"
        },
        {
          src: "docs/doc.js",
          dest: "out/scripts/doc.js"
        },
        {
          src: "docs/vendor.css",
          dest: "out/styles/vendor.css"
        },
        {
          src: "docs/data.json",
          dest: "out/data.json"
        }
      ]
    }
  });
};
