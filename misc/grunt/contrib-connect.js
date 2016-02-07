module.exports = function(grunt) {
  /**
   * Connect section
   * Creates a temporary server for display documentation
   */
  grunt.config("connect", {
    doc: {
      options: {
        port: 9001,
        hostname: "0.0.0.0",
        base: "out"
      }
    },
    e2e: {
      options: {
        port: 9001,
        base: "",
        hostname: "0.0.0.0"
      }
    }
  });
};
