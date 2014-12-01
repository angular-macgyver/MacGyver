module.exports = (grunt) ->
  console.log """

  f;:i     f;:l                       ,:ilttlf:
  fffLf   Lffff                      ,iltLllCLf
  tfLL;   itfLf     t       tltfL f ;itfffGtiiLfl;llt @,:;Cliii  li;f;lii;,tf::;litf
  tfLLfL  ;LfLt    Lif    L;lLLLftf :Lfff    lit tLLf Ltff fLLf  lfLGffLCCCLfffLLLftL
  itLLLt liLfLt    itt   C;tLtLfiLtllfLi      l  fLLfLtL;  ftLfLfftf tLf   l lft  fft
  iliLLtC;LlfLt    ;ttC  lfffC  @lllffL;  ;i;;lt  fLL;fff   lLLttLf  iftli;l iLt tfLt
  iiilLLfiLffLi@  ;ttfi  lfLL    @ltffLL fLLfltCf ttLtCf    lif;fft  lftt;:f ifli;Ct
  iilfLLlLttffi@  ittLtfLlfLi      ltLLL it;:ffLf  fLLL      lLfLl   iL;,:ti iLlLL;
  ;ilftLLCLtfLi@ ttfLLLlLtLLl     LfiLLf LLLtfLLt   lLt      fffLl   ;ff     ;LtlLl
  litLtLLtCtLLlG ;ClllLLffLLf    ttLfCLLL   tlLLi   tLt      tiLtf   iLl   : :LtftLt
  llfLffCi ;LLlGitfLLfLLtflLLfCL;tLLflCLftt:.tLLt   tLi       iLl    iLl:;:t :Lt lLLi
  tfffLtCC iLLt@tCl  CiLLittCLLfCLf  tfLCLLLCCfl    LCi       ;ft    LCCCCCi fCL  lLL;
  iLLf tf  lffffLft   fttt tltiltt    ftti;::lt    tfttf      Lf    tftllltf;ftit lfft
        C                                l;;                   C                   ff

  """

  require('matchdep').filterDev('grunt-*').forEach grunt.loadNpmTasks

  grunt.initConfig
    pkg:       grunt.file.readJSON "package.json"
    bower:     grunt.file.readJSON "bower.json"
    buildConf: grunt.file.readJSON "build.json"

  grunt.loadTasks "misc/grunt"

  require('time-grunt') grunt

  grunt.registerTask "concatDeploy", [
    "concat:appJs"
    "concat:deployAppJs"
    "concat:modulesJs"
  ]

  grunt.registerTask "deploy", "Build and copy to lib/", [
    "coffee"
    "stylus"
    "jade"
    "concatDeploy"
    "clean"
    "replace:src"
    "chalkboard"
    "marked"
    "replace:docs"
    "replace:version"
    "karma:build"
    "update:component"
    "copy:public"
    "uglify:dist"
    "tag"
  ]

  grunt.registerTask "compile", "Compile files", [
    "coffee"
    "stylus:dev"
    "jade"
    "concat:appJs"
    "clean"
    "chalkboard"
    "marked"
    "replace:docs"
  ]

  grunt.registerTask "deploy-bower", "Updated all bower repositories", [
    "copy:bower"
    "uglify:bower"
    "stylus:module"
    "clean"
    "updatebuild"
  ]

  grunt.registerTask "dev", "Watch src and run test server", [
    "compile:dev"
    "copy:data"
    "copy:template"
    "karma:unit"
    "connect:example"
    "watch"
  ]

  grunt.registerTask "test:unit", "Alias for karma:travis", ["karma:travis"]
  grunt.registerTask "test:e2e", "Compile all source code, run a test server and run the end to end tests", [
    "clean"
    "coffee"
    "stylus:dev"
    "jade"
    "copy:data"
    "copy:template"
    "concatDeploy"
    "clean"
    "replace:src"
    "connect:e2e"
    "protractor:normal"
  ]
