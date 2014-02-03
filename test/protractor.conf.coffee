exports.config = {
  seleniumAddress: "http://localhost:4444/wd/hub"
  specs: ["e2e/*.spec.js"]
  baseUrl: "http://localhost:9001"
  framework: "jasmine"

  onPrepare: ->
      # Disable animations so e2e tests run more quickly
      disableNgAnimate = ->
        angular.module('disableNgAnimate', []).run ($animate) ->
          $animate.enabled(false)

      browser.addMockModule 'disableNgAnimate', disableNgAnimate
}