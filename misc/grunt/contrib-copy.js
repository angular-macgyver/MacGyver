module.exports = function(grunt) {
  /**
   * Copy section
   * Currently used for copying images, MacGyver.js and MacGyver.css
   * when deploying code
   */
  grunt.config("copy", {
    template: {
      files: [
        {
          expand: true,
          flatten: true,
          src: ["src/template/*.html"],
          dest: "example/template/"
        }
      ]
    },
    data: {
      files: [
        {
          src: "docs/data.json",
          dest: "example/data.json"
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
    },
    public: {
      files: [
        {
          expand: true,
          flatten: true,
          src: ["example/css/<%= pkg.name.toLowerCase() %>.css"],
          dest: "lib/"
        }
      ]
    }
  });
};
