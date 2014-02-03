describe("Mac Time Input", function() {
  return it("should return true", function() {
    var input;
    browser.get("/");
    input = element(by.id("test-time-input"));
    input.click();
    expect(input.getText()).toEqual("11:59 PM");
  });
});