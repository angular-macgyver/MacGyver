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
          dest: "dist/<%= pkg.name.toLowerCase() %>.min.js"
        }
      ]
    }
  });
};
