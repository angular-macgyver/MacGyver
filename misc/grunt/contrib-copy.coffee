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
    src:
      files: [
        expand:  true
        flatten: false
        cwd:     "src/"
        src:     ["**/*.js"]
        dest:    "tmp/app/"
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
