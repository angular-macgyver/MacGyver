// Path variables
var child = require("child_process");

var GIT_TAG = "git describe --tags --abbrev=0";

function getLastVersion(callback) {
  child.exec(GIT_TAG, function(error, stdout, stderr) {
    var data = error != null ? "" : stdout.replace("\n", "");
    callback(error, data);
  });
};

module.exports = function(grunt) {

  /**
   * @name replace
   * @description
   * Replace placeholder with other values and content
   */
  grunt.registerMultiTask("replace", "Replace placeholder with contents", function() {
    var options = this.options({
      separator: "",
      replace: "",
      pattern: null
    });

    var parse = function(code) {
      var templateUrlRegex = options.pattern;
      var updatedCode = code;
      var match;
      while (match = templateUrlRegex.exec(code)) {
        var replacement;
        if (grunt.util._(options.replace).isFunction()) {
          replacement = options.replace(match);
        } else {
          replacement = options.replace;
        }
        updatedCode = updatedCode.replace(match[0], replacement);
      }
      return updatedCode;
    };

    this.files.forEach(function(file) {
      var src = file.src.filter(function(filepath) {
        var exists;
        if (!(exists = grunt.file.exists(filepath))) {
          grunt.log.warn("Source file '" + filepath + "' not found");
        }
        return exists;
      }).map(function(filepath) {
        return parse(grunt.file.read(filepath));
      }).join(grunt.util.normalizelf(options.separator));

      grunt.file.write(file.dest, src);
      grunt.log.writeln("Replace placeholder with contents in '" + file.dest + "' successfully");
    });
  });

  /**
   * @name tag
   * @description
   * Create a new commit and tag the commit with a version number
   */
  grunt.registerTask("tag", "Tag latest commit", function() {
    var done = this.async();
    var version = grunt.config.get("pkg").version;

    var CMD = [
      "git commit -am 'chore(build): Build v" + version + "'",
      "git tag v" + version
    ].join("&&");

    child.exec(CMD, function(error, stdout, stderr) {
      if (error != null) {
        grunt.fail.fatal("Failed to tag");
      }
      grunt.log.writeln(stdout);
      done();
    });
  });

  /**
   * @name protractor
   * @description
   * To run protractor. Following codes are taken from AngularJS, see:
   * https://github.com/angular/angular.js/blob/master/lib/grunt/utils.js#L155
   */
  grunt.registerMultiTask("protractor", "Run Protractor integration tests", function() {
    var done = this.async();

    var args = ["node_modules/protractor/bin/protractor", this.data];

    p = child.spawn("node", args);
    p.stdout.pipe(process.stdout);
    p.stderr.pipe(process.stderr);
    p.on("exit", function(code) {
      if (code !== 0) {
        grunt.fail.warn("Protractor test(s) failed. Exit code: " + code);
      }
      done();
    });
  });
};
