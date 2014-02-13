exports.config = {
  specs: ["e2e/*.spec.coffee"],
  baseUrl: "http://localhost:9001",
  framework: "jasmine",

  capabilities: {
    "name": "MacGyver E2E"
  },

  onPrepare: function() {
    var disableNgAnimate;
    disableNgAnimate = function() {
      return angular.module('disableNgAnimate', []).run(function($animate) {
        return $animate.enabled(false);
      });
    };
    return browser.addMockModule('disableNgAnimate', disableNgAnimate);
  }
};
