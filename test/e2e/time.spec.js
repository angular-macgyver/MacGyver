describe("Mac Time Input", function() {
  var input, output;
  beforeEach(function() {
    browser.get("/test/e2e/time.html");
    browser.waitForAngular();
    input = element(By.css(".mac-date-time"));
    output = element(By.css(".output"));
  });

  afterEach(function() {
    input = null;
    output = null;
  });

  it("should return true", function() {
    input.click();
    expect(output.getText()).toEqual("10:55 PM");
  });

  it("should change the meridian to AM after pressing the A button", function() {
    input.click();
    input.sendKeys("A");
    expect(output.getText()).toEqual("10:55 AM");
  });

  xit("should not change the meridian to AM after pressing the P button", function() {
    input.click();
    input.sendKeys("P");
    expect(output.getText()).toEqual("10:55 PM");
  });

  it("should change the model after pressing down button", function() {
    input.click();
    input.sendKeys(protractor.Key.DOWN);
    expect(output.getText()).toEqual("10:55 AM");
  });

  it("should change the model after pressing up button", function() {
    input.click();
    input.sendKeys(protractor.Key.UP);
    expect(output.getText()).toEqual("10:55 AM");
  });
});
