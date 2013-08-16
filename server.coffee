fs        = require "fs"
express   = require "express"

exports.startServer = (port, publicPath, callback) ->
  server = express()

  server.use express.static publicPath
  server.use express.bodyParser()

  # Server routes n' stuff
  server.post "/test_upload", (req, res) ->
    newPaths = []
    for file in req.files.files
      data    = fs.readFileSync file.path
      newPath = __dirname + "/example/uploads/#{file.name}"
      fs.writeFileSync newPath, data
      console.log newPath
      newPaths.push newPath
    res.send newPaths

  server.listen port

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


  Macgyver express server running on at localhost:#{port}.
  """
