describe("Mac Time Input", function() {
  beforeEach(function(){
    browser.get("/test/e2e/time.html");
    browser.waitForAngular();
  });

  it("should return true", function() {
    var input;

    input = element(by.css(".date-time input"));
    input.click();

    expect(input.getAttribute("value")).toEqual("10:55 PM");
  });

  it("should change the meridian to AM after pressing the A button", function(){
    var input;

    input = element(by.css(".date-time input"));
    input.click();

    input.sendKeys("A");
    input.sendKeys("A");

    expect(input.getAttribute("value")).toEqual("10:55 AM");

  });

  it("should not change the meridian to AM after pressing the P button", function(){
    var input;

    input = element(by.css(".date-time input"));
    input.click();

    input.sendKeys("P");
    input.sendKeys("P");

    expect(input.getAttribute("value")).toEqual("10:55 PM");
  });

  it("should change the model after pressing down button", function(){
    var input;

    input = element(by.css(".date-time input"));
    input.click();

    input.sendKeys(protractor.Key.DOWN);

    expect(input.getAttribute("value")).toEqual("09:55 PM");
  });

  it("should change the model after pressing up button", function(){
    var input;

    input = element(by.css(".date-time input"));
    input.click();

    input.sendKeys(protractor.Key.UP);

    expect(input.getAttribute("value")).toEqual("11:55 PM");
  });
});
