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
    }
  });
};
