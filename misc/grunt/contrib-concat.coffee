module.exports = (grunt) ->

  #
  # Concat section
  # jqueryui    - compile required jquery ui files
  # appJs       - concat all the application code into MacGyver.js
  # deployAppJs - concat all app code for deployment
  # modulesJs   - modularized js
  # css         - compile all css
  #

  grunt.config "concat",
    jqueryui:
      options:
        process: (src, filepath) ->
          src.replace /@VERSION/g, grunt.config.get("jqueryUI").version
      dest: "tmp/jqueryui.js"
      src:  "<%= buildConf.jqueryui %>"

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
        {
          src:  "<%= buildConf.table %>"
          dest: "lib/<%= pkg.name.toLowerCase() %>-table.js"
        }
        {
          src:  "<%= buildConf.datepicker %>"
          dest: "lib/<%= pkg.name.toLowerCase() %>-datepicker.js"
        }
      ]

    css:
      files: [
        {
          dest: "example/css/vendor.css"
          src:  ["tmp/vendor.css"]
        }
        {
          dest: "example/css/<%= pkg.name.toLowerCase() %>.css"
          src: "<%= buildConf.css.example %>"
        }
      ]

    moduleCss:
      files: [
        {
          dest: "build/bower-macgyver/<%= pkg.name.toLowerCase() %>.css"
          src: "<%= buildConf.css.example %>"
        }
        {
          dest: "build/bower-macgyver-core/<%= pkg.name.toLowerCase() %>-core.css"
          src: "<%= buildConf.css.core %>"
        }
        {
          dest: "build/bower-macgyver-datepicker/<%= pkg.name.toLowerCase() %>-datepicker.css"
          src: "<%= buildConf.css.datepicker %>"
        }
        {
          dest: "build/bower-macgyver-table/<%= pkg.name.toLowerCase() %>-table.css"
          src: "<%= buildConf.css.table %>"
        }
      ]
