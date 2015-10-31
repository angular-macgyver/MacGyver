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
    doc:
      files: [
        src: "docs/doc.js",
        dest: "example/js/doc.js"
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
