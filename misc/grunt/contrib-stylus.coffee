module.exports = (grunt) ->

  grunt.config "stylus",
    #
    # Stylus section
    # Adding nib to all stylus
    #
    options:
      use:    ["nib"]
      paths:  ["src/css/"]
      import: ["_variables"]
    dev:
      files: [
        "example/css/macgyver.css": "<%= buildConf.css.core %>"
        "example/css/vendor.css":   "vendor/vendor.styl"
      ]
    module:
      files: [
        {
          dest: "build/bower-macgyver/<%= pkg.name.toLowerCase() %>.css"
          src:  "<%= buildConf.css.core %>"
        }
        {
          dest: "build/bower-macgyver-core/<%= pkg.name.toLowerCase() %>-core.css"
          src:  "<%= buildConf.css.core %>"
        }
      ]
