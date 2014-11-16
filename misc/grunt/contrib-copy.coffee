module.exports = (grunt) ->

  #
  # Copy section
  # Currently used for copying images, MacGyver.js and MacGyver.css
  # when deploying code
  #
  grunt.config "copy",
    template:
      files: [
        {
          expand:  true
          flatten: true
          src:     ["src/template/*.html"]
          dest:    "example/template/"
        }
      ]
    data:
      files: [
        src: "docs/data.json",
        dest: "example/data.json"
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
