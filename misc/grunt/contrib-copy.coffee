module.exports = (grunt) ->

  #
  # Copy section
  # Currently used for copying images, MacGyver.js and MacGyver.css
  # when deploying code
  #
  grunt.config "copy",
    images:
      files: [
        expand:  true
        flatten: true
        src:     ["src/img/ui-*.png"]
        dest:    "lib/img/"
      ]

    example:
      files: [
        {
          expand:  true
          flatten: true
          src:     ["src/img/ui-*.png"]
          dest:    "example/css/img/"
        },
        {
          expand:  true
          flatten: true
          src:     ["src/template/*.html"]
          dest:    "example/template/"
        },
        "example/data.json": "docs/data.json"

      ]

    public:
      files: [
        expand:  true
        flatten: true
        src:     [
          "example/css/<%= pkg.name.toLowerCase() %>.css"
        ]
        dest: "lib/"
      ]
    bower:
      files: [
        {
          src: "lib/<%= pkg.name.toLowerCase() %>.js"
          dest: "build/bower-macgyver/<%= pkg.name.toLowerCase() %>.js"
        }
        {
          src: "lib/<%= pkg.name.toLowerCase() %>-core.js"
          dest: "build/bower-macgyver-core/macgyver-core.js"
        }
        {
          src: "lib/<%= pkg.name.toLowerCase() %>-filters.js"
          dest: "build/bower-macgyver-filters/macgyver-filters.js"
        }
      ]
