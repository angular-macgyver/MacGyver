describe "Mac Time Input", ->
  beforeEach ->
    browser.get "/test/e2e/time.html"
    browser.waitForAngular()

  it "should return true", ->
    input = element(By.css(".mac-date-time"))
    input.click()

    output = element(By.css(".output"))
    expect(output.getText()).toEqual "10:55 PM"

  it "should change the meridian to AM after pressing the A button", ->
    input = element(By.css(".mac-date-time"))
    input.click()
    input.sendKeys "A"

    output = element(By.css(".output"))
    expect(output.getText()).toEqual "10:55 AM"

  it "should not change the meridian to AM after pressing the P button", ->
    input = element(By.css(".mac-date-time"))
    input.click()
    input.sendKeys "P"

    output = element(By.css(".output"))
    expect(output.getText()).toEqual "10:55 PM"

  it "should change the model after pressing down button", ->
    input = element(By.css(".mac-date-time"))
    input.click()
    input.sendKeys protractor.Key.DOWN

    output = element(By.css(".output"))
    expect(output.getText()).toEqual "10:55 AM"

  it "should change the model after pressing up button", ->
    input = element(By.css(".mac-date-time"))
    input.click()
    input.sendKeys protractor.Key.UP

    output = element(By.css(".output"))
    expect(output.getText()).toEqual "10:55 AM"
