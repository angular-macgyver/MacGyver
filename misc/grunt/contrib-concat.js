module.exports = function(grunt) {
  /**
   * Concat section
   * lib   - Full MacGyver package
   */
  grunt.config("concat", {
    options: {
      banner: "/**\n * MacGyver v<%= pkg.version %>\n * @link <%= pkg.homepage %>\n * @license <%= pkg.license[0].type %>\n */\n(function(window, angular, undefined) {\n",
      footer: "\n})(window, window.angular);"
    },
    lib: {
      dest: "lib/macgyver.js",
      src: "<%= buildConf.full %>"
    }
  });
};
