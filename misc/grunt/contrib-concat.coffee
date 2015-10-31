module.exports = (grunt) ->

  #
  # Concat section
  # example  - Documentation scripts
  # lib      - Full MacGyver package
  # bower    - Bower packages
  #

  grunt.config "concat",
    options:
      banner:"""/**
                 * MacGyver v<%= pkg.version %>
                 * @link <%= pkg.homepage %>
                 * @license <%= pkg.license[0].type %>
                 */
                (function(window, angular, undefined) {

              """
      footer: "\n})(window, window.angular);"
    example:
      dest: "example/js/<%= pkg.name %>.js"
      src: "<%= buildConf.full %>"
    lib:
      dest: "lib/<%= pkg.name.toLowerCase() %>.js"
      src: "<%= buildConf.full %>"
    bower:
      files: [
        {
          src:  "<%= buildConf.full %>"
          dest: "build/bower-macgyver/macgyver.js"
        }
        {
          src:  "<%= buildConf.core %>"
          dest: "build/bower-macgyver-core/macgyver-core.js"
        }
        {
          src:  "<%= buildConf.filters %>"
          dest: "build/bower-macgyver-filters/macgyver-filters.js"
        }
      ]
