module.exports = function(grunt) {
  /**
   * Copy section
   */
  grunt.config("copy", {
    css: {
      files: [
        {
          src: "lib/macgyver.css",
          dest: "out/styles/macgyver.css"
        }
      ]
    },
    doc: {
      files: [
        {
          src: "lib/macgyver.js",
          dest: "out/scripts/macgyver.js"
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
    },
    dist: {
      files: [
        {
          expand: true,
          cwd: "lib/",
          src: ["*"],
          dest: "dist/"
        }
      ]
    }
  });
};
