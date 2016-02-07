module.exports = function(grunt) {
  grunt.config('jsdoc', {
    doc: {
      src: ['src/'],
      options: {
        destination: 'out',
        configure: 'jsdoc.json',
        template: "node_modules/macgyver-jsdoc/template"
      }
    }
  });
}
