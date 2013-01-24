fs   = require 'fs'
path = require 'path'
_    = require 'underscore'

bowerVendorPath = "vendor/bower/"
bowerPathMap    = JSON.parse fs.readFileSync('bower-paths.json', 'utf8')
bowerPaths      = _(for name, filename of bowerPathMap
  if /(\.js$)|(\.coffee$)|(\.css$)|(\.styl$)|(\.less$)/.exec filename
    filename
  else
    "#{filename}/#{path.basename filename}.js"
).flatten()

vendorPath = (filename) ->
  return false unless filename.indexOf('vendor') is 0

  if filename.indexOf(bowerVendorPath) is 0
    filename in bowerPaths
  else
    filename.indexOf("brunch_JavaScriptCompiler_") < 0

# Specify css of certain vendor modules to ignore
cssIgnoreModules = [/jquery\.ui/]

beforePaths = _(bowerPaths).union([
    'src/main.coffee'
  ])

exports.config =
  # See http://brunch.readthedocs.org/en/latest/config.html for documentation.
  modules:
    wrapper: false
    definition: false

  paths:
    public: "example"
    app:    "src"

  conventions:
    ignored: -> false

  files:
    javascripts:
      joinTo:
        'js/macgyver.js': /^src/
        'js/vendor.js': vendorPath
      order:
        # Files in `vendor` directories are compiled before other files
        # even if they aren't specified in order.before.
        before: beforePaths

    stylesheets:
      joinTo:
        'css/vendor.css': (filename) ->
          results     = (not module.test(filename) for module in cssIgnoreModules)
          noneIgnored = _(results).every (result) -> result
          (/^vendor\/bower\//.exec(filename)? or vendorPath filename) and noneIgnored
        'css/app.css': /^src\/css/

    templates:
      joinTo:
        'js/templates.js': /^src/

  plugins:
    jade:
      pretty: yes
    static_jade:
      extension: '.jade'
      path: [/^src/]
      asset: "example"
      pages: []

  server:
    port: 4545
    run: true

