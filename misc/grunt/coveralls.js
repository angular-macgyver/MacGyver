module.exports = function(grunt) {
  grunt.config("coveralls", {
    src: {
      src: "coverage/lcov.info",
      force: false
    }
  });
};
