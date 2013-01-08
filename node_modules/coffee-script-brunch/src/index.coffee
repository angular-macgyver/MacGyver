coffeescript = require 'coffee-script'

module.exports = class CoffeeScriptCompiler
  brunchPlugin: yes
  type: 'javascript'
  extension: 'coffee'

  constructor: (@config) ->
    return

  compile: (data, path, callback) ->
    try
      result = coffeescript.compile data, bare: yes
    catch err
      error = err
    finally
      callback error, result
