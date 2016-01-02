module.exports = function(grunt) {
  grunt.config("uglify", {
    options: {
      report: "min",
      preserveComments: false
    },
    dist: {
      files: [
        {
          src: "lib/<%= pkg.name.toLowerCase() %>.js",
          dest: "lib/<%= pkg.name.toLowerCase() %>.min.js"
        }
      ]
    },
    bower: {
      files: [
        {
          src: "build/bower-macgyver/<%= pkg.name.toLowerCase() %>.js",
          dest: "build/bower-macgyver/macgyver.min.js"
        }, {
          src: "build/bower-macgyver-filters/<%= pkg.name.toLowerCase() %>-filters.js",
          dest: "build/bower-macgyver-filters/macgyver-filters.min.js"
        }
      ]
    }
  });
};
