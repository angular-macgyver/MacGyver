module.exports = (config) ->
  config.set
    sauceLabs:
      startConnect: true
      testName: "MacGyver"

    customLaunchers:
      SL_Chrome:
        base: "SauceLabs"
        browserName: "chrome"

      SL_Firefox:
        base: 'SauceLabs',
        browserName: 'firefox',
        version: '26'

      SL_Safari:
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.9',
        version: '7'

      SL_IE_9:
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 2008',
        version: '9'

      SL_IE_10:
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 2012',
        version: '10'

      SL_IE_11:
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11'

    # base path, that will be used to resolve files and exclude
    basePath: "../example"
    frameworks: ["jasmine"]

    # list of files / patterns to load in the browser
    files: [
      # Javascript
      "../vendor/bower/jquery/jquery.js"
      "../vendor/bower/underscore.string/lib/underscore.string.js"
      "../vendor/bower/jquery.ui/ui/jquery.ui.core.js"
      "../vendor/bower/jquery.ui/ui/jquery.ui.widget.js"
      "../vendor/bower/jquery.ui/ui/jquery.ui.mouse.js"
      "../vendor/bower/jquery.ui/ui/jquery.ui.position.js"
      "../vendor/bower/jquery.ui/ui/jquery.ui.datepicker.js"
      "../vendor/bower/jquery.ui/ui/jquery.ui.resizable.js"
      "../vendor/bower/jquery.ui/ui/jquery.ui.sortable.js"
      "../vendor/bower/angular/angular.js"
      "../vendor/bower/angular-animate/angular-animate.js"

      # Template
      "template/*.html"

      # Test Code
      "../src/main.coffee"
      "../src/services/*.coffee"
      "../src/*.coffee"
      "../src/**/*.coffee"
      "../vendor/bower/angular-mocks/angular-mocks.js"
      "../test/vendor/browserTrigger.js"
      "../test/unit/*.spec.coffee"
    ]

    exclude: [
      "../src/example_controller/*.coffee"
    ]

    reporters: ["progress"]
    logLevel: config.LOG_INFO
    browsers: ["PhantomJS"]
    preprocessors:
      "../**/*.coffee": ["coffee"]
      "**/*.html": ["ng-html2js"]

    plugins: ["karma-*"]

  if process.env.TRAVIS
    buildLabel = "TRAVIS ##{process.env.TRAVIS_BUILD_NUMBER} (#{process.env.TRAVIS_BUILD_ID})"

    config.sauceLabs.build            = buildLabel
    config.sauceLabs.startConnect     = false
    config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER

    config.transports = ["xhr-polling"]

  # Taken from AngularJS karma-shared.conf.js
  # Terrible hack to workaround inflexibility of log4js:
  # - ignore web-server's 404 warnings,
  log4js            = require("../node_modules/karma/node_modules/log4js")
  layouts           = require("../node_modules/karma/node_modules/log4js/lib/layouts")
  originalConfigure = log4js.configure

  log4js.configure = (log4jsConfig) ->
    consoleAppender = log4jsConfig.appenders.shift()
    originalResult = originalConfigure.call(log4js, log4jsConfig)
    layout = layouts.layout(consoleAppender.layout.type, consoleAppender.layout)
    log4js.addAppender (log) ->
      msg = log.data[0]

      # ignore web-server's 404s
      return if log.categoryName is "web-server" and log.level.levelStr is config.LOG_WARN

      console.log layout(log)

    originalResult