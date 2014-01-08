module.exports = (grunt) ->

  grunt.config "uglify",
    options:
      report:           "min"
      preserveComments: false
    dist:
      files: [
        {
          src: "lib/<%= pkg.name.toLowerCase() %>.js"
          dest: "lib/<%= pkg.name.toLowerCase() %>.min.js"
        }
      ]
    bower:
      files: [
        {
          src: "lib/<%= pkg.name.toLowerCase() %>.js"
          dest: "build/bower-macgyver/macgyver.min.js"
        }
        {
          src: "lib/<%= pkg.name.toLowerCase() %>-core.js"
          dest: "build/bower-macgyver-core/macgyver-core.min.js"
        }
        {
          src: "lib/<%= pkg.name.toLowerCase() %>-datepicker.js"
          dest: "build/bower-macgyver-datepicker/macgyver-datepicker.min.js"
        }
        {
          src: "lib/<%= pkg.name.toLowerCase() %>-fileupload.js"
          dest: "build/bower-macgyver-fileupload/macgyver-fileupload.min.js"
        }
        {
          src: "lib/<%= pkg.name.toLowerCase() %>-filters.js"
          dest: "build/bower-macgyver-filters/macgyver-filters.min.js"
        }
        {
          src: "lib/<%= pkg.name.toLowerCase() %>-table.js"
          dest: "build/bower-macgyver-table/macgyver-table.min.js"
        }
      ]
