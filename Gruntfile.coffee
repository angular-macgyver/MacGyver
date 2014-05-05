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
    jqueryUI:  grunt.file.readJSON "vendor/bower/jquery.ui/package.json"
    buildConf: grunt.file.readJSON "build.json"

  grunt.loadTasks "misc/grunt"

  require('time-grunt') grunt

  grunt.registerTask "prepare", "Prepare for deploying", ["bump", "changelog"]
  grunt.registerTask "concatDeploy", [
    "concat:jqueryui"
    "concat:appJs"
    "concat:deployAppJs"
    "concat:modulesJs"
    "concat:css"
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
      "copy:images"
      "copy:public"
      "uglify:dist"
      "tag"
    ]

  grunt.registerTask "compile", "Compile files", [
    "coffee"
    "stylus"
    "jade"
    "concat:jqueryui"
    "concat:appJs"
    "concat:css"
    "clean"
    "chalkboard"
    "marked"
    "replace:docs"
  ]

  grunt.registerTask "deploy-bower", "Updated all bower repositories", [
    "copy:bower"
    "uglify:bower"
    "stylus:compile"
    "concat:moduleCss"
    "clean"
    "updatebuild"
  ]

  grunt.registerTask "dev", "Watch src and run test server", [
    "compile"
    "copy:example"
    "karma:unit"
    "connect:example"
    "watch"
  ]

  grunt.registerTask "test:unit", "Alias for karma:travis", ["karma:travis"]
  grunt.registerTask "test:e2e", "Compile all source code, run a test server and run the end to end tests", [
    "clean"
    "coffee"
    "stylus"
    "concatDeploy"
    "clean"
    "replace:src"
    "connect:e2e"
    "protractor:normal"
  ]
