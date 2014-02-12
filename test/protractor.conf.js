exports.config = {
  seleniumAddress: "http://localhost:4444/wd/hub",
  specs: ["e2e/*.spec.js"],
  baseUrl: "http://localhost:9001",
  framework: "jasmine",
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
