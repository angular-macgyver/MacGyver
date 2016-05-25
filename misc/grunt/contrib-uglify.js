module.exports = function(grunt) {
  grunt.config("uglify", {
    options: {
      report: "min",
      preserveComments: false
    },
    dist: {
      files: [
        {
          src: "lib/macgyver.js",
          dest: "dist/macgyver.min.js"
        }
      ]
    }
  });
};
