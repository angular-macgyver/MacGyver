module.exports = (grunt) ->

  grunt.config "stylus",
    #
    # Stylus section
    # Adding nib to all stylus
    # Compile app css into tmp/app.css temporarily
    # Compile vendor stylus, e.g. example css into tmp/vendor.css
    #
    compile:
      options:
        urlfunc:
          name: "url"
          paths: ["src"]
        import:  ["nib"]
      files: [
        expand:  true
        flatten: true
        src:     "src/css/*.styl"
        dest:    "tmp/css"
        ext:     ".css"
      ]
    vendor:
      options:
        use: ["nib"]
      files:
        "tmp/vendor.css": "vendor/vendor.styl"
