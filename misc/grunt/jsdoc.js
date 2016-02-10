module.exports = function(grunt) {
  grunt.config('jsdoc', {
    doc: {
      src: ['src/'],
      options: {
        destination: 'out',
        configure: 'jsdoc.json',
        private: false,
        template: "node_modules/macgyver-jsdoc/template"
      }
    }
  });
}
