module.exports = (grunt) ->

  #
  # Concat section
  # appJs       - concat all the application code into MacGyver.js
  # deployAppJs - concat all app code for deployment
  # modulesJs   - modularized js
  # css         - compile all css
  #

  grunt.config "concat",
    appJs:
      dest: "example/js/<%= pkg.name %>.js"
      src: "<%= buildConf.full %>"

    deployAppJs:
      options:
        banner:"""/**
                   * MacGyver v<%= pkg.version %>
                   * @link <%= pkg.homepage %>
                   * @license <%= pkg.license[0].type %>
                   */
                  (function(window, angular, undefined) {

                """
        footer: "\n})(window, window.angular);"
      dest: "lib/<%= pkg.name.toLowerCase() %>.js"
      src: "<%= buildConf.full %>"

    modulesJs:
      options:
        banner:"""/**
                   * MacGyver v<%= pkg.version %>
                   * @link <%= pkg.homepage %>
                   * @license <%= pkg.license[0].type %>
                   */
                  (function(window, angular, undefined) {

                """
        footer: "\n})(window, window.angular);"
      files: [
        {
          src:  "<%= buildConf.core %>"
          dest: "lib/<%= pkg.name.toLowerCase() %>-core.js"
        }
        {
          src:  "<%= buildConf.filters %>"
          dest: "lib/<%= pkg.name.toLowerCase() %>-filters.js"
        }
        {
          src:  "<%= buildConf.underscoreFilter %>"
          dest: "lib/<%= pkg.name.toLowerCase() %>-string-filter.js"
        }
      ]
