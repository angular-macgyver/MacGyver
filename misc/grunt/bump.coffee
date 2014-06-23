module.exports = (grunt) ->
  #
  # bump section
  # Update package and bower version
  #
  grunt.config "bump",
    options:
      files: [
        "bower.json"
        "package.json"
      ]
      updateConfigs: [
        "bower"
        "pkg"
      ]
      commit:        false
      commitMessage: "chore(build): Build v%VERSION%"
      tagMessage:    "Build v%VERSION%"
      push:          false
      createTag:     false
