module.exports = function (grunt) {
  /**
   * eslint section
   */
  grunt.config('eslint', {
    options: {
      configFile: 'eslint.json'
    },
    src: {
      files: {
        src: ['src/**/*.js']
      }
    },
    test: {
      options: {
        envs: ['jasmine'],
        globals: ['module', 'inject', 'browserTrigger']
      },
      files: {
        src: ['test/unit/**/*.js']
      }
    },
    e2e: {
      options: {
        envs: ['protractor', 'jasmine']
      },
      files: {
        src: ['test/e2e/*.js']
      }
    }
  });
}
