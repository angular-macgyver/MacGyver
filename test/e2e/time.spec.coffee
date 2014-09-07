describe "Mac Time Input", ->
  input  = null
  output = null

  beforeEach ->
    browser.get "/test/e2e/time.html"
    browser.waitForAngular()

    input  = element(By.css(".mac-date-time"))
    output = element(By.css(".output"))

  afterEach ->
    input  = null
    output = null

  it "should return true", ->
    input.click()

    expect(output.getText()).toEqual "10:55 PM"

  it "should change the meridian to AM after pressing the A button", ->
    input.click()
    input.sendKeys "A"

    expect(output.getText()).toEqual "10:55 AM"

  it "should not change the meridian to AM after pressing the P button", ->
    input.click()
    input.sendKeys "P"

    expect(output.getText()).toEqual "10:55 PM"

  it "should change the model after pressing down button", ->
    input.click()
    input.sendKeys protractor.Key.DOWN

    expect(output.getText()).toEqual "10:55 AM"

  it "should change the model after pressing up button", ->
    input.click()
    input.sendKeys protractor.Key.UP

    expect(output.getText()).toEqual "10:55 AM"
